// String Compression · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'string-compression-impl',
  categoryId: 'string',
  title: { zh: '字符串压缩（游程编码）', en: 'String Compression (Run-Length)' },
  summary: {
    zh: '把连续相同字符原地压缩为「字符 + 次数」形式，返回新长度。',
    en: 'Compress consecutive equal chars in place as "char + count" and return the new length.',
  },
  description: {
    zh: `字符串压缩（String Compression / Run-Length Encoding）：给定字符数组 chars，用「字符 + 连续出现次数」原地改写。每组形如 ['a','2','3'] 表示 "aaa..."（仅当次数 > 1 时写数字）。例如 ["a","a","b","b","c","c","c"] 压缩为 ["a","2","b","2","c","3"]，返回新长度 6。要求 O(1) 额外空间（仅用双指针原地写）。\n\n写指针 write 标记结果末尾，读指针遍历每组相同字符：写字符后，若组长度 > 1 则把十进制数字逐位写入。时间 O(n)，空间 O(1)（不计输出）。`,
    en: `String Compression (Run-Length Encoding): given a char array chars, rewrite it in place as "char + consecutive count". Each group is like ['a','2','3'] meaning "aaa..." (digits written only when count > 1). E.g. ["a","a","b","b","c","c","c"] becomes ["a","2","b","2","c","3"], returning new length 6. O(1) extra space (two pointers, in place).\n\nA write pointer marks the result end; a read pointer scans each run of equal chars: write the char, then if the run length > 1 write the decimal digits one by one. Time O(n), space O(1) (excluding the output).`,
  },
  tags: ['string', 'compression', 'run-length', 'two-pointer', 'in-place'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
