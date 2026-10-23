// A bounded, cancellable loading gate. Old routes cannot dismiss a newer loader.
export function waitForPage({ ready, onReady, minimumMs = 700, maximumMs = 2400, setTimer = setTimeout, clearTimer = clearTimeout }) {
  let cancelled = false;
  let delivered = false;
  let minimumElapsed = false;
  let assetReady = false;
  const timers = [];
  const finish = () => {
    if (cancelled || delivered) return;
    delivered = true;
    timers.forEach(clearTimer);
    onReady();
  };
  const check = () => { if (minimumElapsed && assetReady) finish(); };
  timers.push(setTimer(() => { minimumElapsed = true; check(); }, minimumMs));
  timers.push(setTimer(finish, maximumMs));
  Promise.resolve(ready).catch(() => {}).then(() => { assetReady = true; check(); });
  return () => { cancelled = true; timers.forEach(clearTimer); };
}
