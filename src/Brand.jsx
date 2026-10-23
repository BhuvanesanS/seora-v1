// Viewport the supplied logo without modifying the original artwork.
export default function Brand({ light = false }) {
  return <svg className={`wordmark original-wordmark${light ? ' wordmark-on-dark' : ''}`} viewBox="240 155 630 195" role="img" aria-label="Seaora Marine Products">
    <image href="/assets/seaora-logo-light.jpeg" width="1050" height="600" />
  </svg>;
}
