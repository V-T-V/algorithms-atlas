// =============================================================================
// Shannon-Fano编码（Shannon-Fano）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 按频率递归二分构建前缀码，是 Huffman 的先驱。
// =============================================================================

export interface SFSymbol {
  symbol: string;
  freq: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface ShannonFanoHooks {
  onSplit?: (symbols: string[], left: string[], right: string[]) => void;
  onCode?: (symbol: string, code: string) => void;
}

export interface ShannonFanoResult {
  /** 符号到码字的映射。 */
  codes: Map<string, string>;
}

/** 递归分组：把符号按频率尽量等分。 */
function split(syms: SFSymbol[]): [SFSymbol[], SFSymbol[]] {
  const total = syms.reduce((s, x) => s + x.freq, 0);
  let acc = 0;
  let i = 0;
  for (; i < syms.length - 1; i++) {
    if (acc + syms[i]!.freq > total / 2) break;
    acc += syms[i]!.freq;
  }
  return [syms.slice(0, i + 1), syms.slice(i + 1)];
}

/**
 * Shannon-Fano 编码：按频率降序排列，递归地把符号分成频率总和相近的两组，
 * 左组赋 0、右组赋 1，直到每组只剩一个符号。
 * @param symbols 符号与频率
 * @param hooks 可选的事件钩子
 */
export function shannonFano(symbols: SFSymbol[], hooks: ShannonFanoHooks = {}): ShannonFanoResult {
  const codes = new Map<string, string>();
  const sorted = [...symbols].sort((a, b) => b.freq - a.freq);

  const rec = (syms: SFSymbol[], prefix: string): void => {
    if (syms.length === 1) {
      codes.set(syms[0]!.symbol, prefix);
      hooks.onCode?.(syms[0]!.symbol, prefix);
      return;
    }
    const [left, right] = split(syms);
    hooks.onSplit?.(
      syms.map((s) => s.symbol),
      left.map((s) => s.symbol),
      right.map((s) => s.symbol),
    );
    rec(left, prefix + '0');
    rec(right, prefix + '1');
  };
  rec(sorted, '');
  return { codes };
}

/** 用码表对文本编码。 */
export function encodeWith(text: string, codes: Map<string, string>): string {
  return Array.from(text)
    .map((c) => codes.get(c) ?? '')
    .join('');
}
