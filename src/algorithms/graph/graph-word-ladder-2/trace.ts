// =============================================================================
// 单词接龙 II · 录制帧序列
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { wordLadder2, type WordLadder2Hooks } from './impl.ts';

export const DEFAULT_BEGIN = 'hit';
export const DEFAULT_END = 'cog';
export const DEFAULT_WORDS = ['hot', 'dot', 'dog', 'lot', 'log', 'cog'];

export function buildTrace(
  beginWord: string = DEFAULT_BEGIN,
  endWord: string = DEFAULT_END,
  wordList: readonly string[] = DEFAULT_WORDS,
): Frame[] {
  const rec = new TraceRecorder();
  let result: string[][] = [];

  rec
    .begin({ zh: `begin=${beginWord} end=${endWord}`, en: `begin=${beginWord} end=${endWord}` })
    .setAux([{ label: '字典', value: wordList.join(','), role: 'frontier' }])
    .commit();

  const hooks: WordLadder2Hooks = {
    onLayer: (layer, words) => {
      rec
        .begin({
          zh: `第 ${layer} 层：[${words.join(',')}]`,
          en: `Layer ${layer}: [${words.join(',')}]`,
        })
        .setBars(words.map((w) => ({ value: w.length, role: 'frontier' as const })))
        .setAux([{ label: '本层词', value: words.join(','), role: 'pivot' }])
        .commit();
    },
    onFound: (paths) => {
      result = paths;
      rec
        .begin({
          zh: `找到 ${paths.length} 条最短路径`,
          en: `Found ${paths.length} shortest paths`,
        })
        .setAux(
          paths.map((p, i) => ({ label: `路径${i}`, value: p.join('→'), role: 'final' as const })),
        )
        .commit();
    },
    onDone: (paths) => {
      result = paths;
    },
  };

  wordLadder2(beginWord, endWord, wordList, hooks);
  return rec.build();
}
