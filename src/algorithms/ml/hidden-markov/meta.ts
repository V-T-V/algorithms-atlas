// 隐马尔可夫模型（前向/后向）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ml-hidden-markov',
  categoryId: 'ml',
  title: { zh: '隐马尔可夫模型（前向/后向算法）', en: 'Hidden Markov Model (Forward/Backward)' },
  summary: {
    zh: '用动态规划的前向 α、后向 β 变量求观测序列概率 P(O|λ)。',
    en: 'Dynamic-programming forward α and backward β variables yield observation probability P(O|λ).',
  },
  description: {
    zh:
      '隐马尔可夫模型（Hidden Markov Model, HMM）：含隐藏状态链的序列模型 λ = (A, B, π)。' +
      '\n- A：状态转移矩阵（A[i][j] = 从状态 i 到 j 的概率）' +
      '\n- B：发射矩阵（B[i][o] = 状态 i 发射观测 o 的概率）' +
      '\n- π：初始状态分布' +
      '\n前向算法（求观测序列概率 P(O|λ)）：' +
      '\n- α_t(i) = P(O_1..O_t, q_t = i | λ)' +
      '\n- 初始化：α_1(i) = π_i · B[i][O_1]' +
      '\n- 递推：α_{t+1}(j) = (Σ_i α_t(i)·A[i][j]) · B[j][O_{t+1}]' +
      '\n- 终止：P(O|λ) = Σ_i α_T(i)' +
      '\n后向算法类似，β_t(i) = P(O_{t+1}..O_T | q_t = i, λ)。' +
      '\n应用：语音识别、词性标注、生物序列、时序异常检测。' +
      '\n- 时间 `O(T·N²)`（T 序列长 × N 状态数），空间 `O(T·N)`。',
    en:
      'Hidden Markov Model (HMM): a sequence model with hidden state chain λ = (A, B, π). ' +
      '\n- A: transition matrix (A[i][j] = prob of i→j) ' +
      '\n- B: emission matrix (B[i][o] = prob of state i emitting observation o) ' +
      '\n- π: initial state distribution ' +
      '\nForward algorithm (observation sequence probability P(O|λ)): ' +
      '\n- α_t(i) = P(O_1..O_t, q_t = i | λ) ' +
      '\n- Init: α_1(i) = π_i · B[i][O_1] ' +
      '\n- Recurrence: α_{t+1}(j) = (Σ_i α_t(i)·A[i][j]) · B[j][O_{t+1}] ' +
      '\n- Termination: P(O|λ) = Σ_i α_T(i) ' +
      '\nBackward is analogous: β_t(i) = P(O_{t+1}..O_T | q_t = i, λ). ' +
      '\nApplications: speech recognition, POS tagging, bioinformatics, time-series anomaly detection. ' +
      '\nTime O(T·N²), space O(T·N).',
  },
  tags: ['ml', 'hmm', 'sequence-model', 'dynamic-programming', 'forward-backward'],
  complexity: { time: 'O(T·N²)', space: 'O(T·N)' },
};
