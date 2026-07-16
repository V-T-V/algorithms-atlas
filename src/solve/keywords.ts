// =============================================================================
// 算法关键词同义词词典
// 中文术语 → 英文/算法名/标签 的同义词映射，用于提升搜索匹配质量。
// =============================================================================

/** 中文关键词 → 同义词列表的映射。查询时分词后每个 token 会扩展为其同义词。 */
export const SYNONYMS: Record<string, string[]> = {
  // —— 排序 ——
  排序: ['sort', 'ordering', 'ordering'],
  快排: ['quick', 'quicksort', 'partition'],
  归并: ['merge', 'mergesort'],
  堆排: ['heap', 'heapsort'],
  冒泡: ['bubble'],
  插入排序: ['insertion'],
  选择排序: ['selection'],
  拓扑: ['topological'],
  // —— 搜索/查找 ——
  查找: ['search', 'find', 'lookup'],
  搜索: ['search', 'find'],
  二分: ['binary', 'bisection', 'bisect'],
  二分查找: ['binary', 'search', 'bisect'],
  // —— 图论 ——
  最短路径: ['shortest', 'path', 'dijkstra', 'bellman', 'floyd', 'spfa'],
  最短路: ['shortest', 'path', 'dijkstra'],
  最小生成树: ['mst', 'kruskal', 'prim', 'spanning'],
  生成树: ['spanning', 'mst'],
  广度优先: ['bfs', 'breadth'],
  深度优先: ['dfs', 'depth'],
  连通: ['connected', 'component', 'scc'],
  强连通: ['scc', 'tarjan', 'kosaraju'],
  匹配: ['matching', 'bipartite', 'hungarian'],
  二分图: ['bipartite'],
  网络流: ['flow', 'max', 'ford', 'fulkerson', 'dinic'],
  最大流: ['max', 'flow', 'dinic', 'ford'],
  最小割: ['min', 'cut'],
  欧拉: ['euler'],
  哈密顿: ['hamilton'],
  桥: ['bridge'],
  割点: ['articulation', 'cut'],
  LCA: ['lca', 'ancestor', 'lowest'],
  树链剖分: ['heavy', 'light', 'decomposition'],
  倍增: ['binary', 'lifting', 'jump'],
  // —— 动态规划 ——
  动态规划: ['dp', 'dynamic', 'programming', 'memoization'],
  背包: ['knapsack'],
  编辑距离: ['edit', 'distance', 'levenshtein'],
  最长递增: ['lis', 'increasing', 'subsequence'],
  最长公共: ['lcs', 'common', 'subsequence'],
  状压: ['bitmask', 'state', 'compression'],
  数位: ['digit'],
  区间: ['interval', 'range'],
  // —— 字符串 ——
  字符串匹配: ['match', 'pattern', 'kmp', 'rabin', 'karp'],
  模式匹配: ['pattern', 'match'],
  KMP: ['kmp', 'failure', 'lps'],
  哈希: ['hash', 'rolling'],
  后缀: ['suffix', 'array', 'automaton'],
  回文: ['palindrome', 'manacher'],
  压缩: ['compress', 'huffman', 'lzw', 'rle', 'lz77'],
  编码: ['encode', 'coding'],
  // —— 数学/数论 ——
  素数: ['prime', 'sieve', 'miller'],
  质数: ['prime'],
  最大公约数: ['gcd', 'euclidean'],
  最小公倍数: ['lcm'],
  快速幂: ['fast', 'power', 'exponentiation'],
  组合数: ['combination', 'binomial', 'catalan'],
  排列: ['permutation'],
  矩阵: ['matrix'],
  模: ['mod', 'modular'],
  逆元: ['inverse'],
  中国剩余: ['crt', 'chinese', 'remainder'],
  FFT: ['fft', 'fourier', 'transform'],
  NTT: ['ntt', 'number', 'theoretic'],
  欧拉函数: ['euler', 'totient', 'phi'],
  // —— 数据结构 ——
  树: ['tree', 'binary', 'bst'],
  二叉树: ['binary', 'tree'],
  二叉搜索树: ['bst', 'binary', 'search'],
  平衡树: ['avl', 'red', 'black', 'balanced'],
  线段树: ['segment'],
  树状数组: ['fenwick', 'bit', 'binary', 'indexed'],
  字典树: ['trie'],
  堆: ['heap', 'priority'],
  栈: ['stack'],
  队列: ['queue'],
  链表: ['linked', 'list'],
  哈希表: ['hash', 'table'],
  并查集: ['union', 'find', 'disjoint'],
  缓存: ['cache', 'lru', 'lfu'],
  // —— 回溯/搜索 ——
  回溯: ['backtrack', 'backtracking'],
  深搜: ['dfs', 'depth'],
  广搜: ['bfs', 'breadth'],
  剪枝: ['prune', 'pruning', 'alpha', 'beta'],
  N皇后: ['n', 'queens'],
  数独: ['sudoku'],
  // —— 贪心 ——
  贪心: ['greedy'],
  // —— 几何 ——
  凸包: ['convex', 'hull', 'graham'],
  最近点对: ['closest', 'pair'],
  叉积: ['cross', 'product'],
  // —— 密码学 ——
  加密: ['encrypt', 'cipher', 'aes', 'rsa'],
  解密: ['decrypt'],
  哈希函数: ['hash', 'sha', 'md5'],
  // —— 机器学习 ——
  聚类: ['cluster', 'kmeans'],
  分类: ['classify', 'classifier'],
  回归: ['regression', 'linear'],
  神经网络: ['neural', 'network'],
  // —— 优化 ——
  梯度下降: ['gradient', 'descent'],
  模拟退火: ['simulated', 'annealing'],
  遗传算法: ['genetic', 'evolution'],
  蚁群: ['ant', 'colony'],
  // —— 博弈 ——
  博弈: ['game', 'minimax', 'nim'],
  极小极大: ['minimax'],
  // —— 数值 ——
  求根: ['root', 'newton', 'bisection'],
  积分: ['integral', 'simpson', 'trapezoidal'],
  微分方程: ['ode', 'runge', 'kutta', 'euler'],
  插值: ['interpolation', 'lagrange'],
  // —— 位运算 ——
  位运算: ['bit', 'bitwise'],
  异或: ['xor'],
  // —— 其他 ——
  去重: ['unique', 'duplicate', 'distinct'],
  反转: ['reverse'],
  合并: ['merge'],
  分割: ['partition', 'split'],
  旋转: ['rotate'],
  滑动窗口: ['sliding', 'window'],
  双指针: ['two', 'pointer'],
  单调栈: ['monotonic', 'stack'],
  拓扑排序: ['topological', 'sort'],
  抄表: ['tabulation'],
  记忆化: ['memo', 'memoization'],
  分治: ['divide', 'conquer'],
  递归: ['recursion', 'recursive'],
  迭代: ['iterative', 'iteration'],
  // —— 新增扩展 ——
  路径压缩: ['path', 'compression', 'union'],
  优先队列: ['priority', 'queue', 'heap'],
  前缀和: ['prefix', 'sum', 'cumulative'],
  差分: ['difference', 'diff'],
  离散化: ['discretize', 'coordinate'],
  莫队: ['mo', 'algorithm', 'offline'],
  差分约束: ['difference', 'constraint', 'system'],
  二分图匹配: ['bipartite', 'matching', 'hungarian'],
  线性基: ['linear', 'basis', 'xor'],
  莫比乌斯: ['mobius', 'mu'],
  欧拉路: ['euler', 'path', 'circuit'],
  连通块: ['connected', 'component'],
  前向星: ['forward', 'star', 'adjacency'],
  邻接表: ['adjacency', 'list'],
  邻接矩阵: ['adjacency', 'matrix'],
  树形: ['tree', 'shaped'],
  概率: ['probability', 'expected'],
  期望: ['expected', 'expectation'],
  矩阵快速幂: ['matrix', 'fast', 'power'],
  分块: ['block', 'sqrt', 'decomposition'],
  跳表: ['skip', 'list'],
  布隆: ['bloom', 'filter'],
  一致性哈希: ['consistent', 'hash', 'ring'],
  生产者消费者: ['producer', 'consumer'],
  读写锁: ['read', 'write', 'lock'],
  红黑树: ['red', 'black', 'rb'],
  伸展树: ['splay'],
  替罪羊树: ['scapegoat'],
  B树: ['btree', 'b-tree'],
  四叉树: ['quad', 'tree'],
  八叉树: ['octree'],
  KD树: ['kd', 'tree', 'nearest'],
  R树: ['r-tree', 'rtree', 'spatial'],
  后缀自动机: ['sam', 'suffix', 'automaton'],
  回文树: ['palindrome', 'tree', 'eertree'],
  AC自动机: ['aho', 'corasick', 'ac'],
  最小费用流: ['mcmf', 'min', 'cost', 'flow'],
  最大权闭合子图: ['max', 'weight', 'closure'],
  上下界流: ['bounded', 'flow'],
  斯坦纳树: ['steiner', 'tree'],
  虚树: ['virtual', 'tree'],
  点分治: ['centroid', 'decomposition'],
  笛卡尔树: ['cartesian', 'tree'],
  左偏树: ['leftist', 'heap', 'mergeable'],
  配对堆: ['pairing', 'heap'],
  斐波那契堆: ['fibonacci', 'heap'],
  可持久化: ['persistent', 'versioned'],
};

