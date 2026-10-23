import test from 'node:test';
import assert from 'node:assert/strict';
import { pages, products, pageMeta, getRoute, buildEnquiry, careerAreas, buildCareerEnquiry, buildQuickEnquiryRoute, initialRequirement } from '../src/content.js';

test('all seven navigation destinations have unique page metadata', () => {
  assert.equal(pages.length, 7);
  assert.equal(new Set(pages.map(([,path]) => path)).size, 7);
  assert.equal(new Set(pages.map(([,path]) => pageMeta[path].title)).size, 7);
  for (const [,path] of pages) assert.ok(pageMeta[path].description.length > 40);
});
test('trailing slashes normalize without treating unknown pages as home', () => {
  assert.equal(getRoute('/about/'), '/about');
  assert.equal(getRoute('/'), '/');
  assert.equal(getRoute('/missing'), '/missing');
});
test('old design directions link still reaches a useful page', () => {
  assert.equal(getRoute('/design-directions'), '/');
});
test('each product has distinct enquiry identity and complete information', () => {
  assert.equal(new Set(products.map(p => p.id)).size, 3);
  for (const p of products) {
    assert.ok(p.text && p.application && p.packing && p.details.length);
    assert.match(buildEnquiry({product:p.name}).subject, new RegExp(p.name));
  }
});
test('enquiry preserves customer and requirement details', () => {
  const fields = {name:'Test Buyer',company:'Example Feeds',email:'buyer@example.com',phone:'+91 12345',product:'Fish Oil',quantity:'20 tonnes',destination:'Chennai',message:'Please share specifications.'};
  const draft = buildEnquiry(fields);
  for (const value of Object.values(fields)) assert.ok(draft.body.includes(value));
  const url = new URL(draft.href);
  assert.equal(url.protocol, 'mailto:');
  assert.equal(url.pathname, 'sales@seaoraonline.com');
  assert.equal(url.searchParams.get('body'), draft.body);
});
test('special characters cannot add email recipients or headers', () => {
  const draft = buildEnquiry({name:'A & B',message:'Line 1\n&bcc=other@example.com? # தமிழ்',product:'Fish Meal'});
  const url = new URL(draft.href);
  assert.deepEqual([...url.searchParams.keys()], ['subject','body']);
  assert.equal(url.hash, '');
  assert.ok(url.searchParams.get('body').includes('தமிழ்'));
});
test('unknown product is a general enquiry, not a fabricated catalogue entry', () => {
  assert.equal(buildEnquiry({product:'Unknown'}).subject, 'Seaora enquiry — General enquiry');
});
test('optional details are explicit and whitespace is trimmed', () => {
  const body = buildEnquiry({name:'  Buyer  '}).body;
  assert.ok(body.includes('Name: Buyer\n'));
  assert.ok(body.includes('Phone: Not provided'));
  assert.ok(body.includes('Quantity: To be discussed'));
});

test('career draft preserves applicant details and targets the general company inbox', () => {
  const fields = {name:'Test Applicant',email:'applicant@example.com',phone:'+91 12345',location:'Chennai',area:'Quality & laboratory',experience:'Graduate',message:'Interested in ingredient testing.'};
  const draft = buildCareerEnquiry(fields);
  for (const value of Object.values(fields)) assert.ok(draft.body.includes(value));
  const url = new URL(draft.href);
  assert.equal(url.pathname, 'info@seaoraonline.com');
  assert.equal(url.searchParams.get('body'), draft.body);
  assert.equal(url.searchParams.get('subject'), draft.subject);
});
test('career interests are validated and optional values have clear fallbacks', () => {
  for (const area of careerAreas) assert.ok(buildCareerEnquiry({area}).subject.endsWith(area));
  const draft = buildCareerEnquiry({area:'Unlisted position',name:'  Applicant  '});
  assert.equal(draft.subject, 'Seaora careers enquiry — General interest');
  assert.ok(draft.body.includes('Name: Applicant\n'));
  assert.ok(draft.body.includes('Phone: Not provided'));
  assert.ok(draft.body.includes('Experience: Not provided'));
});
test('career email safely encodes Unicode and does not allow header injection', () => {
  const draft = buildCareerEnquiry({name:'தமிழ் & Applicant',message:'\n&bcc=other@example.com#test',area:'Sales & administration'});
  const url = new URL(draft.href);
  assert.deepEqual([...url.searchParams.keys()], ['subject','body']);
  assert.equal(url.hash, '');
  assert.equal(url.searchParams.get('body'), draft.body);
});

test('quick enquiry preserves the selected product and business intent', () => {
  const route = buildQuickEnquiryRoute({intent:'specifications', product:'oil'});
  assert.equal(route, '/contact?product=oil&intent=specifications#enquiry-form');
  assert.match(initialRequirement('?intent=specifications'), /specifications and available documentation/);
  assert.match(initialRequirement('?intent=supply'), /supply requirement/);
});
test('careers choice goes to careers and does not carry a product enquiry', () => {
  assert.equal(buildQuickEnquiryRoute({intent:'careers',product:'meal'}), '/careers#career-enquiry');
});
test('quick enquiry rejects unknown intent and product values', () => {
  assert.equal(buildQuickEnquiryRoute({intent:'https://example.com',product:'oil&bcc=other@example.com'}), '/contact#enquiry-form');
  assert.equal(initialRequirement('?intent=unknown'), '');
});
test('application links remain supported with bounded prefilled text', () => {
  assert.equal(initialRequirement('?application=Aquaculture'), 'Application: Aquaculture');
  assert.ok(initialRequirement('?application=' + 'a'.repeat(300)).length <= 213);
  assert.match(initialRequirement('?application=Poultry&intent=supply'), /supply requirement\.\nApplication: Poultry/);
});
