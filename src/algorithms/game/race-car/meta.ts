// 赛车（Race Car, LeetCode 818）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'race-car',
  categoryId: 'game',
  title: { zh: '赛车', en: 'Race Car' },
  summary: {
    zh: 'A 加速、R 反向，求到达目标位置的最短指令数（BFS/DP）。',
    en: 'A to accelerate, R to reverse; shortest instructions to reach target (BFS/DP).',
  },
  description: {
    zh: '赛车从位置 0 出发，速度 +1。两条指令：\n- "A"（加速）：position += speed，speed *= 2；\n- "R"（反向）：speed = speed > 0 ? -1 : +1（位置不变）。\n求到达 position = target 的最短指令序列长度（车子冲过目标后再回来也算）。\n\n本实现用 BFS 在 (position, speed) 状态空间搜索最短路。为限制状态规模，对 position 设上界（约 2·target）剪枝。也可用 DP：考虑先加速到越过 target 的某个 2^k - 1 再 R 反向。',
    en: 'A race car starts at position 0 with speed +1. Two instructions:\n- "A" (accelerate): position += speed, then speed *= 2;\n- "R" (reverse): speed = speed > 0 ? -1 : +1 (position unchanged).\nFind the shortest instruction sequence to reach position = target (overshooting then coming back is allowed).\n\nThis implementation uses BFS over the (position, speed) state space for shortest path, bounding position at about 2·target to keep the state space finite. A DP approach is also possible: accelerate past target to some 2^k - 1, then reverse.',
  },
  tags: ['game', 'bfs', 'shortest-path'],
  complexity: { time: 'O(target·log target)', space: 'O(target·log target)' },
  references: [{ label: 'LeetCode 818', url: 'https://leetcode.com/problems/race-car/' }],
  defaultInput: 3,
};
