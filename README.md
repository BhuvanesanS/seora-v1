# Seaora website

React and Vite website for Seaora Marine Products. The October 23 editorial refresh preserves the supplied Seaora fish logo and white branded page loader, with an asymmetric marine banner, warm neutral backgrounds, navy/red accents, interactive ingredient presentation and a user-initiated enquiry panel.

## Run locally

```sh
npm install
npm run dev
```

Use the URL printed by Vite. Existing dependency versions and the pnpm lockfile were not upgraded for this redesign. If using pnpm, run `pnpm install --frozen-lockfile` instead of npm install.

## Checks

```sh
npm test
npm run build
npm run preview
```

Twenty Node tests cover navigation metadata, route handling, catalogue data, sales and careers enquiry contents, safe mailto encoding, quick-enquiry routing, intent prefill and the cancellable loading gate. The editorial refresh was checked on all seven routes at 320px, 390px, 768px, 1024px and 1440px: no horizontal overflow or navigation overflow. Main headings and route titles were checked at desktop and narrow-mobile sizes. Browser interaction checks covered the ingredient selector, FAQ expansion, mobile menu, popup Escape dismissal, forward/reverse keyboard focus wrapping, focus restoration, product/intent prefill, careers routing and preparation of a sales email without sending it. Earlier Careers QA covered required fields, preselection and stale-draft removal. These are browser viewport checks, not physical-device certification.

## Pages and behaviour

- Home, About us, Products, Our process, Quality, Careers, Contact.
- A real not-found view for unknown routes; the former `/design-directions` URL shows the homepage for compatibility.
- Product query links open the relevant product section and preselect that product on the enquiry page.
- Each route/query change has a skippable white logo introduction, including browser back/forward. It lasts at least 700ms, waits up to 2.4 seconds for the relevant image, then fades out over 180ms. Reduced-motion users get a short static transition instead. Cancelling/unmounting a route removes its timers; an old image callback cannot dismiss a newer page loader. This is a branded transition and indeterminate indicator, not measured download progress. Same-page anchors do not trigger it.
- The homepage uses a split editorial banner and a three-product interactive ingredient showcase. Ingredient choices preserve the relevant product in the specification enquiry link.
- All six inner pages share a split chapter banner. Product detail sections alternate image placement on desktop and return to a consistent image-first flow on mobile.
- Finite image entrance effects, staggered scroll reveals, restrained hover effects and accordion transitions respect reduced-motion preferences. Scroll-reveal observation begins after the page loader finishes; content stays available if the observer is unavailable. No animation dependencies were added.
- SHARP-inspired button interactions use rounded outlines, a corner-expanding colour fill, moving arrows and directional navigation underlines in Seaora's red/navy palette. Primary, header, floating and enquiry-form actions share the treatment. Keyboard focus receives the same fill plus an outline; pointer hover is limited to hover-capable devices, touch receives pressed feedback, and reduced-motion preferences suppress movement. The button update was checked at 320px, 390px, 768px and 1440px without horizontal overflow, including enquiry-dialog keyboard focus. All 20 tests and the production build passed.
- Header, homepage and floating enquiry buttons open an on-demand native dialog. It supports Escape, explicit forward/reverse Tab wrapping, scroll locking and focus restoration. Specifications/supply choices prefill the contact form; careers leads to the careers enquiry section. There are no timed or exit-intent popups.
- Buyer FAQs explain specifications, quote requirements, unpublished pricing/minimum quantities and the email-based enquiry process without inventing commercial promises.
- Reduced-motion CSS, keyboard focus indicators, skip-to-content, labelled form fields, and mobile navigation are included.
- The floating enquiry control has independent fixed positioning; shared button animation rules must not assign its position. On mobile it is a 56px message-icon button, inset from the right/bottom with safe-area support. Verified on all seven pages at 320, 390, 650, 768 and 1440px: the full control stays within the viewport without page overflow. Mobile opening, Escape dismissal and positioning after scrolling were checked. This is the native enquiry panel, not a WhatsApp link.

## Enquiry delivery — important

There is no backend or mail service in this repository. The previous form only displayed a simulated success message. The revised form prepares a draft addressed to `sales@seaoraonline.com`, including the visitor's name, company, email, phone, product, quantity, destination, and requirement. The visitor must open their email app and send it. Copying the prepared draft is a fallback. The site does not store or automatically send the data.

