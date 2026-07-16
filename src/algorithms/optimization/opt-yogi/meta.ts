// YOGI · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'opt-yogi',
  categoryId: 'optimization',
  title: { zh: 'YOGI', en: 'YOGI' },
  summary: {
    zh: 'YOGI：用 (1 − g²) 替代累加项，抑制学习率过度衰减。',
    en: 'YOGI: uses (1 − g²) instead of additive accumulation to curb excessive lr decay.',
  },
  description: {
    zh: 'YOGI（Zaheer 2018）：v ← v + (1 − β2)·sign(g² − v)·g²。当梯度大时不显著增加 v，避免学习率塌缩。',
    en: 'YOGI (Zaheer 2018): v ← v + (1 − β2)·sign(g² − v)·g². When gradients are large, v does not blow up, avoiding lr collapse.',
  },
  tags: ['optimization', 'adam'],
  complexity: { time: 'O(k·d)', space: 'O(d)' },
};
