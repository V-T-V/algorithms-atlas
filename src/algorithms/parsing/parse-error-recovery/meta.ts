import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'parse-error-recovery',
  categoryId: 'parsing',
  title: { zh: '错误恢复（Panic 模式）', en: 'Panic-Mode Error Recovery' },
  summary: {
    zh: '遇错时跳过 token 直到同步点，尽量继续解析以报告更多错误。',
    en: 'Skip tokens to a synchronizing set on error and resume parsing.',
  },
  description: {
    zh: 'Panic-mode：错误时丢弃 token 直到同步集合（; ) } ]），然后继续，从而报告多个错误而非一处即停。',
    en: 'On error, drop tokens until a sync token (; ) } ]) appears, then resume, so multiple errors are reported per run.',
  },
  tags: ['parsing', 'error-recovery', 'compiler'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
