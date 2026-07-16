// URL 解析器 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'url-parser',
  categoryId: 'parsing',
  title: { zh: 'URL 解析器', en: 'URL Parser' },
  summary: {
    zh: '解析 URL 为协议/认证/主机/端口/路径/查询参数/锚点。',
    en: 'Parse a URL into scheme/auth/host/port/path/query/fragment.',
  },
  description: {
    zh: '解析 URL 字符串为结构化对象，遵循 RFC 3986 风格：\n  scheme://[user[:pass]@]host[:port][/path][?query][#fragment]\n\n步骤：\n1. 用 # 分出 fragment\n2. 用 ? 分出 query，query 用 & 与 = 拆成键值对\n3. 用 :// 分出 scheme 与 remainder\n4. 在 remainder 中分出 authority（首个 / 之前）与 path\n5. authority 中若有 @，前面是 userinfo，后面是 host[:port]\n\n本实现是教学版正则+分割，非完整 RFC 实现。',
    en: 'Parse a URL into scheme, userinfo (user[:pass]), host, port, path, query params, and fragment per RFC 3986 style. Split on # then ? then :// then first / then @. Teaching version using regex and splitting; not a full RFC implementation.',
  },
  tags: ['parsing', 'url', 'uri', 'network'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
