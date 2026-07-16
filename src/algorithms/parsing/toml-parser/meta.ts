// TOML 子集解析器 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'toml-parser',
  categoryId: 'parsing',
  title: { zh: 'TOML 子集解析器', en: 'TOML Subset Parser' },
  summary: {
    zh: '逐行解析 TOML 子集：节、键值对（字符串/整数/布尔/数组）。',
    en: 'Line-based parser for a TOML subset: sections, key/value (string/int/bool/array).',
  },
  description: {
    zh: '解析 TOML 配置文件的一个教学子集：\n- 节标题 [section]（支持嵌套点号 a.b）\n- 键值对 key = value\n- 值类型：字符串（"..."）、整数、布尔（true/false）、数组（[...]）\n- 忽略空行与 # 注释\n\n逐行扫描：用正则识别行类型，构造嵌套对象。本实现不支持多行字符串、日期等高级特性。',
    en: 'A teaching subset of TOML: [section] headers (with dotted nesting), key = value lines, value types string/int/bool/array, skipping blank lines and # comments. Line-based scan with regex classification builds a nested object. No multi-line strings or dates.',
  },
  tags: ['parsing', 'toml', 'config', 'format'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
