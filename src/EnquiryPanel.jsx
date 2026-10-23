import { useEffect, useRef, useState } from 'react';
import { products, buildQuickEnquiryRoute } from './content.js';

// Native modal supplies the inert background; explicit Tab wrapping also covers embedded browsers.
export default function EnquiryPanel({ onClose, navigate }) {
  const dialog = useRef(null);
  const [intent, setIntent] = useState('specifications');
  useEffect(() => {
    const element = dialog.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus({preventScroll:true});
    };
  }, []);
  function continueToForm(event) {
    event.preventDefault();
    const route = buildQuickEnquiryRoute(Object.fromEntries(new FormData(event.currentTarget)));
    onClose();
    navigate(route);
  }
  function keepFocusInside(event) {
    if (event.key !== 'Tab') return;
    const controls = [...dialog.current.querySelectorAll('button, input, select, textarea, a[href], [tabindex]')].filter(element => !element.disabled && element.tabIndex >= 0 && element.getClientRects().length);
    const first = controls[0];
    const last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }
  return <dialog ref={dialog} className="enquiry-dialog" aria-labelledby="enquiry-dialog-title" aria-describedby="enquiry-dialog-description" onKeyDown={keepFocusInside} onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="enquiry-dialog-inner"><button autoFocus className="dialog-close" aria-label="Close enquiry panel" onClick={onClose}>×</button><p className="eyebrow"><span />LET’S MAKE A CONNECTION</p><h2 id="enquiry-dialog-title">What brings<br />you to <em>Seaora?</em></h2><p id="enquiry-dialog-description">Choose a starting point. We’ll take you to the right enquiry form.</p>
      <form onSubmit={continueToForm}><fieldset><legend>I’m interested in</legend>{[['specifications','Product specifications','Grades, applications and documentation'],['supply','A supply enquiry','Quantity, packing and destination'],['careers','Career opportunities','Introduce yourself to our team']].map(([value,label,description]) => <label className="intent-option" key={value}><input type="radio" name="intent" value={value} checked={intent === value} onChange={() => setIntent(value)} /><span><strong>{label}</strong><span>{description}</span></span><span aria-hidden="true">↗</span></label>)}</fieldset>
        {intent !== 'careers' && <label className="dialog-product">Ingredient<select name="product" defaultValue=""><option value="">General enquiry / help me choose</option>{products.map(product => <option key={product.id} value={product.id}>{product.name}</option>)}</select></label>}
        <button className="button" type="submit">{intent === 'careers' ? 'Go to careers' : 'Continue to enquiry'} <span aria-hidden="true">↗</span></button><p className="dialog-privacy">No account needed. Nothing is sent at this step.</p>
      </form>
    </div>
  </dialog>;
}
