// 随机化跳表 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'randomized-skip-list',
  categoryId: 'randomized',
  title: { zh: '随机化跳表', en: 'Randomized Skip List' },
  summary: {
    zh: '多层链表，每节点以概率 p 抽到上层，期望 O(log n) 搜索/插入/删除。',
    en: 'Multi-level linked list where each node is promoted with probability p; expected O(log n) search/insert/delete.',
  },
  description: {
    zh: '跳表（Pugh, 1990）是一种用随机化平衡的有序字典，达到与平衡二叉搜索树相当的期望复杂度，但实现更简单、并发友好。结构是多层链表：最底层（第 0 层）含全部元素（有序单链表），其上每一层是下层的「稀疏索引」——每个节点以独立概率 p（通常 1/2）出现在更高一层。搜索时从最高层最左开始，若当前层的下一个节点键值小于目标则右移，否则下降一层，期望比较次数 O(log_{1/p} n)。插入时先按普通链表插入，再以概率 p 反复「提升」该节点到上层。删除则反向剥离。由于高度由独立随机决定，无复杂重平衡，结构在期望意义下总是平衡。本实现固定概率 p=1/2、最大层数上限 16。',
    en: "The skip list (Pugh, 1990) is an ordered dictionary balanced by randomization, achieving expected complexities comparable to balanced BSTs while being simpler to implement and concurrency-friendly. It is a multi-level linked list: the bottom level (level 0) holds all elements as an ordered singly-linked list; each level above is a 'sparse index' of the level below — each node appears one level up with independent probability p (typically 1/2). Search starts from the top-left: at each level, move right if the next node's key is less than the target, otherwise drop one level; expected comparisons O(log_{1/p} n). Insert first does an ordinary linked-list insert, then 'promotes' the node up with probability p. Delete strips it from every level. Since heights are decided by independent randomness there is no rebalancing, and the structure is balanced in expectation. This implementation uses p=1/2 with a max-level cap of 16.",
  },
  tags: ['randomized', 'data-structure', 'ordered-map', 'las-vegas', 'linked-list'],
  complexity: { time: 'O(log n)', space: 'O(n)' },
};
