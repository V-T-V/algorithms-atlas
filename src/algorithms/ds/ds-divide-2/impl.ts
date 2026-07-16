// =============================================================================
// CDQ 分治：三维偏序计数
// 给定 (a, b, c) 数组，统计对数 (i, j) 满足 a_i<=a_j, b_i<=b_j, c_i<=c_j, i<j
// =============================================================================

export interface Triple {
  a: number;
  b: number;
  c: number;
}

export interface CDQHooks {
  onMerge?: (l: number, r: number, count: number) => void;
  onContribute?: (i: number, j: number) => void;
  onDone?: (total: number) => void;
}

export function cdq3d(arr: Triple[], hooks: CDQHooks = {}): number {
  // 先按 a 排序
  const sorted = arr
    .map((t, i) => ({ ...t, i }))
    .sort((x, y) => x.a - y.a || x.b - y.b || x.c - y.c);
  const data = sorted.map((t) => ({ a: t.a, b: t.b, c: t.c }));
  const n = data.length;
  let total = 0;
  const buffer: typeof data = new Array(n).fill(null).map(() => ({ a: 0, b: 0, c: 0 }));

  const recurse = (l: number, r: number): void => {
    if (l >= r) return;
    const m = (l + r) >> 1;
    recurse(l, m);
    recurse(m + 1, r);
    // 合并：左半 [l,m]，右半 [m+1,r]，按 b 升序合并
    // 同时统计：对右半每个元素，左半有多少个 b<=它 且 c<=它
    // 左半按 b 排序后用双指针 + 右半也按 b 排序
    let i = l;
    let j = m + 1;
    // 先把两段分别按 b 排序（递归保证），然后归并
    // 我们需要再按 c 计数；用扫描线 + 计数数组（c 离散）
    // 简化：直接 O(len) 扫描
    const leftPart = data.slice(l, m + 1).sort((x, y) => x.b - y.b);
    const rightPart = data.slice(m + 1, r + 1).sort((x, y) => x.b - y.b);
    let p = 0;
    let cnt = 0;
    for (const rv of rightPart) {
      while (p < leftPart.length && leftPart[p]!.b <= rv.b) {
        p++;
      }
      // 在 [0,p) 中找 c<=rv.c 的个数
      let q = 0;
      for (let k = 0; k < p; k++) {
        if (leftPart[k]!.c <= rv.c) {
          q++;
          hooks.onContribute?.(l + k, m + 1 + rightPart.indexOf(rv));
        }
      }
      cnt += q;
    }
    total += cnt;
    hooks.onMerge?.(l, r, cnt);
    // 归并写回（按 b）
    i = l;
    j = m + 1;
    let k = l;
    // 用已排序的 leftPart + rightPart 直接覆盖
    const merged = [...leftPart, ...rightPart];
    void i;
    void j;
    for (let x = 0; x < merged.length; x++) {
      buffer[k] = merged[x]!;
      k++;
    }
    for (let x = l; x <= r; x++) data[x] = buffer[x]!;
  };

  recurse(0, n - 1);
  hooks.onDone?.(total);
  return total;
}
