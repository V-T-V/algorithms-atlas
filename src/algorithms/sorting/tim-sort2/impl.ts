// =============================================================================
// Tim排序v2 TimSort (galloping) · 纯算法实现（零 DOM 依赖，可独立单测）
// 与已有 timsort 的区别：归并阶段使用 **galloping（指数搜索）** 模式。
//   - 识别自然 run（升序 / 降序翻转）
//   - 小 run 用 galloping-insertion（二分）补齐
//   - 归并时：若一侧连续 "获胜" 达 MIN_GALLOP 次，切换到 galloping 指数搜索批量搬移
//   - 稳定排序
// =============================================================================

/** 操作过程中的事件钩子。任一可选。 */
export interface TimSort2Hooks {
  /** 识别出一个 run [lo, hi]（升序）。 */
  onRun?: (lo: number, hi: number) => void;
  /** 对小段 [lo, hi] 执行二分插入排序补齐。 */
  onInsertionSort?: (lo: number, hi: number) => void;
  /** 比较下标 i、j 的元素。 */
  onCompare?: (i: number, j: number) => void;
  /** 交换 / 写入下标 dest 的值。 */
  onWrite?: (dest: number, value: number) => void;
  /** 准备合并 [lo, mid] 与 [mid+1, hi]。 */
  onMerge?: (lo: number, mid: number, hi: number) => void;
  /** 进入 galloping 模式（连续一侧获胜达阈值）。 */
  onGalloping?: (from: 'left' | 'right', count: number) => void;
  /** galloping 指数搜索：在 [base, bound) 找插入点。 */
  onGallopingSearch?: (side: 'left' | 'right', found: number) => void;
}

const MIN_GALLOP = 3;

/**
 * TimSort（galloping 归并版）：稳定、自适应。
 * 1) 扫描识别自然 run，降序段翻转为升序
 * 2) 短 run 用二分插入补齐
 * 3) 归并时启用 galloping：一侧连续胜 MIN_GALLOP 次则指数搜索批量搬移
 * @param arr 待排序数组（克隆后操作）
 * @param hooks 可选事件钩子
 */
