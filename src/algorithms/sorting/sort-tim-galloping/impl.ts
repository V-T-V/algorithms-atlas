// TimSort 式（带加速归并）· 纯算法实现
export interface GallopHooks {
  onGallop?: (side: 'L' | 'R', count: number, arr: number[]) => void;
}

function lowerBound(a: readonly number[], target: number, lo: number, hi: number): number {
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (a[mid]! < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

export function gallopMergeSort(arr: readonly number[], hooks: GallopHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  const aux = new Array<number>(n);
  for (let width = 1; width < n; width *= 2) {
    for (let lo = 0; lo < n; lo += 2 * width) {
      const mid = Math.min(lo + width, n);
      const hi = Math.min(lo + 2 * width, n);
      for (let k = lo; k < hi; k++) aux[k] = a[k]!;
      let i = lo,
        j = mid,
        k = lo;
      let runL = 0,
        runR = 0;
      while (i < mid && j < hi) {
        if (aux[i]! <= aux[j]!) {
          a[k++] = aux[i++]!;
          runL++;
          runR = 0;
          if (runL >= 3) {
            const p = lowerBound(aux, aux[j]!, i, mid);
            const cnt = p - i;
            for (let x = 0; x < cnt; x++) a[k++] = aux[i++]!;
            hooks.onGallop?.('L', cnt, a);
            i = p;
            runL = 0;
          }
        } else {
          a[k++] = aux[j++]!;
          runR++;
          runL = 0;
          if (runR >= 3) {
            const p = lowerBound(aux, aux[i]!, j, hi);
            const cnt = p - j;
            for (let x = 0; x < cnt; x++) a[k++] = aux[j++]!;
            hooks.onGallop?.('R', cnt, a);
            j = p;
            runR = 0;
          }
        }
      }
      while (i < mid) a[k++] = aux[i++]!;
      while (j < hi) a[k++] = aux[j++]!;
    }
  }
  return a;
}
