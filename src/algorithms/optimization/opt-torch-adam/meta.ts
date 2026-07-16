// PyTorch Adam · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'opt-torch-adam',
  categoryId: 'optimization',
  title: { zh: 'PyTorch Adam', en: 'PyTorch Adam' },
  summary: {
    zh: 'PyTorch torch.optim.Adam（默认 lr=0.001, eps=1e-8）。',
    en: 'PyTorch torch.optim.Adam (defaults lr=0.001, eps=1e-8).',
  },
  description: {
    zh: 'PyTorch Adam：标准 AdamW 之前版本，不带解耦权重衰减。',
    en: 'PyTorch Adam: the pre-AdamW version, no decoupled weight decay.',
  },
  tags: ['optimization', 'framework', 'adam', 'pytorch'],
  complexity: { time: 'O(k·d)', space: 'O(d)' },
};
