// =============================================================================
// 数位 DP（Digit DP）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 典型问题：统计 [1, n] 中「不含数字 d」的整数个数。
// =============================================================================

/** 数位 DP 输入。 */
export interface DigitDpInput {
  /** 上界 n（含），统计 [1, n]。 */
  n: number;
  /** 要排除的数字 d（0-9）。 */
  digit: number;
}

/** 数位 DP 执行过程中的事件钩子。任一可选。 */
export interface DigitDpHooks {
  /** 进入某一位 pos 的子问题：tight 表示当前是否贴上界。 */
  onEnterState?: (pos: number, tight: number, started: number) => void;
  /** 在某位 pos 选了数字 choice（valid 表示是否符合约束）。 */
  onChooseDigit?: (pos: number, choice: number, valid: boolean) => void;
  /** 一个子问题 (pos,tight,started) 的解已求出。 */
  onSolve?: (pos: number, tight: number, started: number, value: number) => void;
  /** 算法完成：答案。 */
  onDone?: (answer: number) => void;
}

/**
 * 数位 DP：统计 [1, n] 中「不含数字 digit」的整数个数。
 *
 * 状态 `f(pos, tight, started)`：
 * - `pos`：当前处理到的数位（从高位 0 到 len-1）。
 * - `tight`：1 表示前面各位都已贴上界（当前位上限为 n 的该位数字），0 表示已自由（上限 9）。
 * - `started`：1 表示已经放过非零位（前导 0 已结束），0 表示仍在前导 0。
 *
 * 转移：在当前位枚举 0..up，跳过被禁数字（注意：前导 0 的 '0' 不算「含 0」，除非 digit≠0 时才需要禁 0）。
 *
 * @param input 输入
 * @param hooks 可选事件钩子
 * @returns [1,n] 中不含 digit 的整数个数
 */
export function digitDp(input: DigitDpInput, hooks: DigitDpHooks = {}): number {
  const { n, digit } = input;
  if (n <= 0) return 0;
  const digits = String(n)
    .split('')
    .map((c) => Number(c));
  const len = digits.length;

  // 记忆化：(pos, tight, started) → count；tight=1 的状态不记忆（只走一次）
  const memo = new Map<string, number>();

  const dfs = (pos: number, tight: number, started: number): number => {
    if (pos === len) {
      // 形成一个数：仅当 started=1（即真正放了非零位）才算一个合法数
      return started === 1 ? 1 : 0;
    }
    const key = `${pos},${tight},${started}`;
    if (tight === 0 && memo.has(key)) return memo.get(key)!;
    hooks.onEnterState?.(pos, tight, started);

    const up = tight === 1 ? digits[pos]! : 9;
    let sum = 0;
    for (let choice = 0; choice <= up; choice++) {
      // 是否仍是前导 0
      const newStarted = started === 1 || choice !== 0 ? 1 : 0;
      // 约束：选了 digit（且若 digit=0，前导 0 的 0 不计入）
      const isForbidden = choice === digit && !(choice === 0 && started === 0 && digit === 0);
      const valid = !isForbidden;
      hooks.onChooseDigit?.(pos, choice, valid);
      if (!valid) continue;
      const newTight = tight === 1 && choice === up ? 1 : 0;
      sum += dfs(pos + 1, newTight, newStarted);
    }
    if (tight === 0) memo.set(key, sum);
    hooks.onSolve?.(pos, tight, started, sum);
    return sum;
  };

  const answer = dfs(0, 1, 0);
  hooks.onDone?.(answer);
  return answer;
}
