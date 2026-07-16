// =============================================================================
// Delta-of-Delta 编码 · 纯算法实现
// 二阶差分：d[i] = (t[i]-t[i-1]) - (t[i-1]-t[i-2])，首项特殊处理。
// =============================================================================

export interface DeltaOfDeltaHooks {
  onDelta?: (i: number, prevDelta: number | null, curDelta: number, dod: number) => void;
}

export interface DeltaOfDeltaResult {
  /** 第 0 项 = 原值；第 1 项 = 一阶差分；之后 = 二阶差分。 */
  values: number[];
}

/**
 * Delta-of-Delta 编码（整数时间戳序列）。
 *   values[0] = timestamps[0]
 *   values[1] = timestamps[1] - timestamps[0]            （一阶 delta）
 *   values[i] = (t[i]-t[i-1]) - (t[i-1]-t[i-2])           （二阶 delta），i>=2
 */
export function deltaOfDeltaEncode(
  timestamps: number[],
  hooks: DeltaOfDeltaHooks = {},
): DeltaOfDeltaResult {
  const n = timestamps.length;
  const values: number[] = [];
  if (n === 0) return { values };
  values.push(timestamps[0]!);

  let prevDelta: number | null = null;
  for (let i = 1; i < n; i++) {
    const curDelta = timestamps[i]! - timestamps[i - 1]!;
    let dod: number;
    if (prevDelta === null) {
      dod = curDelta; // 第一项记录一阶 delta
    } else {
      dod = curDelta - prevDelta;
    }
    values.push(dod);
    hooks.onDelta?.(i, prevDelta, curDelta, dod);
    prevDelta = curDelta;
  }
  return { values };
}

/** Delta-of-Delta 解码：还原原时间戳序列。 */
export function deltaOfDeltaDecode(values: number[]): number[] {
  const n = values.length;
  if (n === 0) return [];
  const out: number[] = [values[0]!];
  if (n === 1) return out;
  // 第二项是一阶 delta
  let prevDelta = values[1]!;
  out.push(out[0]! + prevDelta);
  for (let i = 2; i < n; i++) {
    const dod = values[i]!;
    const curDelta = prevDelta + dod;
    out.push(out[i - 1]! + curDelta);
    prevDelta = curDelta;
  }
  return out;
}
