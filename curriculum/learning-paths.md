# Algorithms Atlas 课程路线

生成时间：2026-07-12T06:23:51.134Z

当前算法总量：1508

## 入门基础

面向零到一学习者，先建立排序、搜索、数据结构和递归的基本执行模型。

- 路线 ID：`foundation`
- 算法数量：231
- 覆盖分类：`sorting` · `searching` · `ds` · `list` · `recursion`

| 模块        | 数量 | 推荐起点                                                  |
| ----------- | ---: | --------------------------------------------------------- |
| `ds`        |   70 | 动态数组、AVL数据结构、二项堆                             |
| `list`      |   30 | 两数相加（链表）、两数相加 II（正向存储）、深拷贝链表     |
| `recursion` |   45 | 阿克曼函数、迭代 Ackermann（栈模拟）、递归生成组合 C(n,k) |
| `searching` |   40 | 二分查找、最左二分、统计出现次数                          |
| `sorting`   |   46 | 珠排序、双调排序、猴子排序                                |

## 面试高频

按面试高频主题组织，覆盖数组、图、动态规划、字符串、贪心与回溯。

- 路线 ID：`interview`
- 算法数量：562
- 覆盖分类：`sorting` · `searching` · `ds` · `dp` · `graph` · `string` · `greedy` · `backtracking`

| 模块           | 数量 | 推荐起点                                                        |
| -------------- | ---: | --------------------------------------------------------------- |
| `ai-search`    |    2 | 策略迭代 (Policy Iteration)、价值迭代 (Value Iteration)         |
| `backtracking` |   47 | 优美排列、累加数、Android 解锁模式枚举                          |
| `design`       |    5 | Kadane 最大子数组和、滑动窗口聚合、滑动窗口去重计数             |
| `dp`           |  100 | wqs二分DP、状压 DP（TSP 旅行商）、有界背包                      |
| `ds`           |   70 | 动态数组、AVL数据结构、二项堆                                   |
| `game`         |    1 | 赛车                                                            |
| `geometry`     |    1 | 合并两个凸包                                                    |
| `graph`        |  100 | A\* 寻路、全源最短路（含路径）、割点·标准 DFS                   |
| `greedy`       |   47 | 活动选择、分发饼干、分糖果（贪心）                              |
| `misc`         |    1 | 杨辉三角                                                        |
| `ml`           |    2 | 隐马尔可夫模型（前向/后向算法）、Viterbi 算法（最可能状态路径） |
| `network`      |    1 | 最小费用最大流                                                  |
| `parsing`      |    3 | CYK 算法、广义 LR 解析器、解析器组合子                          |
| `randomized`   |    2 | Las Vegas 快速选择（随机化快速选择）、随机化快速排序            |
| `recursion`    |   12 | 递归生成组合 C(n,k)、生成括号、递归快速幂                       |
| `searching`    |   40 | 二分查找、最左二分、统计出现次数                                |
| `selection`    |   12 | 桶选择（均匀分布）、Floyd-Rivest 选择、内省选择                 |
| `sorting`      |   46 | 珠排序、双调排序、猴子排序                                      |
| `string`       |   70 | AC 自动机、AC自动机增强、AC 自动机 fail 指针构建（BFS）         |

## 图论 / DP

聚焦图搜索、最短路、连通性、博弈搜索和动态规划，适合作为进阶专题课。

- 路线 ID：`graph-dp`
- 算法数量：292
- 覆盖分类：`graph` · `dp` · `ai-search` · `game`

| 模块        | 数量 | 推荐起点                                                                   |
| ----------- | ---: | -------------------------------------------------------------------------- |
| `ai-search` |   45 | MCTS 回传 (Backpropagation)、带移动排序的迭代加深、MCTS 默认策略 (Rollout) |
| `dp`        |  100 | wqs二分DP、状压 DP（TSP 旅行商）、有界背包                                 |
| `game`      |   47 | Alpha-Beta 剪枝、迭代加深 + Alpha-Beta、巴什博弈                           |
| `graph`     |  100 | A\* 寻路、全源最短路（含路径）、割点·标准 DFS                              |

## 工程系统

把解析、调度、网络、压缩、哈希、密码学和并发整理为工程向算法模块。

- 路线 ID：`systems`
- 算法数量：307
- 覆盖分类：`parsing` · `scheduling` · `network` · `compression` · `crypto` · `hashing` · `concurrency`

| 模块          | 数量 | 推荐起点                                             |
| ------------- | ---: | ---------------------------------------------------- |
| `compression` |   47 | 非对称数制编码 (ANS)、算术编码、Brotli 风格字典压缩  |
| `concurrency` |   45 | 面包店算法、睡眠理发师、屏障                         |
| `crypto`      |   47 | AES玩具版、AES S盒、仿射密码                         |
| `hashing`     |   47 | 布隆过滤器、一致性哈希、Count-Min Sketch             |
| `network`     |   46 | 棒球淘汰（最大流）、二分图最小点覆盖、Blossom 算法   |
| `parsing`     |   30 | AST 构建（表达式树）、CSV 解析器（状态机）、CYK 算法 |
| `scheduling`  |   45 | 完全公平调度器、截止单调调度（DM）、赤字轮转（DRR）  |
