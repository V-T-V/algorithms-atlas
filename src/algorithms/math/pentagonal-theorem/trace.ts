// =============================================================================
// 五边形数定理 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { partitionByPentagonal, type PentagonalHooks } from './impl.ts';

export const DEFAULT_INPUT = { N: 10, mod: 1_000_000_007 };

export function buildTrace(input: { N: number; mod: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { N, mod } = input;
  const p: number[] = new Array<number>(N + 1).fill(0);
  let curN = -1;
  let result: number[] = [];

  const snap = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    if (curN >= 0) roles[curN] = 'compare';
    rec
      .begin(note)
      .setBars(
        p.map((v, i) => ({
          value: v,
          role: roles[i] ?? ((result.length > 0 ? 'final' : 'frontier') as BarRole),
          label: `p(${i})`,
        })),
      )
      .setAux([{ label: '当前 n', value: curN >= 0 ? String(curN) : '∅', role: 'compare' }])
      .commit();
  };

  snap({ zh: `用五边形数定理计算 p(0..${N})`, en: `Compute p(0..${N}) via pentagonal theorem` });

  const hooks: PentagonalHooks = {
    onStep: (n, val) => {
      p[n] = val;
      curN = n;
      snap({ zh: `p(${n}) = ${val}`, en: `p(${n}) = ${val}` });
    },
    onResult: (table) => {
      result = [...table];
      curN = -1;
      snap({ zh: `完成 p(0..${N})`, en: `Done p(0..${N})` });
    },
  };

  partitionByPentagonal(N, mod, hooks);

  rec
    .begin({ zh: `完成：p(${N}) = ${p[N]}`, en: `Done: p(${N}) = ${p[N]}` })
    .setBars(
      p.map((v, i) => ({
        value: v,
        role: (i === N ? 'final' : 'default') as BarRole,
        label: `p(${i})`,
      })),
    )
    .setAux([{ label: `p(${N})`, value: String(p[N]), role: 'final' }])
    .commit();

  return rec.build();
}
