// =============================================================================
// 算术编码 Arithmetic Coding · 纯算法实现
// 将整个消息编码为 [0,1) 区间内的一个浮点数。
// 编码：逐字符缩小区间；解码：按区间逆向确定字符。
// =============================================================================

export type FreqMap = Record<string, number>;

export interface ArithmeticHooks {
  /** 编码一个字符后触发，show 当前区间 [lo, hi]。 */
  onEncodeSymbol?: (ch: string, lo: number, hi: number) => void;
}

/** 根据频率表计算累积分布。返回 [{ch, lo, hi}]。 */
export function buildCDF(freq: FreqMap): Array<{ ch: string; lo: number; hi: number }> {
  const total = Object.values(freq).reduce((a, b) => a + b, 0);
  let acc = 0;
  const cdf: Array<{ ch: string; lo: number; hi: number }> = [];
  for (const [ch, f] of Object.entries(freq)) {
    const lo = acc / total;
    acc += f;
    const hi = acc / total;
    cdf.push({ ch, lo, hi });
  }
  return cdf;
}

/** 编码消息为 [0,1) 内的浮点数。 */
export function arithmeticEncode(
  message: string,
  freq: FreqMap,
  hooks: ArithmeticHooks = {},
): { code: number; length: number } {
  const cdf = buildCDF(freq);
  const cdfMap = new Map(cdf.map((e) => [e.ch, e]));
  let lo = 0;
  let hi = 1;
  for (const ch of message) {
    const range = hi - lo;
    const entry = cdfMap.get(ch);
    if (!entry) throw new Error(`未知字符: ${ch}`);
    const newLo = lo + range * entry.lo;
    const newHi = lo + range * entry.hi;
    lo = newLo;
    hi = newHi;
    hooks.onEncodeSymbol?.(ch, lo, hi);
  }
  // 取区间中点作为编码值
  return { code: (lo + hi) / 2, length: message.length };
}

/** 解码：给定编码值和消息长度，逆向恢复消息。 */
export function arithmeticDecode(code: number, length: number, freq: FreqMap): string {
  const cdf = buildCDF(freq);
  let result = '';
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < length; i++) {
    const range = hi - lo;
    const relPos = (code - lo) / range; // 归一化到 [0,1)
    // 找到 relPos 落在哪个字符的区间
    const entry = cdf.find((e) => relPos >= e.lo && relPos < e.hi);
    if (!entry) break;
    result += entry.ch;
    lo = lo + range * entry.lo;
    hi = lo + range * (entry.hi - entry.lo);
  }
  return result;
}
