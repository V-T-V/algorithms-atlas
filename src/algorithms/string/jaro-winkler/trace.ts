// =============================================================================
// Jaro-Winkler 相似度 · 录制帧序列
// 用 setArray 展示两串，pointers 标注公共前缀；setAux 展示 Jaro、前缀长度与最终值。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { jaroWinkler, type JaroWinklerHooks } from './impl.ts';

export const DEFAULT_INPUT: { a: string; b: string } = {
  a: 'MARTHA',
  b: 'MARHTA',
};

const CODE = (s: string): number[] => Array.from(s, (c) => c.charCodeAt(0));

/** 录制演示帧序列。 */
export function buildTrace(input: { a: string; b: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { a, b } = input;
  let j = 0;
  let prefixLen = 0;
  let similarity = 0;

  const hooks: JaroWinklerHooks = {
    onJaro: (jv) => {
      j = jv;
      rec
        .begin({ zh: `Jaro 相似度 = ${j.toFixed(4)}`, en: `Jaro similarity = ${j.toFixed(4)}` })
        .setArray(CODE(a), new Array(a.length).fill('default'), [])
        .setAux([
          { label: 'a', value: a, role: 'default' },
          { label: 'b', value: b, role: 'default' },
          { label: 'Jaro J', value: j.toFixed(4), role: 'frontier' },
        ])
        .commit();
    },
    onPrefix: (pl) => {
      prefixLen = pl;
      const roles: BarRole[] = new Array(a.length).fill('default');
      for (let k = 0; k < pl; k++) roles[k] = 'compare';
      rec
        .begin({
          zh: `公共前缀长度 l = ${pl}（上限 4）`,
          en: `Common prefix length l = ${pl} (cap 4)`,
        })
        .setArray(CODE(a), roles, [])
        .setAux([
          { label: 'a', value: a, role: 'default' },
          { label: 'b', value: b, role: 'default' },
          { label: '前缀 l', value: `${pl}`, role: 'compare' },
          { label: 'Jaro J', value: j.toFixed(4), role: 'frontier' },
        ])
        .commit();
    },
  };

  rec
    .begin({ zh: `比较 "${a}" 与 "${b}"`, en: `Compare "${a}" vs "${b}"` })
    .setArray(CODE(a), new Array(a.length).fill('default'), [])
    .commit();

  similarity = jaroWinkler(a, b, hooks);

  // 终态：高亮前缀
  const roles: BarRole[] = new Array(a.length).fill('final');
  for (let k = 0; k < prefixLen; k++) roles[k] = 'compare';
  rec
    .begin({ zh: `完成：JW = ${similarity.toFixed(4)}`, en: `Done: JW = ${similarity.toFixed(4)}` })
    .setArray(CODE(a), roles, [])
    .setAux([
      { label: 'a', value: a, role: 'default' },
      { label: 'b', value: b, role: 'default' },
      { label: '前缀 l', value: `${prefixLen}`, role: 'compare' },
      { label: 'Jaro J', value: j.toFixed(4), role: 'frontier' },
      { label: 'JW', value: similarity.toFixed(4), role: 'final' },
    ])
    .commit();

  return rec.build();
}
