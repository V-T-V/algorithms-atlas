// 倒排索引构建 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'inverted-index',
  categoryId: 'design',
  title: { zh: '倒排索引', en: 'Inverted Index' },
  summary: {
    zh: '词 → 文档列表的映射，是全文检索的核心数据结构。',
    en: 'A term-to-documents mapping; the core data structure of full-text search.',
  },
  description: {
    zh: '倒排索引（inverted index）是搜索引擎的基石：对每个词项维护它出现的文档（及位置）列表。构建流程：\n\n1. 分词：把文档切分为词项（小写化、去标点）\n2. 建表：对每个词项累加它出现的 docId\n3. 查询：给定词，O(1) 拿到包含它的所有文档；多词查询用集合交并\n\n空间 O(总词频)，查询 O(命中文档数)，支持布尔检索与短语检索（带位置信息）。',
    en: "The inverted index is the backbone of search engines: for each term maintain the list of documents (and positions) where it occurs. Build steps:\n\n1. Tokenize: split each document into terms (lowercase, strip punctuation)\n2. Build: append the docId to each term's posting list\n3. Query: given a term, O(1) to get all docs containing it; multi-term queries use set intersection/union\n\nSpace O(total term freq), query O(hit count); supports boolean and phrase queries (with positions).",
  },
  tags: ['inverted-index', 'index', 'search'],
  complexity: { time: 'O(总词频)', space: 'O(总词频)' },
};
