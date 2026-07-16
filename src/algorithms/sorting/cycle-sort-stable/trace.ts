// =============================================================================
// 稳定圈排序 · 录制帧序列
// 通过 cycleSortStable 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { cycleSortStable, type CycleSortStableHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 5, 1, 2, 3];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = [...input];
  const _n = a.length;
  let writing: [number, number] | null = null; // (pos, value)
  let cycleValue: number | null = null;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    if (writing) roles[writing[0]] = 'swap';
    rec
      .begin(note)
      .setBars(rec.barsFrom(a, roles, Object.fromEntries(a.map((v, i) => [i, `${v}#${i}`]))))
      .setAux([
        {
          label: '当前循环值',
          value: cycleValue === null ? '—' : String(cycleValue),
          role: 'pivot',
        },
        {
          label: '正在写入',
          value: writing ? `a[${writing[0]}] := ${writing[1]}` : '—',
          role: 'compare',
        },
      ])
      .commit();
    writing = null;
  };

  snapshot({
    zh: `初始数组（下标 #i 标注原位置）：${a.join(', ')}`,
    en: `Initial array (#i marks original position): ${a.join(', ')}`,
  });

  const hooks: CycleSortStableHooks = {
    onCycleStart: (item) => {
      cycleValue = item;
      snapshot({ zh: `开始新循环：值 ${item}`, en: `New cycle: value ${item}` });
    },
    onCount: (item, count) => {
      snapshot({
        zh: `${item} 应放在起点后第 ${count} 个位置`,
        en: `${item} belongs ${count} slots after cycle start`,
      });
    },
    onWrite: (pos, v) => {
      writing = [pos, v];
      snapshot({ zh: `写入 a[${pos}] := ${v}`, en: `Write a[${pos}] := ${v}` });
    },
    onCycleEnd: (writes) => {
      snapshot({ zh: `本循环结束（共 ${writes} 次写入）`, en: `Cycle end (${writes} writes)` });
      cycleValue = null;
    },
  };

  cycleSortStable(input, hooks);

  rec
    .begin({ zh: '排序完成（稳定：等值保持原序）', en: 'Sorted (stable: equals keep order)' })
    .setBars(a.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
