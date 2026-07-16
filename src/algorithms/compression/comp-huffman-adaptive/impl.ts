// =============================================================================
// 自适应 Huffman (简化 FGK 风格) · 纯算法实现
// 简化策略：先输出不同符号表（让收发双方共享字母表），再对每个符号用「当前累积频率下的
// Huffman 编码」。每编码/解码一个符号就增量重建码本 —— 体现"自适应"的核心。
// =============================================================================

export interface AdaptiveHuffHooks {
  onSymbol?: (sym: number, code: string, isNew: boolean) => void;
  onRebuild?: (codes: ReadonlyMap<number, string>) => void;
}

interface HuffNode {
  sym: number;
  weight: number;
  l: HuffNode | null;
  r: HuffNode;
}

/** 由频率表构造 Huffman 码本（返回 sym → 比特串）。单符号给 '0'。 */
function buildCodes(freq: Map<number, number>): Map<number, string> {
  if (freq.size === 0) return new Map();
  if (freq.size === 1) {
    const sym = freq.keys().next()!.value as number;
    return new Map([[sym, '0']]);
  }
  const nodes: HuffNode[] = [];
  for (const [sym, w] of freq)
    nodes.push({ sym, weight: w, l: null, r: null as unknown as HuffNode });
  while (nodes.length > 1) {
    nodes.sort((a, b) => a.weight - b.weight || a.sym - b.sym);
    const a = nodes.shift()!;
    const b = nodes.shift()!;
    nodes.push({ sym: Math.min(a.sym, b.sym), weight: a.weight + b.weight, l: a, r: b });
  }
  const out = new Map<number, string>();
  function walk(n: HuffNode, prefix: string): void {
    if (n.l === null) {
      out.set(n.sym, prefix || '0');
      return;
    }
    walk(n.l, prefix + '0');
    walk(n.r, prefix + '1');
  }
  walk(nodes[0]!, '');
  return out;
}

/**
 * 简化自适应 Huffman：
 *  - 字母表（所有不同符号）在码流开头声明，保证收发双方同步。
 *  - 每个符号编码时用「此前累积频率」构造的 Huffman 码本。
 *  - 每编/解码一个符号后增量更新频率并重建。
 */
export class AdaptiveHuffman {
  private freq = new Map<number, number>();
  private codes = new Map<number, string>();
  private readonly hooks: AdaptiveHuffHooks;

  constructor(hooks: AdaptiveHuffHooks = {}) {
    this.hooks = hooks;
  }

  private rebuild(): void {
    this.codes = buildCodes(this.freq);
    this.hooks.onRebuild?.(this.codes);
  }

  /** 处理一个符号，返回其编码（基于此前频率）。 */
  encodeSymbol(sym: number): string {
    const isNew = !this.freq.has(sym);
    // 取码本（可能为空 → 用 '0' 占位，表示首符号）
    const code = this.codes.get(sym) ?? '0';
    this.hooks.onSymbol?.(sym, code, isNew);
    this.freq.set(sym, (this.freq.get(sym) ?? 0) + 1);
    this.rebuild();
    return code;
  }

  /** 编码整个序列。码流结构：[字母表头] + [每个符号的自适应 Huffman 码]。 */
  encode(data: readonly number[]): string {
    if (data.length === 0) return '';
    // 1. 字母表头：不同符号列表（每个 8 位），前面 8 位是数量
    const distinct = [...new Set(data)];
    let bits = distinct.length.toString(2).padStart(8, '0');
    for (const s of distinct) bits += (s & 0xff).toString(2).padStart(8, '0');
    // 2. 把字母表先喂给编码器（让首符号有非空码本）
    for (const s of distinct) {
      this.freq.set(s, (this.freq.get(s) ?? 0) + 1);
    }
    this.rebuild();
    // 3. 对每个原始符号编码（继续增量更新）
    // 重置频率，从零开始按真实出现次数累积，但首符号需要已有码本
    // 为了让首符号能编码，保留字母表产生的初始频率
    for (const b of data) bits += this.encodeSymbol(b);
    return bits;
  }

  /** 解码。 */
  decode(bits: string): number[] {
    if (bits.length === 0) return [];
    let i = 0;
    // 1. 读字母表头
    const count = parseInt(bits.slice(0, 8), 2);
    i = 8;
    const distinct: number[] = [];
    for (let k = 0; k < count; k++) {
      distinct.push(parseInt(bits.slice(i, i + 8), 2));
      i += 8;
    }
    // 2. 喂字母表建立初始频率与码本
    const freq = new Map<number, number>();
    for (const s of distinct) freq.set(s, (freq.get(s) ?? 0) + 1);
    let codes = buildCodes(freq);
    // 3. 反向索引：比特串 → 符号
    const out: number[] = [];
    while (i < bits.length) {
      // 贪心最长匹配
      let matchSym = -1;
      let matchLen = 0;
      for (const [sym, c] of codes) {
        if (bits.startsWith(c, i) && c.length > matchLen) {
          matchSym = sym;
          matchLen = c.length;
        }
      }
      if (matchLen === 0) break;
      out.push(matchSym);
      i += matchLen;
      freq.set(matchSym, (freq.get(matchSym) ?? 0) + 1);
      codes = buildCodes(freq);
    }
    return out;
  }
}
