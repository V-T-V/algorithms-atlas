// 倒排索引 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { InvertedIndex, type InvertedIndexHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  docs: ['the quick brown fox', 'the lazy brown dog', 'quick fox and quick hare'],
  queryTerms: ['quick', 'brown', 'fox'],
};

export function buildTrace(
  input: { docs: string[]; queryTerms: string[] } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { docs, queryTerms } = input;
  const indexSnapshot = new Map<string, number[]>(); // term -> docIds
  let curTerm = '';
  let curDoc = -1;

  const render = (note: { zh: string; en: string }): void => {
    const entries = Array.from(indexSnapshot.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    rec
      .begin(note)
      .setMap(
        entries.map(([term, docIds]) => ({
          key: term,
          value: `[${docIds.join(',')}]`,
          role: (term === curTerm ? 'compare' : 'default') as BarRole,
        })),
      )
      .setAux([
        { label: '已建词项数', value: String(indexSnapshot.size), role: 'frontier' as BarRole },
        { label: '当前处理', value: curDoc >= 0 ? `doc ${curDoc}` : '-', role: 'pivot' as BarRole },
        ...docs.map((d, i) => ({
          label: `doc ${i}`,
          value: d.slice(0, 30),
          role: (i === curDoc ? 'compare' : 'sorted') as BarRole,
        })),
      ])
      .commit();
    curTerm = '';
  };

  render({
    zh: `从 ${docs.length} 篇文档构建倒排索引`,
    en: `Build inverted index from ${docs.length} docs`,
  });

  const hooks: InvertedIndexHooks = {
    onNewTerm: (term) => {
      indexSnapshot.set(term, []);
      curTerm = term;
      render({ zh: `新词项 "${term}"`, en: `New term "${term}"` });
    },
    onAppend: (term, docId) => {
      const list = indexSnapshot.get(term) ?? [];
      list.push(docId);
      indexSnapshot.set(term, list);
      curTerm = term;
      render({ zh: `"${term}" → doc ${docId}`, en: `"${term}" → doc ${docId}` });
    },
    onToken: (_d, _p, _t) => {},
    onQuery: (term, hitCount) => {
      curTerm = term;
      render({
        zh: `查询 "${term}"：命中 ${hitCount} 篇`,
        en: `Query "${term}": ${hitCount} hits`,
      });
    },
  };

  const idx = new InvertedIndex(hooks);
  docs.forEach((d) => {
    curDoc = idx.docCount();
    render({ zh: `添加 doc ${curDoc}: "${d}"`, en: `Add doc ${curDoc}: "${d}"` });
    idx.addDocument(d);
  });
  curDoc = -1;

  queryTerms.forEach((t) => idx.search(t));
  const andResult = idx.searchAnd(queryTerms);

  rec
    .begin({
      zh: `完成："${queryTerms.join(' AND ')}" 命中 [${andResult.join(',')}]`,
      en: `Done: "${queryTerms.join(' AND ')}" → [${andResult.join(',')}]`,
    })
    .setMap(
      Array.from(indexSnapshot.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([term, docIds]) => ({
          key: term,
          value: `[${docIds.join(',')}]`,
          role: 'sorted' as BarRole,
        })),
    )
    .setAux([{ label: 'AND 结果', value: `[${andResult.join(',')}]`, role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
