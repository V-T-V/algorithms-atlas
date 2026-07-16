// =============================================================================
// 桶排序（Bucket Sort）· 纯算法实现（非比较·分桶）
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 适用于均匀分布在 [0, maxVal] 区间的数值（浮点或整数均可）。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface BucketSortHooks {
  /** 确定桶数与值域后。给出桶数、值域上界。 */
  onSetup?: (bucketCount: number, maxVal: number) => void;
  /** 把值 v 分配到第 b 号桶。给出当前各桶内容（投影成一维数组便于展示）。 */
  onDispatch?: (v: number, b: number, buckets: number[][]) => void;
  /** 各桶内部排序完成。给出排序后的各桶。 */
  onSortBuckets?: (buckets: number[][]) => void;
  /** 把桶 b 中的值依次收集到输出（参数为输出位置起点）。 */
  onCollect?: (b: number, output: number[]) => void;
}

/**
 * 桶排序（非比较、分桶）。
 *
 * 思路：把值域 `[0, maxVal]` 等分成 `bucketCount` 个桶，扫描输入把每个值
 * 落入对应的桶；再对每个桶内部排序（这里用插入排序，桶内元素少时常数小）；
 * 最后按桶顺序、桶内顺序依次收集即得有序序列。
 *
 * 当输入近似均匀分布时，每桶期望元素数约 `n / bucketCount`，桶内排序代价
 * `O(k²)` 很小，整体接近 `O(n + bucketCount)`；最坏（所有元素挤进一个桶）
 * 退化为 `O(n²)`。空间 `O(n + bucketCount)`。桶排序是**稳定**的（取决于桶内
 * 排序是否稳定；这里用稳定的插入排序）。
 *
 * @param arr 待排序数组（克隆后只读，不改原数组）
 * @param bucketCount 桶数（默认 max(2, ⌈√n⌉)）
 * @param hooks 可选的事件钩子
 */
export function bucketSort(
  arr: readonly number[],
  bucketCount?: number,
  hooks: BucketSortHooks = {},
): number[] {
  const n = arr.length;
  if (n === 0) return [];
  if (n === 1) return [arr[0]!];

  // 值域上界（输入必须 ≥ 0）
  let maxVal = arr[0]!;
  for (let i = 1; i < n; i++) if (arr[i]! > maxVal) maxVal = arr[i]!;

  const buckets = bucketCount ?? Math.max(2, Math.ceil(Math.sqrt(n)));
  hooks.onSetup?.(buckets, maxVal);

  // 建空桶
  const table: number[][] = Array.from({ length: buckets }, () => []);

  // 分桶：v 落入 floor(v / maxVal * (buckets-1))；maxVal 自身落入最后一个桶
  const denom = maxVal > 0 ? maxVal : 1;
  for (let i = 0; i < n; i++) {
    const v = arr[i]!;
    let b = Math.floor((v / denom) * (buckets - 1));
    if (b < 0) b = 0;
    if (b > buckets - 1) b = buckets - 1;
    table[b]!.push(v);
    hooks.onDispatch?.(
      v,
      b,
      table.map((t) => [...t]),
    );
  }

  // 桶内插入排序（稳定）
  for (let b = 0; b < buckets; b++) {
    insertionSort(table[b]!);
  }
  hooks.onSortBuckets?.(table.map((t) => [...t]));

  // 收集
  const output: number[] = [];
  for (let b = 0; b < buckets; b++) {
    for (const v of table[b]!) output.push(v);
    hooks.onCollect?.(b, [...output]);
  }
  return output;
}

/** 稳定的插入排序（原地）。 */
function insertionSort(a: number[]): void {
  for (let i = 1; i < a.length; i++) {
    const key = a[i]!;
    let j = i - 1;
    while (j >= 0 && a[j]! > key) {
      a[j + 1] = a[j]!;
      j--;
    }
    a[j + 1] = key;
  }
}
