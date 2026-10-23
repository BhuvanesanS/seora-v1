import { useEffect, useRef, useState, useCallback } from 'react';
import { products, pages, steps, pageMeta, buildEnquiry, getRoute, initialRequirement } from './content.js';

import Brand from './Brand.jsx';
import PageLoader from './PageLoader.jsx';
import Careers from './Careers.jsx';
import { ImmersiveHero, IngredientShowcase, BuyerQuestions } from './Showcase.jsx';
import EnquiryPanel from './EnquiryPanel.jsx';

const ocean = '/assets/ocean-editorial.webp';
const harbour = '/assets/seaora-harbour-hero.webp';
const ingredients = '/assets/seaora-ingredients-editorial.webp';
const Arrow = () => <span aria-hidden="true">↗</span>;
function navigateTo(route) {
  const target = new URL(route, window.location.origin);
  const samePage = target.pathname === window.location.pathname && target.search === window.location.search;
  window.history.pushState({}, '', target.pathname + target.search + target.hash);
  if (samePage) {
    const section = target.hash && document.getElementById(target.hash.slice(1));
    if (section) { section.scrollIntoView({ behavior: 'instant', block: 'start' }); section.querySelector('input,button,a')?.focus({preventScroll:true}); }
    else window.scrollTo({top:0,behavior:'instant'});
  } else window.dispatchEvent(new PopStateEvent('popstate'));
}
function Link({ to, children, className = '', onClick, ...props }) {
  return <a href={to} className={className} {...props} onClick={event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (window.location.pathname + window.location.search !== to) { window.history.pushState({}, '', to); window.dispatchEvent(new PopStateEvent('popstate')); }
    else { if (window.location.hash) window.history.replaceState({}, '', to); window.scrollTo({ top: 0, behavior: 'instant' }); }
    onClick?.(event);
  }}>{children}</a>;
}
function ButtonLink({ to, children, secondary = false }) { return <Link to={to} className={`button${secondary ? ' button-outline' : ''}`}>{children}<Arrow /></Link>; }
function Eyebrow({ children }) { return <p className="eyebrow"><span />{children}</p>; }
function Heading({ eyebrow, title, copy }) { return <div className="section-heading"><Eyebrow>{eyebrow}</Eyebrow><h2>{title}</h2>{copy && <p>{copy}</p>}</div>; }
function ImagePanel({ src = harbour, alt }) { return <div className="image-panel"><img src={src} alt={alt} loading="lazy" decoding="async" /></div>; }

