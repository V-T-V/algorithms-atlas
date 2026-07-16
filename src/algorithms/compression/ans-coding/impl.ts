// =============================================================================
// 非对称数制编码 rANS · 纯算法实现（简化）
// 用一个静态频率表，演示 rANS 的单步编/解码。
// =============================================================================

/** 符号 → 频率。 */
export type FreqTable = Map<number, number>;

/** 派生：累积频率与每符号起始值。 */
export interface AnsModel {
  /** 频率表副本（已归一化为 M = sum(freqs)）。 */
  freq: FreqTable;
  /** 总质量 M。 */
  M: number;
  /** 符号列表（升序）。 */
  symbols: number[];
  /** 累积频率 cumulative[s]。 */
  cumulative: Map<number, number>;
}

export interface AnsHooks {
  onEncode?: (symbol: number, xBefore: number, xAfter: number) => void;
  onDecode?: (symbol: number, xBefore: number, xAfter: number) => void;
}

/** 从频率表构造 ANS 模型（归一化保留整数频率）。 */
export function buildModel(freq: FreqTable): AnsModel {
  const symbols = [...freq.keys()].filter((s) => (freq.get(s) ?? 0) > 0).sort((a, b) => a - b);
  const M = symbols.reduce((a, s) => a + (freq.get(s) ?? 0), 0);
  const cumulative = new Map<number, number>();
  let acc = 0;
  for (const s of symbols) {
    cumulative.set(s, acc);
    acc += freq.get(s)!;
  }
  return { freq: new Map(freq), M, symbols, cumulative };
}

/**
 * rANS 单步编码：把 symbol 编入当前状态 x。
 *   x' = M * (x // fs) + xs + (x mod fs)
 * 其中 M = Σfreq（状态基数），fs = freq[symbol]，xs = cumulative[symbol]。
 * 解码是其严格逆运算（见 ransDecodeStep）。
 */
export function ransEncodeStep(x: number, symbol: number, model: AnsModel): number {
  const fs = model.freq.get(symbol)!;
  const xs = model.cumulative.get(symbol)!;
  return model.M * Math.floor(x / fs) + xs + (x % fs);
}

/**
 * rANS 单步解码：从 x 还原一个符号与新的 x。
 * 返回 { symbol, x }。
 */
export function ransDecodeStep(x: number, model: AnsModel): { symbol: number; x: number } {
  const slot = x % model.M;
  // 找到 cumulative[s] <= slot < cumulative[s] + freq[s]
  let symbol = model.symbols[0]!;
  for (const s of model.symbols) {
    const cs = model.cumulative.get(s)!;
    const fs = model.freq.get(s)!;
    if (slot >= cs && slot < cs + fs) {
      symbol = s;
      break;
    }
  }
  const fs = model.freq.get(symbol)!;
  const xs = model.cumulative.get(symbol)!;
  const newX = fs * Math.floor(x / model.M) + slot - xs;
  return { symbol, x: newX };
}

/**
 * 编码整条符号流（rANS，无 renormalization —— 演示用小规模）。
 * 初始 x = M（保证可逆），逐步前进。
 */
export function ransEncode(symbols: number[], model: AnsModel, hooks: AnsHooks = {}): number {
  let x = model.M;
  for (const s of symbols) {
    const before = x;
    x = ransEncodeStep(x, s, model);
    hooks.onEncode?.(s, before, x);
  }
  return x;
}

/** 解码：已知最终 x 与符号数 n，反向逐步还原（返回的符号序列需 reverse）。 */
export function ransDecode(
  finalX: number,
  n: number,
  model: AnsModel,
  hooks: AnsHooks = {},
): number[] {
  let x = finalX;
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const before = x;
    const { symbol, x: newX } = ransDecodeStep(x, model);
    out.push(symbol);
    hooks.onDecode?.(symbol, before, newX);
    x = newX;
  }
  return out.reverse();
}