Do not label the form as automatically submitted unless a real, validated backend is connected. No sales WhatsApp number is supplied in this checkout, so a number has not been invented; the floating contact button opens the enquiry-routing panel. That panel collects only an intent and product choice, not personal information.

## Design structure

The current homepage trial uses `ImmersiveHero` in `Showcase.jsx`: a full-width coastal background, white headline and transparent navigation that becomes solid on scroll or mobile-menu opening. `immersive-home.css` isolates this treatment. The previous `EditorialHero` and its styles remain intact; switch the Home component back to that export and remove the homepage overlay class to restore the split layout. Inner pages and enquiry delivery are unchanged. The background is the existing illustrative ocean asset, not a photograph of Seaora's premises.

`styles.css` contains the base layout, `refinement.css` retains the original redesign and careers styling, and `premium.css` contains the current editorial layer. `Showcase.jsx` holds the homepage banner, interactive ingredient presentation and buyer FAQs. `EnquiryPanel.jsx` owns the modal lifecycle; validated routing and form-prefill helpers live in `content.js`. Existing source assets were preserved. No additional packages, analytics, CRM integrations, automatic emails or deployments were introduced.

## Careers

`/careers` is linked in desktop/mobile navigation and the footer, with its own metadata and the shared branded page loader. Interest-area buttons preselect the enquiry form. Applicants can enter their name, email, phone, location, area of interest, experience and introduction, then review and copy/open an email draft addressed to the existing general inbox `info@seaoraonline.com`. CVs must be attached in their email app. There is no CV upload, server storage or automatic application submission.

No confirmed vacancies or recruitment inbox were supplied. The page explicitly distinguishes areas of interest from job openings and asks visitors to enquire about current opportunities. Confirm recruitment copy and the destination email with the client before launch; do not advertise invented roles or benefits.

## Before deployment

- Confirm company copy, contact addresses, product specifications, and image usage with the client.
- The original JPEG logo is displayed through an SVG viewport without altering the source artwork. Earlier draft wordmark assets remain unused for recoverability.
- Original harbour and ingredient PNGs remain intact; the UI uses optimized WebP copies. New illustrative ocean and ingredient images use about 510 KiB combined. All six displayed editorial WebP files together use about 823 KiB. Ingredient images are explicitly labelled as illustrative, not actual product/batch photographs. Client-approved original photography should replace them for an authentic production portfolio.
- `vercel.json` provides the SPA fallback for the seven client-side routes, including `/careers`. If moving to another host, configure it to serve `index.html` for client-side routes; otherwise direct inner-page URLs will return a server 404.
- Page titles and descriptions update on navigation. This remains a client-rendered SPA; server prerendering and final-domain social/canonical URLs are separate deployment work.
- Google Fonts is optional for rendering: system font fallbacks are defined.
- No dependency upgrades were introduced. Production hosting is the existing Vercel project at `https://seora-v1.vercel.app`, connected to the `main` branch of `BhuvanesanS/seora-v1`.

## Visual asset provenance / October 23

Created using the built-in image-generation tool, then resized/compressed to WebP with Sharp. No original generated image or supplied source was deleted.

- `public/assets/ocean-editorial.webp`: premium editorial aerial ocean photograph; deep blue/turquoise Indian Ocean with white waves meeting pale sand on the right; open dark water on the left for white type; natural morning light; no buildings, people, text or logos; an illustrative scene, not a named location.
- `public/assets/fish-meal-editorial.webp`: small mound of warm golden-brown fish meal powder with a stainless-steel scoop.
- `public/assets/fish-oil-editorial.webp`: unlabeled laboratory beaker half filled with translucent golden amber fish oil.
- `public/assets/fish-paste-editorial.webp`: shallow porcelain dish of dark caramel-brown soluble paste and a steel spoon showing its texture.

Shared ingredient prompt direction: premium minimal still-life studio photography, square composition, pale cool-grey seamless background, soft upper-left daylight and natural shadows, physically realistic material texture, understated industrial catalogue presentation, no labels/branding/text/people/animals; illustrative sample, not actual batch photography.
