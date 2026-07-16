// C(n,k) 组合 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { btCombineK, type BtCombineKHooks } from './impl.ts';

export const DEFAULT_N = 4;
export const DEFAULT_K = 2;

export function buildTrace(
  input: { n: number; k: number } = { n: DEFAULT_N, k: DEFAULT_K },
): Frame[] {
  const rec = new TraceRecorder();
  const { n, k } = input;
  const values = Array.from({ length: n }, (_, i) => i + 1);

  rec
    .begin({ zh: `C(${n},${k})`, en: `C(${n},${k})` })
    .setBars(rec.barsFrom(values))
    .setAux([{ label: '目标', value: `从 1..${n} 选 ${k} 个`, role: 'pivot' }])
    .commit();

  const hooks: BtCombineKHooks = {
    onPick: (value, path) => {
      const roles: Record<number, BarRole> = {};
      path.forEach((p) => {
        roles[p - 1] = 'compare';
      });
      rec
        .begin({
          zh: `选 ${value}，路径 ${JSON.stringify(path)}`,
          en: `Pick ${value}, path ${JSON.stringify(path)}`,
        })
        .setBars(rec.barsFrom(values, roles))
        .setAux([{ label: '当前路径', value: JSON.stringify(path), role: 'frontier' }])
        .commit();
    },
    onEmit: (combo) => {
      const roles: Record<number, BarRole> = {};
      combo.forEach((p) => {
        roles[p - 1] = 'final';
      });
      rec
        .begin({
          zh: `收集组合 ${JSON.stringify(combo)}`,
          en: `Emit combo ${JSON.stringify(combo)}`,
        })
        .setBars(rec.barsFrom(values, roles))
        .setAux([{ label: '收集', value: JSON.stringify(combo), role: 'final' }])
        .commit();
    },
  };

  const result = btCombineK(n, k, hooks);

  rec
    .begin({ zh: `完成：共 ${result.length} 个组合`, en: `Done: ${result.length} combos` })
    .setAux([
      { label: '组合总数', value: String(result.length), role: 'final' },
      { label: '组合', value: result.map((c) => JSON.stringify(c)).join(' '), role: 'final' },
    ])
    .commit();

  return rec.build();
}