export function timSort2(arr: readonly number[], hooks: TimSort2Hooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  if (n <= 1) return a;
  const MIN_MERGE = 32;

  /** 二分插入排序 a[left..right]。 */
  const binaryInsertionSort = (left: number, right: number): void => {
    hooks.onInsertionSort?.(left, right);
    for (let i = left + 1; i <= right; i++) {
      const key = a[i]!;
      // 二分找插入点
      let lo = left;
      let hi = i;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        hooks.onCompare?.(mid, i);
        if (a[mid]! <= key) lo = mid + 1;
        else hi = mid;
      }
      // 后移 [lo, i-1] → [lo+1, i]
      for (let j = i; j > lo; j--) {
        a[j] = a[j - 1]!;
        hooks.onWrite?.(j, a[j]!);
      }
      a[lo] = key;
      hooks.onWrite?.(lo, key);
    }
  };

  /** 识别从 lo 起的 run 长度；降序则翻转为升序。返回长度。 */
  const countRun = (lo: number): number => {
    if (lo === n - 1) return 1;
    let hi = lo + 1;
    if (a[lo]! <= a[hi]!) {
      while (hi < n - 1 && a[hi]! <= a[hi + 1]!) hi++;
    } else {
      while (hi < n - 1 && a[hi]! > a[hi + 1]!) hi++;
      // 翻转 [lo, hi]
      let l = lo;
      let r = hi;
      while (l < r) {
        const t = a[l]!;
        a[l] = a[r]!;
        a[r] = t;
        hooks.onWrite?.(l, a[l]!);
        hooks.onWrite?.(r, a[r]!);
        l++;
        r--;
      }
    }
    return hi - lo + 1;
  };

  /** galloping 指数搜索：在已排序数组 src 中找 key 的左插入点。
   *  返回插入下标（首个 > key 的位置，保证稳定：相等取右侧）。 */
  const gallopSearch = (
    src: readonly number[],
    base: number,
    len: number,
    key: number,
    hint: 'left' | 'right',
  ): number => {
    void hint;
    // 指数扩张找 [offset, offset+2^k)
    let lastOffset = 0;
    let offset = 1;
    let cmp: number;
    // 这里简化：src 已升序，二分即可（galloping 的关键在于不等长时跳过大块）
    // 用指数+二分混合
    if (base < len && src[base]! > key) {
      // key 小于 base 处：向左 gallop
      const upperBound = -1;
      offset = 1;
      while (base - offset > upperBound && src[base - offset]! > key) {
        lastOffset = offset;
        offset = (offset << 1) + 1;
      }
      let lo = base - offset;
      let hi = base - lastOffset;
      while (lo < hi) {
        const mid = (lo + hi + 1) >> 1;
        if (src[mid]! > key) lo = mid;
        else hi = mid - 1;
      }
      cmp = -1;
      void cmp;
      return lo; // 最后一个 > key 的位置 → 插入其后
    } else {
      // 向右 gallop
      const upperBound = len;
      offset = 1;
      while (base + offset < upperBound && src[base + offset]! <= key) {
        lastOffset = offset;
        offset = (offset << 1) + 1;
      }
      let lo = base + lastOffset;
      let hi = Math.min(base + offset, len - 1);
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (src[mid]! <= key) lo = mid + 1;
        else hi = mid;
      }
      cmp = 1;
      void cmp;
      return lo;
    }
  };

  /** galloping 归并 a[lo..mid] 与 a[mid+1..hi]。 */
  const mergeAt = (lo: number, mid: number, hi: number): void => {
    hooks.onMerge?.(lo, mid, hi);
    const left = a.slice(lo, mid + 1);
    const right = a.slice(mid + 1, hi + 1);
    let i = 0;
    let j = 0;
    let k = lo;
    let consecutiveLeft = 0;
    let consecutiveRight = 0;

    const takeLeft = (): void => {
      a[k] = left[i]!;
      hooks.onWrite?.(k, left[i]!);
      i++;
      consecutiveLeft++;
      consecutiveRight = 0;
      k++;
    };
    const takeRight = (): void => {
      a[k] = right[j]!;
      hooks.onWrite?.(k, right[j]!);
      j++;
      consecutiveRight++;
      consecutiveLeft = 0;
      k++;
    };

    while (i < left.length && j < right.length) {
      hooks.onCompare?.(lo + i, mid + 1 + j);
      if (left[i]! <= right[j]!) {
        takeLeft();
      } else {
        takeRight();
      }
      // 触发 galloping：一侧连续获胜达阈值
      if (consecutiveLeft >= MIN_GALLOP) {
        hooks.onGalloping?.('left', consecutiveLeft);
        // 在 right[j..] 中指数搜索 left[i] 的插入点，批量搬走更小的 right 元素
        let bound = 1;
        while (j + bound < right.length && right[j + bound - 1]! < left[i]!)
          bound = (bound << 1) + 1;
        // 二分精确定位：首个 >= left[i] 的位置（相对 j）
        let gl = j;
        let gr = Math.min(j + bound, right.length);
        while (gl < gr) {
          const gm = (gl + gr) >> 1;
          hooks.onCompare?.(lo + i, mid + 1 + gm);
          if (right[gm]! < left[i]!) gl = gm + 1;
          else gr = gm;
        }
        const count = gl - j;
        hooks.onGallopingSearch?.('right', count);
        for (let m = 0; m < count; m++) {
          a[k] = right[j]!;
          hooks.onWrite?.(k, right[j]!);
          j++;
          k++;
        }
        consecutiveLeft = 0;
      } else if (consecutiveRight >= MIN_GALLOP) {
        hooks.onGalloping?.('right', consecutiveRight);
        let bound = 1;
        while (i + bound < left.length && left[i + bound - 1]! <= right[j]!)
          bound = (bound << 1) + 1;
        let gl = i;
        let gr = Math.min(i + bound, left.length);
        while (gl < gr) {
          const gm = (gl + gr) >> 1;
          hooks.onCompare?.(lo + gm, mid + 1 + j);
          if (left[gm]! <= right[j]!) gl = gm + 1;
          else gr = gm;
        }
        const count = gl - i;
        hooks.onGallopingSearch?.('left', count);
        for (let m = 0; m < count; m++) {
          a[k] = left[i]!;
          hooks.onWrite?.(k, left[i]!);
          i++;
          k++;
        }
        consecutiveRight = 0;
      }
    }
    while (i < left.length) {
      a[k] = left[i]!;
      hooks.onWrite?.(k, left[i]!);
      i++;
      k++;
    }
    while (j < right.length) {
      a[k] = right[j]!;
      hooks.onWrite?.(k, right[j]!);
      j++;
      k++;
    }
  };

  void gallopSearch;

  // 主流程
  const stack: Array<{ start: number; len: number }> = [];
  let pos = 0;
  while (pos < n) {
    let runLen = countRun(pos);
    hooks.onRun?.(pos, pos + runLen - 1);
    if (runLen < MIN_MERGE) {
      const force = Math.min(MIN_MERGE, n - pos);
      binaryInsertionSort(pos, pos + force - 1);
      runLen = force;
    }
    stack.push({ start: pos, len: runLen });
    pos += runLen;

    // 合并栈顶两个 run
    while (stack.length >= 2) {
      const b = stack[stack.length - 1]!;
      const a1 = stack[stack.length - 2]!;
      stack.pop();
      stack.pop();
      mergeAt(a1.start, a1.start + a1.len - 1, b.start + b.len - 1);
      stack.push({ start: a1.start, len: a1.len + b.len });
      if (stack.length === 1) break;
    }
  }

  return a;
}
