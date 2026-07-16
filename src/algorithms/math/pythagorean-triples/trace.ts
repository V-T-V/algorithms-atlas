// =============================================================================
// 勾股数生成 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { primitivePythagoreanTriples, type PythagoreanHooks } from './impl.ts';

export const DEFAULT_INPUT = 100;

export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const maxC = input;
  const found: Array<[number, number, number]> = [];

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(
        found.map((t, i) => ({
          value: t[2]!,
          role: (i === found.length - 1 ? 'compare' : 'frontier') as BarRole,
          label: `${t[0]}²+${t[1]}²=${t[2]}²`,
        })),
      )
      .setAux([{ label: '已生成', value: String(found.length), role: 'frontier' }])
      .commit();
  };

  snap({ zh: `生成本原勾股数 c ≤ ${maxC}`, en: `Generate primitive triples c <= ${maxC}` });

  const hooks: PythagoreanHooks = {
    onGenerate: (_m, _n, triple) => {
      found.push(triple);
      snap({
        zh: `${triple[0]}²+${triple[1]}²=${triple[2]}²`,
        en: `${triple[0]}²+${triple[1]}²=${triple[2]}²`,
      });
    },
    onResult: (triples) => {
      snap({ zh: `共 ${triples.length} 组本原勾股数`, en: `${triples.length} primitive triples` });
    },
  };

  primitivePythagoreanTriples(maxC, hooks);

  rec
    .begin({ zh: `完成：${found.length} 组`, en: `Done: ${found.length} triples` })
    .setBars(
      found.map((t) => ({
        value: t[2]!,
        role: 'final' as BarRole,
        label: `${t[0]},${t[1]},${t[2]}`,
      })),
    )
    .setAux([{ label: '总数', value: String(found.length), role: 'final' }])
    .commit();

  return rec.build();
}
