// TD(0) 时序差分（TD(0) Learning）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ais-td-zero',
  categoryId: 'ai-search',
  title: { zh: 'TD(0) 时序差分', en: 'TD(0) Learning' },
  summary: { zh: '无模型策略评估 V 值。', en: 'Model-free V evaluation bootstrapping 1 step.' },
  description: {
    zh: 'TD(0)(Sutton)用一步自举更新 V(s)←V(s)+α[r+γV(s_next)-V(s)]，是蒙特卡洛与动态规划的折中。',
    en: 'TD(0) bootstraps one step: V(s)←V(s)+α[r+γV(s_next)-V(s)], interpolating Monte Carlo and dynamic programming.',
  },
  tags: ['ai-search', 'td', 'reinforcement', 'prediction'],
  complexity: { time: 'O(episodes * steps)', space: 'O(|S|)' },
};
