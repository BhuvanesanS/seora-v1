import { useEffect, useState } from 'react';
import Brand from './Brand.jsx';
import { waitForPage } from './routeLoading.js';

export default function PageLoader({ path, label, onDone }) {
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const preview = new Image();
    preview.src = ['/products', '/quality'].includes(path)
      ? '/assets/seaora-ingredients-editorial.webp' : '/assets/ocean-editorial.webp';
    let exitTimer;
    const cancel = waitForPage({
      ready: preview.decode(), minimumMs: reduced ? 100 : 700,
      onReady: () => {
        setLeaving(true);
        exitTimer = setTimeout(onDone, reduced ? 0 : 180);
      },
    });
    return () => { cancel(); clearTimeout(exitTimer); };
  }, [path, onDone]);
  return <div className={`brand-loader ${leaving ? 'is-leaving' : ''}`}>
    <div role="status" aria-live="polite"><Brand /><div className="loading-track" /><p>LOADING</p><span className="loader-destination">{label}</span><span className="sr-only">Opening {label}</span></div>
    <button onClick={onDone}>Continue to page <span aria-hidden="true">↗</span></button>
  </div>;
}
