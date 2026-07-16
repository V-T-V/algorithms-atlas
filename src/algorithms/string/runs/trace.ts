// =============================================================================
// Runs（周期性极大区间）· 录制帧序列
// setArray 展示字符串（字符码），命中区间按周期高亮；setAux 展示 run 列表。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { runs, type RunsHooks } from './impl.ts';

export const DEFAULT_INPUT = 'abababab';

const CODE = (s: string): number[] => Array.from(s, (c) => c.charCodeAt(0));

/** 录制演示帧序列。 */
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const s = input;
  const n = s.length;
  const found: Array<{ l: number; r: number; period: number; exponent: number }> = [];

  const aux = (): Array<{ label: string; value: string; role?: BarRole }> => [
    { label: 's', value: s },
    { label: 'runs', value: found.map((x) => `[${x.l},${x.r}]p=${x.period}`).join(' ') || '-' },
  ];

  const snap = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = new Array(n).fill('default');
    for (const f of found) for (let k = f.l; k <= f.r; k++) roles[k] = 'final';
    rec.begin(note).setArray(CODE(s), roles, []).setAux(aux()).commit();
  };

  snap({ zh: `寻找周期性极大区间：${s}`, en: `Find runs: ${s}` });

  const hooks: RunsHooks = {
    onRun: (run) => {
      found.push(run);
      snap({
        zh: `run [${run.l},${run.r}] 周期 ${run.period}（×${run.exponent.toFixed(1)}）`,
        en: `Run [${run.l},${run.r}] p=${run.period}`,
      });
    },
    onDone: () => {},
  };

  runs(s, hooks);

  rec
    .begin({ zh: `完成：${found.length} 个 run`, en: `Done: ${found.length} runs` })
    .setArray(CODE(s), new Array(n).fill('final'), [])
    .setAux(aux())
    .commit();
  return rec.build();
}
