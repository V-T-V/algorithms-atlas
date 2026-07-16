// 露天矿开采（Open-Pit Mining via Max-Weight Closure）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'open-pit-mining',
  categoryId: 'network',
  title: { zh: '露天矿开采（最大权闭合子图）', en: 'Open-Pit Mining (Max-Weight Closure)' },
  summary: {
    zh: '在「挖某块必先挖上方所有块」约束下，求利润最大的开采集合：转最大权闭合子图。',
    en: 'Maximize profit of mined blocks under "must mine above first" precedence: reduce to max-weight closure.',
  },
  description: {
    zh: '露天矿开采问题：一个三维矿体划分为若干块，每块有收益（矿石价值 − 开采成本，可正可负）。约束：**要挖某块，必须先挖掉它正上方所有块**（重力/物理可达性）。目标是选出利润最大的开采集合。\n\n**最大权闭合子图建模**：\n1. 把依赖关系看成 DAG：块 v → 块 u（u 在 v 上方，挖 v 之前必须挖 u）。\n2. 把每个权为正的块 u 连边 s → u 容量 = w(u)（「选」它能获得 w(u) 的利润）。\n3. 把每个权为负的块 v 连边 v → t 容量 = −w(v)（「选」它要付 |w(v)| 代价）。\n4. 依赖边 u → v（v 在 u 上方）容量 ∞，强制「选 u 必选 v」（否则该无穷边会被割）。\n5. **最大权闭合 = ∑(正权) − 最小割**。\n\n直观：最小割决定「放弃哪些正权块、接受哪些负权块」，使依赖闭合。本实现用 Edmonds-Karp 求解 2D 单列或多列矿体（块仅按列方向依赖，简化场景）。',
    en: 'Open-pit mining: a 3D ore body is partitioned into blocks, each with profit (ore value − extraction cost, can be positive or negative). Constraint: to mine a block, all blocks directly above it must already be mined. Goal: pick the profit-maximizing mining set.\n\n**Max-weight closure model**:\n1. View precedence as DAG: v → u means u is above v (mining v requires mining u first).\n2. For each block u with w(u)>0: edge s → u with capacity w(u) (mining it gains w(u)).\n3. For each block v with w(v)<0: edge v → t with capacity −w(v) (mining it costs |w(v)|).\n4. Precedence edges u → v with capacity ∞, forcing closure (else this edge is cut).\n5. **Max-weight closure = ∑(positive weights) − min cut**.\n\nIntuition: min cut decides which positive blocks to give up and which negative blocks to accept to keep closure. This implementation uses Edmonds-Karp on 2D single/multi-column ore bodies (simplified column-only precedence).',
  },
  tags: ['network', 'min-cut', 'application', 'open-pit-mining', 'closure', 'max-weight-closure'],
  complexity: { time: 'O(V·E²)', space: 'O(V + E)' },
  references: [
    {
      label: 'Lerchs-Grossmann / Picard (1976) Open pit mining',
      url: 'https://en.wikipedia.org/wiki/Open-pit_mining',
    },
  ],
};
