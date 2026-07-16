// Base Conversion · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'base-conversion',
  categoryId: 'misc',
  title: { zh: '进制转换', en: 'Base Conversion' },
  summary: {
    zh: '在 2~36 任意进制之间转换整数表示（经十进制中转）。',
    en: 'Convert an integer string between any bases from 2 to 36 (via decimal).',
  },
  description: {
    zh: '进制转换分两步：先把源进制字符串解析成十进制整数（按位 ×源进制 累加），再把十进制整数按目标进制反复取余、除基得到目标字符串。可用数字 0..9 与字母 A..Z 表示 0..35，故支持 2~36 进制。\n\n本模块也展示中间步骤：解析阶段的位权累加、生成阶段的取余倒序拼接。',
    en: 'Base conversion proceeds in two stages: parse the source-base string into a decimal integer (positional ×base accumulation), then repeatedly take modulo and divide by the target base to produce the target string. Digits 0..9 and letters A..Z represent 0..35, so bases 2..36 are supported.\n\nThis module also surfaces the intermediate stages: positional accumulation during parsing, and reverse-order digit accumulation during generation.',
  },
  tags: ['misc', 'number-theory', 'string', 'simulation'],
  complexity: { time: 'O(d)', space: 'O(d)' },
};
