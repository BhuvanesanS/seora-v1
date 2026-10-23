export const pages = [['Home', '/'], ['About us', '/about'], ['Products', '/products'], ['Our process', '/process'], ['Quality', '/quality'], ['Careers', '/careers'], ['Contact', '/contact']];
export const products = [
  { id: 'meal', index: 1, name: 'Fish Meal', type: 'MARINE PROTEIN', short: 'A foundation for feed nutrition.', text: 'A marine protein ingredient for aquaculture, poultry, and livestock feed formulations.', application: 'Aquaculture, poultry & livestock feed', packing: 'Woven bags · bulk supply discussion', details: ['Grade-led protein options', 'Packing matched to your supply requirement', 'Product specification sheet on request'] },
  { id: 'oil', index: 2, name: 'Fish Oil', type: 'MARINE OIL', short: 'Marine nutrition in liquid form.', text: 'Marine oil for nutrition-focused feed blends and industrial applications.', application: 'Feed blends & industrial applications', packing: 'Drums, IBC & bulk options', details: ['Marine oil profile for formulation discussion', 'Handling formats suited to your requirement', 'Batch documentation available on request'] },
  { id: 'paste', index: 3, name: 'Fish Soluble Paste', type: 'NUTRIENT CONCENTRATE', short: 'Concentrated marine potential.', text: 'A concentrated marine ingredient designed to support palatability and nutrient density in feed recipes.', application: 'Specialised feed formulations', packing: 'Drums · confirm preferred format', details: ['Concentrated soluble marine fraction', 'For palatability-focused feed requirements', 'Specification and handling guidance on request'] },
];
export const steps = [
  { number: '01', title: 'Receive', label: 'THE STARTING POINT', summary: 'Marine raw material, received and reviewed.', text: 'Marine raw material is received and reviewed before it enters the process. Timely handling sets the direction for the stages that follow.', note: 'Material intake' },
  { number: '02', title: 'Process', label: 'CONTROLLED PREPARATION', summary: 'Cooking and pressing prepare the material.', text: 'Controlled cooking and pressing prepare the raw material for separation into its distinct marine ingredient streams.', note: 'Cooking & pressing' },
  { number: '03', title: 'Separate', label: 'DISTINCT INGREDIENT STREAMS', summary: 'Meal, oil, and soluble fractions take shape.', text: 'Meal, oil, and soluble fractions are separated and handled according to the finished ingredient and its intended format.', note: 'Meal, oil & solubles' },
  { number: '04', title: 'Review & pack', label: 'READY FOR THE NEXT STEP', summary: 'Finished ingredients are checked and packed.', text: 'Finished material is reviewed, packed, and prepared for supply. Product specifications, packing, and relevant documentation are discussed before dispatch.', note: 'Product & dispatch readiness' },
];
export const pageMeta = {
  '/': { title: 'From the sea. For what’s next.', description: 'Discover Seaora Marine Products: fish meal, fish oil, and fish soluble paste from Manapad, Tamil Nadu, for feed formulation requirements.' },
  '/about': { title: 'About us', description: 'Meet Seaora Marine Products Private Limited, a marine ingredients business based in Manapad, Tamil Nadu, India.' },
  '/products': { title: 'Marine ingredients', description: 'Explore Seaora fish meal, fish oil, and fish soluble paste. Discuss specifications, packing formats, and supply requirements.' },
  '/process': { title: 'Our process', description: 'Explore Seaora’s four-stage marine ingredient journey: receiving, processing, separation, and review before packing.' },
  '/quality': { title: 'Quality approach', description: 'Understand Seaora’s approach to material review, process observations, finished ingredients, and product documentation.' },
  '/careers': { title: 'Careers', description: 'Explore career interests with Seaora Marine Products in Manapad. Prepare a general careers enquiry and contact the team about current opportunities.' },
  '/contact': { title: 'Contact & enquiries', description: 'Contact Seaora for product specifications and supply enquiries. Share your product, application, quantity, and destination.' },
  notFound: { title: 'Page not found', description: 'Find your way back to Seaora Marine Products and explore our marine ingredients.' },
};
export function getRoute(path) { const clean = path.replace(/\/+$/, '') || '/'; return clean === '/design-directions' ? '/' : clean; }
export function buildQuickEnquiryRoute({ intent, product }) {
  if (intent === 'careers') return '/careers#career-enquiry';
  const params = new URLSearchParams();
  if (products.some(item => item.id === product)) params.set('product', product);
  if (['specifications', 'supply'].includes(intent)) params.set('intent', intent);
  return `/contact${params.size ? `?${params}` : ''}#enquiry-form`;
}
export function initialRequirement(search) {
  const params = new URLSearchParams(search);
  const lines = [];
  if (params.get('intent') === 'specifications') lines.push('Please share the relevant product specifications and available documentation.');
  if (params.get('intent') === 'supply') lines.push('I would like to discuss a supply requirement.');
  if (params.get('application')) lines.push(`Application: ${params.get('application').slice(0, 200)}`);
  return lines.join('\n');
}
export const careerAreas = ['Production & operations', 'Quality & laboratory', 'Engineering & maintenance', 'Logistics & supply', 'Sales & administration', 'General interest'];
export function buildCareerEnquiry(fields) {
  const clean = value => String(value || '').trim();
  const area = careerAreas.includes(fields.area) ? fields.area : 'General interest';
  const subject = `Seaora careers enquiry — ${area}`;
  const body = `Hello Seaora team,\n\nI would like to enquire about career opportunities.\n\nName: ${clean(fields.name)}\nEmail: ${clean(fields.email)}\nPhone: ${clean(fields.phone) || 'Not provided'}\nCurrent location: ${clean(fields.location)}\nArea of interest: ${area}\nExperience: ${clean(fields.experience) || 'Not provided'}\n\nAbout me:\n${clean(fields.message)}\n\nPlease let me know if there are suitable opportunities and how I can apply.\n\nThank you.`;
  return { subject, body, href: `mailto:info@seaoraonline.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` };
}
export function buildEnquiry(fields) {
  const clean = value => String(value || '').trim();
  const product = products.some(p => p.name === fields.product) ? fields.product : 'General enquiry';
  const subject = `Seaora enquiry — ${product}`;
  const body = `Hello Seaora team,\n\nI would like to discuss the following requirement.\n\nName: ${clean(fields.name)}\nCompany: ${clean(fields.company)}\nEmail: ${clean(fields.email)}\nPhone: ${clean(fields.phone) || 'Not provided'}\nProduct: ${product}\nQuantity: ${clean(fields.quantity) || 'To be discussed'}\nDestination: ${clean(fields.destination) || 'To be discussed'}\n\nRequirement:\n${clean(fields.message)}\n\nThank you.`;
  return { subject, body, href: `mailto:sales@seaoraonline.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` };
}
