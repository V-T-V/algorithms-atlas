// =============================================================================
// 单词接龙 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ladderLength, type WordLadderHooks } from './impl.ts';

export const DEFAULT_BEGIN = 'hit';
export const DEFAULT_END = 'cog';
export const DEFAULT_WORDS = ['hot', 'dot', 'dog', 'lot', 'log', 'cog'];

export function buildTrace(
  beginWord: string = DEFAULT_BEGIN,
  endWord: string = DEFAULT_END,
  wordList: string[] = DEFAULT_WORDS,
): Frame[] {
  const rec = new TraceRecorder();
  const visited = new Set<string>([beginWord]);
  const distMap = new Map<string, number>();
  distMap.set(beginWord, 1);
  let curWord = beginWord;
  let ans = 0;

  const snap = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = wordList.map((w) =>
      w === endWord && ans > 0 ? 'final' : visited.has(w) ? 'frontier' : 'default',
    );
    rec
      .begin(note)
      .setBars(
        wordList.map((w, i) => ({
          value: w.length,
          role: roles[i]!,
          label: `${w}${distMap.has(w) ? `(${distMap.get(w)})` : ''}`,
        })),
      )
      .setAux([
        { label: 'begin', value: beginWord, role: 'pivot' },
        { label: 'end', value: endWord, role: 'final' },
        { label: '当前', value: curWord, role: 'compare' },
      ])
      .commit();
  };

  snap({ zh: `${beginWord} → ${endWord}`, en: `${beginWord} → ${endWord}` });

  const hooks: WordLadderHooks = {
    onVisit: (word, dist) => {
      visited.add(word);
      distMap.set(word, dist);
      curWord = word;
      snap({ zh: `访问 ${word}（${dist}）`, en: `Visit ${word} (${dist})` });
    },
    onResult: (t) => {
      ans = t;
      curWord = '';
      snap({
        zh: t === 0 ? '不可达' : `长度 = ${t}`,
        en: t === 0 ? 'Unreachable' : `Length = ${t}`,
      });
    },
  };

  const result = ladderLength(beginWord, endWord, wordList, hooks);

  rec
    .begin({
      zh: result === 0 ? '不可达' : `完成：${result}`,
      en: result === 0 ? 'Unreachable' : `Done: ${result}`,
    })
    .setBars(wordList.map((w) => ({ value: w.length, role: 'final' as BarRole, label: w })))
    .setAux([{ label: '长度 / length', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
