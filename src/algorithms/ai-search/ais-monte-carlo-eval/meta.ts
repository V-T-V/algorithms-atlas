// 蒙特卡洛策略评估（Monte Carlo Policy Evaluation）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ais-monte-carlo-eval',
  categoryId: 'ai-search',
  title: { zh: '蒙特卡洛策略评估', en: 'Monte Carlo Policy Evaluation' },
  summary: { zh: '用完整回合回报平均估计 V。', en: 'Averages full-episode returns to estimate V.' },
  description: {
    zh: '蒙特卡洛评估通过大量完整回合的回报样本平均估计状态价值，不需要环境模型，回报可首访或每次访问。',
    en: 'Monte Carlo evaluation averages return samples from complete episodes to estimate state values without a model (first/every visit).',
  },
  tags: ['ai-search', 'monte-carlo', 'reinforcement', 'prediction'],
  complexity: { time: 'O(episodes * steps)', space: 'O(|S|)' },
};
