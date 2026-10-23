import { useEffect, useRef, useState } from 'react';
import { careerAreas, buildCareerEnquiry } from './content.js';

const areaNotes = [
  'Making processes work, from material intake to finished ingredients.',
  'A detail-minded approach to ingredients, specifications and checks.',
  'Practical problem-solving with equipment and plant systems.',
  'Connecting materials, packing and the movement of goods.',
  'Clear communication, coordination and business support.',
];

export default function Careers({ PageHero, Heading }) {
  const [area, setArea] = useState('General interest');
  const [draft, setDraft] = useState(null);
  const [copyState, setCopyState] = useState('');
  const nameInput = useRef(null);
  const result = useRef(null);

  useEffect(() => { if (draft) result.current?.focus(); }, [draft]);

  function chooseArea(value) {
    setArea(value);
    setDraft(null);
    nameInput.current?.focus({ preventScroll: true });
    document.getElementById('career-enquiry')?.scrollIntoView({ behavior: 'instant', block: 'start' });
  }

  function prepare(event) {
    event.preventDefault();
    setCopyState('');
    setDraft(buildCareerEnquiry(Object.fromEntries(new FormData(event.currentTarget))));
  }

  async function copyDraft() {
    try {
      await navigator.clipboard.writeText(draft.body);
      setCopyState('Copied. Paste this into an email to info@seaoraonline.com and attach your CV if you wish.');
    } catch {
      setCopyState('Copy is unavailable. Select the prepared text below and copy it manually.');
    }
  }

  return <>
    <PageHero label="Careers" title={<>Your perspective.<br />Our next chapter.</>} text="An interest in marine ingredients. A practical mindset. Start a conversation about where your skills could fit at Seaora." />
    <section className="container section career-intro">
      <Heading eyebrow="People & possibilities" title={<>Good work begins<br />with a conversation.</>} />
      <div><p className="lead">From the coast of Manapad, our work connects marine materials with feed nutrition.</p><p>Whether you are beginning your career or bringing experience from another business, tell us what you do and where your interests lie.</p><a className="text-link" href="#career-enquiry">Introduce yourself <span aria-hidden="true">↘</span></a></div>
    </section>
    <section className="soft-section"><div className="container section career-interests">
      <Heading eyebrow="Find your direction" title="Where could you contribute?" copy="These are areas of interest for your enquiry, not advertised job openings." />
      <div className="career-area-list">{careerAreas.slice(0, -1).map((item, index) => <button className="career-area" key={item} type="button" onClick={() => chooseArea(item)} aria-label={`Enquire about ${item}`}><span className="section-index">0{index + 1}</span><span><strong>{item}</strong><span>{areaNotes[index]}</span></span><span className="career-area-arrow" aria-hidden="true">↗</span></button>)}</div>
      <div className="career-vacancy-note"><span className="career-note-marker" aria-hidden="true">i</span><p><strong>Looking for a current opening?</strong> No open positions are listed on this website. Contact the team to ask about current opportunities and the application process.</p></div>
    </div></section>
    <section id="career-enquiry" className="container section contact-grid career-contact">
      <aside><p className="eyebrow"><span />Introduce yourself</p><h2>A little about you.<br />A useful first step.</h2><p>This is a general careers enquiry. It is not an application for a confirmed vacancy.</p><div className="contact-item"><span>CAREERS ENQUIRIES · GENERAL CONTACT</span><a href="mailto:info@seaoraonline.com">info@seaoraonline.com</a></div><ol className="career-next-steps"><li><strong>Tell us about yourself</strong><span>Share your interests and relevant experience.</span></li><li><strong>Review your email draft</strong><span>Open your email app and attach your CV, if you wish.</span></li><li><strong>Send to the Seaora team</strong><span>Ask about suitable openings and next steps.</span></li></ol></aside>
      <form className="enquiry-form" onSubmit={prepare} onChange={() => setDraft(null)}>
        <div className="form-heading"><h3>Start a careers conversation</h3><p>Fields marked * are required.</p></div>
        <div className="form-grid">
          <label>Full name *<input ref={nameInput} name="name" autoComplete="name" required maxLength="120" placeholder="Your full name" /></label>
          <label>Email address *<input name="email" type="email" autoComplete="email" required maxLength="200" placeholder="you@example.com" /></label>
          <label>Phone number<input name="phone" type="tel" autoComplete="tel" maxLength="35" placeholder="Include country code" /></label>
          <label>Current location *<input name="location" autoComplete="address-level2" required maxLength="120" placeholder="City, state or country" /></label>
          <label>Area of interest *<select name="area" value={area} onChange={event => setArea(event.target.value)}>{careerAreas.map(item => <option key={item}>{item}</option>)}</select></label>
          <label>Experience<input name="experience" maxLength="120" placeholder="e.g. Graduate or 3 years in quality" /></label>
          <label className="full-field">A little about you *<textarea name="message" rows="5" required maxLength="1500" placeholder="Your skills, background and what you would like to do…" /></label>
        </div>
        <p className="form-note">This page prepares an email, not an online submission. Your details are not stored or sent by this website. Attach your CV in your email app; please do not include identity documents or sensitive financial information.</p>
        <button className="button" type="submit">Prepare careers email <span aria-hidden="true">↗</span></button>
        {draft && <section ref={result} tabIndex="-1" className="enquiry-result" aria-label="Careers email ready"><h3>Your introduction is ready.</h3><p>Nothing has been sent yet. Review the draft, open your email app, attach your CV if you wish, and send.</p><textarea aria-label="Prepared careers email" readOnly value={draft.body} rows="10" /><div className="result-actions"><a className="button" href={draft.href}>Open email app <span aria-hidden="true">↗</span></a><button className="text-link" type="button" onClick={copyDraft}>Copy email <span aria-hidden="true">⧉</span></button></div><p role="status">{copyState || 'No email app configured? Copy the message and email info@seaoraonline.com.'}</p></section>}
      </form>
    </section>
  </>;
}
