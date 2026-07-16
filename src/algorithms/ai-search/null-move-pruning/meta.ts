// 空着裁剪（Null-Move Pruning）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'null-move-pruning',
  categoryId: 'ai-search',
  title: { zh: '空着裁剪', en: 'Null-Move Pruning' },
  summary: {
    zh: '让对手先走一步（不做任何走法），若仍能剪枝则当前局面足够好，直接返回。',
    en: 'Pass a move to the opponent; if the resulting position still cuts off, the current node is good enough to return.',
  },
  description: {
    zh: '空着裁剪（Donninger, 1993）是一种 α-β 加速技术：在搜索某节点时，先假设当前玩家「不走」（让对手先动），用 `depth-R-1` 深度做一次零窗口搜索（R 常取 2 或 3）。若这次「白白送对手一先」的搜索结果仍 ≥ β，说明当前局面好到即便送一先对手也无法翻盘，于是直接返回该值并剪枝。\n\n要点：\n- 不能在处于「无走法可走会输」（如王兵残局、Zugzwang）的局面使用。\n- 评估函数应侧面反映局面优劣。\n\n本实现在数值博弈树上工作：节点可「跳过」（走到一个虚拟空着子节点），用 fail-hard 零窗口测试，并保证根值与纯 α-β 一致（不开启空着时退化）。',
    en: 'Null-move pruning (Donninger, 1993) accelerates alpha-beta: at a node, first assume the side-to-move "passes" (lets the opponent move), and search with `depth-R-1` in a null window (R often 2 or 3). If even after "giving the opponent a free tempo" the result is still ≥ β, the position is good enough that the opponent cannot turn it around even with a free move, so we cut off and return.\n\nCaveats:\n- Do not use in zugzwang-prone positions (e.g. K+P endgames).\n- The evaluation must reflect positional strength.\n\nThis implementation works on a numeric game tree: a node can "pass" to a virtual null child, tested with a fail-hard null window. When disabled it degrades to plain alpha-beta and matches its root value.',
  },
  tags: ['ai-search', 'game-tree', 'alpha-beta', 'pruning', 'null-move'],
  complexity: { time: 'O(b^(d-R))', space: 'O(d)' },
  references: [
    {
      label: 'Null-move pruning — Chessprogramming Wiki',
      url: 'https://www.chessprogramming.org/Null_Move_Pruning',
    },
  ],
};
