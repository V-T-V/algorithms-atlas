// =============================================================================
// 问题求解搜索引擎
// 基于 TF-IDF 的全文检索：从用户的问题描述匹配最相关的算法。
// 纯前端、零依赖，索引在页面加载时一次性构建。
// =============================================================================

import type { AlgorithmMeta } from '../types.ts';
import { expandSynonyms, SYNONYMS, EN_SYNONYMS } from './keywords.ts';

/** 中文分词：按标点/空格/英文边界切分，保留 2+ 字符的 token。 */
function tokenize(text: string): string[] {
  const tokens: string[] = [];
  // 按非字母数字字符切分（保留中文字符序列）
  const parts = text.split(/[^a-zA-Z0-9\u4e00-\u9fff]+/);
  for (const part of parts) {
    if (!part) continue;
    // 英文 token 整体保留
    if (/^[a-zA-Z0-9]+$/.test(part)) {
      if (part.length >= 2) tokens.push(part.toLowerCase());
    } else {
      // 中文：提取 2-4 字滑窗子串（简易中文分词）
      for (let len = 2; len <= Math.min(4, part.length); len++) {
        for (let i = 0; i <= part.length - len; i++) {
          tokens.push(part.slice(i, i + len));
        }
      }
      // 也保留单字（低权重）
      if (part.length === 1) tokens.push(part);
    }
  }
  return tokens;
}

interface IndexedDoc {
  meta: AlgorithmMeta;
  /** token → TF（词频/文档长度）。 */
  tf: Map<string, number>;
  /** 预计算的文档文本（用于匹配结果显示）。 */
  text: string;
}

export interface SearchResult {
  meta: AlgorithmMeta;
  score: number;
  /** 匹配到的关键词。 */
  matchedTerms: string[];
}

export class SearchEngine {
  private docs: IndexedDoc[] = [];
  /** IDF：token → log(N / df)。 */
  private idf = new Map<string, number>();
  private built = false;

  /** 从全部算法元数据构建索引。 */
  build(metas: readonly AlgorithmMeta[]): void {
    this.docs = [];
    const df = new Map<string, number>(); // document frequency

    for (const meta of metas) {
      // 构建文档文本
      const text = [
        meta.id,
        meta.title.zh,
        meta.title.en,
        meta.summary.zh,
        meta.summary.en,
        meta.tags.join(' '),
        meta.categoryId,
      ].join(' ');

      const tokens = tokenize(text);
      // 扩展同义词
      const expanded = expandSynonyms(tokens);

      // 计算 TF
      const tf = new Map<string, number>();
      for (const t of expanded) {
        tf.set(t, (tf.get(t) ?? 0) + 1);
      }
      // 归一化 TF
      const maxTf = Math.max(1, ...tf.values());
      for (const [k, v] of tf) {
        tf.set(k, v / maxTf);
        df.set(k, (df.get(k) ?? 0) + 1);
      }

      this.docs.push({ meta, tf, text });
    }

    // 计算 IDF
    const N = this.docs.length;
    for (const [token, freq] of df) {
      this.idf.set(token, Math.log((N + 1) / (freq + 1)) + 1);
    }

    this.built = true;
  }

  /** 查询：返回按相关度排序的结果。多关键词匹配获得加权。 */
  search(query: string, limit = 20): SearchResult[] {
    if (!this.built || !query.trim()) return [];

    const queryTokens = tokenize(query);
    const expanded = expandSynonyms(queryTokens);
    if (expanded.length === 0) return [];

    // 将 expanded 分组为原始 query tokens 的同义词组（每组来自一个原始 token）
    const queryGroups = queryTokens.map((t) => {
      const group = new Set<string>([t.toLowerCase()]);
      const lower = t.toLowerCase();
      if (SYNONYMS[t]) for (const s of SYNONYMS[t]!) group.add(s);
      if (EN_SYNONYMS[lower]) for (const s of EN_SYNONYMS[lower]!) group.add(s);
      return group;
    });

    const results: SearchResult[] = [];

    for (const doc of this.docs) {
      let score = 0;
      const matched: string[] = [];
      let groupsMatched = 0;

      for (const token of expanded) {
        const tf = doc.tf.get(token);
        if (tf !== undefined && tf > 0) {
          const idf = this.idf.get(token) ?? 1;
          score += tf * idf;
          if (!matched.includes(token)) matched.push(token);
        }
      }

      // 统计有多少个 query group 匹配到了（多词匹配加权）
      for (const group of queryGroups) {
        if ([...group].some((t) => doc.tf.has(t))) groupsMatched++;
      }
      // 多词匹配奖励：每多匹配一个 group 加 30% 分数
      if (queryGroups.length > 1) {
        score *= 1 + 0.3 * groupsMatched;
      }

      if (score > 0) {
        const maxPossible = expanded.length * 2;
        const normalized = Math.min(100, Math.round((score / maxPossible) * 100));
        results.push({ meta: doc.meta, score: normalized, matchedTerms: matched });
      }
    }

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, limit);
  }
}
