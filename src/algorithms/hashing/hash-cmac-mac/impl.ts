// CMAC (简化伪块密码) · 实现
export interface CmacHooks {
  onBlock?: (i: number, block: number, acc: number) => void;
  onConclude?: (tag: number) => void;
}
function blockCipher(block: number, key: number): number {
  return ((block ^ key) * 2654435761) >>> 0;
}
function genSubkeys(key: number): [number, number] {
  const l = blockCipher(0, key);
  const k1 = (l << 1) ^ ((l >>> 31) * 0x87);
  const k2 = (k1 << 1) ^ ((k1 >>> 31) * 0x87);
  return [k1 >>> 0, k2 >>> 0];
}
export function cmac(data: string, key = 0xabcdef01, hooks: CmacHooks = {}): number {
  const [k1, k2] = genSubkeys(key);
  const blocks: number[] = [];
  for (let i = 0; i < data.length; i += 4) {
    let b = 0;
    for (let j = 0; j < 4; j++) b |= (i + j < data.length ? data.charCodeAt(i + j) : 0) << (j * 8);
    blocks.push(b);
  }
  if (blocks.length === 0) blocks.push(0);
  const last = blocks[blocks.length - 1]!;
  blocks[blocks.length - 1] = last ^ k1; // 简化: 假设完整块
  let acc = 0;
  for (let i = 0; i < blocks.length; i++) {
    acc = blockCipher(acc ^ blocks[i]!, key);
    hooks.onBlock?.(i, blocks[i]!, acc);
  }
  hooks.onConclude?.(acc >>> 0);
  void k2;
  return acc >>> 0;
}
