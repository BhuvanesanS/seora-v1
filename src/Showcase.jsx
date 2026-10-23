import { useState } from 'react';
import { products } from './content.js';

// Full-width homepage trial. EditorialHero below is retained for an easy layout switch.
export function ImmersiveHero({ Link, onEnquire }) {
  return <section className="immersive-hero" aria-label="Seaora introduction">
    <img className="immersive-photo" src="/assets/ocean-editorial.webp" alt="Illustrative aerial view of ocean waves meeting the coast" fetchPriority="high" />
    <div className="container immersive-content">
      <p className="eyebrow">SEAORA MARINE PRODUCTS / MANAPAD, INDIA</p>
      <h1>From the sea.<br />For what’s next.</h1>
      <p className="immersive-description">Marine ingredients. Meaningful possibilities.<br />{' '}Fish meal, fish oil and soluble paste for your formulation.</p>
      <div className="immersive-actions"><Link to="/products" className="button">Explore ingredients <span aria-hidden="true">↗</span></Link><button className="button button-outline" onClick={onEnquire}>Talk to Seaora <span aria-hidden="true">↗</span></button></div>
    </div>
    <div className="container immersive-bottom"><span>ROOTED IN THE COAST.<br />CONNECTED TO YOUR BUSINESS.</span><a href="#introduction">Discover Seaora <span aria-hidden="true">↓</span></a></div>
  </section>;
}

export function EditorialHero({ Link, onEnquire }) {
  return <section className="editorial-hero" aria-label="Seaora introduction">
    <div className="editorial-copy">
      <p className="eyebrow"><span />MARINE INGREDIENTS / MANAPAD, INDIA</p>
      <h1>From the sea.<br />For what’s<br /><em>next.</em></h1>
      <p className="editorial-description">Fish meal, fish oil and soluble paste.<br />Marine-origin ingredients for your next formulation.</p>
      <div className="editorial-actions"><Link to="/products" className="button">Explore ingredients <span aria-hidden="true">↗</span></Link><button className="text-link" onClick={onEnquire}>Talk to Seaora <span aria-hidden="true">↗</span></button></div>
      <div className="editorial-footnote"><span className="coastal-mark" aria-hidden="true">≈</span><span>ROOTED IN THE COAST.<br />FOCUSED ON YOUR REQUIREMENT.</span><a href="#introduction" aria-label="Explore the Seaora story">↓</a></div>
    </div>
    <div className="editorial-media">
      <img className="editorial-ocean" src="/assets/ocean-editorial.webp" alt="Illustrative aerial view of ocean waves meeting the coast" fetchPriority="high" />
      <div className="marine-contours" aria-hidden="true"><span /><span /><span /></div>
      <span className="editorial-image-note">SEAORA / A MARINE PERSPECTIVE</span>
      <div className="ingredient-note"><img src="/assets/fish-meal-editorial.webp" alt="Illustrative fish meal sample" /><div><span>FROM SOURCE TO FORMULATION</span><strong>Nature’s beginning.<br />Your next possibility.</strong><Link to="/process">Follow the journey <span aria-hidden="true">↗</span></Link></div></div>
      <span className="editorial-coordinate" aria-hidden="true">01 — MARINE ORIGIN</span>
    </div>
  </section>;
}

export function IngredientShowcase({ Link, ProductArt }) {
  const [selected, setSelected] = useState(products[0].id);
  const product = products.find(item => item.id === selected);
  return <div className="ingredient-showcase" data-reveal>
    <div className="ingredient-selector" role="group" aria-label="Explore ingredients">{products.map(item => <button key={item.id} aria-pressed={selected === item.id} aria-controls="ingredient-spotlight" onClick={() => setSelected(item.id)}><span>0{item.index}</span>{item.name}<span aria-hidden="true">↗</span></button>)}</div>
    <div id="ingredient-spotlight" className="ingredient-spotlight" aria-live="polite" aria-atomic="true">
      <div className="spotlight-art" key={`art-${product.id}`}><ProductArt kind={product.id} /><span className="spotlight-index" aria-hidden="true">0{product.index}</span></div>
      <div className="spotlight-copy" key={product.id}><p className="eyebrow"><span />{product.type}</p><h3>{product.name}</h3><p className="lead">{product.short}</p><p>{product.text}</p><dl><div><dt>APPLICATION</dt><dd>{product.application}</dd></div><div><dt>SUPPLY FORMAT</dt><dd>{product.packing}</dd></div></dl><Link className="button" to={`/contact?product=${product.id}&intent=specifications`}>Request specifications <span aria-hidden="true">↗</span></Link><Link className="spotlight-detail" to={`/products?product=${product.id}`}>Explore product details <span aria-hidden="true">↗</span></Link></div>
    </div>
  </div>;
}

const questions = [
  ['What information should I include in an enquiry?', 'Start with the ingredient, your intended application, required quantity, preferred packing and destination. Include any target specifications so the team can discuss the relevant supply details.'],
  ['Can I request product specifications?', 'Yes. Select an ingredient and choose “Product specifications” in the enquiry panel. Ask for the relevant specification sheet and available batch documentation; these are confirmed for the proposed supply.'],
  ['Are prices and minimum order quantities listed online?', 'Prices, minimum quantities, availability and delivery arrangements are not published on this website. Contact Seaora to confirm these details for your requirement.'],
  ['Does the website take orders or payments?', 'No. This is a product information and enquiry website. The form prepares a message for you to send from your email app; it does not place an order or collect a payment.'],
];

export function BuyerQuestions({ Link }) {
  return <section className="container section buyer-questions"><div className="section-heading"><p className="eyebrow"><span />BEFORE THE FIRST CONVERSATION</p><h2>A clearer brief.<br /><em>A better start.</em></h2><p>Useful answers for purchasing and formulation teams.</p><Link className="text-link" to="/contact">Ask us a question <span aria-hidden="true">↗</span></Link></div><div className="buyer-answers">{questions.map(([question,answer],index) => <details key={question}><summary><span>0{index+1}</span>{question}<span className="faq-toggle" aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></section>;
}
