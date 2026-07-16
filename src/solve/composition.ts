// =============================================================================
// 算法组合推荐引擎
// 预定义常见"问题模式 → 多步算法组合"模板。
// 当用户的问题匹配到某个模式时，推荐完整的多步组合方案。
// =============================================================================

import type { AlgorithmMeta } from '../types.ts';
import type { SearchResult } from './search-engine.ts';

/** 一步组合方案中的一个环节。 */
export interface CompositionStep {
  /** 步骤序号（1-based）。 */
  step: number;
  /** 这一步的中文说明。 */
  description: string;
  /** 这一步推荐使用的算法类别关键词（用于匹配具体算法）。 */
  keywords: string[];
  /** 这一步匹配到的具体算法（由搜索引擎填充）。 */
  algorithms?: SearchResult[];
}

/** 一个完整的组合方案。 */
export interface Composition {
  /** 方案标题。 */
  title: string;
  /** 方案描述。 */
  description: string;
  /** 组合步骤。 */
  steps: CompositionStep[];
  /** 匹配分数（越高越相关）。 */
  score: number;
}

// —— 问题模式 → 组合方案模板 ——
// 每个模板定义：触发关键词 + 组合步骤。
// 当用户问题包含触发关键词时，该模板被激活。

interface CompositionTemplate {
  /** 触发关键词（中文/英文，任一匹配即激活）。 */
  triggers: string[];
  title: string;
  description: string;
  steps: Array<{ description: string; keywords: string[] }>;
}

