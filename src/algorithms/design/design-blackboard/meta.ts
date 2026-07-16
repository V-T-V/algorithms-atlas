// 黑板模式（Blackboard）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'design-blackboard',
  categoryId: 'design',
  title: { zh: '黑板模式', en: 'Blackboard' },
  summary: { zh: '专家共享黑板协同求解。', en: 'Experts share a blackboard to solve.' },
  description: {
    zh: '黑板模式让多个知识源观察共享黑板，条件满足时修改黑板，控制壳循环调度，用于语音识别、AI 推理等无确定算法问题。',
    en: 'The Blackboard pattern lets knowledge sources watch a shared board and modify it when conditions hold; a control shell loops. Used for speech, AI reasoning with no deterministic algorithm.',
  },
  tags: ['design', 'pattern', 'blackboard', 'architectural'],
  complexity: { time: 'O(k*n)', space: 'O(b)' },
};
