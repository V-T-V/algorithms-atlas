// =============================================================================
// 循环缓冲排序 · 纯算法实现
// 用一个大小为 k 的环形缓冲区辅助「两段有序子序列」的合并。
// 教学版：缓冲区大小固定为左段长度的一半（向上取整），展示旋转暂存思想。
// =============================================================================
export interface CircleBufferSortHooks {
  onInitBuffer?: (size: number) => void;
  onStage?: (value: number, bufPos: number) => void;
  onWriteback?: (index: number, value: number) => void;
  onMerged?: (lo: number, mid: number, hi: number) => void;
}

/**
 * 用环形缓冲区原地合并 a[lo..mid] 与 a[mid+1..hi]（均含端点）。
 */
function mergeWithBuffer(
  a: number[],
  lo: number,
  mid: number,
  hi: number,
  buf: number[],
  bufStart: number,
  hooks: CircleBufferSortHooks,
): void {
  // 把左段前 k 个暂存进缓冲区，腾出旋转空间。
  const k = Math.min(buf.length, mid - lo + 1);
  for (let t = 0; t < k; t++) {
    buf[(bufStart + t) % buf.length] = a[lo + t]!;
    hooks.onStage?.(a[lo + t]!, (bufStart + t) % buf.length);
  }
  // 三路归并：缓冲区段、左段剩余、右段
  const tmp = buf.slice(bufStart, bufStart + k);
  let i = 0; // tmp 指针
  let l = lo + k; // 左段剩余指针
  let r = mid + 1; // 右段指针
  let w = lo;
  const leftEnd = mid;
  const rightEnd = hi;
  while (i < tmp.length || l <= leftEnd || r <= rightEnd) {
    const fromBuf = i < tmp.length ? tmp[i]! : Infinity;
    const fromLeft = l <= leftEnd ? a[l]! : Infinity;
    const fromRight = r <= rightEnd ? a[r]! : Infinity;
    let chosen = fromBuf;
    let src: 'buf' | 'left' | 'right' = 'buf';
    if (fromLeft <= chosen && fromLeft <= fromRight) {
      chosen = fromLeft;
      src = 'left';
    } else if (fromRight <= chosen) {
      chosen = fromRight;
      src = 'right';
    }
    a[w] = chosen;
    hooks.onWriteback?.(w, chosen);
    if (src === 'buf') i++;
    else if (src === 'left') l++;
    else r++;
    w++;
    if (w > rightEnd) break;
  }
  hooks.onMerged?.(lo, mid, hi);
}

/**
 * 循环缓冲归并排序。
 * @param arr 待排序数组（克隆后操作）
 * @param hooks 可选的事件钩子
 */
export function circleBufferSort(
  arr: readonly number[],
  hooks: CircleBufferSortHooks = {},
): number[] {
  const a = [...arr];
  const n = a.length;
  if (n <= 1) return a;
  const bufSize = Math.max(1, Math.ceil(n / 2));
  const buf = new Array<number>(bufSize).fill(0);
  hooks.onInitBuffer?.(bufSize);

  const sort = (lo: number, hi: number): void => {
    if (lo >= hi) return;
    const mid = (lo + hi) >> 1;
    sort(lo, mid);
    sort(mid + 1, hi);
    mergeWithBuffer(a, lo, mid, hi, buf, 0, hooks);
  };
  sort(0, n - 1);
  return a;
}
