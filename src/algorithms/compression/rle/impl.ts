// =============================================================================
// 游程编码 Run-Length Encoding · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 一个游程（run）：连续的若干个相同符号 value，共 count 个。 */
export interface Run {
  value: string;
  count: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface RleHooks {
  /** 开始一个新游程：从索引 start 处，符号为 value。 */
  onRun?: (start: number, value: string) => void;
  /** 游程结束：符号 value，连续 count 个（占 [start, start+count)）。 */
  onEmit?: (start: number, value: string, count: number) => void;
}

/**
 * 游程编码：把连续相同的符号压缩成 (value, count) 对。
 *
 * 适用于字符串（按字符游程）。输入为空时返回空数组。
 *
 * @param input 输入字符串
 * @param hooks 可选的事件钩子
 * @returns 游程序列
 */
export function rle(input: string, hooks: RleHooks = {}): Run[] {
  const runs: Run[] = [];
  if (input.length === 0) return runs;

  let i = 0;
  while (i < input.length) {
    const value = input[i]!;
    hooks.onRun?.(i, value);

    let count = 1;
    while (i + count < input.length && input[i + count] === value) {
      count++;
    }
    runs.push({ value, count });
    hooks.onEmit?.(i, value, count);
    i += count;
  }
  return runs;
}

/**
 * 把游程序列编码成字符串。
 * 默认格式 `<value><count>`（如 `A3B2`）。可选自定义分隔符。
 */
export function encodeRuns(runs: Run[], sep = ''): string {
  return runs.map((r) => `${r.value}${r.count}`).join(sep);
}

/** 游程解码：把游程序列还原成原始字符串。 */
export function decodeRuns(runs: Run[]): string {
  return runs.map((r) => r.value.repeat(r.count)).join('');
}

/** 计算压缩比：原始长度 / 编码后长度（>1 表示有压缩收益）。 */
export function compressionRatio(input: string, runs: Run[]): number {
  if (input.length === 0) return 1;
  const encoded = encodeRuns(runs).length;
  return encoded === 0 ? 1 : input.length / encoded;
}
