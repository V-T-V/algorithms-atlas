// =============================================================================
// AES玩具版（AES (Toy)）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 教学版 AES：在 2×2 字节状态矩阵上演示完整轮变换四件套
// （SubBytes / ShiftRows / MixColumns / AddRoundKey），便于在网格中可视化。
// =============================================================================

/** Rijndael S-Box 前 16 项（用于本演示的 4-bit 索引代换）。 */
const SBOX: readonly number[] = [
  0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
];

/** GF(2^8) 上的乘法，简约多项式 x^8+x^4+x^3+x+1（0x11B）。 */
function gmul(a: number, b: number): number {
  let p = 0;
  let x = a & 0xff;
  let y = b & 0xff;
  for (let i = 0; i < 8; i++) {
    if (y & 1) p ^= x;
    const hi = x & 0x80;
    x = (x << 1) & 0xff;
    if (hi) x ^= 0x1b;
    y >>= 1;
  }
  return p & 0xff;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface AesHooks {
  onSubBytes?: (state: number[]) => void;
  onShiftRows?: (state: number[]) => void;
  onMixColumns?: (state: number[]) => void;
  onAddRoundKey?: (state: number[], roundKey: number[]) => void;
}

export interface AesResult {
  /** 加密后的字节（与输入等长）。 */
  bytes: number[];
}

/**
 * 玩具版 AES：在 4 字节状态（2×2 列主序）上做一轮标准 AES 轮变换。
 *
 * 步骤：
 * 1. SubBytes：每字节经 S-Box 代换（取低 4 位索引本演示的 16 项表）
 * 2. ShiftRows：第 1 行左移 1（列主序下标 {1,3} 互换）
 * 3. MixColumns：每列在 GF(2^8) 上乘固定矩阵 [[2,3],[3,2]]
 * 4. AddRoundKey：与轮密钥逐字节异或
 *
 * @param input 4 字节明文
 * @param roundKey 4 字节轮密钥
 * @param hooks 可选的事件钩子
 */
export function aes(
  input: number[],
  roundKey: number[] = [0x2b, 0x7e, 0x15, 0x16],
  hooks: AesHooks = {},
): AesResult {
  if (input.length !== 4) throw new Error('toy AES 需要 4 字节输入');
  let s = [...input];

  // 1. SubBytes（用低 4 位查演示 S-Box）
  s = s.map((b) => SBOX[(b & 0x0f)!] ?? b);
  hooks.onSubBytes?.([...s]);

  // 2. ShiftRows：行 0 = 下标 {0,2}，行 1 = 下标 {1,3} → 交换 1 与 3
  const t = s[1]!;
  s[1] = s[3]!;
  s[3] = t;
  hooks.onShiftRows?.([...s]);

  // 3. MixColumns：每列 [s0,s1] / [s2,s3] 与常量矩阵 [[2,3],[3,2]] 相乘
  const mixCol = (c0: number, c1: number): [number, number] => [
    gmul(2, c0) ^ gmul(3, c1),
    gmul(3, c0) ^ gmul(2, c1),
  ];
  const [m0a, m0b] = mixCol(s[0]!, s[1]!);
  const [m1a, m1b] = mixCol(s[2]!, s[3]!);
  s = [m0a & 0xff, m0b & 0xff, m1a & 0xff, m1b & 0xff];
  hooks.onMixColumns?.([...s]);

  // 4. AddRoundKey
  const out = s.map((b, i) => b ^ (roundKey[i] ?? 0));
  hooks.onAddRoundKey?.([...out], [...roundKey]);
  return { bytes: out };
}
