// Tiling Domino & Tromino · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-tiling-domino-tromino',
  categoryId: 'dp',
  title: { zh: '铺砖·多米诺+三多米诺', en: 'Tiling with Dominoes and Trominoes' },
  summary: {
    zh: '用 2×1 多米诺与 L 型三多米诺铺满 3×N 的方案数。',
    en: 'Number of ways to tile a 3×N grid with 2×1 dominoes and L-trominoes.',
  },
  description: {
    zh: '经典问题（IOI/竞赛）：用 2×1 多米诺（可横/竖）和 L 型三多米诺铺满 3×N 网格的方案数。用「轮廓线 DP」（状态为列内 3 位的填充情况，共 8 个状态）逐列转移。f[i][mask] 表示前 i 列完整填充、第 i+1 列被前一列伸出的部分占用为 mask 的方案数。结果 f[n][0]。时间 O(n·8·8)。',
    en: 'Classic problem: tile a 3×N grid with 2×1 dominoes (h/v) and L-trominoes. Use a profile (broken-profile) DP where the state is the 3-bit occupancy mask of the next column (8 states). f[i][mask] = number of ways to fully tile the first i columns with mask bits of column i+1 pre-filled by overhangs. Answer f[n][0]. Time O(n·8·8).',
  },
  tags: ['dp', 'tiling', 'profile-dp', 'broken-profile', 'counting'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
