// 递归回文判定 · 纯算法实现

/** 事件钩子。 */
export interface IsPalindromeRecursiveHooks {
  /** 比较 s[lo] 与 s[hi]。 */
  onCompare?: (lo: number, hi: number, a: string, b: string) => void;
  /** 匹配成功（lo 与 hi 处字符相等）。 */
  onMatch?: (lo: number, hi: number) => void;
  /** 不匹配。 */
  onMismatch?: (lo: number, hi: number) => void;
  /** 最终结论。 */
  onResult?: (ok: boolean) => void;
}

export interface PalindromeOptions {
  /** 是否忽略大小写与空白（默认 false）。 */
  normalize?: boolean;
}

/** 规范化：小写化并去掉非字母数字字符。 */
function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * 递归回文判定：检查 s 是否回文。
 */
export function isPalindromeRecursive(
  s: string,
  hooks: IsPalindromeRecursiveHooks = {},
  options: PalindromeOptions = {},
): boolean {
  const { normalize: doNorm = false } = options;
  const str = doNorm ? normalize(s) : s;

  const check = (lo: number, hi: number): boolean => {
    if (lo >= hi) return true;
    const a = str[lo]!;
    const b = str[hi]!;
    hooks.onCompare?.(lo, hi, a, b);
    if (a !== b) {
      hooks.onMismatch?.(lo, hi);
      return false;
    }
    hooks.onMatch?.(lo, hi);
    return check(lo + 1, hi - 1);
  };

  const ok = check(0, str.length - 1);
  hooks.onResult?.(ok);
  return ok;
}
