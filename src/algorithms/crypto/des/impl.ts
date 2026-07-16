// =============================================================================
// DES玩具版（DES (Toy)）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 教学版 DES：在 8 位明文上演示 Feistel 一轮（P-box 置换 + 密钥混合 + S-box 代换）。
// =============================================================================

/** 8→8 扩展/置换盒（演示用固定排列）。 */
const PBOX: readonly number[] = [4, 7, 2, 6, 1, 5, 0, 3];
/** 4 项玩具 S-Box。 */
const SBOX: readonly number[] = [3, 0, 2, 1];

/** 按给定排列（下标数组）重排比特位。 */
function permute(bits: number[], table: readonly number[]): number[] {
  return table.map((idx) => bits[idx]!);
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface DesHooks {
  onPermute?: (bits: number[]) => void;
  onKeyMix?: (bits: number[]) => void;
  onSbox?: (bits: number[]) => void;
}

export interface DesResult {
  bits: number[];
}

/**
 * 玩具版 DES 单轮：对 8 位比特串执行 P-box 置换、与 8 位密钥异或、
 * 再取高/低 4 位各经 2-to-1 S-Box 压缩回 8 位。
 * @param input 8 位比特数组
 * @param key 8 位密钥比特数组
 * @param hooks 可选的事件钩子
 */
export function des(
  input: number[],
  key: number[] = [1, 0, 1, 0, 0, 1, 1, 0],
  hooks: DesHooks = {},
): DesResult {
  if (input.length !== 8) throw new Error('玩具 DES 需要 8 位输入');
  // 1. P-box 置换
  let s = permute(input, PBOX);
  hooks.onPermute?.([...s]);

  // 2. 与密钥异或
  s = s.map((b, i) => b ^ (key[i] ?? 0));
  hooks.onKeyMix?.([...s]);

  // 3. S-Box：高 4 位 / 低 4 位各两位映射成 1 位 → 仍输出 8 位
  //    取每相邻两位组成 2-bit 索引，经 SBOX 得 1 位，再两两拼回 8 位
  const out: number[] = [];
  for (let i = 0; i < 8; i += 2) {
    const idx = (s[i]! << 1) | s[i + 1]!;
    const sb = SBOX[idx & 0x03]! & 1;
    out.push(sb, sb);
  }
  hooks.onSbox?.([...out]);
  return { bits: out };
}