const TEMPLATES: CompositionTemplate[] = [
  // —— 排序 + 二分查找 ——
  {
    triggers: ['排序后查找', '有序数组查找', '排序搜索', 'sort then search', '排序查找'],
    title: '排序 + 二分查找',
    description: '先对数据排序，再利用有序性进行高效的二分查找。适用于需要多次查询同一数据集的场景。',
    steps: [
      { description: '对数据集进行排序（建立有序基础）', keywords: ['sort', 'quicksort', 'mergesort', '排序'] },
      { description: '在有序数组上执行二分查找（O(log n) 查询）', keywords: ['binary', 'search', '二分', '查找'] },
    ],
  },
  // —— BFS/DFS + 拓扑排序 ——
  {
    triggers: ['依赖关系', '任务调度', '编译顺序', 'dependency', 'topological', '拓扑排序调度'],
    title: '拓扑排序 + BFS/DFS',
    description: '用拓扑排序确定任务/模块的执行顺序，配合 BFS 或 DFS 遍历依赖图。适用于编译器、任务调度、课程安排等场景。',
    steps: [
      { description: '构建有向无环图（DAG），检测是否存在环', keywords: ['topological', 'cycle', 'detect', 'graph'] },
      { description: '拓扑排序确定执行顺序', keywords: ['topological', 'sort', 'kahn'] },
      { description: 'BFS/DFS 遍历执行任务', keywords: ['bfs', 'dfs', 'traverse'] },
    ],
  },
  // —— 并查集 + 排序（Kruskal MST）——
  {
    triggers: ['最小生成树', '连通分量', '合并集合', 'minimum spanning', 'mst', 'kruskal'],
    title: '排序 + 并查集（Kruskal MST）',
    description: '将边按权重排序，用并查集维护连通性，逐步选边构建最小生成树。经典的贪心+数据结构组合。',
    steps: [
      { description: '将所有边按权重排序', keywords: ['sort', '排序'] },
      { description: '初始化并查集', keywords: ['union', 'find', 'disjoint', '并查集'] },
      { description: '贪心选边：若两端不在同一集合则加入生成树', keywords: ['kruskal', 'mst', 'greedy', 'spanning'] },
    ],
  },
  // —— 前缀和 + 二分查找 ——
  {
    triggers: ['区间求和', '子数组和', '前缀和查找', 'prefix sum', 'range sum', '前缀和二分'],
    title: '前缀和 + 二分查找',
    description: '预处理前缀和数组实现 O(1) 区间求和，配合二分查找处理"和 ≥ target 的最短子数组"等查询。',
    steps: [
      { description: '计算前缀和数组（O(n) 预处理）', keywords: ['prefix', 'sum', '前缀和', 'cumulative'] },
      { description: '在前缀和上二分查找满足条件的区间', keywords: ['binary', 'search', '二分', 'bisect'] },
    ],
  },
  // —— 哈希 + 双指针 ——
  {
    triggers: ['两数之和', '三数之和', '去重', 'two sum', 'three sum', '哈希双指针'],
    title: '排序 + 双指针 / 哈希表',
    description: '"两数之和"类问题的两种经典解法：哈希表 O(n) 或排序+双指针 O(n log n)。选择取决于是否允许修改输入。',
    steps: [
      { description: '方案A：哈希表一次遍历（O(n)，不改输入）', keywords: ['hash', 'table', '哈希', 'two-sum'] },
      { description: '方案B：排序 + 双指针（O(n log n)，可扩展到三数/四数之和）', keywords: ['sort', 'two', 'pointer', '双指针'] },
    ],
  },
  // —— DP + 贪心 ——
  {
    triggers: ['区间调度', '活动安排', '任务分配贪心', 'activity selection', '贪心动态规划'],
    title: '贪心 + 动态规划',
    description: '先尝试贪心策略（如按结束时间排序选活动），若不满足最优子结构则退化为动态规划。',
    steps: [
      { description: '贪心策略：按某种准则排序后逐步选择', keywords: ['greedy', '贪心', 'activity', 'sort'] },
      { description: '若贪心不够，用 DP 保证最优解', keywords: ['dp', 'dynamic', 'programming', '动态规划'] },
    ],
  },
  // —— 字符串哈希 + 二分 ——
  {
    triggers: ['最长公共子串', '字符串匹配二分', '二分找最长', 'binary search string', '最长回文二分'],
    title: '字符串哈希 + 二分',
    description: '二分枚举答案长度，用滚动哈希 O(1) 检查是否存在等长子串。适用于"最长/最短满足条件的子串"问题。',
    steps: [
      { description: '预处理字符串的滚动哈希', keywords: ['hash', 'rolling', '哈希', 'rabin'] },
      { description: '二分枚举目标长度，哈希检查可行性', keywords: ['binary', 'search', '二分', 'bisect'] },
    ],
  },
  // —— DFS + 回溯 + 剪枝 ——
  {
    triggers: ['全排列', '组合枚举', '所有方案', 'permutation', 'combination', '枚举回溯'],
    title: '回溯 + DFS + 剪枝',
    description: '用 DFS 搜索所有可能的解，回溯撤销选择，剪枝提前终止不可能的分支。适用于排列组合、N皇后、数独等。',
    steps: [
      { description: 'DFS 递归搜索解空间', keywords: ['dfs', 'depth', '深搜'] },
      { description: '回溯：撤销当前选择，尝试其他分支', keywords: ['backtrack', '回溯'] },
      { description: '剪枝：提前判断并跳过不可能的分支', keywords: ['prune', '剪枝', 'pruning'] },
    ],
  },
  // —— 线段树 + 懒标记 ——
  {
    triggers: ['区间更新', '区间查询', '懒惰标记', 'lazy propagation', 'segment tree update', '线段树区间'],
    title: '线段树 + 懒标记',
    description: '线段树支持 O(log n) 区间查询，懒标记（Lazy Propagation）将区间更新也优化到 O(log n)。',
    steps: [
      { description: '构建线段树（O(n) 建树）', keywords: ['segment', 'tree', '线段树', 'build'] },
      { description: '懒标记延迟区间更新（O(log n) 更新）', keywords: ['lazy', 'segment', '线段树', '懒标记'] },
    ],
  },
  // —— 图最短路 + 路径重建 ——
  {
    triggers: ['最短路径', '路径还原', 'shortest path reconstruct', '最短路方案'],
    title: '最短路径算法 + 路径重建',
    description: '用 Dijkstra/Bellman-Ford 计算最短距离，再用 predecessor 数组回溯还原具体路径。',
    steps: [
      { description: '运行最短路径算法（Dijkstra/Bellman-Ford）', keywords: ['dijkstra', 'bellman', 'shortest', '最短'] },
      { description: '从终点回溯 predecessor 数组重建路径', keywords: ['path', 'reconstruct', 'predecessor', '路径'] },
    ],
  },
  // —— 分治 + 合并 ——
  {
    triggers: ['分治合并', '归并排序', 'divide conquer merge', '最近点对分治', '分治递归'],
    title: '分治 + 合并',
    description: '将问题分解为子问题分别求解，再合并子问题的解。归并排序、最近点对、大整数乘法等经典应用。',
    steps: [
      { description: '将问题分为两个规模减半的子问题', keywords: ['divide', 'split', 'partition', '分治'] },
      { description: '递归求解子问题', keywords: ['recursive', 'recursion', '递归'] },
      { description: '合并两个子问题的解', keywords: ['merge', 'combine', '合并'] },
    ],
  },
  // —— 并查集 + 路径压缩 ——
  {
    triggers: ['连通性判断', '合并查询', 'union find', 'disjoint set', '并查集优化'],
    title: '并查集 + 路径压缩 + 按秩合并',
    description: '并查集用路径压缩和按秩合并将单次操作优化到接近 O(1)。适用于动态连通性问题。',
    steps: [
      { description: '初始化并查集（每个元素自成一个集合）', keywords: ['union', 'find', 'disjoint', '并查集'] },
      { description: '路径压缩：find 时将节点直接指向根', keywords: ['path', 'compression', '路径压缩'] },
      { description: '按秩合并：小树挂到大树下', keywords: ['rank', 'union', '按秩'] },
    ],
  },
  // —— 贪心 + 优先队列 ——
  {
    triggers: ['贪心优先队列', '堆贪心', 'greedy heap', 'dijkstra贪心', '哈夫曼'],
    title: '贪心 + 优先队列（堆）',
    description: '贪心策略配合优先队列（堆）高效选取当前最优解。Dijkstra、Huffman 编码、合并 K 个有序链表等。',
    steps: [
      { description: '定义贪心策略（每次取最优）', keywords: ['greedy', '贪心'] },
      { description: '用优先队列（堆）高效维护候选集', keywords: ['priority', 'queue', 'heap', '堆'] },
    ],
  },
  // —— 快速幂 + 模运算 ——
  {
    triggers: ['大数取模', '快速幂模', ' modular exponentiation', '矩阵快速幂'],
    title: '快速幂 + 模运算',
    description: '用二进制拆分将 a^n 从 O(n) 优化到 O(log n)，配合模运算避免溢出。',
    steps: [
      { description: '二进制拆分指数 n', keywords: ['fast', 'power', '快速幂'] },
      { description: '每步取模防止溢出', keywords: ['mod', 'modular', '模'] },
    ],
  },
  // —— 离线查询 + 莫队 ——
  {
    triggers: ['离线查询', '莫队算法', 'offline query', 'mo algorithm', '区间离线'],
    title: '离线排序 + 莫队算法',
    description: '将区间查询离线排序，用双指针维护区间。O(n√n) 解决无修改的区间统计问题。',
    steps: [
      { description: '将查询按左端点分块排序', keywords: ['mo', 'offline', '莫队', 'sort'] },
      { description: '双指针移动维护当前区间统计', keywords: ['two', 'pointer', '双指针', 'range'] },
    ],
  },
];

