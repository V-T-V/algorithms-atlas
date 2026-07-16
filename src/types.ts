// =============================================================================
// 算法图谱 · 核心类型契约
// 所有算法模块、可视化原语、播放器、注册表都依赖本文件。
// =============================================================================

/** 中英双语文本。zh / en 必填。 */
export interface Localized {
  zh: string;
  en: string;
}

/** 一个算法的元数据。每个算法在 index.ts 里静态声明一份。 */
export interface AlgorithmMeta {
  /** 全局唯一 id，也是路由段，如 'quick-sort'。 */
  id: string;
  /** 所属分类 id（见 taxonomy.ts），如 'sorting'。 */
  categoryId: string;
  /** 显示名（双语）。 */
  title: Localized;
  /** 一句话摘要（双语），用于卡片。 */
  summary: Localized;
  /** 多段描述（双语，支持简单 Markdown：段落、代码、斜体、列表）。 */
  description: Localized;
  /** 语义标签，如 ['divide-and-conquer','in-place','recursive']。 */
  tags: string[];
  /** 复杂度。 */
  complexity: {
    time: string; // 'O(n log n)'
    space: string; // 'O(log n)'
  };
  /** 稳定性等额外属性（可选，仅部分类别适用）。 */
  attributes?: Record<string, string>;
  /** 参考资料（可选）。 */
  references?: { label: string; url: string }[];
  /** 演示默认输入（可选）。当 trace.ts 需要可复现输入时填。 */
  defaultInput?: unknown;
}

// ---------------------------------------------------------------------------
// 可视化原语使用的「状态」类型。算法在录制时填这些字段；
// 各 viz 组件读取对应字段来渲染某一帧。
// ---------------------------------------------------------------------------

/** 柱状条（排序/堆/柱状图）的状态。 */
export interface BarState {
  value: number;
  /** 语义角色，决定颜色。 */
  role: BarRole;
  /** 柱顶/旁标注文字（如索引、数值）。 */
  label?: string;
}

export type BarRole =
  | 'default'
  | 'compare'
  | 'swap'
  | 'pivot'
  | 'sorted'
  | 'frontier'
  | 'final'
  | 'warn';

/** 二维网格单元（DP 表/棋盘/迷宫）的状态。 */
export interface Cell {
  v?: string | number; // 显示内容
  role: BarRole; // 复用语义色
}

/** 图的节点（图算法）。 */
export interface GraphNode {
  id: string;
  label?: string;
  /** 可显式给定坐标（0~1 归一化），否则由布局算法计算。 */
  x?: number;
  y?: number;
  role?: BarRole;
}

/** 图的边。 */
export interface GraphEdge {
  from: string;
  to: string;
  weight?: number;
  role?: BarRole;
  /** 有向图用。 */
  directed?: boolean;
}

/** 树节点（BST/堆/线段树）。 */
export interface TreeNode {
  id: string;
  value: string | number;
  children?: TreeNode[];
  role?: BarRole;
  /** 边标注（如比较结果）。 */
  edgeLabel?: string;
}

/** 一帧：算法执行过程中某一时刻的快照。各字段全部可选，
 *  算法按需填自己用到的 viz。播放器按帧驱动渲染。 */
export interface Frame {
  /** 本帧解说（双语）。 */
  note?: Localized;
  /** 高亮的「源码行号」（1-based），配合 CodeTrace 用。 */
  highlightLines?: number[];
  // —— 可视化数据，按需填 ——
  bars?: BarState[];
  /** 带指针的数组（搜索/双指针）。指针 = 索引数组。 */
  array?: {
    values: number[];
    roles?: BarRole[];
    pointers: Array<{ index: number; label: string }>;
  };
  array2d?: Cell[][];
  graph?: { nodes: GraphNode[]; edges: GraphEdge[] };
  tree?: TreeNode;
  /** 键值对（哈希表/并查集的字典视图）。 */
  map?: Array<{ key: string; value: string; role?: BarRole }>;
  /** 额外自由文本区（如递归栈、队列内容）。 */
  aux?: Array<{ label: string; value: string; role?: BarRole }>;
}

// ---------------------------------------------------------------------------
// Demo 契约：每个算法模块导出一个零参 createDemo() 工厂。
// ---------------------------------------------------------------------------

export interface Demo {
  meta: AlgorithmMeta;
  /** 录制一帧序列（算法跑一遍）。可接受运行时输入覆盖默认。
   *  类型故意用 any：各算法的输入形状各异，由各模块的 buildTrace 自定签名。 */
  buildTrace: (input?: any) => Frame[];
}

export type DemoFactory = () => Promise<Demo>;
