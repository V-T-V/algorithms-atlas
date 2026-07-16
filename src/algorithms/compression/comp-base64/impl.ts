export interface B64Hooks {
  onQuartet?: (chars: string) => void;
}
const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
export function base64Encode(bytes: number[], hooks: B64Hooks = {}): string {
  let out = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const b1 = bytes[i] ?? 0;
    const b2 = bytes[i + 1] ?? 0;
    const b3 = bytes[i + 2] ?? 0;
    const c1 = b1 >> 2;
    const c2 = ((b1 & 3) << 4) | (b2 >> 4);
    const c3 = ((b2 & 15) << 2) | (b3 >> 6);
    const c4 = b3 & 63;
    let q = ALPHA[c1]! + ALPHA[c2]!;
    q += i + 1 < bytes.length ? ALPHA[c3]! : '=';
    q += i + 2 < bytes.length ? ALPHA[c4]! : '=';
    hooks.onQuartet?.(q);
    out += q;
  }
  return out;
}
