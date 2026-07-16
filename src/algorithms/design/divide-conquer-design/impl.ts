// =============================================================================
// 分治设计范式 · 纯算法实现
// 以归并排序为载体：mergeSort 实现 分/治/合 三步，并记录递归调用树。
// =============================================================================

/** 递归树节点（用于可视化调用结构）。 */
export interface RecursionNode {
  id: string;
  range: [number, number]; // 处理的子数组 [lo, hi)
  depth: number;
  children: RecursionNode[];
}

export interface DivideConquerHooks {
  onDivide?: (lo: number, hi: number, depth: number) => void;
  onConquerBase?: (lo: number, hi: number) => void;
  onMerge?: (lo: number, mid: number, hi: number, merged: number[]) => void;
}

/**
 * 归并排序（分治示范），返回已排序数组，并构建递归树。
 * @param arr 输入
 * @param hooks 事件钩子
 * @returns { sorted, tree }
 */
export function mergeSortDc(
  arr: readonly number[],
  hooks: DivideConquerHooks = {},
): { sorted: number[]; tree: RecursionNode } {
  const a = [...arr];
  const n = a.length;
  let counter = 0;
  const newId = (): string => `n${counter++}`;

  const sort = (lo: number, hi: number, depth: number): { node: RecursionNode } => {
    const node: RecursionNode = { id: newId(), range: [lo, hi], depth, children: [] };
    if (hi - lo <= 1) {
      hooks.onConquerBase?.(lo, hi);
      return { node };
    }
    const mid = lo + Math.floor((hi - lo) / 2);
    hooks.onDivide?.(lo, hi, depth);
    const left = sort(lo, mid, depth + 1);
    const right = sort(mid, hi, depth + 1);
    node.children.push(left.node, right.node);
    merge(a, lo, mid, hi, hooks);
    return { node };
  };

  const { node: tree } = sort(0, n, 0);
  return { sorted: a, tree };
}

/** 原地合并 a[lo..mid) 与 a[mid..hi)。 */
function merge(a: number[], lo: number, mid: number, hi: number, hooks: DivideConquerHooks): void {
  const left = a.slice(lo, mid);
  const right = a.slice(mid, hi);
  let i = 0;
  let j = 0;
  let k = lo;
  while (i < left.length && j < right.length) {
    if (left[i]! <= right[j]!) a[k++] = left[i++]!;
    else a[k++] = right[j++]!;
  }
  while (i < left.length) a[k++] = left[i++]!;
  while (j < right.length) a[k++] = right[j++]!;
  hooks.onMerge?.(lo, mid, hi, a.slice(lo, hi));
}

/** 把递归树展平为节点列表（便于可视化）。 */
export function flattenTree(root: RecursionNode): RecursionNode[] {
  const out: RecursionNode[] = [];
  const walk = (n: RecursionNode): void => {
    out.push(n);
    for (const c of n.children) walk(c);
  };
  walk(root);
  return out;
}