function Header({ path, search, onEnquire }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggle = useRef(null);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 40);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [path]);
  useEffect(() => setOpen(false), [path, search]);
  useEffect(() => {
    if (!open) return undefined;
    const escape = event => { if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); } };
    window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, [open]);
  return <header className={`site-header${path === '/' ? ' home-overlay-header' : ''}${scrolled ? ' is-scrolled' : ''}${open ? ' menu-is-open' : ''}`}><div className="utility-bar"><div className="container"><span>From the coast. For better nutrition.</span><a href="mailto:sales@seaoraonline.com">sales@seaoraonline.com <Arrow /></a></div></div><div className="container navigation">
    <Link to="/" className="brand-link" aria-label="Seaora home"><Brand /></Link>
    <button ref={toggle} className={`menu-toggle ${open ? 'is-open' : ''}`} aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}><span /><span /></button>
    <nav id="main-navigation" aria-label="Main navigation" className={open ? 'is-open' : ''}>{pages.map(([label, to]) => <Link key={to} to={to} aria-current={path === to ? 'page' : undefined} onClick={() => setOpen(false)}>{label}</Link>)}<button className="nav-cta" aria-haspopup="dialog" onClick={() => { setOpen(false); onEnquire(); }}>Let’s talk <Arrow /></button></nav>
  </div></header>;
}
function Footer() {
  return <footer className="site-footer"><div className="container footer-top"><div className="footer-brand"><Link to="/" aria-label="Seaora home"><Brand light /></Link><p>Marine ingredients.<br />A considered approach.</p><span>Manapad, Tamil Nadu, India</span></div><div><h2>Discover</h2>{pages.slice(1).map(([label,to]) => <Link to={to} key={to}>{label}</Link>)}</div><div><h2>Our ingredients</h2>{products.map(p => <Link key={p.id} to={`/products?product=${p.id}`}>{p.name}</Link>)}</div><div className="footer-contact"><h2>Start a conversation</h2><a href="mailto:sales@seaoraonline.com">sales@seaoraonline.com <Arrow /></a><a href="mailto:info@seaoraonline.com">info@seaoraonline.com</a><p>Tell us your product, quantity,<br />and destination. We’ll take it from there.</p></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Seaora Marine Products Private Limited.</span><span>Rooted in the coast. Connected to your business.</span></div></footer>;
}
function ProductArt({ kind }) {
  const files = { meal: 'fish-meal', oil: 'fish-oil', paste: 'fish-paste' };
  return <div className={`product-art art-${kind}`}><img src={`/assets/${files[kind]}-editorial.webp`} alt={`Illustrative ${products.find(p => p.id === kind)?.name.toLowerCase()} ingredient sample`} loading="lazy" decoding="async" /><span>Illustrative ingredient visual</span></div>;
}
function Cta({ title = 'Good ingredients start with a good conversation.' }) { return <section className="cta-band"><div className="container"><div><Eyebrow>Let’s work together</Eyebrow><h2>{title}</h2></div><ButtonLink to="/contact">Discuss your requirement</ButtonLink></div></section>; }
function PageHero({ label, title, text, image = ocean }) {
  return <section className={`chapter-hero ${image === ingredients ? 'chapter-ingredients' : ''}`}>
    <div className="container chapter-layout"><div className="chapter-copy"><div className="breadcrumb"><Link to="/">Home</Link><span>/</span><span>{label}</span></div><Eyebrow>{label}</Eyebrow><h1>{title}</h1><p>{text}</p><span className="chapter-rule" aria-hidden="true" /></div><div className="chapter-photo"><img src={image} alt={image === ingredients ? 'Illustrative marine ingredients' : 'Illustrative ocean coastline'} fetchPriority="high" /><span>SEAORA / {label.toUpperCase()}</span><div className="chapter-orbit" aria-hidden="true" /></div></div>
  </section>;
}
function Principles({ items }) { return <div className="principles">{items.map(([title,copy],i) => <article key={title}><span className="section-index">0{i+1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>; }

function Home({ onEnquire }) {
  return <><ImmersiveHero Link={Link} onEnquire={onEnquire} />
    <div className="product-strip"><div className="container"><span>THE SEAORA RANGE</span>{products.map(p => <Link key={p.id} to={`/products?product=${p.id}`}>{p.name}<Arrow /></Link>)}</div></div>
    <section id="introduction" className="container section intro-grid"><div><Eyebrow>Connected to the coast</Eyebrow><h2>Nature gives us<br />the beginning.<br /><span className="muted-heading">Care shapes the rest.</span></h2></div><div className="intro-copy"><span className="section-index">01 / OUR PERSPECTIVE</span><p className="lead">A focused marine ingredients business. A straightforward way of working.</p><p>Based in Manapad, Tamil Nadu, Seaora brings fish meal, fish oil, and fish soluble paste to feed manufacturers. We connect your application with a considered approach to processing, packing, and supply.</p><Link className="text-link" to="/about">Get to know Seaora <Arrow /></Link></div></section>
    <section className="soft-section ingredients-section"><div className="container section"><div className="section-top"><Heading eyebrow="The ingredient collection" title={<>Three ingredients.<br /><em>Distinct possibilities.</em></>} /><Link to="/products" className="text-link">View the full range <Arrow /></Link></div><IngredientShowcase Link={Link} ProductArt={ProductArt} /></div></section>
    <section className="container section feature-grid"><ImagePanel src={ingredients} alt="Fish meal and marine oil in an ingredient study" /><div className="feature-copy"><Eyebrow>Quality, considered</Eyebrow><h2>Confidence is in<br />the details.</h2><p>From the first material review to the final packing decision, a clear process helps make every supply conversation more useful.</p><ul className="check-list"><li>Product specifications for your application</li><li>Packing formats matched to your requirement</li><li>Batch documentation discussed before supply</li></ul><ButtonLink to="/quality" secondary>Our quality approach</ButtonLink></div></section>
    <section className="process-preview"><div className="container section"><div className="section-top"><Heading eyebrow="From source to supply" title="Considered at every step." /><Link to="/process" className="text-link">Explore our process <Arrow /></Link></div><div className="steps-grid">{steps.map(s => <article key={s.number}><span>{s.number}</span><h3>{s.title}</h3><p>{s.summary}</p></article>)}</div></div></section>
    <section className="container section applications"><Heading eyebrow="Made for your formulation" title={<>Different applications.<br />One focused approach.</>} copy="Start with your application. We’ll help you explore the relevant ingredient and supply details." /><div>{[['Aquaculture', 'Marine ingredients for fish and shrimp feed.'], ['Poultry', 'Protein and oil inputs for balanced feed recipes.'], ['Livestock', 'Ingredient options for compound-feed formulations.'], ['Speciality feed', 'Discuss a more specific formulation requirement.']].map(([name,description],i) => <Link key={name} to={`/contact?application=${encodeURIComponent(name)}`}><span>0{i+1}</span><div><h3>{name}</h3><p>{description}</p></div><Arrow /></Link>)}</div></section><BuyerQuestions Link={Link} /><Cta /></>;
}
function About() {
  return <><PageHero label="About Seaora" title={<>Rooted in the coast.<br />Looking ahead.</>} text="Marine ingredients. Practical thinking. A clear path from your requirement to the right supply conversation." />
    <section className="container section intro-grid"><Heading eyebrow="Who we are" title="A clear purpose, from the very beginning." /><div><p className="lead">Seaora Marine Products Private Limited focuses on three valuable marine ingredients: fish meal, fish oil, and fish soluble paste.</p><p>Our coastal base in Manapad, Tamil Nadu, connects the business to the source. Our approach is simple: understand what buyers need, discuss the relevant product details, and keep communication clear throughout the supply process.</p></div></section>
    <section className="soft-section"><div className="container section"><Heading eyebrow="What guides us" title="Care in the material. Clarity in the relationship." /><Principles items={[[ 'Close to the source', 'Timely handling and considered processing begin with understanding marine raw material.'], ['Focused on the requirement', 'Product, application, quantity, and destination guide a meaningful technical discussion.'], ['Clear from the outset', 'Specifications, packaging, and supply expectations are discussed before an order is confirmed.']]} /></div></section>
    <section className="container section feature-grid about-feature"><ImagePanel alt="Coastal marine supply setting" /><div className="feature-copy"><Eyebrow>Our coastal connection</Eyebrow><h2>Manapad.<br />Our starting point.</h2><p>The coast is more than the setting for our business. It is the starting point for the materials we work with and the ingredient conversations we have with feed makers.</p><Link to="/process" className="text-link">Follow the process <Arrow /></Link></div></section><Cta /></>;
}
function Products() {
  return <><PageHero label="Our products" title={<>Marine origin.<br />Meaningful application.</>} text="Explore our core ingredients, then discuss the grade, packing format, and supply details that fit your business." image={ingredients} />
    <nav className="product-jump container" aria-label="Product sections">{products.map(p => <a key={p.id} href={`#product-${p.id}`}>{p.name}<span>↓</span></a>)}</nav>
    <div className="container product-details">{products.map(p => <section id={`product-${p.id}`} className="product-detail" key={p.id}><div className="detail-art"><span className="section-index">0{p.index} / SEAORA INGREDIENTS</span><ProductArt kind={p.id} /></div><div><Eyebrow>{p.type}</Eyebrow><h2>{p.name}</h2><p className="lead">{p.text}</p><div className="product-specs"><div><span>APPLICATION</span><p>{p.application}</p></div><div><span>SUPPLY FORMAT</span><p>{p.packing}</p></div></div><ul className="check-list">{p.details.map(d => <li key={d}>{d}</li>)}</ul><ButtonLink to={`/contact?product=${p.id}`}>Enquire about {p.name.toLowerCase()}</ButtonLink><p className="small-note">Final specifications, availability, and packing are confirmed by our team.</p></div></section>)}</div>
    <section className="soft-section"><div className="container section"><Heading eyebrow="Before we quote" title="A few details make all the difference." copy="Share your application, preferred specification, required quantity, packing, and destination. This helps us start with the right information." /><div className="requirement-tags"><span>01 · Product & grade</span><span>02 · Required quantity</span><span>03 · Packing preference</span><span>04 · Delivery destination</span></div></div></section><Cta title="Let’s find the right ingredient for your requirement." /></>;
}
function Process() {
  return <><PageHero label="Our process" title={<>A thoughtful journey.<br />From start to finish.</>} text="Four connected stages turn marine raw material into distinct ingredient streams, ready for review and supply." />
    <section className="container section process-layout"><div className="process-side"><Eyebrow>How it comes together</Eyebrow><h2>Every stage<br />has a purpose.</h2><p>A simple view of the journey, from receiving the material to preparing it for dispatch.</p><Link to="/quality" className="text-link">The quality perspective <Arrow /></Link></div><div className="process-timeline">{steps.map(s => <article key={s.number}><span className="step-number">{s.number}</span><div><span className="section-index">{s.label}</span><h3>{s.title}</h3><p>{s.text}</p><span className="stage-note">Focus / {s.note}</span></div></article>)}</div></section>
    <section className="flow-band"><div className="container"><span>ONE MARINE SOURCE</span><span className="flow-arrow" aria-hidden="true">→</span><div>{products.map(p => <Link to={`/products?product=${p.id}`} key={p.id}>{p.name}<Arrow /></Link>)}</div></div></section><Cta title="Your requirement. Our next conversation." /></>;
}
function Quality() {
  return <><PageHero label="Quality approach" title={<>Clear expectations.<br />Considered controls.</>} text="Confidence comes from understanding the ingredient, its specifications, and the details that matter to your formulation." image={ingredients} />
    <section className="container section intro-grid"><Heading eyebrow="Our perspective" title="Quality is a conversation, not just a claim." /><div><p className="lead">The right product starts with the right questions.</p><p>Discuss your application, target parameters, packing requirements, and destination with Seaora. Product information and available batch documentation can then be considered against your specific requirement.</p><p>Specifications and documentation are confirmed for the relevant product and supply. This website does not replace a product specification sheet.</p></div></section>
    <section className="soft-section"><div className="container section"><Heading eyebrow="Across the journey" title="Three points of attention." /><Principles items={[[ 'Material review', 'Raw material is reviewed at intake before entering the processing journey.'], ['Process observations', 'Cooking, pressing, and separation are considered in the context of the ingredient being produced.'], ['Finished-product review', 'The finished material, packing needs, and relevant documentation are discussed before dispatch.']]} /></div></section>
    <section className="container section document-section"><div><Eyebrow>For your purchasing team</Eyebrow><h2>Ask for what<br />you need to know.</h2><p>Help us make your enquiry more precise.</p></div><div className="document-list">{[['Product specification', 'Tell us the parameters that are relevant to your formulation.'], ['Packing & handling', 'Discuss the preferred format and shipment quantity.'], ['Batch documentation', 'Ask which documents are available for the proposed supply.']].map(([title,text]) => <div key={title}><span className="document-icon" aria-hidden="true">↗</span><div><h3>{title}</h3><p>{text}</p></div></div>)}<Link to="/contact" className="text-link">Request product information <Arrow /></Link></div></section><Cta /></>;
}
function Contact({ search }) {
  const params = new URLSearchParams(search);
  const initialProduct = products.find(p => p.id === params.get('product'))?.name || 'General enquiry';
  const [draft, setDraft] = useState(null);
  const [copyState, setCopyState] = useState('');
  const result = useRef(null);
  function prepare(event) { event.preventDefault(); setDraft(buildEnquiry(Object.fromEntries(new FormData(event.currentTarget)))); setCopyState(''); }
  useEffect(() => { if (draft) result.current?.focus(); }, [draft]);
  async function copy() {
    try { await navigator.clipboard.writeText(draft.body); setCopyState('Enquiry copied. Paste it into your email to sales@seaoraonline.com.'); }
    catch { setCopyState('Copy is unavailable in this browser. Select and copy the enquiry text below.'); }
  }
  return <><PageHero label="Contact us" title={<>Let’s make<br />the right connection.</>} text="Tell us a little about your business and what you need. Every useful supply relationship begins with a conversation." />
    <section className="container section contact-grid"><aside><Eyebrow>Get in touch</Eyebrow><h2>Your next step<br />starts here.</h2><p>For specifications, supply enquiries, or a conversation about our marine ingredients.</p><div className="contact-item"><span>SALES & PRODUCT ENQUIRIES</span><a href="mailto:sales@seaoraonline.com">sales@seaoraonline.com <Arrow /></a></div><div className="contact-item"><span>GENERAL ENQUIRIES</span><a href="mailto:info@seaoraonline.com">info@seaoraonline.com <Arrow /></a></div><div className="contact-item"><span>OUR LOCATION</span><p>Manapad, Tamil Nadu<br />India</p></div><div className="contact-note"><span aria-hidden="true">↗</span><p>No automated submission.<br />Review your enquiry, then send it using your email app.</p></div></aside>
    <form id="enquiry-form" className="enquiry-form" onSubmit={prepare} onChange={() => { if (draft) setDraft(null); }}><div className="form-heading"><h2>Tell us what you need</h2><span>* Required fields</span></div><div className="form-grid">
      <label>Your name *<input name="name" autoComplete="name" required maxLength="100" placeholder="Full name" /></label><label>Company *<input name="company" autoComplete="organization" required maxLength="160" placeholder="Company name" /></label>
      <label>Email address *<input name="email" type="email" autoComplete="email" required maxLength="200" placeholder="you@company.com" /></label><label>Phone number<input name="phone" type="tel" autoComplete="tel" maxLength="35" placeholder="Include country code" /></label>
      <label>Product of interest *<select name="product" defaultValue={initialProduct}>{products.map(p => <option key={p.id}>{p.name}</option>)}<option>General enquiry</option></select></label><label>Quantity & unit<input name="quantity" maxLength="80" placeholder="e.g. 20 metric tonnes" /></label>
      <label className="full-field">Delivery destination<input name="destination" autoComplete="off" maxLength="160" placeholder="City, country or port" /></label><label className="full-field">Your requirement *<textarea name="message" required maxLength="2000" rows="4" defaultValue={initialRequirement(search)} placeholder="Application, specification, packing preference and timeline…" /></label>
    </div><p className="form-note">Your details stay in this page until you choose to open your email app or copy them. Nothing is stored on a server.</p><button className="button" type="submit">Prepare my enquiry <Arrow /></button>
    {draft && <section ref={result} tabIndex="-1" className="enquiry-result" aria-label="Your enquiry is ready"><h3>Your enquiry is ready to send.</h3><p>It has not been sent yet. Open your email app, review the message, and send it to our sales team.</p><textarea aria-label="Prepared enquiry" readOnly value={draft.body} rows="8" /><div className="result-actions"><a className="button" href={draft.href}>Open email app <Arrow /></a><button className="text-link" type="button" onClick={copy}>Copy enquiry <span aria-hidden="true">⧉</span></button></div><p role="status">{copyState || 'No email app? Copy the enquiry and send it to sales@seaoraonline.com.'}</p></section>}</form></section>
    <section className="soft-section"><div className="container section"><Heading eyebrow="A clear next step" title="From first hello to the finer details." /><Principles items={[[ 'Share your brief', 'Send your product, quantity, application, and destination.'], ['Discuss the details', 'Align on specifications, packing, and supply requirements.'], ['Plan what’s next', 'Confirm the next action with the Seaora team.']]} /></div></section></>;
}
function NotFound() { return <section className="container section not-found"><Eyebrow>Page not found</Eyebrow><h1>A little off course.</h1><p>The page you’re looking for isn’t here. Let’s get you back to Seaora.</p><ButtonLink to="/">Back to home</ButtonLink></section>; }
export default function App() {
  const [location, setLocation] = useState(() => ({ path: getRoute(window.location.pathname), search: window.location.search }));
  const [loading, setLoading] = useState(true);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const main = useRef(null);
  const currentLocation = useRef(location);
  const finishLoading = useCallback(() => setLoading(false), []);
  useEffect(() => setEnquiryOpen(false), [location]);
  useEffect(() => {
    const onPop = () => {
      const next = { path: getRoute(window.location.pathname), search: window.location.search };
      const previous = currentLocation.current;
      if (previous.path === next.path && previous.search === next.search) return;
      currentLocation.current = next;
      setLoading(true);
      setLocation(next);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  useEffect(() => {
    const meta = pageMeta[location.path] || pageMeta.notFound;
    document.title = `${meta.title} | Seaora Marine Products`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', meta.description);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location]);
  useEffect(() => {
    if (loading) return undefined;
    main.current?.focus({ preventScroll: true });
    const product = new URLSearchParams(location.search).get('product');
    if (location.path === '/products' && products.some(p => p.id === product)) document.getElementById(`product-${product}`)?.scrollIntoView({ behavior: 'instant', block: 'start' });
    else if (window.location.hash) document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ behavior: 'instant' });
  }, [location, loading]);
  useEffect(() => {
    if (loading || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return undefined;
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-revealed'); observer.unobserve(entry.target); } }), { threshold: 0.08 });
    document.querySelectorAll('[data-reveal], .section-heading, .feature-copy, .principles article, .steps-grid article, .career-area, .document-list>div, .product-detail, .process-timeline article').forEach((node,index) => { node.style.setProperty('--reveal-delay', `${(index % 3) * 60}ms`); observer.observe(node); });
    return () => observer.disconnect();
  }, [location, loading]);
  const views = { '/': <Home onEnquire={() => setEnquiryOpen(true)} />, '/about': <About />, '/products': <Products />, '/process': <Process />, '/quality': <Quality />, '/careers': <Careers PageHero={PageHero} Heading={Heading} />, '/contact': <Contact key={location.search} search={location.search} /> };
  return <>{loading && <PageLoader key={location.path + location.search} path={location.path} label={pages.find(([,path]) => path === location.path)?.[0] || 'Seaora'} onDone={finishLoading} />}<div className={loading ? 'site-shell is-loading' : 'site-shell is-ready'} inert={loading ? true : undefined}><a className="skip-link" href="#main-content">Skip to content</a><Header path={location.path} search={location.search} onEnquire={() => setEnquiryOpen(true)} /><main id="main-content" aria-busy={loading} ref={main} tabIndex="-1" key={location.path}>{views[location.path] || <NotFound />}</main><Footer /><button className="floating-enquiry" aria-label="Open Seaora enquiry panel" aria-haspopup="dialog" onClick={() => setEnquiryOpen(true)}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 5h16v12H9l-5 4V5Z" stroke="currentColor" strokeWidth="1.5" /><path d="M8 9h8M8 13h5" stroke="currentColor" strokeWidth="1.5" /></svg><span>Let’s talk</span></button></div>{enquiryOpen && <EnquiryPanel onClose={() => setEnquiryOpen(false)} navigate={navigateTo} />}</>;
}