/** 从用户问题中提取组合方案。 */
export function findCompositions(
  query: string,
  searchFn: (q: string, limit: number) => SearchResult[],
): Composition[] {
  const lowerQuery = query.toLowerCase();
  const compositions: Composition[] = [];

  for (const template of TEMPLATES) {
    // 检查是否有触发词匹配
    const matched = template.triggers.some((t) => {
      const lt = t.toLowerCase();
      return lowerQuery.includes(lt) || lt.includes(lowerQuery.slice(0, Math.min(lt.length, 4)));
    });

    if (!matched) continue;

    // 为每一步找到具体算法
    const steps: CompositionStep[] = template.steps.map((s, i) => {
      const algoQuery = s.keywords.join(' ');
      const algorithms = searchFn(algoQuery, 3);
      return {
        step: i + 1,
        description: s.description,
        keywords: s.keywords,
        algorithms,
      };
    });

    // 计算组合的总匹配分数
    const totalScore = steps.reduce((sum, s) => {
      const maxAlgoScore = s.algorithms?.[0]?.score ?? 0;
      return sum + maxAlgoScore;
    }, 0);
    const avgScore = steps.length > 0 ? Math.round(totalScore / steps.length) : 0;

    compositions.push({
      title: template.title,
      description: template.description,
      steps,
      score: avgScore,
    });
  }

  compositions.sort((a, b) => b.score - a.score);
  return compositions;
}
