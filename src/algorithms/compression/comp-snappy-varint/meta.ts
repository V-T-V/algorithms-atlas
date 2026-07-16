// Snappy 字面+拷贝解析（Snappy Literal/Copy）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'comp-snappy-varint',
  categoryId: 'compression',
  title: { zh: 'Snappy 字面+拷贝解析', en: 'Snappy Literal/Copy' },
  summary: {
    zh: 'Snappy 标签字面与回引拷贝混合。',
    en: 'Snappy tag mixing literals and back-references.',
  },
  description: {
    zh: 'Snappy 用 1 字节 tag 区分字面与拷贝(短/长偏移)，跳过不压缩段，主打超快解压，LevelDB/BigQuery 使用。',
    en: 'Snappy tags literals vs short/long copies, skipping incompressible spans for ultra-fast decode (LevelDB, BigQuery).',
  },
  tags: ['compression', 'snappy', 'lz'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
