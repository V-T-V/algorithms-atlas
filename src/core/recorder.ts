// =============================================================================
// 帧录制器（TraceRecorder）
// 算法实现用它来「录制」一帧序列，而完全不感知动画/渲染。
// 设计要点：
//   - 每次 record() 推入一个完整 Frame 快照（不是增量），播放器可直接渲染。
//   - 提供 typed 辅助方法（bars / array / note ...）减少样板。
//   - 录制结束时 build() 返回 Frame[]，交给播放器。
// =============================================================================

import type {
  BarRole,
  BarState,
  Cell,
  Frame,
  GraphEdge,
  GraphNode,
  Localized,
  TreeNode,
} from '../types.ts';

export class TraceRecorder {
  private readonly frames: Frame[] = [];
  private cur: Frame = {};

  /** 开始一帧（复制上一帧的可视化状态作为基底，便于「持续高亮」语义）。 */
  begin(note?: Localized): this {
    const prev = this.frames[this.frames.length - 1] ?? ({} as Frame);
    this.cur = cloneViz(prev); // 继承上一帧的 viz 数据
    if (note) this.cur.note = note;
    return this;
  }

  /** 提交当前帧。 */
  commit(): this {
    this.frames.push(this.cur);
    this.cur = {};
    return this;
  }

  /** 在当前帧设源码高亮行（1-based）。 */
  highlightLines(...lines: number[]): this {
    this.cur.highlightLines = lines;
    return this;
  }

  // —— 排序/柱状图（bars）——
  setBars(bars: BarState[]): this {
    this.cur.bars = bars;
    return this;
  }
  /** 便捷：从纯数值数组 + 按索引的角色映射生成柱状帧。 */
  barsFrom(
    values: readonly number[],
    roles: Record<number, BarRole> = {},
    labels?: Record<number, string>,
  ): BarState[] {
    return values.map((value, i) => ({
      value,
      role: roles[i] ?? 'default',
      label: labels?.[i],
    }));
  }

  // —— 带指针数组（array）——
  setArray(
    values: number[],
    roles: BarRole[] | undefined,
    pointers: Array<{ index: number; label: string }>,
  ): this {
    this.cur.array = { values, roles, pointers };
    return this;
  }

  // —— 二维网格（array2d）——
  setGrid(grid: Cell[][]): this {
    this.cur.array2d = grid;
    return this;
  }
  /** 便捷：从二维数值/字符串数组生成网格，角色用默认。 */
  gridFrom(
    rows: Array<Array<string | number | undefined>>,
    roles: Record<string, BarRole> = {},
  ): Cell[][] {
    return rows.map((row, r) =>
      row.map((v, c) => ({
        v: v as string | number | undefined,
        role: roles[`${r},${c}`] ?? 'default',
      })),
    );
  }

  // —— 图（graph）——
  setGraph(nodes: GraphNode[], edges: GraphEdge[]): this {
    this.cur.graph = { nodes, edges };
    return this;
  }

  // —— 树（tree）——
  setTree(root: TreeNode): this {
    this.cur.tree = root;
    return this;
  }

  // —— 键值映射（哈希表/并查集）——
  setMap(entries: Array<{ key: string; value: string; role?: BarRole }>): this {
    this.cur.map = entries;
    return this;
  }

  // —— 辅助区（递归栈/队列/说明）——
  setAux(entries: Array<{ label: string; value: string; role?: BarRole }>): this {
    this.cur.aux = entries;
    return this;
  }

  /** 录制结束，返回帧序列。 */
  build(): Frame[] {
    if (Object.keys(this.cur).length > 0) this.commit();
    return this.frames;
  }

  /** 已录制的帧数。 */
  get length(): number {
    return this.frames.length;
  }
}

/** 深拷贝可视化数据（帧继承用）。 */
function cloneViz(f: Frame): Frame {
  return {
    bars: f.bars?.map((b) => ({ ...b })),
    array: f.array
      ? {
          values: [...f.array.values],
          roles: f.array.roles ? [...f.array.roles] : undefined,
          pointers: f.array.pointers.map((p) => ({ ...p })),
        }
      : undefined,
    array2d: f.array2d?.map((row) => row.map((c) => ({ ...c }))),
    graph: f.graph
      ? {
          nodes: f.graph.nodes.map((n) => ({ ...n })),
          edges: f.graph.edges.map((e) => ({ ...e })),
        }
      : undefined,
    tree: f.tree ? cloneTree(f.tree) : undefined,
    map: f.map?.map((e) => ({ ...e })),
    aux: f.aux?.map((e) => ({ ...e })),
  };
}

function cloneTree(n: TreeNode): TreeNode {
  return {
    id: n.id,
    value: n.value,
    role: n.role,
    edgeLabel: n.edgeLabel,
    children: n.children?.map(cloneTree),
  };
}
