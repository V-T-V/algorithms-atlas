// =============================================================================
// 哈希聚合 · 纯算法实现
// 通用框架：Accumulator 接口 + 多种聚合函数工厂。
// =============================================================================

/** 累加器接口：init / add / result。 */
export interface Accumulator<V, R> {
  add(value: V): void;
  result(): R;
}

/** 累加器工厂（每个分组新建一个）。 */
export type AccFactory<V, R> = () => Accumulator<V, R>;

// —— 内置聚合函数工厂 ——
export const countAcc = <V = number>(): Accumulator<V, number> => {
  let c = 0;
  return {
    add: () => {
      c += 1;
    },
    result: () => c,
  };
};

export const sumAcc = (): Accumulator<number, number> => {
  let s = 0;
  return {
    add: (v) => {
      s += v;
    },
    result: () => s,
  };
};

export const avgAcc = (): Accumulator<number, number> => {
  let s = 0;
  let c = 0;
  return {
    add: (v) => {
      s += v;
      c += 1;
    },
    result: () => (c === 0 ? 0 : s / c),
  };
};

export const minAcc = (): Accumulator<number, number> => {
  let m = Infinity;
  return {
    add: (v) => {
      if (v < m) m = v;
    },
    result: () => (m === Infinity ? NaN : m),
  };
};

export const maxAcc = (): Accumulator<number, number> => {
  let m = -Infinity;
  return {
    add: (v) => {
      if (v > m) m = v;
    },
    result: () => (m === -Infinity ? NaN : m),
  };
};

export interface HashAggregateHooks<K, R> {
  onNewGroup?: (key: K) => void;
  onUpdate?: (key: K, value: number) => void;
  onEmit?: (key: K, result: R) => void;
}

export interface GroupResult<K, R> {
  key: K;
  value: R;
}

/**
 * 哈希聚合主函数。
 * @param rows 数据行（每行产生一个 key 与一个 value）
 * @param keyFn 从行提取分组键
 * @param valFn 从行提取待聚合的值
 * @param accFactory 累加器工厂
 */
export function hashAggregate<Row, K, R>(
  rows: readonly Row[],
  keyFn: (row: Row) => K,
  valFn: (row: Row) => number,
  accFactory: AccFactory<number, R>,
  hooks: HashAggregateHooks<K, R> = {},
): GroupResult<K, R>[] {
  const groups = new Map<K, Accumulator<number, R>>();
  for (const row of rows) {
    const key = keyFn(row);
    const v = valFn(row);
    let acc = groups.get(key);
    if (!acc) {
      acc = accFactory();
      groups.set(key, acc);
      hooks.onNewGroup?.(key);
    }
    acc.add(v);
    hooks.onUpdate?.(key, v);
  }
  const results: GroupResult<K, R>[] = [];
  for (const [key, acc] of groups) {
    const r = acc.result();
    hooks.onEmit?.(key, r);
    results.push({ key, value: r });
  }
  return results;
}
