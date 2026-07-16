// =============================================================================
// 算法分类 · 单一来源（Single Source of Truth）
// 30 大类，覆盖计算机算法的全域。每个算法的 categoryId 必须在此表中。
// 顺序即默认显示顺序。
// =============================================================================

export interface Category {
  id: string;
  name: { zh: string; en: string };
  icon: string; // emoji
  /** CSS 变量名，决定该类卡片/演示的强调色。 */
  theme: string;
  /** 一句话简介（双语）。 */
  blurb: { zh: string; en: string };
}

export const CATEGORIES: readonly Category[] = [
  {
    id: 'sorting',
    name: { zh: '排序', en: 'Sorting' },
    icon: '📊',
    theme: '--c-blue',
    blurb: { zh: '将元素按某种顺序重新排列。', en: 'Reorder elements into a sequence.' },
  },
  {
    id: 'searching',
    name: { zh: '搜索', en: 'Searching' },
    icon: '🔍',
    theme: '--c-cyan',
    blurb: { zh: '在数据结构中定位目标元素。', en: 'Locate a target within a structure.' },
  },
  {
    id: 'graph',
    name: { zh: '图算法', en: 'Graph' },
    icon: '🕸️',
    theme: '--c-green',
    blurb: { zh: '在顶点与边构成的图上求解。', en: 'Solve problems over vertices and edges.' },
  },
  {
    id: 'tree',
    name: { zh: '树', en: 'Tree' },
    icon: '🌳',
    theme: '--c-green',
    blurb: { zh: '层次结构上的操作与平衡。', en: 'Operations on hierarchical structures.' },
  },
  {
    id: 'dp',
    name: { zh: '动态规划', en: 'Dynamic Programming' },
    icon: '🧩',
    theme: '--c-purple',
    blurb: { zh: '用子问题最优解构造整体最优解。', en: 'Build optima from optimal subproblems.' },
  },
  {
    id: 'string',
    name: { zh: '字符串', en: 'String' },
    icon: '🔤',
    theme: '--c-indigo',
    blurb: { zh: '模式匹配与字符串处理。', en: 'Pattern matching and text processing.' },
  },
  {
    id: 'math',
    name: { zh: '数学与数论', en: 'Math & Number Theory' },
    icon: '🔢',
    theme: '--c-yellow',
    blurb: { zh: '整数、素数、模运算与数值计算。', en: 'Integers, primes, modular arithmetic.' },
  },
  {
    id: 'geometry',
    name: { zh: '计算几何', en: 'Computational Geometry' },
    icon: '📐',
    theme: '--c-orange',
    blurb: { zh: '点、线、多边形上的几何计算。', en: 'Computation over points and polygons.' },
  },
  {
    id: 'crypto',
    name: { zh: '密码学', en: 'Cryptography' },
    icon: '🔐',
    theme: '--c-red',
    blurb: { zh: '加解密、哈希与签名（教学版）。', en: 'Encryption, hashing, signatures (toy).' },
  },
  {
    id: 'compression',
    name: { zh: '压缩编码', en: 'Compression' },
    icon: '🗜️',
    theme: '--c-pink',
    blurb: { zh: '无损/有损数据压缩与编码。', en: 'Lossless/lossy data compression.' },
  },
  {
    id: 'ml',
    name: { zh: '机器学习', en: 'Machine Learning' },
    icon: '🤖',
    theme: '--c-indigo',
    blurb: { zh: '从数据中学习模型的核心算法。', en: 'Core learning algorithms from data.' },
  },
  {
    id: 'optimization',
    name: { zh: '优化与元启发式', en: 'Optimization' },
    icon: '⛰️',
    theme: '--c-orange',
    blurb: { zh: '局部搜索与群体智能寻优。', en: 'Local search and metaheuristics.' },
  },
  {
    id: 'backtracking',
    name: { zh: '回溯', en: 'Backtracking' },
    icon: '🔙',
    theme: '--c-purple',
    blurb: { zh: '系统地探索解空间并剪枝。', en: 'Systematic search with pruning.' },
  },
  {
    id: 'greedy',
    name: { zh: '贪心', en: 'Greedy' },
    icon: '🎯',
    theme: '--c-yellow',
    blurb: { zh: '每步取局部最优以逼近全局最优。', en: 'Local-best choices toward a global aim.' },
  },
  {
    id: 'bitwise',
    name: { zh: '位运算', en: 'Bit Manipulation' },
    icon: '🔣',
    theme: '--c-cyan',
    blurb: { zh: '直接在二进制位上运算。', en: 'Operate directly on binary digits.' },
  },
  {
    id: 'ds',
    name: { zh: '数据结构', en: 'Data Structures' },
    icon: '📦',
    theme: '--c-blue',
    blurb: { zh: '组织、存储与访问数据的结构。', en: 'How data is organized and accessed.' },
  },
  {
    id: 'numerical',
    name: { zh: '数值方法', en: 'Numerical Methods' },
    icon: '➗',
    theme: '--c-lime',
    blurb: { zh: '求根、积分、解线性方程组。', en: 'Roots, integrals, linear systems.' },
  },
  {
    id: 'game',
    name: { zh: '博弈论', en: 'Game Theory' },
    icon: '♟️',
    theme: '--c-red',
    blurb: { zh: '对抗下的最优决策。', en: 'Optimal play under adversarial settings.' },
  },
  {
    id: 'ai-search',
    name: { zh: 'AI 搜索', en: 'AI Search' },
    icon: '🧠',
    theme: '--c-purple',
    blurb: { zh: '蒙特卡洛树搜索等决策搜索。', en: 'MCTS and decision-time search.' },
  },
  {
    id: 'randomized',
    name: { zh: '随机化', en: 'Randomized' },
    icon: '🎲',
    theme: '--c-pink',
    blurb: { zh: '以随机性换取效率或近似解。', en: 'Trade randomness for speed/approximation.' },
  },
  {
    id: 'list',
    name: { zh: '链表与数组', en: 'Linked List & Array' },
    icon: '🔗',
    theme: '--c-cyan',
    blurb: { zh: '线性序列上的指针操作。', en: 'Pointer play over linear sequences.' },
  },
  {
    id: 'concurrency',
    name: { zh: '并发与分布式', en: 'Concurrency & Distributed' },
    icon: '🔀',
    theme: '--c-orange',
    blurb: { zh: '同步、共识与资源调度。', en: 'Synchronization, consensus, scheduling.' },
  },
  {
    id: 'recursion',
    name: { zh: '递归与分治', en: 'Recursion & Divide & Conquer' },
    icon: '🪞',
    theme: '--c-indigo',
    blurb: { zh: '自相似分解与合并。', en: 'Self-similar decomposition and combine.' },
  },
  {
    id: 'design',
    name: { zh: '算法设计范式', en: 'Design Paradigms' },
    icon: '🧱',
    theme: '--c-gray',
    blurb: { zh: '抽象层面的设计原则与模式。', en: 'Abstract design principles and patterns.' },
  },
  {
    id: 'parsing',
    name: { zh: '解析与编译', en: 'Parsing & Compiler' },
    icon: '📜',
    theme: '--c-green',
    blurb: { zh: '文法、词法、语法分析。', en: 'Lexing, grammar, and parsing.' },
  },
  {
    id: 'scheduling',
    name: { zh: '调度', en: 'Scheduling' },
    icon: '⏱️',
    theme: '--c-blue',
    blurb: { zh: '任务/资源在时间上的分配。', en: 'Assigning tasks to resources over time.' },
  },
  {
    id: 'network',
    name: { zh: '网络流与路由', en: 'Network Flow & Routing' },
    icon: '🚰',
    theme: '--c-cyan',
    blurb: { zh: '流网络、路由与带宽分配。', en: 'Flow networks, routing, bandwidth.' },
  },
  {
    id: 'selection',
    name: { zh: '选择与排名', en: 'Selection & Ranking' },
    icon: '🏅',
    theme: '--c-yellow',
    blurb: { zh: '第 k 大、中位数、顺序统计量。', en: 'k-th element, median, order statistics.' },
  },
  {
    id: 'hashing',
    name: { zh: '哈希', en: 'Hashing' },
    icon: '#️⃣',
    theme: '--c-lime',
    blurb: { zh: '哈希函数与冲突解决。', en: 'Hash functions and collision handling.' },
  },
  {
    id: 'misc',
    name: { zh: '其他', en: 'Miscellaneous' },
    icon: '✨',
    theme: '--c-gray',
    blurb: { zh: '难以归入单一类别的算法。', en: 'Algorithms that defy a single bucket.' },
  },
];

// —— 派生查询 ——（保持单一来源，避免散落的硬编码）

export const CATEGORY_IDS: readonly string[] = CATEGORIES.map((c) => c.id);

const CATEGORY_BY_ID = new Map<string, Category>(CATEGORIES.map((c) => [c.id, c]));

export function getCategory(id: string): Category | undefined {
  return CATEGORY_BY_ID.get(id);
}

/** 断言分类存在；缺失则抛错（供 guard 测试与创建期校验）。 */
export function requireCategory(id: string): Category {
  const c = CATEGORY_BY_ID.get(id);
  if (!c) throw new Error(`Unknown category id: ${id}`);
  return c;
}
