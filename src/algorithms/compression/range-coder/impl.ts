// =============================================================================
// 范围编码（Range Coder）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 用 32 位整数实现算术编码的「区间编码」变体，避免专利问题。
// =============================================================================

const TOP: bigint = 1n << 32n;
const BOTTOM: bigint = 0xffn << 24n;
const MASK: bigint = (1n << 32n) - 1n;

export interface RangeModel {
  /** 各符号的累计频（cumulative[i+1]-cumulative[i] = freq[i]）。 */
  cumulative: number[];
  /** 总频数。 */
  total: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface RangeCoderHooks {
  onEncode?: (sym: number, low: bigint, range: bigint) => void;
}

export interface RangeCoderResult {
  /** 编码后的字节序列。 */
  bytes: number[];
}

/** 从频数表构建累计模型。 */
export function buildModel(freqs: number[]): RangeModel {
  const cumulative = [0];
  for (const f of freqs) cumulative.push((cumulative[cumulative.length - 1]! + f) | 0);
  return { cumulative, total: cumulative[cumulative.length - 1]! };
}

/**
 * 范围编码：把符号序列压缩成字节。
 * 每个符号把当前区间 [low, low+range) 按累计频率细分。
 * @param symbols 符号下标序列
 * @param model 频率模型
 * @param hooks 可选的事件钩子
 */
export function rangeCoder(
  symbols: number[],
  model: RangeModel,
  hooks: RangeCoderHooks = {},
): RangeCoderResult {
  let low = 0n;
  let range = TOP - 1n;
  const out: number[] = [];

  const normalize = (): void => {
    while ((low & BOTTOM) === ((low + range) & BOTTOM)) {
      out.push(Number((low >> 24n) & 0xffn));
      low = (low << 8n) & MASK;
      range = (range << 8n) & MASK;
    }
    while ((low & BOTTOM) !== 0n && range < BOTTOM) {
      range = ((~low & (BOTTOM - 1n)) + 1n) & MASK;
    }
  };

  for (const sym of symbols) {
    range /= BigInt(model.total);
    low += BigInt(model.cumulative[sym]!) * range;
    range *= BigInt(model.cumulative[sym + 1]! - model.cumulative[sym]!);
    hooks.onEncode?.(sym, low, range);
    normalize();
  }
  // flush
  for (let i = 0; i < 5; i++) {
    out.push(Number((low >> 24n) & 0xffn));
    low = (low << 8n) & MASK;
  }
  return { bytes: out };
}
