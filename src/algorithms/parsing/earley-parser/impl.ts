// =============================================================================
// Earley 分析器 · 纯算法实现
// 任意 CFG 的图表分析：扫描/完成/预测三步，构造每位置状态集。
// 零 DOM 依赖，可独立单测。
// =============================================================================

export interface Production {
  lhs: string;
  rhs: string[]; // ε 用空数组表示
}

export interface Grammar {
  start: string;
  productions: Production[];
}

/** Earley 状态：A → α · β (origin)。 */
export interface State {
  prod: number; // 产生式下标
  dot: number; // 点位置
  origin: number; // 起源位置
}

export interface EarleyHooks {
  onPredict?: (pos: number, state: State) => void;
  onScan?: (pos: number, state: State, token: string) => void;
  onComplete?: (pos: number, state: State) => void;
  onResult?: (accepted: boolean) => void;
}

export interface ParseResult {
  accepted: boolean;
  chart: State[][];
}

/** 状态签名（去重用）。 */
function stateKey(s: State): string {
  return `${s.prod},${s.dot},${s.origin}`;
}

/**
 * Earley 识别。
 *
 * @param tokens 输入终结符数组
 * @param grammar 文法
 * @param hooks 可选事件钩子
 * @returns 是否接受 + 完整 chart
 */
export function earleyParse(
  tokens: string[],
  grammar: Grammar,
  hooks: EarleyHooks = {},
): ParseResult {
  const n = tokens.length;
  // 初始化 chart：n+1 个状态集
  const chart: State[][] = [];
  for (let i = 0; i <= n; i++) chart.push([]);

  // 把起始符的所有产生式加入 S_0（dot=0, origin=0）
  for (let p = 0; p < grammar.productions.length; p++) {
    if (grammar.productions[p]!.lhs === grammar.start) {
      chart[0]!.push({ prod: p, dot: 0, origin: 0 });
    }
  }

  for (let k = 0; k <= n; k++) {
    const set = chart[k]!;
    const seen = new Set(set.map(stateKey));
    let i = 0;
    while (i < set.length) {
      const st = set[i]!;
      i++;
      const prod = grammar.productions[st.prod]!;
      const nextSym = prod.rhs[st.dot]; // 点后符号；undefined 表示完成态

      if (nextSym === undefined) {
        // —— complete：A → α· (origin) ——
        hooks.onComplete?.(k, st);
        // 把 origin 集中等待 A 的状态推进
        const originSet = chart[st.origin]!;
        for (const os of originSet) {
          const oProd = grammar.productions[os.prod]!;
          if (oProd.rhs[os.dot] === prod.lhs) {
            const advanced: State = { prod: os.prod, dot: os.dot + 1, origin: os.origin };
            const key = stateKey(advanced);
            if (!seen.has(key)) {
              seen.add(key);
              set.push(advanced);
            }
          }
        }
      } else if (isNonTerminal(nextSym, grammar)) {
        // —— predict：点后是非终结符 B ——
        hooks.onPredict?.(k, st);
        for (let p = 0; p < grammar.productions.length; p++) {
          if (grammar.productions[p]!.lhs === nextSym) {
            const predicted: State = { prod: p, dot: 0, origin: k };
            const key = stateKey(predicted);
            if (!seen.has(key)) {
              seen.add(key);
              set.push(predicted);
            }
          }
        }
      } else {
        // —— scan：点后是终结符 ——
        if (k < n && tokens[k] === nextSym) {
          hooks.onScan?.(k, st, nextSym);
          const advanced: State = { prod: st.prod, dot: st.dot + 1, origin: st.origin };
          const key = stateKey(advanced);
          const nextSeen = chart[k + 1]!.reduce<Set<string>>((acc, s) => {
            acc.add(stateKey(s));
            return acc;
          }, new Set());
          if (!nextSeen.has(key)) {
            chart[k + 1]!.push(advanced);
          }
        }
      }
    }
  }

  // 接受条件：S_n 中存在 start 产生式的完成态（origin=0）
  const accepted = chart[n]!.some((s) => {
    const prod = grammar.productions[s.prod]!;
    return prod.lhs === grammar.start && s.dot >= prod.rhs.length && s.origin === 0;
  });
  hooks.onResult?.(accepted);
  return { accepted, chart };
}

/** 判断符号是否为非终结符（出现在某产生式左部）。 */
export function isNonTerminal(sym: string, grammar: Grammar): boolean {
  return grammar.productions.some((p) => p.lhs === sym);
}

// ---------------------------------------------------------------------------
// 示例文法：经典算术
//   E → E + T | T
//   T → T * F | F
//   F → ( E ) | id
// ---------------------------------------------------------------------------
export const SAMPLE_GRAMMAR: Grammar = {
  start: 'E',
  productions: [
    { lhs: 'E', rhs: ['E', '+', 'T'] },
    { lhs: 'E', rhs: ['T'] },
    { lhs: 'T', rhs: ['T', '*', 'F'] },
    { lhs: 'T', rhs: ['F'] },
    { lhs: 'F', rhs: ['(', 'E', ')'] },
    { lhs: 'F', rhs: ['id'] },
  ],
};
