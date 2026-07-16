import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mapReduceWordCount } from './impl.ts';

export const DEFAULT_TEXT =
  'the quick brown fox jumps over the lazy dog the fox is quick and the dog is lazy';

export function buildTrace(opts: { text?: string; shards?: number } = {}): Frame[] {
  const text = opts.text ?? DEFAULT_TEXT;
  const shards = opts.shards ?? 3;
  const rec = new TraceRecorder();
  const shardCounts: Map<string, number>[] = [];

  const snap = (note: { zh: string; en: string }, total: Map<string, number> | null): void => {
    const top = total ?? new Map<string, number>();
    const entries = [...top.entries()].sort((a, b) => b[1]! - a[1]!).slice(0, 8);
    rec
      .begin(note)
      .setBars(
        entries.map(([w, c]) => ({ value: c, role: 'final' as BarRole, label: `${w}:${c}` })),
      )
      .setAux([
        { label: '分片数', value: shards.toString(), role: 'compare' as BarRole },
        {
          label: '独立词数',
          value: (total ?? new Map<string, number>()).size.toString(),
          role: 'final' as BarRole,
        },
      ])
      .commit();
  };

  snap({ zh: '初始化 MapReduce', en: 'Init MapReduce' }, null);

  mapReduceWordCount(text, shards, {
    onMapDone: (r) => {
      shardCounts.push(r.counts);
      let sum = 0;
      for (const c of r.counts.values()) sum += c;
      snap(
        {
          zh: `Mapper ${r.shardId} 完成：${r.counts.size} 词，共 ${sum} 次`,
          en: `Mapper ${r.shardId} done: ${r.counts.size} words, ${sum} tokens`,
        },
        r.counts,
      );
    },
    onReduceDone: (total) => {
      snap(
        { zh: `Reduce 完成：${total.size} 独立词`, en: `Reduce done: ${total.size} unique words` },
        total,
      );
    },
  });

  rec
    .begin({ zh: '完成：词频统计', en: 'Done: word count' })
    .setAux([{ label: '结果', value: '已统计所有词频', role: 'final' as BarRole }])
    .commit();
  void shardCounts;
  return rec.build();
}
