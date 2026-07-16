// Rabin 指纹 (GF(2) 多项式) · 实现
export interface RfHooks {
  onByte?: (i: number, byte: number, fp: number) => void;
  onConclude?: (fingerprint: number) => void;
}
const POLY = 0x11d; // x^8 + x^4 + x^3 + x^2 + 1 (含隐式 x^8)
export function rabinFingerprint(data: string, hooks: RfHooks = {}): number {
  let fp = 0;
  for (let i = 0; i < data.length; i++) {
    fp ^= data.charCodeAt(i);
    for (let b = 0; b < 8; b++) {
      if (fp & 0x80) fp = ((fp << 1) ^ POLY) & 0xff;
      else fp = (fp << 1) & 0xff;
    }
    hooks.onByte?.(i, data.charCodeAt(i), fp);
  }
  hooks.onConclude?.(fp);
  return fp;
}
