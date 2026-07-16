import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { memoryFenceModel } from './impl.ts';
export const DEFAULT_INPUT = ['store x=1', 'fence', 'load flag'];
export function buildTrace(program: string[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '内存屏障', en: 'Memory Fence' }).commit();
  const { fences } = memoryFenceModel(program, {
    onInstr: (op) =>
      rec
        .begin({ zh: op, en: op })
        .setAux([{ label: 'op', value: op, role: 'compare' as BarRole }])
        .commit(),
    onFence: () =>
      rec
        .begin({ zh: '屏障', en: 'fence' })
        .setAux([{ label: 'fence', value: 'F', role: 'pivot' as BarRole }])
        .commit(),
    onReorderBlocked: () =>
      rec
        .begin({ zh: '阻止重排', en: 'block' })
        .setAux([{ label: 'blocked', value: 'reorder', role: 'warn' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: fences + ' 个屏障', en: fences + ' fences' })
    .setAux([{ label: 'fences', value: String(fences), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
