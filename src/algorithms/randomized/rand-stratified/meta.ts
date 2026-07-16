// 分层采样 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rand-stratified',
  categoryId: 'randomized',
  title: { zh: '分层采样', en: 'Stratified Sampling' },
  summary: {
    zh: '把定义域分成若干等分层，每层各采一个样本，方差比纯随机显著降低。',
    en: 'Divide the domain into equal strata and sample one point per stratum, markedly reducing variance versus plain random sampling.',
  },
  description: {
    zh: '分层采样把 [0,1] 等分为 n 层 [i/n,(i+1)/n)，每层内取一个均匀随机点 x = (i + u)/n（u ∈ [0,1)）。估计积分时每层贡献相加。比纯蒙特卡洛方差降低约 1/n 倍。常用于计算机图形学（像素抖动）、积分估计。',
    en: 'Stratified sampling partitions [0,1] into n strata [i/n,(i+1)/n) and draws one uniform point x = (i + u)/n (u in [0,1)) per stratum. Summing per-stratum integral contributions cuts variance by about 1/n versus plain Monte Carlo. Common in graphics (pixel jittering) and integration.',
  },
  tags: ['randomized', 'monte-carlo', 'variance-reduction', 'stratified'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
