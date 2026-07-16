# 算法图谱 · Algorithms Atlas

> 3000 个计算机算法的 TypeScript 实现、中英双语描述与交互式动画演示。
> 纯前端静态站，零运行时依赖，构建产物可双击打开。

## 现状

- **3047 个完整算法**（含交互式动画演示 + 单元测试），覆盖全部 **30 大类**
- **🔍 问题求解引擎**：输入问题描述 → TF-IDF 匹配算法 + 10 种经典算法组合推荐
- **可持续生产线**：脚手架生成器 + 自动注册 + 可复用可视化原语
- 全部门禁通过：`type-check`（0 错误）/ `lint`（0 错误）/ `build`（12166 模块）

## 问题求解

访问 `#/solve` 或点击画廊首页的 **"🔍 问题求解"** 按钮：

1. **输入问题**：如"如何找最短路径""数组去重""编辑距离"
2. **组合推荐**：系统识别问题模式，推荐多步算法组合方案（如"排序+二分查找""拓扑排序+BFS"），每步附具体算法链接
3. **单算法匹配**：TF-IDF 全文检索，按相关度排序展示最相关的 20 个算法
4. **点击查看**：跳转到算法详情页，观看交互式动画演示

内置 10 种组合模板：排序+二分查找 / 拓扑排序+BFS / Kruskal MST / 前缀和+二分 / 两数之和 / 贪心+DP / 字符串哈希+二分 / 回溯+剪枝 / 线段树+懒标记 / 最短路+路径重建。

## 技术栈

Vite 5 + TypeScript 5.9（strict + `noUncheckedIndexedAccess`）+ 纯前端 SPA + 零运行时依赖。
与工作区兄弟项目（`kids-games` / `tripplan`）约定一致，`base: './'` 可双击打开。

## 核心设计：trace 录制 + 通用播放器

每个算法**只负责"录制"一串帧（Frame）**，通用播放器负责回放（播放/暂停/单步/调速/重置/进度条）。
算法本身不写任何动画代码——这是 3000 个演示可行的唯一路径。

```
impl.ts（纯算法 + hooks）  ──►  trace.ts（用 recorder 录帧）  ──►  Frame[]
                                                                        │
通用播放器 ◄─── renderFrame ─── viz 原语（Bars/Array/Grid/Graph/Tree/...）
```

### 每个算法的文件结构

```
src/algorithms/<category>/<id>/
├── meta.ts     # 双语元数据（静态收集进首包，供画廊索引）
├── impl.ts     # 纯算法（零 DOM 依赖，可独立单测）+ hooks 暴露每步
├── trace.ts    # 用 TraceRecorder 把 impl 跑成 Frame[]
└── index.ts    # 懒加载入口（导出 createDemo()，按需分块）
```

`meta.ts` 与演示代码分文件，确保首屏只加载轻量元数据，演示代码真正按需分块。

## 目录结构

```
algorithms-atlas/
├── src/
│   ├── types.ts              # AlgorithmMeta / Frame / Demo / viz 状态类型
│   ├── taxonomy.ts           # 30 大类（单一分类来源）
│   ├── core/
│   │   ├── registry.ts       # import.meta.glob 自动发现（零注册代码）
│   │   ├── router.ts         # hash 路由（#/id）
│   │   ├── engine.ts         # 装载算法 + 启动播放器
│   │   ├── playback.ts       # 通用播放控制器
│   │   └── recorder.ts       # TraceRecorder（帧录制 API）
│   ├── viz/                  # 可复用可视化原语
│   │   ├── Bars.ts           #   数组 → 动画柱（排序/堆）
│   │   ├── ArrayView.ts      #   带指针的数组（搜索/双指针）
│   │   ├── Array2D.ts        #   二维网格（DP 表/棋盘/迷宫）
│   │   ├── Graph.ts          #   节点+边（图算法）
│   │   ├── Tree.ts           #   树（BST/AVL/堆）
│   │   ├── Steps.ts          #   辅助区/键值映射
│   │   ├── CodeTrace.ts      #   源码 + 当前行高亮
│   │   └── palette.ts        #   语义色（compare/swap/pivot/...）
│   ├── lobby/                # 画廊首页 + 虚拟滚动（承载 3000 卡）
│   ├── shell/                # 算法详情页外壳（双语切换）
│   └── algorithms/<cat>/<id>/  # 各算法模块
├── scripts/new-algorithm.mjs # 脚手架生成器
└── test/                     # 单测（每个 impl 一份）+ registry guard
```

