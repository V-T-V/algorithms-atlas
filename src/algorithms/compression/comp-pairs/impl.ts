// =============================================================================
// 相邻对编码 (BPE) · 纯算法实现
// =============================================================================

export interface BpeMerge {
  pair: [number, number];
  newToken: number;
}

export interface BpeHooks {
  onMerge?: (pair: [number, number], newToken: number, count: number) => void;
}

export interface BpeResult {
  tokens: number[];
  merges: BpeMerge[];
}

const FIRST_MERGE = 256;

/** 训练：对 token 序列做 R 轮 BPE 合并。 */
export function bpeTrain(data: readonly number[], rounds: number, hooks: BpeHooks = {}): BpeResult {
  const tokens = [...data];
  const merges: BpeMerge[] = [];
  let nextToken = FIRST_MERGE;

  for (let r = 0; r < rounds; r++) {
    // 统计相邻对频率
    const counts = new Map<string, { pair: [number, number]; count: number }>();
    for (let i = 0; i + 1 < tokens.length; i++) {
      const a = tokens[i]!;
      const b = tokens[i + 1]!;
      const key = `${a},${b}`;
      const cur = counts.get(key);
      if (cur) cur.count++;
      else counts.set(key, { pair: [a, b], count: 1 });
    }
    if (counts.size === 0) break;
    // 选最高频
    let best: { pair: [number, number]; count: number } | null = null;
    for (const v of counts.values()) {
      if (!best || v.count > best.count) best = v;
    }
    const top = best!;
    if (top.count < 2) break; // 只合并出现 >= 2 次的对
    merges.push({ pair: top.pair, newToken: nextToken });
    hooks.onMerge?.(top.pair, nextToken, top.count);
    // 应用合并
    const newTokens: number[] = [];
    let i = 0;
    while (i < tokens.length) {
      if (i + 1 < tokens.length && tokens[i] === top.pair[0] && tokens[i + 1] === top.pair[1]) {
        newTokens.push(nextToken);
        i += 2;
      } else {
        newTokens.push(tokens[i]!);
        i++;
      }
    }
    tokens.length = 0;
    tokens.push(...newTokens);
    nextToken++;
  }
  return { tokens, merges };
}

/** 解码：按合并表反向展开（从最后一条往前）。 */
export function bpeDecode(tokens: readonly number[], merges: readonly BpeMerge[]): number[] {
  let cur = [...tokens];
  for (let m = merges.length - 1; m >= 0; m--) {
    const rule = merges[m]!;
    const out: number[] = [];
    for (const t of cur) {
      if (t === rule.newToken) {
        out.push(rule.pair[0], rule.pair[1]);
      } else {
        out.push(t);
      }
    }
    cur = out;
  }
  return cur;
}
