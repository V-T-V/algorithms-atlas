// 简单 XML/SAX 解析 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'xml-parser',
  categoryId: 'parsing',
  title: { zh: '简单 XML/SAX 解析', en: 'Simple XML/SAX Parser' },
  summary: {
    zh: '事件驱动 SAX 风格：逐标签触发 start/text/end 事件，不建树。',
    en: 'Event-driven SAX style: emit start/text/end events per tag without building a tree.',
  },
  description: {
    zh: 'SAX（Simple API for XML）是事件驱动的 XML 解析模型：解析器逐字符扫描，遇到开始标签、文本内容、结束标签时回调对应事件，而非构建完整 DOM 树。\n\n本实现处理一个 XML 子集：\n- <tag attr="v"> 开始标签（含属性）\n- </tag> 结束标签\n- <tag/> 自闭合标签\n- 标签间文本\n- 忽略声明 <?xml ...?> 与注释 <!-- ... -->\n\n通过钩子向外发射事件，调用方可据此构建树或直接处理。',
    en: 'SAX is an event-driven XML parsing model: scan character by character, firing start-element, text, and end-element events instead of building a DOM tree. This subset handles <tag attr="v">, </tag>, <tag/>, text between tags, and skips <?xml?> and comments. Callers handle events via hooks.',
  },
  tags: ['parsing', 'xml', 'sax', 'event-driven'],
  complexity: { time: 'O(n)', space: 'O(d)' },
};
