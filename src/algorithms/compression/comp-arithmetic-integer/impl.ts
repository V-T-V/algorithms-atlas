// =============================================================================
// 整数算术编码 · 纯算法实现
// 简化版：用分数区间下界 + 总范围，输出区间下界的二进制（精度 P 位）。
// 保证收发双方同步的编解码。
// =============================================================================

export interface ArithIntHooks {
  onSymbol?: (sym: number, lo: number, range: number) => void;
}

export interface ArithIntModel {
  /** 符号到频率（整数）。 */
  freq: Map<number, number>;
  /** 累积频率表（按符号升序），[sym] -> 起始累积，末尾为 total。 */
  cum: number[];
  /** 排序后的符号列表。 */
  syms: number[];
  /** 频率总和。 */
  total: number;
}

export function buildModel(freq: Map<number, number>): ArithIntModel {
  const syms = [...freq.keys()].sort((a, b) => a - b);
  const cum: number[] = [0];
  let acc = 0;
  for (const s of syms) {
    acc += freq.get(s)!;
    cum.push(acc);
  }
  return { freq, cum, syms, total: acc };
}

function symIndex(model: ArithIntModel, sym: number): number {
  const idx = model.syms.indexOf(sym);
  if (idx < 0) throw new Error(`未知符号 ${sym}`);
  return idx;
}

/**
 * 编码：把符号序列映射到一个 [0,1) 内的分数下界（用大整数精度 P 位表示）。
 * 编码输出 P 位二进制。
 */
export function arithIntEncode(
  data: readonly number[],
  model: ArithIntModel,
  precision: number = 32,
  hooks: ArithIntHooks = {},
): string {
  const TOP = 2 ** precision;
  let lo = 0;
  let range = TOP;
  for (const b of data) {
    const idx = symIndex(model, symOf(model, b));
    const cLo = model.cum[idx]!;
    const cHi = model.cum[idx + 1]!;
    const step = Math.floor(range / model.total);
    lo = lo + step * cLo;
    range = step * (cHi - cLo);
    hooks.onSymbol?.(b, lo, range);
  }
  // 输出 lo 的精度位
  return lo.toString(2).padStart(precision, '0');
}

function symOf(model: ArithIntModel, sym: number): number {
  if (!model.syms.includes(sym)) throw new Error(`未知符号 ${sym}`);
  return sym;
}

/**
 * 解码：从 P 位二进制 + 模型 + 符号数 还原序列。
 */
export function arithIntDecode(
  bits: string,
  model: ArithIntModel,
  count: number,
  precision: number = 32,
): number[] {
  const TOP = 2 ** precision;
  const value = parseInt(bits.slice(0, precision), 2);
  const out: number[] = [];
  let lo = 0;
  let range = TOP;
  for (let k = 0; k < count; k++) {
    const step = Math.floor(range / model.total);
    // 找到符号：value-lo 落在哪个累积段
    const offset = Math.floor((value - lo) / step);
    let idx = 0;
    while (idx < model.syms.length && model.cum[idx + 1]! <= offset) idx++;
    const sym = model.syms[idx]!;
    out.push(sym);
    const cLo = model.cum[idx]!;
    const cHi = model.cum[idx + 1]!;
    lo = lo + step * cLo;
    range = step * (cHi - cLo);
  }
  return out;
}