## 30 大类

`sorting` · `searching` · `graph` · `tree` · `dp` · `string` · `math` · `geometry` · `crypto` ·
`compression` · `ml` · `optimization` · `backtracking` · `greedy` · `bitwise` · `ds` ·
`numerical` · `game` · `ai-search` · `randomized` · `list` · `concurrency` · `recursion` ·
`design` · `parsing` · `scheduling` · `network` · `selection` · `hashing` · `misc`

定义在 `src/taxonomy.ts`，是分类的**单一来源**。

## 如何加一个新算法

```bash
# 1. 用脚手架生成骨架（category 必须在 taxonomy 中存在）
node scripts/new-algorithm.mjs sorting heap-sort "Heap Sort" "堆排序"
```

这会生成 4 个文件 + 1 个测试，然后编辑：

1. **`impl.ts`** — 实现纯算法，用 `hooks` 暴露关键步骤（参考 `sorting/quick-sort/impl.ts`）
2. **`trace.ts`** — 用 `TraceRecorder` 在每个关键步骤 `begin().setBars/setArray/setGrid/...commit()`
3. **`meta.ts`** — 填写真实的 `summary`/`description`/`tags`/`complexity`
4. **`test/...`** — 写真实期望输出断言 + 钩子调用断言

**无需改动任何注册代码**——`registry.ts` 用 `import.meta.glob` 自动发现新模块。

## 开发命令

```bash
npm install          # 安装依赖
npm run dev          # 本地开发（默认 http://localhost:5200）
npm run build        # 生产构建到 dist/（可双击打开）
npm run type-check   # TS 类型检查（strict）
npm run lint         # ESLint
npm run format       # Prettier 格式化
npm test             # 运行全部单测（node --test + tsx）
npm run product:curriculum # 导出课程化学习路线 JSON / Markdown
npm run product:check      # 校验产品化门禁
```

## 通往 3000 的路线

30 大类 × 平均 100 算法 ≈ 3000。当前 **1508 个**（已覆盖 30 大类），每加一个算法 = 建文件夹 + 写 impl/trace/meta + 写单测。

各类当前进度（从 1508 继续向 ~100/类推进）：

| 大类         | 当前进度 | 目标     | 代表算法                             |
| ------------ | -------- | -------- | ------------------------------------ |
| dp           | 100      | ~120     | 概率 DP、状压进阶、树形 DP           |
| graph        | 100      | ~120     | 2-SAT、桥/割点、网络流进阶           |
| math         | 100      | ~120     | NTT、原根、Lucas 进阶、组合数        |
| ds           | 70       | ~100     | 可持久化数据结构、树链剖分           |
| string       | 70       | ~100     | 后缀自动机、回文树、Boyer-Moore 进阶 |
| backtracking | 47       | ~60      | 各类回溯题型                         |
| compression  | 47       | ~60      | LZ4、Zstd、Tunstall                  |
| crypto       | 47       | ~60      | Hill、ChaCha20、XXTEA                |
| design       | 47       | ~60      | 设计模式全集                         |
| game         | 47       | ~60      | 博弈论经典                           |
| greedy       | 47       | ~60      | 区间/调度贪心                        |
| hashing      | 47       | ~60      | SipHash、BLAKE3、LSH                 |
| misc         | 47       | ~60      | 数学杂题                             |
| sorting      | 46       | ~60      | Flash、Spreadsort                    |
| network      | 46       | ~60      | 网络流进阶                           |
| 其余 15 类   | 30~45    | ~50+     | （均衡扩充）                         |
| **合计**     | **1508** | **3000** |                                      |

每批推进时遵循同样的门禁：`type-check` / `lint` / `format` / `test` / `build` 全绿。

## 设计原则

- **零运行时依赖**：所有代码自包含，构建产物可离线双击打开
- **算法与可视化分离**：算法纯函数 + hooks，不感知 DOM/动画
- **单一来源**：分类、注册、配色均只有一个权威定义处
- **懒加载**：每个算法独立 chunk，首屏只加载元数据与画廊框架
- **可复现**：随机算法接受固定种子，测试与演示输出可断言
