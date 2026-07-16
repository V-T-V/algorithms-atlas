export interface RipHooks {
  onSeg?: (s: string, idx: number) => void;
  onResult?: (ip: string) => void;
}
function validSeg(s: string): boolean {
  if (s.length === 0 || s.length > 3) return false;
  if (s.length > 1 && s[0] === '0') return false;
  const n = Number(s);
  return n >= 0 && n <= 255;
}
export function restoreIpAddresses(s: string, hooks: RipHooks = {}): string[] {
  const out: string[] = [];
  const cur: string[] = [];
  const go = (start: number) => {
    if (cur.length === 4 && start === s.length) {
      out.push(cur.join('.'));
      hooks.onResult?.(cur.join('.'));
      return;
    }
    if (cur.length === 4 || start >= s.length) return;
    for (let len = 1; len <= 3 && start + len <= s.length; len++) {
      const seg = s.slice(start, start + len);
      if (validSeg(seg)) {
        cur.push(seg);
        hooks.onSeg?.(seg, cur.length - 1);
        go(start + len);
        cur.pop();
      }
    }
  };
  go(0);
  return out;
}
