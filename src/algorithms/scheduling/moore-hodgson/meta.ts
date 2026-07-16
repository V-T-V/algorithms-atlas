// Moore-Hodgson 算法（最小化延迟作业数）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'moore-hodgson',
  categoryId: 'scheduling',
  title: { zh: 'Moore-Hodgson 最小延迟作业数', en: 'Moore-Hodgson (Min Late Jobs)' },
  summary: {
    zh: '按截止时间排序依次调度，超时就剔除最长作业，最小化延迟作业数。',
    en: 'Sort by deadline and schedule in order; when late, drop the longest job — minimizes the number of late jobs.',
  },
  description: {
    zh: '单机调度问题 1||ΣUⱼ：n 个作业，每个有处理时间 pⱼ 和截止时间 dⱼ，目标是最小化**延迟作业数** Uⱼ（Uⱼ=1 表示作业 j 在截止期后完成）。所有作业同时可用（到达时间 0）。\n\n**Moore-Hodgson 算法**（1968）：\n1. 把作业按**截止时间 dⱼ 升序**排序。\n2. 维护一个「按时完成集合」S（用最大堆按处理时间组织）和当前累计时间 t = 0。\n3. 依次扫描每个作业 j：\n   - 把 j 加入 S，t += pⱼ。\n   - 若 t > dⱼ（j 会延迟）：从 S 中**移除处理时间最大的作业**（可能是 j 自己），并把 t 减去该作业的处理时间。被移除的作业计入「延迟」。\n4. 最终 S 中的作业按时完成，其余延迟。延迟数 = n − |S|。\n\n正确性：每次不得不舍弃时，舍弃最长作业最「划算」（释放最多时间），这是经典的交换论证。复杂度 O(n log n)。',
    en: 'Single-machine scheduling 1||ΣUⱼ: n jobs each with processing time pⱼ and deadline dⱼ; minimize the **number of late jobs** Uⱼ (Uⱼ=1 if job j completes after its deadline). All jobs available at time 0.\n\n**Moore-Hodgson algorithm** (1968):\n1. Sort jobs by **deadline dⱼ** ascending.\n2. Maintain an "on-time set" S (a max-heap by processing time) and running time t = 0.\n3. Scan each job j in order:\n   - Add j to S, t += pⱼ.\n   - If t > dⱼ (j would be late): remove the **longest** job from S (possibly j itself), subtract its processing time from t. The removed job is counted "late".\n4. At the end, jobs in S finish on time; the rest are late. Late count = n − |S|.\n\nCorrectness: whenever a sacrifice is needed, dropping the longest job is most "worthwhile" (frees the most time) — a classic exchange argument. Complexity O(n log n).',
  },
  tags: ['scheduling', 'moore-hodgson', 'minimize-late-jobs', 'greedy', 'heap'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
