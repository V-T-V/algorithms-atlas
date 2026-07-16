// =============================================================================
// Blowfish 密钥扩展 · 简化实现
// 演示 P/S 初始化 + 反复加密自覆盖的密钥扩展流程。
// 轮函数用简化版（非真实 Blowfish F）。
// =============================================================================

export const P_ARRAY_LEN = 18;
export const S_BOX_LEN = 256;
export const S_BOX_COUNT = 4;
const ROUNDS = 16;

/** 用 π 的十六进制小数位填充初值（演示用伪随机种子）。 */
function piHexInit(len: number, seedOffset: number): number[] {
  const out: number[] = [];
  // 简化：用 (index * 黄金比) 异或一个常数生成 32 位初值
  const phi = 0x9e3779b9;
  for (let i = 0; i < len; i++) {
    const v = (((i + seedOffset + 1) * phi) ^ 0x243f6a88) >>> 0;
    out.push(v);
  }
  return out;
}

export interface BlowfishState {
  P: number[];
  S: number[][];
}

export interface BlowfishHooks {
  onInitP?: (index: number, value: number) => void;
  onInitS?: (box: number, index: number, value: number) => void;
  onEncryptStep?: (round: number, l: number, r: number) => void;
  onOverwriteP?: (index: number, value: number) => void;
  onOverwriteS?: (box: number, index: number, value: number) => void;
}

/** 简化的 Blowfish F 函数（非真实，仅用于演示密钥扩展的反馈）。 */
function blowfishF(state: BlowfishState, x: number): number {
  const a = (x >>> 24) & 0xff;
  const b = (x >>> 16) & 0xff;
  const c = (x >>> 8) & 0xff;
  const d = x & 0xff;
  const s0 = state.S[0]![a]!;
  const s1 = state.S[1]![b]!;
  const s2 = state.S[2]![c]!;
  const s3 = state.S[3]![d]!;
  return (((s0 + s2) ^ s1) + s3) >>> 0;
}

/** 单次 Blowfish 加密（16 轮 Feistel）。 */
export function blowfishEncrypt(
  state: BlowfishState,
  lIn: number,
  rIn: number,
): { l: number; r: number } {
  let l = lIn >>> 0;
  let r = rIn >>> 0;
  for (let i = 0; i < ROUNDS; i++) {
    l = (l ^ state.P[i]!) >>> 0;
    const f = blowfishF(state, l);
    r = (f ^ r) >>> 0;
    // 交换 l, r
    [l, r] = [r, l];
  }
  // 撤销最后一次交换
  [l, r] = [r, l];
  r = (r ^ state.P[ROUNDS]!) >>> 0;
  l = (l ^ state.P[ROUNDS + 1]!) >>> 0;
  return { l, r };
}

/** 把字符串密钥展开为 32 位字数组（循环填充到至少 18 项）。 */
export function keyToWords(key: string): number[] {
  const bytes = Array.from(key).map((c) => c.charCodeAt(0) & 0xff);
  if (bytes.length === 0) bytes.push(0);
  const words: number[] = [];
  let bi = 0;
  while (words.length < P_ARRAY_LEN) {
    let w = 0;
    for (let s = 0; s < 4; s++) {
      w = (w << 8) | (bytes[bi % bytes.length]! & 0xff);
      bi++;
    }
    words.push(w >>> 0);
  }
  return words;
}

/**
 * Blowfish 密钥扩展：
 *  1) 用 π 风格初值填充 P（18）与 4 个 S 盒（256×4）；
 *  2) 用密钥字异或覆盖 P；
 *  3) 反复用当前 P/S 加密全零块 (L=0,R=0)，把输出依次覆盖 P[0..17]、S[0..3][0..255]。
 */
export function blowfishKeySchedule(key: string, hooks: BlowfishHooks = {}): BlowfishState {
  const P = piHexInit(P_ARRAY_LEN, 0);
  for (let i = 0; i < P.length; i++) hooks.onInitP?.(i, P[i]!);
  const S: number[][] = [];
  for (let b = 0; b < S_BOX_COUNT; b++) {
    const box = piHexInit(S_BOX_LEN, 100 + b);
    S.push(box);
    for (let i = 0; i < box.length; i++) hooks.onInitS?.(b, i, box[i]!);
  }

  const keyWords = keyToWords(key);
  for (let i = 0; i < P_ARRAY_LEN; i++) {
    P[i] = (P[i]! ^ keyWords[i % keyWords.length]!) >>> 0;
    hooks.onOverwriteP?.(i, P[i]!);
  }

  const state: BlowfishState = { P, S };
  let l = 0;
  let r = 0;
  let stepRound = 0;

  // 覆盖 P
  for (let i = 0; i < P_ARRAY_LEN; i += 2) {
    const { l: nl, r: nr } = blowfishEncrypt(state, l, r);
    hooks.onEncryptStep?.(stepRound++, nl, nr);
    P[i] = nl;
    P[i + 1] = nr;
    hooks.onOverwriteP?.(i, nl);
    if (i + 1 < P_ARRAY_LEN) hooks.onOverwriteP?.(i + 1, nr);
    l = nl;
    r = nr;
  }
  // 覆盖 4 个 S 盒
  for (let b = 0; b < S_BOX_COUNT; b++) {
    for (let i = 0; i < S_BOX_LEN; i += 2) {
      const { l: nl, r: nr } = blowfishEncrypt(state, l, r);
      hooks.onEncryptStep?.(stepRound++, nl, nr);
      S[b]![i] = nl;
      if (i + 1 < S_BOX_LEN) S[b]![i + 1] = nr;
      hooks.onOverwriteS?.(b, i, nl);
      if (i + 1 < S_BOX_LEN) hooks.onOverwriteS?.(b, i + 1, nr);
      l = nl;
      r = nr;
    }
  }

  return state;
}
