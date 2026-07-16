// =============================================================================
// SimHash 文档指纹 · 纯算法实现
// 特征 → m 位哈希 → ± 加权累加 → 取符号得指纹。零 DOM 依赖，可独立单测。
// =============================================================================

/** 事件钩子。 */
export interface SimHashHooks {
  /** 处理一个特征后累加器的中间值（含正负贡献）。 */
  onFeature?: (feature: string, weight: number, hash: number, accum: number[]) => void;
  /** 取符号后输出最终指纹（m 位十进制 0/1 数组）。 */
  onResult?: (fingerprint: number[]) => void;
}

/** 简单 32 位哈希（FNV-1a 变体）。 */
function hash32(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** 把文档分词为特征数组（默认按空白与标点切分）。 */
export function tokenize(doc: string): string[] {
  return doc
    .toLowerCase()
    .split(/[^a-z0-9\u4e00-\u9fa5]+/)
    .filter((t) => t.length > 0);
}

/**
 * 计算 m 位 SimHash 指纹。
 * @param features 特征数组（或文档字符串，内部自动分词）
 * @param bits 指纹位宽（默认 64，实现上用 m 个整数符号位）
 * @param hooks 可选事件钩子
 * @returns 长度为 bits 的 0/1 数组
 */
export function simHash(
  features: string[] | string,
  bits: number = 64,
  hooks: SimHashHooks = {},
): number[] {
  if (bits <= 0) throw new RangeError('bits must be positive');
  const feats = typeof features === 'string' ? tokenize(features) : features;
  // 权重：默认每个特征权重 1（也可按词频）
  const weights = computeWeights(feats);
  const accum = new Array<number>(bits).fill(0);

  for (const [feat, weight] of weights) {
    const h = hash32(feat);
    for (let i = 0; i < bits; i++) {
      const bit = (h >>> i) & 1;
      accum[i] = accum[i]! + (bit ? weight : -weight);
    }
    hooks.onFeature?.(feat, weight, h, [...accum]);
  }

  const fp = accum.map((v) => (v > 0 ? 1 : 0));
  hooks.onResult?.(fp);
  return fp;
}

/** 计算每个特征的出现次数（权重）。 */
export function computeWeights(features: string[]): Array<[string, number]> {
  const m = new Map<string, number>();
  for (const f of features) m.set(f, (m.get(f) ?? 0) + 1);
  return [...m.entries()];
}

/** 两个指纹的汉明距离。 */
export function hammingDistance(a: readonly number[], b: readonly number[]): number {
  if (a.length !== b.length) throw new Error('fingerprint lengths differ');
  let d = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) d++;
  }
  return d;
}

/** 把 0/1 数组转为二进制字符串。 */
export function fingerprintToString(fp: readonly number[]): string {
  return fp.join('');
}
