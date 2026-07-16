// 倒排索引 · 纯算法实现

/** 一条 posting：文档 id + 该词在文档中的出现位置（下标）。 */
export interface Posting {
  docId: number;
  positions: number[];
}

/** 事件钩子。 */
export interface InvertedIndexHooks {
  /** 处理文档 docId 的第 pos 个词项 term。 */
  onToken?: (docId: number, pos: number, term: string) => void;
  /** 把 term 加入索引（首次出现）。 */
  onNewTerm?: (term: string) => void;
  /** 词项 term 在 docId 新增一次出现。 */
  onAppend?: (term: string, docId: number) => void;
  /** 查询 term：返回命中文档数。 */
  onQuery?: (term: string, hitCount: number) => void;
}

/** 简单分词：小写化、按非字母数字切分。 */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 0);
}

/**
 * 倒排索引：从文档集合构建 term → Posting[] 映射。
 */
export class InvertedIndex {
  private readonly index = new Map<string, Posting[]>();
  private readonly docLen: number[] = [];

  constructor(private hooks: InvertedIndexHooks = {}) {}

  /** 添加一篇文档，返回其 docId。 */
  addDocument(text: string): number {
    const docId = this.docLen.length;
    const tokens = tokenize(text);
    this.docLen.push(tokens.length);
    tokens.forEach((term, pos) => {
      this.hooks.onToken?.(docId, pos, term);
      let postings = this.index.get(term);
      if (!postings) {
        postings = [];
        this.index.set(term, postings);
        this.hooks.onNewTerm?.(term);
      }
      // 若最后一个 posting 属于当前 doc，则追加位置；否则新建 posting
      const last = postings[postings.length - 1];
      if (last && last.docId === docId) {
        last.positions.push(pos);
      } else {
        postings.push({ docId, positions: [pos] });
        this.hooks.onAppend?.(term, docId);
      }
    });
    return docId;
  }

  /** 查询单个词项命中的文档 id 列表（升序去重）。 */
  search(term: string): number[] {
    const t = term.toLowerCase();
    const postings = this.index.get(t);
    const docs = postings ? postings.map((p) => p.docId) : [];
    this.hooks.onQuery?.(t, docs.length);
    return docs;
  }

  /** 查询多个词项的「AND」（同时包含所有词的文档）。 */
  searchAnd(terms: string[]): number[] {
    if (terms.length === 0) return [];
    const sets = terms.map((t) => new Set(this.search(t)));
    // 取所有集合的交集
    const smallest = sets.reduce((a, b) => (a.size < b.size ? a : b));
    const result: number[] = [];
    for (const d of smallest) {
      if (sets.every((s) => s.has(d))) result.push(d);
    }
    return result.sort((a, b) => a - b);
  }

  /** 词项总数。 */
  termCount(): number {
    return this.index.size;
  }

  /** 文档总数。 */
  docCount(): number {
    return this.docLen.length;
  }

  /** 取某词项的 posting 列表（带位置）。 */
  getPostings(term: string): Posting[] {
    return this.index.get(term.toLowerCase()) ?? [];
  }
}
