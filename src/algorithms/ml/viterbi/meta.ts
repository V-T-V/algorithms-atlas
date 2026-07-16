// Viterbi 算法 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ml-viterbi',
  categoryId: 'ml',
  title: { zh: 'Viterbi 算法（最可能状态路径）', en: 'Viterbi Algorithm' },
  summary: {
    zh: '用动态规划在 HMM 中求最可能的隐藏状态序列 q* = argmax P(q,O|λ)。',
    en: 'Dynamic programming to find the most probable hidden state sequence q* = argmax P(q,O|λ) in an HMM.',
  },
  description: {
    zh:
      'Viterbi 算法：在 HMM λ=(A,B,π) 中，给定观测序列 O，求最可能产生 O 的隐藏状态序列 q*。' +
      '\n用动态规划（与前向算法结构一致，但取 max 而非 sum，并回溯路径）：' +
      '\n- δ_t(i) = max_{q_1..q_{t-1}} P(q_1..q_{t-1}, q_t=i, O_1..O_t | λ)' +
      '\n- 初始化：δ_1(i) = π_i · B[i][O_1]' +
      '\n- 递推：δ_{t+1}(j) = max_i { δ_t(i)·A[i][j] } · B[j][O_{t+1}]' +
      '  同时记录 ψ_{t+1}(j) = argmax_i { δ_t(i)·A[i][j] }（最优前驱）' +
      '\n- 终止：q*_T = argmax_i δ_T(i)' +
      '\n- 回溯：q*_t = ψ_{t+1}(q*_{t+1})，t=T-1..1' +
      '\n实际实现常取对数避免下溢（用 log-sum → log-max）。' +
      '\n应用：语音识别解码、词性标注、纠错、CRF 类比。' +
      '\n- 时间 `O(T·N²)`，空间 `O(T·N)`。',
    en:
      'Viterbi algorithm: given an HMM λ=(A,B,π) and observations O, find the most likely hidden state sequence q*. ' +
      '\nDynamic programming (same structure as forward, but max instead of sum, plus backtracking): ' +
      '\n- δ_t(i) = max_{q_1..q_{t-1}} P(q_1..q_{t-1}, q_t=i, O_1..O_t | λ) ' +
      '\n- Init: δ_1(i) = π_i · B[i][O_1] ' +
      '\n- Recurrence: δ_{t+1}(j) = max_i { δ_t(i)·A[i][j] } · B[j][O_{t+1}], storing ψ_{t+1}(j) = argmax_i { δ_t(i)·A[i][j] } ' +
      '\n- Termination: q*_T = argmax_i δ_T(i) ' +
      '\n- Backtrack: q*_t = ψ_{t+1}(q*_{t+1}) for t=T-1..1 ' +
      '\nPractical implementations use log-space to avoid underflow. ' +
      '\nApplications: speech decoding, POS tagging, error correction, CRF analogy. ' +
      '\nTime O(T·N²), space O(T·N).',
  },
  tags: ['ml', 'hmm', 'viterbi', 'dynamic-programming', 'decoding'],
  complexity: { time: 'O(T·N²)', space: 'O(T·N)' },
};
