// JSON Parser · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'json-parser',
  categoryId: 'parsing',
  title: { zh: '手写 JSON 解析器', en: 'Hand-written JSON Parser' },
  summary: {
    zh: '递归下降解析 JSON：null/bool/number/string/array/object。',
    en: 'Recursive-descent parsing of JSON: null/bool/number/string/array/object.',
  },
  description: {
    zh:
      '本实现是手写的递归下降 JSON 解析器，不依赖 JSON.parse。它逐字符扫描，按 JSON 文法递归构造 JavaScript 值：null、true/false、数字（含小数/指数/负号）、字符串（含转义序列 \\"\\\\\/\\b\\f\\n\\r\\t\\uXXXX）、数组（[...]）、对象（{...}）。支持前后空白跳过、尾逗号检测、深嵌套。错误时抛出带位置信息的异常。' +
      '展示了递归下降的真实形态：每个产生式对应一个函数。',
    en: 'This is a hand-written recursive-descent JSON parser that does not rely on JSON.parse. It scans character by character and recursively builds JavaScript values per the JSON grammar: null, true/false, numbers (with fractional/exponent/sign), strings (with escape sequences \\"\\\\\/\\b\\f\\n\\r\\t\\uXXXX), arrays ([...]) and objects ({...}). It skips leading/trailing whitespace, detects trailing commas, supports deep nesting, and throws position-aware errors on malformed input. It demonstrates the classic shape of recursive descent: one function per production.',
  },
  tags: ['parsing', 'recursive-descent', 'json', 'serialization'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
