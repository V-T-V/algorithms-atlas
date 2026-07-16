// 最小费用环流（消圈算法）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'net-min-cost-circulation',
  categoryId: 'network',
  title: { zh: '最小费用环流（消圈）', en: 'Min-Cost Circulation (Cycle Canceling)' },
  summary: {
    zh: '在带容量与费用图上找最小费用环流：先给一个可行环流，反复用 SPFA 找负费用环并沿环增广。',
    en: 'Find a min-cost circulation on a capacitated, costed graph: start from a feasible circulation, then repeatedly find a negative-cost cycle (SPFA) and augment along it.',
  },
  description: {
    zh: '最小费用环流问题：在每条边有容量上界和单位费用的有向图上，求一个满足「每点流入=流出」且总费用最小的环流。消圈算法：先构造一个可行环流（若存在），然后在残量图上用 SPFA 检测负费用环；若存在则沿该环增广（减少费用），直到残量图无负环。本教学版用「下界 0 + 满流初值」构造可行解。',
    en: 'The min-cost circulation problem: on a directed graph where each edge has a capacity upper bound and a unit cost, find a circulation (in-flow = out-flow at every vertex) of minimum total cost. The cycle-canceling algorithm starts from a feasible circulation, then uses SPFA to detect negative-cost cycles in the residual graph and augments along them (reducing cost) until none remain. This teaching version builds a feasible solution via zero lower bounds and a full-flow initial.',
  },
  tags: ['network', 'min-cost-flow', 'circulation', 'cycle-canceling'],
  complexity: { time: 'O(V·E²·C)', space: 'O(V + E)' },
};
