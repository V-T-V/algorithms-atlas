// =============================================================================
// 拉马努金出租车数
// 枚举 a^3 + b^3 (1 <= a < b <= limit)，找出最早出现「两种不同表示」的和。
// 1729 = 1^3+12^3 = 9^3+10^3 为 Ta(2)。
// =============================================================================

export interface TaxicabHooks {
  onPair?: (a: number, b: number, sum: number) => void;
  onFound?: (sum: number, reprs: Array<[number, number]>) => void;
  onResult?: (taxicab: number, reprs: Array<[number, number]>) => void;
}

export interface TaxicabResult {
  /** 最小的「两立方和」数（两种表示）。 */
  taxicab: number;
  /** 两种表示。 */
  representations: Array<[number, number]>;
}

export function ramanujanTaxicab(limit: number, hooks: TaxicabHooks = {}): TaxicabResult {
  // sum -> 表示列表
  const map = new Map<number, Array<[number, number]>>();
  let found: { sum: number; reprs: Array<[number, number]> } | null = null;

  outer: for (let a = 1; a <= limit; a++) {
    for (let b = a + 1; b <= limit; b++) {
      const sum = a * a * a + b * b * b;
      hooks.onPair?.(a, b, sum);
      const list = map.get(sum);
      if (list) {
        // 检查是否为「不同」表示：a,b 与已有不同
        const isNew = list.every(([x, y]) => x !== a && y !== b);
        if (isNew) {
          list.push([a, b]);
          if (list.length >= 2 && !found) {
            found = { sum, reprs: [...list] };
            hooks.onFound?.(sum, [...list]);
            hooks.onResult?.(sum, [...list]);
            break outer;
          }
        }
      } else {
        map.set(sum, [[a, b]]);
      }
    }
  }

  if (!found) {
    hooks.onResult?.(0, []);
    return { taxicab: 0, representations: [] };
  }
  return { taxicab: found.sum, representations: found.reprs };
}

/** 列出 <= bound 内所有「至少两种立方和表示」的数（升序）。 */
export function findAllTaxicab(
  limit: number,
  bound: number,
  hooks: TaxicabHooks = {},
): Array<{ sum: number; reprs: Array<[number, number]> }> {
  const map = new Map<number, Array<[number, number]>>();
  for (let a = 1; a <= limit; a++) {
    for (let b = a + 1; b <= limit; b++) {
      const sum = a * a * a + b * b * b;
      if (sum > bound) continue;
      hooks.onPair?.(a, b, sum);
      const list = map.get(sum);
      if (list) {
        const isNew = list.every(([x, y]) => x !== a && y !== b);
        if (isNew) list.push([a, b]);
      } else {
        map.set(sum, [[a, b]]);
      }
    }
  }
  const result: Array<{ sum: number; reprs: Array<[number, number]> }> = [];
  for (const [sum, reprs] of map) {
    if (reprs.length >= 2) {
      result.push({ sum, reprs: reprs.sort((p, q) => p[0] - q[0]) });
      hooks.onFound?.(sum, reprs);
    }
  }
  result.sort((a, b) => a.sum - b.sum);
  return result;
}
