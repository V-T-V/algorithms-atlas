// =============================================================================
// 游程编码（Run-Length Encoding, RLE）· 纯算法实现
// 把连续相同字符合并成 (char, count) 对，用于无损压缩与周期/游程分析。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

/** 一个游程：字符 + 连续出现次数。 */
export interface Run {
  char: string;
  count: number;
  /** 该游程在原串中的起始下标。 */
  start: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface RunLengthHooks {
  /** 确定一个游程（字符、次数、起点）。 */
  onRun?: (run: Run) => void;
  /** 计算完成。 */
  onDone?: (runs: Run[]) => void;
}

/**
 * 游程编码：把字符串压缩成 (char, count) 游程序列。
 *
 * 线性扫描：相邻相同字符合并，不同字符开启新游程。
 * 时间 O(n)，空间 O(游程数)。
 *
 * @returns 游程序列（按出现顺序）
 */
export function runLength(s: string, hooks: RunLengthHooks = {}): Run[] {
  const runs: Run[] = [];
  let i = 0;
  while (i < s.length) {
    const ch = s[i]!;
    let j = i + 1;
    while (j < s.length && s[j] === ch) j++;
    const run: Run = { char: ch, count: j - i, start: i };
    runs.push(run);
    hooks.onRun?.(run);
    i = j;
  }
  hooks.onDone?.(runs);
  return runs;
}

/** 把游程序列还原成字符串。 */
export function decodeRuns(runs: Run[]): string {
  return runs.map((r) => r.char.repeat(r.count)).join('');
}
