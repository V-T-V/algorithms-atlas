// =============================================================================
// 分数加法 · 录制帧序列
// 通过 fractionAdd 的钩子，把累加过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { fractionAdd, type FractionAddHooks, type Frac } from './impl.ts';

export const DEFAULT_INPUT: Array<[number, number]> = [
  [1, 2],
  [1, 3],
  [1, 4],
  [1, 5],
];

const fmt = (f: Frac): string => (f.den === 1n ? `${f.num}` : `${f.num}/${f.den}`);

/** 录制演示帧序列。 */
export function buildTrace(input: Array<[number, number]> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const lines: Array<{ key: string; value: string; role?: BarRole }> = [];

  const snapshot = (note: { zh: string; en: string }, acc: Frac, term: Frac): void => {
    rec
      .begin(note)
      .setAux([
        { label: '当前项', value: fmt(term), role: 'compare' as BarRole },
        { label: '累加和', value: fmt(acc), role: 'final' as BarRole },
      ])
      .setMap(lines.slice())
      .commit();
  };

  lines.push({ key: '初始', value: '0/1', role: 'default' });
  rec
    .begin({ zh: `对 ${input.length} 个分数求和`, en: `Sum ${input.length} fractions` })
    .setAux([{ label: '累加和', value: '0', role: 'final' as BarRole }])
    .commit();

  const hooks: FractionAddHooks = {
    onAdd: (acc, term) => {
      lines.push({ key: '加', value: `${fmt(acc)} + ${fmt(term)}`, role: 'default' });
      snapshot({ zh: `${fmt(acc)} + ${fmt(term)}`, en: `${fmt(acc)} + ${fmt(term)}` }, acc, term);
    },
    onReduced: (acc) => {
      lines.push({ key: '化简', value: `= ${fmt(acc)}`, role: 'compare' });
      snapshot({ zh: `化简为 ${fmt(acc)}`, en: `Reduced to ${fmt(acc)}` }, acc, {
        num: 0n,
        den: 1n,
      });
    },
    onResult: (acc) => {
      lines.push({ key: '结果', value: fmt(acc), role: 'final' });
      rec
        .begin({ zh: `总和 = ${fmt(acc)}`, en: `Sum = ${fmt(acc)}` })
        .setAux([{ label: '总和', value: fmt(acc), role: 'final' as BarRole }])
        .setMap(lines.slice())
        .commit();
    },
  };

  fractionAdd(input, hooks);
  return rec.build();
}