/** 英文关键词 → 同义词（双向匹配，如 'sort' 也能匹配 '排序'）。 */
export const EN_SYNONYMS: Record<string, string[]> = {
  sort: ['排序', 'ordering'],
  search: ['查找', '搜索'],
  shortest: ['最短', '最短路径'],
  path: ['路径', '最短路'],
  tree: ['树'],
  graph: ['图'],
  sort2: ['排序'],
  matching: ['匹配'],
  flow: ['流', '网络流'],
  dp: ['动态规划', 'dp'],
  dynamic: ['动态'],
  hash: ['哈希', '散列'],
  encrypt: ['加密'],
  compress: ['压缩'],
  cluster: ['聚类'],
  greedy: ['贪心'],
  backtrack: ['回溯'],
  convex: ['凸'],
  prime: ['素数', '质数'],
  sort3: ['排序'],
};

/** 将中文分词后扩展同义词。 */
export function expandSynonyms(tokens: string[]): string[] {
  const result = new Set<string>(tokens);
  for (const t of tokens) {
    const lower = t.toLowerCase();
    // 中文关键词扩展
    if (SYNONYMS[t]) {
      for (const s of SYNONYMS[t]!) result.add(s);
    }
    // 英文关键词扩展
    if (EN_SYNONYMS[lower]) {
      for (const s of EN_SYNONYMS[lower]!) result.add(s);
    }
  }
  return [...result];
}
