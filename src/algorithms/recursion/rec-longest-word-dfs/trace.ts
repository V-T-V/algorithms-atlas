import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { longestWord } from './impl.ts';

export const DEFAULT_WORDS = ['w', 'wo', 'wor', 'worl', 'world'];

export function buildTrace(opts: { words?: string[] } = {}): Frame[] {
  const words = opts.words ?? DEFAULT_WORDS;
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `初始化 ${words.length} 单词`, en: `Init ${words.length} words` })
    .setBars(words.map((w, _i) => ({ value: w.length, role: 'default' as BarRole, label: w })))
    .setAux([{ label: '目标', value: '最长可构建单词', role: 'compare' as BarRole }])
    .commit();

  longestWord(words, {
    onCandidate: (word) => {
      rec
        .begin({
          zh: `候选: ${word} (长度${word.length})`,
          en: `candidate: ${word} (len ${word.length})`,
        })
        .setBars(
          words.map((w) => ({
            value: w.length,
            role: (w === word ? 'final' : word.startsWith(w) ? 'sorted' : 'default') as BarRole,
            label: w,
          })),
        )
        .setAux([{ label: '候选', value: word, role: 'compare' as BarRole }])
        .commit();
    },
  });

  const result = longestWord(words);
  rec
    .begin({ zh: `完成：${result}`, en: `Done: ${result}` })
    .setBars(
      words.map((w) => ({
        value: w.length,
        role: (w === result ? 'final' : result.startsWith(w) ? 'sorted' : 'default') as BarRole,
        label: w,
      })),
    )
    .setAux([{ label: '结果', value: result, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
