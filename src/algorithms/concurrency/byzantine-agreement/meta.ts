// 拜占庭协定（简化版）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'byzantine-agreement',
  categoryId: 'concurrency',
  title: { zh: '拜占庭协定（简化）', en: 'Byzantine Agreement (Simplified)' },
  summary: {
    zh: 'n 个将军中 f 个叛变，经多轮交换值取多数，达成一致决策（n ≥ 3f+1）。',
    en: 'Among n generals with f traitors, exchange values over rounds and take majority to agree (n ≥ 3f+1).',
  },
  description: {
    zh: '拜占庭将军问题：n 个将军通过消息决定共同行动（攻/退），其中最多 f 个是叛徒（可任意撒谎）。目标是所有忠诚将军达成一致、且若指挥官忠诚则采用其值。\n\n经典结果（Lamport, Shostak, Pease 1982）：当且仅当 n ≥ 3f+1 时存在确定性解。Oral Messages 算法（OM(f)）递归 f 层：\n\n- OM(0)：直接采用收到的值\n- OM(m)：指挥官把自己的值 v 发给所有副官；每个副官把收到的值当作新的「指挥官值」，对其他副官递归 OM(m-1)；最后取多数表决\n\n本实现简化为两轮多数表决：第 1 轮各进程广播初始值；第 2 轮转发「我收到的值」；最后每人对收到的所有值取多数。在无叛徒或少量叛徒下能达成一致。',
    en: 'The Byzantine Generals problem: n generals decide a joint action via messages, with up to f traitors that may lie arbitrarily. Goal: all loyal generals agree, and if the commander is loyal they adopt its value.\n\nClassic result (Lamport, Shostak, Pease 1982): a deterministic solution exists iff n ≥ 3f+1. The Oral Messages algorithm OM(f) recurses f levels:\n\n- OM(0): use the received value directly\n- OM(m): commander sends its value v to all lieutenants; each lieutenant treats its received value as the new "commander value" and runs OM(m-1) with the others; finally take majority vote\n\nThis implementation simplifies to two majority rounds: round 1 each process broadcasts its initial value; round 2 each forwards "what I received"; finally each takes the majority of all received values. It agrees when there are no traitors or only a few.',
  },
  tags: ['concurrency', 'distributed', 'consensus', 'fault-tolerance'],
  complexity: { time: 'O(n²) messages', space: 'O(n)' },
  attributes: { model: '步骤序列模拟 / step-sequence simulation' },
  references: [
    {
      label: 'Lamport, Shostak, Pease (1982). The Byzantine Generals Problem.',
      url: 'https://doi.org/10.1145/357172.357176',
    },
  ],
};
