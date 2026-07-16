// 上下界可行环流（Circulation）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'circulation',
  categoryId: 'network',
  title: { zh: '上下界可行环流', en: 'Feasible Circulation with Bounds' },
  summary: {
    zh: '有上下界容量的环流可行性：构造超级源汇 + 强制下界流量，跑最大流判定。',
    en: 'Feasibility of a circulation with lower/upper bounds: super source/sink + forced lower-bound flow + max-flow check.',
  },
  description: {
    zh: '环流问题：每条边 e 有下界 lo[e] 与上界 hi[e]，要求为每条边分配流量 f[e]，满足 lo[e] ≤ f[e] ≤ hi[e]，且每个节点流量守恒（入度 = 出度）。问是否存在这样的可行流。\n\n**转化算法**：\n1. 每条边先「强制」通过 lo[e] 单位流量：记 d[u] = 出度强制量 − 入度强制量（节点 u 的净流出）。即对边 (u,v)：d[u] -= lo，d[v] += lo。\n2. 残量网络上每条边容量变为 hi[e] − lo[e]（上界减下界）。\n3. 引入超级源 ss 与超级汇 tt：\n   - 若 d[u] > 0（净入多于出，需补出）：连 ss→u 容量 d[u]。\n   - 若 d[u] < 0（净出多于入）：连 u→tt 容量 −d[u]。\n4. 跑 ss→tt 最大流。若最大流 = 所有正 d[u] 之和（即 ss 出边全满），则存在可行环流；否则不可行。\n\n注：若要求「有源汇」的环流，只需加一条 t→s 容量 ∞ 的边把源汇也变成普通节点即可。',
    en: 'Circulation: each edge e has lower bound lo[e] and upper bound hi[e]; assign f[e] with lo[e] ≤ f[e] ≤ hi[e] and flow conservation (in = out) at every node. Decide feasibility.\n\n**Reduction**:\n1. Force lo[e] units through each edge: let d[u] = forced outflow − forced inflow at node u. For edge (u,v): d[u] -= lo, d[v] += lo.\n2. Residual capacity becomes hi[e] − lo[e].\n3. Add a super source ss and super sink tt:\n   - If d[u] > 0 (net inflow > outflow, needs to push out): edge ss→u with cap d[u].\n   - If d[u] < 0: edge u→tt with cap −d[u].\n4. Run max-flow ss→tt. If the max-flow equals the sum of all positive d[u] (all ss out-edges saturated), a feasible circulation exists; otherwise not.\n\nFor a circulation "with source and sink", add an edge t→s with capacity ∞ to make s,t ordinary nodes.',
  },
  tags: ['network', 'circulation', 'lower-bound', 'feasibility', 'max-flow'],
  complexity: { time: 'O(V²·E)', space: 'O(V + E)' },
};
