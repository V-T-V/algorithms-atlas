// AES-CTR · 实现（自带 toy 块加密）
export interface CtrHooks {
  onCounter?: (counter: number[]) => void;
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
export function ctrCrypt(
  key: number[],
  nonce: number[],
  data: number[],
  hooks: CtrHooks = {},
): number[] {
  const out: number[] = [];
  const counter = [...nonce];
  for (let i = 0; i < data.length; i += 16) {
    hooks.onCounter?.([...counter]);
    const ks = blockEnc(key, counter);
    hooks.onStream?.(ks);
    for (let k = 0; k < 16 && i + k < data.length; k++) out.push(data[i + k]! ^ ks[k]!);
    for (let k = 15; k >= 0; k--) {
      counter[k] = (counter[k]! + 1) & 0xff;
      if (counter[k] !== 0) break;
    }
  }
  return out;
}
