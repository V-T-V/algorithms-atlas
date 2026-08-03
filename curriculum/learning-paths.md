# Algorithms Atlas 课程路线

生成时间：2026-08-03T06:06:01.494Z

当前算法总量：3046

## 入门基础

面向零到一学习者，先建立排序、搜索、数据结构和递归的基本执行模型。

- 路线 ID：`foundation`
- 算法数量：468
- 覆盖分类：`sorting` · `searching` · `ds` · `list` · `recursion`

| 模块 | 数量 | 推荐起点 |
| --- | ---: | --- |
| `ds` | 100 | 动态数组、AVL数据结构、二项堆 |
| `list` | 98 | 两数相加（链表）、两数相加 II（正向存储）、深拷贝链表 |
| `recursion` | 70 | 阿克曼函数、迭代 Ackermann（栈模拟）、递归生成组合 C(n,k) |
| `searching` | 100 | 二分查找、最左二分、统计出现次数 |
| `sorting` | 100 | 珠排序、双调排序、猴子排序 |

## 面试高频

按面试高频主题组织，覆盖数组、图、动态规划、字符串、贪心与回溯。

- 路线 ID：`interview`
- 算法数量：966
- 覆盖分类：`sorting` · `searching` · `ds` · `dp` · `graph` · `string` · `greedy` · `backtracking`

| 模块 | 数量 | 推荐起点 |
| --- | ---: | --- |
| `ai-search` | 4 | Beam Stack Search、约束传播搜索、策略迭代 (Policy Iteration) |
| `backtracking` | 97 | 优美排列、累加数、图所有路径 |
| `compression` | 2 | LZ 通用 v2、LZSS v2 |
| `design` | 5 | Kadane 最大子数组和、滑动窗口聚合、滑动窗口去重计数 |
| `dp` | 160 | wqs二分DP、状压 DP（TSP 旅行商）、有界背包 |
| `ds` | 100 | 动态数组、AVL数据结构、二项堆 |
| `game` | 2 | 马尔可夫奖励过程最优、赛车 |
| `geometry` | 1 | 合并两个凸包 |
| `graph` | 140 | A* 寻路、全源最短路（含路径）、割点·标准 DFS |
| `greedy` | 100 | 活动选择、分发饼干、分糖果（贪心） |
| `list` | 28 | Floyd 环检测、链表插入排序、两数相加（前置补零法） |
| `misc` | 3 | 快乐数、验证回文短语、杨辉三角 |
| `ml` | 2 | 隐马尔可夫模型（前向/后向算法）、Viterbi 算法（最可能状态路径） |
| `network` | 4 | 最小费用最大流、Bellman-Ford、Dijkstra最短路 |
| `numerical` | 1 | FFT（Cooley-Tukey） |
| `parsing` | 3 | CYK 算法、广义 LR 解析器、解析器组合子 |
| `randomized` | 2 | Las Vegas 快速选择（随机化快速选择）、随机化快速排序 |
| `recursion` | 13 | 递归生成组合 C(n,k)、生成括号、排列生成 |
| `scheduling` | 1 | 最短作业优先 |
| `searching` | 100 | 二分查找、最左二分、统计出现次数 |
| `selection` | 12 | 桶选择（均匀分布）、Floyd-Rivest 选择、内省选择 |
| `sorting` | 100 | 珠排序、双调排序、猴子排序 |
| `string` | 85 | AC 自动机、AC自动机增强、AC 自动机 fail 指针构建（BFS） |
| `tree` | 1 | 有序数组构造平衡 BST |

## 图论 / DP

聚焦图搜索、最短路、连通性、博弈搜索和动态规划，适合作为进阶专题课。

- 路线 ID：`graph-dp`
- 算法数量：499
- 覆盖分类：`graph` · `dp` · `ai-search` · `game`

| 模块 | 数量 | 推荐起点 |
| --- | ---: | --- |
| `ai-search` | 99 | 蚁群算法、Anytime A*、AO* 与或图搜索 |
| `dp` | 160 | wqs二分DP、状压 DP（TSP 旅行商）、有界背包 |
| `game` | 100 | Alpha-Beta 剪枝、迭代加深 + Alpha-Beta、巴什博弈 |
| `graph` | 140 | A* 寻路、全源最短路（含路径）、割点·标准 DFS |

## 工程系统

把解析、调度、网络、压缩、哈希、密码学和并发整理为工程向算法模块。

- 路线 ID：`systems`
- 算法数量：668
- 覆盖分类：`parsing` · `scheduling` · `network` · `compression` · `crypto` · `hashing` · `concurrency`

| 模块 | 数量 | 推荐起点 |
| --- | ---: | --- |
| `compression` | 100 | 非对称数制编码 (ANS)、算术编码、Brotli 风格字典压缩 |
| `concurrency` | 100 | 面包店算法、睡眠理发师、屏障 |
| `crypto` | 100 | AES玩具版、AES S盒、仿射密码 |
| `hashing` | 100 | 布隆过滤器、一致性哈希、Count-Min Sketch |
| `network` | 100 | 棒球淘汰（最大流）、二分图最小点覆盖、Blossom 算法 |
| `parsing` | 70 | AST 构建（表达式树）、CSV 解析器（状态机）、CYK 算法 |
| `scheduling` | 98 | 完全公平调度器、截止单调调度（DM）、赤字轮转（DRR） |

