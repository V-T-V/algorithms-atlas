// =============================================================================
// PPM* 风格变体 · 纯算法实现（简化）
// 维护多阶上下文计数表；对每个符号用「最长上下文 + 退避」计算编码概率。
// =============================================================================

/** 单步编码事件。 */
export interface PpmStep {
  /** 当前符号（码点）。 */
  symbol: number;
  /** 命中的上下文阶数（-1 表示退避到 0 阶 / 均匀）。 */
  order: number;
  /** 该符号在所选上下文中的编码概率（∈ (0,1]）。 */
  probability: number;
  /** 信息量 -log2(p)，单位 bit。 */
  bits: number;
}

export interface PpmHooks {
  onPredict?: (
    pos: number,
    symbol: number,
    order: number,
    probability: number,
    bits: number,
  ) => void;
  onEscape?: (pos: number, fromOrder: number, toOrder: number) => void;
}

export interface PpmResult {
  steps: PpmStep[];
  /** 累计信息量（bit）。 */
  totalBits: number;
}

/** 字符串 → 码点数组。 */
export function toCodePoints(s: string): number[] {
  return Array.from(s).map((c) => c.codePointAt(0)!);
}

/** 把历史 [pos-order, pos) 转成上下文键。 */
function contextKey(data: number[], pos: number, order: number): string {
  if (order <= 0) return '';
  const start = Math.max(0, pos - order);
  return data.slice(start, pos).join(',');
}

/**
 * PPM* 风格编码（PPM with escape, order-k 退避）。
 *
 * - 维护 order=0..maxOrder 的上下文 → {symbol: count} 计数表。
 * - 对位置 pos 的符号 s：从 maxOrder 向下试，命中（该上下文见过 s）则用它；
 *   每次未命中触发 escape，按 PPM-D 退避：概率 = count_s / (total + escapeDenom)。
 * - 退避到 order=-1（均匀分布）时 probability = 1/|alphabet|。
 * - 编码后把 s 计入所有 order 的上下文表（更新）。
 *
 * @param input 输入
 * @param maxOrder 最大上下文阶（默认 2）
 * @param escapeDenom escape 分母增量（PPM-D 风格，默认 = 上下文不同符号数）
 * @param hooks 可选事件钩子
 */
export function ppmStar(input: string, maxOrder = 2, hooks: PpmHooks = {}): PpmResult {
  const data = toCodePoints(input);
  const n = data.length;
  // counts[order] : Map<contextKey, Map<symbol, count>>
  const counts: Map<string, Map<number, number>>[] = [];
  for (let o = 0; o <= maxOrder; o++) counts.push(new Map());

  const steps: PpmStep[] = [];
  let totalBits = 0;

  // 字母表大小：用已见符号集合的当前大小 + 1（预留 escape 新符号）
  const seen = new Set<number>();

  for (let pos = 0; pos < n; pos++) {
    const s = data[pos]!;
    let chosenOrder = -1;
    let probability = 0;

    for (let o = maxOrder; o >= 0; o--) {
      const key = contextKey(data, pos, o);
      const tbl = counts[o]!.get(key);
      if (!tbl) {
        // 上下文不存在 → 直接 escape（不计概率，但要发 onEscape）
        hooks.onEscape?.(pos, o, o - 1);
        continue;
      }
      let total = 0;
      for (const c of tbl.values()) total += c;
      const denom = total + tbl.size; // PPM-D escape
      const cS = tbl.get(s) ?? 0;
      if (cS > 0) {
        // 命中
        probability = cS / denom;
        chosenOrder = o;
        break;
      } else {
        // 该上下文见过别的符号但没见过 s → escape
        hooks.onEscape?.(pos, o, o - 1);
      }
    }

    // 退避到 order=-1：均匀分布
    if (chosenOrder < 0) {
      const alpha = seen.size + 1; // +1 给当前未见符号留位
      probability = 1 / alpha;
      chosenOrder = -1;
    }

    const bits = -Math.log2(probability);
    totalBits += bits;
    steps.push({ symbol: s, order: chosenOrder, probability, bits });
    hooks.onPredict?.(pos, s, chosenOrder, probability, bits);

    // 更新所有 order 的上下文计数
    seen.add(s);
    for (let o = 0; o <= maxOrder; o++) {
      const key = contextKey(data, pos, o);
      let tbl = counts[o]!.get(key);
      if (!tbl) {
        tbl = new Map();
        counts[o]!.set(key, tbl);
      }
      tbl.set(s, (tbl.get(s) ?? 0) + 1);
    }
  }

  return { steps, totalBits };
}
