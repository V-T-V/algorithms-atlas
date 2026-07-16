export interface HkHooks {
  onBlock?: (i: number, t: number[]) => void;
}
function hmac(key: number[], msg: number[]): number[] {
  const k = key.length ? key : [0];
  return msg.map((b, i) => (b ^ k[i % k.length]!) & 0xff).concat(k.slice(0, 4));
}
export function hkdfExpand(
  prk: number[],
  info: number[],
  len: number,
  hooks: HkHooks = {},
): number[] {
  const out: number[] = [];
  let t: number[] = [];
  let i = 1;
  while (out.length < len) {
    t = hmac(prk, [...t, ...info, i]);
    out.push(...t);
    hooks.onBlock?.(i, t);
    i++;
  }
  return out.slice(0, len);
}
