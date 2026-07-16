// 重标记到前端（Relabel-to-Front）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'relabel-to-front',
  categoryId: 'network',
  title: { zh: '重标记到前端', en: 'Relabel-to-Front' },
  summary: {
    zh: 'Goldberg 的预流推进变体：用链表维护待处理节点，重标后将其移到队首，O(V³)。',
    en: "Goldberg's push-relabel variant: a linked list of active nodes, move a relabeled node to the front; O(V³).",
  },
  description: {
    zh: 'Relabel-to-Front 是 push-relabel 的一个高效实现，复杂度严格为 `O(V³)`。\n\n核心数据结构：一个保存所有「活跃节点」（有超额流的非 s/t 节点）的链表 L。算法流程：\n1. 初始化：h[s]=V，所有 s 的出边饱和推送。\n2. 从链表头开始扫描：对当前节点 u 反复 discharge（push 直到无超额流或需 relabel）。\n3. 若 u 在 discharge 过程中被 relabel（即高度增加），则把 u 移到链表头部，重新从头扫描。\n4. 当前节点无超额流时前进到下一节点。\n\n「移到队首」的关键作用：每次 relabel 后从头开始可避免大量重复工作，把总复杂度压到 O(V³)。',
    en: 'Relabel-to-Front is an efficient implementation of push-relabel with strict `O(V³)` complexity.\n\nCore data structure: a linked list L of "active" nodes (nodes with excess, excluding s and t). Algorithm:\n1. Initialize: h[s]=V, saturate all out-edges of s.\n2. Scan from the head: repeatedly *discharge* the current node u (push until no excess or relabel needed).\n3. If u is relabeled during discharge (its height increased), move u to the head of L and restart from the head.\n4. Advance to the next node when u has no excess.\n\nThe "move to front" trick is key: after each relabel we restart from the head, avoiding repeated work and bounding total work to O(V³).',
  },
  tags: ['network', 'max-flow', 'push-relabel', 'relabel-to-front'],
  complexity: { time: 'O(V³)', space: 'O(V + E)' },
  references: [
    {
      label: 'Relabel-to-Front — CLRS 26.5',
      url: 'https://en.wikipedia.org/wiki/Push%E2%80%93relabel_maximum_flow_algorithm',
    },
  ],
};
