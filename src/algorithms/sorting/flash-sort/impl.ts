// =============================================================================
// 闪排序（Flash Sort）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface FlashSortHooks {
  /** 桶数 m 确定后。 */
  onClassify?: (m: number) => void;
  /** 桶上界（前缀和）计算完成。upper[i] 为桶 i 的结束下标（不含）。 */
  onBoundaries?: (upper: number[]) => void;
  /** 置换循环把值 v 写入下标 pos。 */
  onPermute?: (pos: number, v: number) => void;
  /** 进入插入排序收尾阶段。 */
  onInsertion?: () => void;
}

/** 计算元素 v 所属的桶下标 k（0..m-1）。 */
function classOf(v: number, min: number, max: number, m: number): number {
  if (max === min) return 0;
  const k = Math.floor(((m - 1) * (v - min)) / (max - min));
  return k < 0 ? 0 : k >= m ? m - 1 : k;
}

/**
 * 闪排序（Flash Sort，Neubert 1998）。
 *
 * @param arr 待排序数组（克隆后操作，不改原数组）
 * @param hooks 可选的事件钩子
 */
export function flashSort(arr: readonly number[], hooks: FlashSortHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  if (n <= 1) return a;

  let min = a[0]!;
  let max = a[0]!;
  for (let i = 1; i < n; i++) {
    if (a[i]! < min) min = a[i]!;
    if (a[i]! > max) max = a[i]!;
  }
  if (min === max) return a;

  const m = Math.max(1, Math.floor(0.42 * n));
  hooks.onClassify?.(m);

  // 每桶元素数
  const count = new Array<number>(m).fill(0);
  for (let i = 0; i < n; i++) count[classOf(a[i]!, min, max, m)]!++;

  // 前缀和：lo[k] = 桶 k 的起始下标（含），hi[k] = 桶 k 的结束下标（不含）
  // 用一个 (m+1) 长度数组：bound[k] = 前 k 个桶元素数之和；桶 k 区间 = [bound[k], bound[k+1])
  const bound = new Array<number>(m + 1).fill(0);
  for (let k = 0; k < m; k++) bound[k + 1] = bound[k]! + count[k]!;
  hooks.onBoundaries?.(bound.slice(1, m + 1));

  // —— 置换阶段（标准 Neubert）——
  // write[k]：桶 k 的下一个写入位置，从 bound[k]（左端）开始，写入后 ++。
  // 每次把元素放到它所属桶的 write 处，被换出来的元素继续处理，直到当前槽的元素属于本桶。
  const write = [...bound.slice(0, m)]; // write[k] = bound[k]
  // 扫描下标 i；但置换可能写到 i 之前的位置，所以用 region 游标推进。
  // 标准做法：对每个桶 k，从 write[k] 开始向右推进，直到 write[k] == bound[k+1]。
  for (let k = 0; k < m; k++) {
    while (write[k]! < bound[k + 1]!) {
      const ev = a[write[k]!]!;
      const ek = classOf(ev, min, max, m);
      if (ek === k) {
        // 已在正确桶，直接推进
        write[k] = write[k]! + 1;
        continue;
      }
      // ev 属于桶 ek，换到 write[ek] 处
      const pos = write[ek]!;
      const tmp = a[pos]!;
      a[pos] = ev;
      hooks.onPermute?.(pos, ev);
      a[write[k]!] = tmp; // tmp 回到当前槽，循环继续判定 tmp 的归属
      write[ek] = pos + 1;
    }
  }

  // 收尾：每桶插入排序
  hooks.onInsertion?.();
  for (let k = 0; k < m; k++) {
    const lo = bound[k]!;
    const hi = bound[k + 1]!;
    for (let p = lo + 1; p < hi; p++) {
      const key = a[p]!;
      let q = p - 1;
      while (q >= lo && a[q]! > key) {
        a[q + 1] = a[q]!;
        q--;
      }
      a[q + 1] = key;
    }
  }

  return a;
}
