// Luhn Algorithm · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'luhn-algorithm',
  categoryId: 'misc',
  title: { zh: 'Luhn 校验', en: 'Luhn Algorithm' },
  summary: {
    zh: '通过加权求和与校验位检测信用卡号等身份编码的录入错误。',
    en: 'Weighted digit-sum checksum to catch transcription errors in card numbers.',
  },
  description: {
    zh: 'Luhn 算法（模 10 校验）用于验证信用卡号、IMEI、加拿大社会保险号等编码的正确性。算法从右至左扫描：每隔一位（从倒数第二位开始）将数字加倍，若结果 > 9 则减 9（等价于各位求和），其余位原样保留，最后求总和。若总和对 10 取模为 0，则号码有效。\n\n它能检出所有单数字替换错误和大部分相邻数字换位错误（除 09↔90 外），但不是加密手段——任何合法号都通过校验。',
    en: 'The Luhn algorithm (mod-10 checksum) validates credit card numbers, IMEIs, Canadian SINs, etc. Scanning right to left, it doubles every second digit (starting from the second-to-last); if the result exceeds 9 it subtracts 9 (equivalent to summing the digits), keeps the rest unchanged, and totals everything. The number is valid if the total is divisible by 10.\n\nIt detects all single-digit substitutions and most adjacent transpositions (except 09↔90), but it is not cryptographic—any well-formed number passes.',
  },
  tags: ['misc', 'checksum', 'validation', 'greedy'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
