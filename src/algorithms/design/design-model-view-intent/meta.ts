// MVI 模式（Model-View-Intent）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'design-model-view-intent',
  categoryId: 'design',
  title: { zh: 'MVI 模式', en: 'Model-View-Intent' },
  summary: { zh: '单向数据流 intent->model->view。', en: 'One-way flow intent to model to view.' },
  description: {
    zh: 'MVI 模式让用户意图(intent)经 reducer 更新 model，再渲染 view，全程单向不可变，反应式前端常用(Cycle.js)。',
    en: 'MVI routes user intents through a reducer to update the model then renders the view; fully one-way and immutable, common in reactive front-ends (Cycle.js).',
  },
  tags: ['design', 'pattern', 'mvi', 'architectural'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
