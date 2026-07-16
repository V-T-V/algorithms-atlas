// =============================================================================
// Tunstall 编码 · 纯算法实现
// =============================================================================

interface TNode {
  seq: string; // 该叶对应的符号串
  prob: number;
  code: number; // 定长码字
}

export interface TunstallHooks {
  onExpand?: (seq: string, prob: number) => void;
}

export interface TunstallResult {
  /** 字符串 → 码字（定长 L 位）。仅含多字符组合（共 2^L 项）。 */
  dict: Map<string, number>;
  /** 码字 → 字符串。 */
  revDict: Map<number, string>;
  /** 单字符兜底：字符串 → 码字（码字从 2^L 起，保证编码器任意字符可编码）。 */
  baseDict: Map<string, number>;
  /** 单字符兜底：码字 → 字符串。 */
  baseRevDict: Map<number, string>;
  /** 码字位数（多字符码部分）。 */
  L: number;
}

/** 构建 Tunstall 字典：字母表 + 各自概率 + 目标码长 L。 */
export function buildTunstall(
  alphabet: Array<{ sym: string; prob: number }>,
  L: number,
  hooks: TunstallHooks = {},
): TunstallResult {
  const target = 1 << L; // 2^L 叶子
  const leaves: TNode[] = alphabet.map((a) => ({ seq: a.sym, prob: a.prob, code: 0 }));
  // 若初始就超过目标，截断
  while (leaves.length < target) {
    // 选概率最大叶
    let maxIdx = 0;
    for (let i = 1; i < leaves.length; i++) {
      if (leaves[i]!.prob > leaves[maxIdx]!.prob) maxIdx = i;
    }
    const expand = leaves[maxIdx]!;
    hooks.onExpand?.(expand.seq, expand.prob);
    // 移除该叶，加入 expand + 每个符号
    leaves.splice(maxIdx, 1);
    for (const a of alphabet) {
      leaves.push({ seq: expand.seq + a.sym, prob: expand.prob * a.prob, code: 0 });
    }
  }
  // 分配码字 0..2^L-1
  leaves.sort((a, b) => b.prob - a.prob);
  const dict = new Map<string, number>();
  const revDict = new Map<number, string>();
  for (let i = 0; i < leaves.length; i++) {
    leaves[i]!.code = i;
    dict.set(leaves[i]!.seq, i);
    revDict.set(i, leaves[i]!.seq);
  }
  // 单字符兜底码：从 2^L 起分配，保证编码器对任意单字符可编码
  // （展开后单字符叶常被消耗，需独立兜底以保证可逆）
  const baseDict = new Map<string, number>();
  const baseRevDict = new Map<number, string>();
  for (let i = 0; i < alphabet.length; i++) {
    const sym = alphabet[i]!.sym;
    baseDict.set(sym, target + i);
    baseRevDict.set(target + i, sym);
  }
  return { dict, revDict, baseDict, baseRevDict, L };
}

/** 用 Tunstall 字典编码字符串（贪心最长匹配，单字符兜底）。 */
export function tunstallEncode(text: string, result: TunstallResult): number[] {
  const codes: number[] = [];
  let i = 0;
  // 找最长匹配的前缀串
  while (i < text.length) {
    let bestLen = 0;
    let bestSeq = '';
    for (const seq of result.dict.keys()) {
      if (text.startsWith(seq, i) && seq.length > bestLen) {
        bestLen = seq.length;
        bestSeq = seq;
      }
    }
    if (bestLen === 0) {
      // 多字符字典无匹配（常因末尾单字符被展开消耗）
      // → 使用单字符兜底码
      const ch = text[i]!;
      const base = result.baseDict.get(ch);
      if (base === undefined) throw new Error(`位置 ${i} 字符 "${ch}" 无法编码`);
      codes.push(base);
      i += 1;
      continue;
    }
    codes.push(result.dict.get(bestSeq)!);
    i += bestLen;
  }
  return codes;
}

/** 解码：每个码字 → 串（多字符码或单字符兜底码）。 */
export function tunstallDecode(codes: readonly number[], result: TunstallResult): string {
  let out = '';
  for (const c of codes) {
    out += result.revDict.get(c) ?? result.baseRevDict.get(c) ?? '';
  }
  return out;
}
