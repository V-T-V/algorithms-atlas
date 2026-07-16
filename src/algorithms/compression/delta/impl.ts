// =============================================================================
// Delta编码（Delta Coding）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface DeltaHooks {
  onDelta?: (i: number, delta: number) => void;
}

export interface DeltaResult {
  /** 差分序列（首元素保留为基准）。 */
  deltas: number[];
}

/**
 * Delta 编码：把序列替换为相邻元素的差分。
 * deltas[0] = data[0]；deltas[i] = data[i] - data[i-1]。
 * 对缓慢变化的序列（时间序列、音频）能显著缩小动态范围。
 * @param data 输入数值序列
 * @param hooks 可选的事件钩子
 */
export function delta(data: number[], hooks: DeltaHooks = {}): DeltaResult {
  if (data.length === 0) return { deltas: [] };
  const deltas = [data[0]!];
  hooks.onDelta?.(0, data[0]!);
  for (let i = 1; i < data.length; i++) {
    const d = data[i]! - data[i - 1]!;
    deltas.push(d);
    hooks.onDelta?.(i, d);
  }
  return { deltas };
}

/** Delta 解码：累加还原。 */
export function inverseDelta(deltas: number[]): number[] {
  if (deltas.length === 0) return [];
  const out = [deltas[0]!];
  for (let i = 1; i < deltas.length; i++) out.push(out[i - 1]! + deltas[i]!);
  return out;
}
