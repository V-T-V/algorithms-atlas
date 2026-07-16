// PyTorch SGD · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'opt-torch-sgd',
  categoryId: 'optimization',
  title: { zh: 'PyTorch SGD', en: 'PyTorch SGD' },
  summary: {
    zh: 'PyTorch torch.optim.SGD：支持 momentum、dampening、Nesterov、weight_decay。',
    en: 'PyTorch torch.optim.SGD: supports momentum, dampening, Nesterov, weight_decay.',
  },
  description: {
    zh: 'PyTorch SGD：v ← ρ·v + (1−damp)·g；θ ← θ − lr·(v + wd·θ)。可切换 Nesterov。',
    en: 'PyTorch SGD: v ← ρ·v + (1−damp)·g; θ ← θ − lr·(v + wd·θ). Nesterov optional.',
  },
  tags: ['optimization', 'framework', 'sgd', 'pytorch'],
  complexity: { time: 'O(k·d)', space: 'O(d)' },
};
