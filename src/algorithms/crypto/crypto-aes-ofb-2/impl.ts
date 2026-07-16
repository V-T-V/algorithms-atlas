// AES-OFB v2 · 实现（自带 toy 块加密）
export interface OfbHooks {
  onFeedback?: (fb: number[]) => void;
  onStream?: (ks: number[]) => void;
}
function blockEnc(key: number[], blk: number[]): number[] {
  const out = blk.slice();
  for (let r = 0; r < 4; r++) {
    for (let i = 0; i < 16; i++)
      out[i] = ((out[i]! + key[(i + r) % key.length]! + r * 0x11) ^ (out[i]! << 1)) & 0xff;
    for (let i = 0; i < 16; i++) out[i] = out[i]! ^ out[(i + 7) % 16]!;
  }
  return out;
}
export function ofbCrypt(
  key: number[],
  iv: number[],
  data: number[],
  hooks: OfbHooks = {},
): number[] {
  const out: number[] = [];
  let feedback = [...iv];
  for (let i = 0; i < data.length; i += 16) {
    feedback = blockEnc(key, feedback);
    hooks.onFeedback?.([...feedback]);
    hooks.onStream?.(feedback);
    for (let k = 0; k < 16 && i + k < data.length; k++) out.push(data[i + k]! ^ feedback[k]!);
  }
  return out;
}
