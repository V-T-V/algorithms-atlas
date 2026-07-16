// =============================================================================
// Duval 分解 · 录制帧序列
// setArray 展示字符串（字符码），pointer 标注因子起点；setAux 展示因子序列。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { duval, type DuvalHooks } from './impl.ts';

export const DEFAULT_INPUT = 'abcabcab';

const CODE = (s: string): number[] => Array.from(s, (c) => c.charCodeAt(0));

/** 录制演示帧序列。 */
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const s = input;
  const n = s.length;
  const factors: Array<{ text: string; start: number; end: number }> = [];

  const aux = (): Array<{ label: string; value: string; role?: BarRole }> => [
    { label: 's', value: s },
    { label: 'factors', value: factors.map((f) => f.text).join(' | ') || '-' },
  ];

  const snap = (
    note: { zh: string; en: string },
    roles: BarRole[],
    pointers: Array<{ index: number; label: string }>,
  ): void => {
    rec.begin(note).setArray(CODE(s), roles, pointers).setAux(aux()).commit();
  };

  snap(
    { zh: `Lyndon 分解：${s}`, en: `Lyndon factorization: ${s}` },
    new Array(n).fill('default'),
    [],
  );

  const hooks: DuvalHooks = {
    onFactor: (f) => {
      factors.push(f);
      const roles: BarRole[] = new Array(n).fill('default');
      const pointers: Array<{ index: number; label: string }> = [{ index: f.start, label: 'l' }];
      for (let k = f.start; k < f.end; k++) roles[k] = 'final';
      snap({ zh: `输出因子 '${f.text}'`, en: `Emit factor '${f.text}'` }, roles, pointers);
    },
    onDone: () => {},
  };

  duval(s, hooks);

  const roles: BarRole[] = new Array(n).fill('final');
  rec
    .begin({ zh: `完成：${factors.length} 个因子`, en: `Done: ${factors.length} factors` })
    .setArray(CODE(s), roles, [])
    .setAux(aux())
    .commit();
  return rec.build();
}
