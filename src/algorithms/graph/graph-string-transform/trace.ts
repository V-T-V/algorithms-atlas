// =============================================================================
// 字符串变换 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ladderLengthBi, type StringTransformHooks } from './impl.ts';

export const DEFAULT_BEGIN = 'hit';
export const DEFAULT_END = 'cog';
export const DEFAULT_WORDS = ['hot', 'dot', 'dog', 'lot', 'log', 'cog'];

export function buildTrace(
  beginWord: string = DEFAULT_BEGIN,
  endWord: string = DEFAULT_END,
  wordList: string[] = DEFAULT_WORDS,
): Frame[] {
  const rec = new TraceRecorder();
  const visited = new Set<string>([beginWord, endWord]);
  let ans = 0;

  const snap = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = wordList.map((w) => (visited.has(w) ? 'frontier' : 'default'));
    rec
      .begin(note)
      .setBars(wordList.map((w, i) => ({ value: w.length, role: roles[i]!, label: w })))
      .setAux([
        { label: 'begin', value: beginWord, role: 'pivot' },
        { label: 'end', value: endWord, role: 'final' },
        { label: '已访问', value: [...visited].join(', '), role: 'frontier' },
      ])
      .commit();
  };

  snap({ zh: `${beginWord} → ${endWord}`, en: `${beginWord} → ${endWord}` });

  const hooks: StringTransformHooks = {
    onExpand: (word) => {
      visited.add(word);
      snap({ zh: `扩展 ${word}`, en: `Expand ${word}` });
    },
    onResult: (t) => {
      ans = t;
      snap({
        zh: t === 0 ? '不可达' : `长度 = ${t}`,
        en: t === 0 ? 'Unreachable' : `Length = ${t}`,
      });
    },
  };

  const result = ladderLengthBi(beginWord, endWord, wordList, hooks);

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
