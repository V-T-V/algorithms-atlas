import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'parse-regex-to-postfix',
  categoryId: 'parsing',
  title: { zh: '正则转后缀', en: 'Regex to Postfix' },
  summary: {
    zh: '用调度场把正则（含 | * ·）转为后缀，便于 Thompson 构造。',
    en: 'Insert explicit concat then run shunting yard to get postfix.',
  },
  description: {
    zh: '显式插入连接运算符 ·，定义优先级（* > · > |），用调度场得到后缀串。',
    en: 'Insert explicit concatenation operator ., set precedence (* > . > |), run shunting yard.',
  },
  tags: ['parsing', 'regex', 'postfix', 'shunting-yard'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
