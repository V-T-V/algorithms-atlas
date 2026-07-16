// DES / 3DES · 实现（教学版 4 字节分组 / 4 轮 Feistel）
export interface DesHooks {
  onRound?: (round: number, l: number, r: number) => void;
}
// 教学轮函数 f(R, rk)：伪随机非线性变换
function f(R: number, rk: number): number {
  return (((R * 0x517 + rk) & 0xffff) ^ (((R << 3) | (R >>> 13)) & 0xffff)) & 0xffff;
}
// 第 i 轮子密钥（加密方向 0..rounds-1）
function roundKey(K: number, i: number): number {
  return (K + i) & 0xffff;
}
// 标准 Feistel：加密 = N 轮（每轮 newR=L^f(R,rk_i); L=R; R=newR）后输出 (L,R) 不交换。
function feistelEnc(
  block: number[],
  key: number[],
  rounds: number,
  hooks?: DesHooks,
): { L: number; R: number } {
  let L = ((block[0]! << 8) | block[1]!) & 0xffff;
  let R = ((block[2]! << 8) | block[3]!) & 0xffff;
  const K = ((key[0] ?? 0) << 8) | (key[1] ?? 0);
  for (let i = 0; i < rounds; i++) {
    const newR = (L ^ f(R, roundKey(K, i))) & 0xffff;
    L = R;
    R = newR;
    hooks?.onRound?.(i, L, R);
  }
  return { L, R };
}
// 解密 = 把输入当作 (R',L')（即交换），用反向子密钥跑同样 N 轮，最后再交换回来。
function feistelDec(
  block: number[],
  key: number[],
  rounds: number,
  hooks?: DesHooks,
): { L: number; R: number } {
  // 输入 (L_N, R_N) 与加密输出顺序一致；逐轮反推 (L_{i}, R_{i}) 由 (L_{i+1}, R_{i+1}) 得到：
  //   R_i = L_{i+1}; L_i = R_{i+1} ^ f(L_{i+1}, rk_i)
  let L = ((block[0]! << 8) | block[1]!) & 0xffff;
  let R = ((block[2]! << 8) | block[3]!) & 0xffff;
  const K = ((key[0] ?? 0) << 8) | (key[1] ?? 0);
  for (let i = rounds - 1; i >= 0; i--) {
    const prevR = L;
    const prevL = (R ^ f(L, roundKey(K, i))) & 0xffff;
    L = prevL;
    R = prevR;
    hooks?.onRound?.(rounds - 1 - i, L, R);
  }
  return { L, R };
}
export function desEncrypt(key: number[], block: number[], hooks: DesHooks = {}): number[] {
  const { L, R } = feistelEnc(block, key, 4, hooks);
  return [(L >>> 8) & 0xff, L & 0xff, (R >>> 8) & 0xff, R & 0xff];
}
export function desDecrypt(key: number[], block: number[], hooks: DesHooks = {}): number[] {
  const { L, R } = feistelDec(block, key, 4, hooks);
  return [(L >>> 8) & 0xff, L & 0xff, (R >>> 8) & 0xff, R & 0xff];
}
export function tripleDesEncrypt(
  k1: number[],
  k2: number[],
  block: number[],
  hooks: DesHooks = {},
): number[] {
  return desEncrypt(k1, desDecrypt(k2, desEncrypt(k1, block, hooks), hooks), hooks);
}
export function tripleDesDecrypt(
  k1: number[],
  k2: number[],
  block: number[],
  hooks: DesHooks = {},
): number[] {
  return desDecrypt(k1, desEncrypt(k2, desDecrypt(k1, block, hooks), hooks), hooks);
}
