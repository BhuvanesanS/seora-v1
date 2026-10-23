import test from 'node:test';
import assert from 'node:assert/strict';
import { waitForPage } from '../src/routeLoading.js';

function clock() {
  const jobs = new Map(); let id = 0; let now = 0;
  return { setTimer(fn, ms) { jobs.set(++id, {fn, at: now + ms}); return id; },
    clearTimer(id) { jobs.delete(id); },
    tick(ms) { now += ms; for (const [id, job] of [...jobs]) if (job.at <= now && jobs.has(id)) { jobs.delete(id); job.fn(); } },
  };
}
const flush = async () => { await Promise.resolve(); await Promise.resolve(); };
test('cached route image still shows the short page introduction', async () => {
  const time = clock(); let calls = 0;
  waitForPage({ ...time, ready: Promise.resolve(), onReady: () => calls++ });
  await flush(); time.tick(699); assert.equal(calls, 0);
  time.tick(1); assert.equal(calls, 1); time.tick(3000); assert.equal(calls, 1);
});
test('failed imagery never traps the visitor in the loader', async () => {
  const time = clock(); let calls = 0;
  waitForPage({ ...time, ready: Promise.reject(new Error('offline')), onReady: () => calls++ });
  await flush(); time.tick(700); assert.equal(calls, 1);
});
test('an image that never settles is bounded by the maximum timeout', () => {
  const time = clock(); let calls = 0;
  waitForPage({ ...time, ready: new Promise(() => {}), onReady: () => calls++ });
  time.tick(2399); assert.equal(calls, 0); time.tick(1); assert.equal(calls, 1);
});
test('unmounted or superseded route cannot complete a newer transition', async () => {
  const time = clock(); let calls = 0; let resolve;
  const cancel = waitForPage({ ...time, ready: new Promise(r => {resolve = r;}), onReady: () => calls++ });
  cancel(); resolve(); await flush(); time.tick(3000); assert.equal(calls, 0);
});
test('slow image finishes once when ready after the minimum', async () => {
  const time = clock(); let calls = 0; let resolve;
  waitForPage({ ...time, ready: new Promise(r => {resolve = r;}), onReady: () => calls++ });
  time.tick(900); assert.equal(calls, 0); resolve(); await flush(); assert.equal(calls, 1);
});
