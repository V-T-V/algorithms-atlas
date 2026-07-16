// =============================================================================
// Collatz 最大步数统计 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { collatzStepsMemo, type CollatzMaxHooks } from './impl.ts';

export const DEFAULT_INPUT = 30;

export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input;
  const steps: number[] = new Array<number>(n + 1).fill(-1);
  const records: Array<{ value: number; steps: number }> = [];
  let cur = -1;

  const render = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    const labels: Record<number, string> = {};
    const recordVals = new Set(records.map((r) => r.value));
    for (let i = 1; i <= n; i++) {
      labels[i - 1] = `${i}\n${steps[i]! < 0 ? '·' : steps[i]}`;
      if (recordVals.has(i)) roles[i - 1] = 'final';
      else if (i - 1 === cur) roles[i - 1] = 'compare';
      else if (steps[i]! >= 0) roles[i - 1] = 'frontier';
    }
    const values = Array.from({ length: n }, (_, i) => i + 1);
    rec
      .begin(note)
      .setBars(rec.barsFrom(values, roles, labels))
      .setAux([
        {
          label: '步数表',
          value: steps
            .slice(1)
            .map((v) => (v < 0 ? '·' : v))
            .join(' '),
          role: 'compare',
        },
        {
          label: '记录保持者',
          value: records.map((r) => r.value).join(', ') || '∅',
          role: 'final',
        },
        { label: '记录数', value: String(records.length), role: 'final' },
      ])
      .commit();
  };

  render({ zh: `统计 [1, ${n}] 的 Collatz 步数`, en: `Collatz steps in [1, ${n}]` });

  const hooks: CollatzMaxHooks = {
    onCompute: (i, s) => {
      steps[i] = s;
      cur = i - 1;
      render({ zh: `steps[${i}] = ${s}`, en: `steps[${i}] = ${s}` });
    },
    onRecord: (value, s) => {
      records.push({ value, steps: s });
      cur = value - 1;
      render({ zh: `新记录：${value} 步数 ${s}`, en: `Record: ${value} steps ${s}` });
    },
    onResult: () => {
      cur = -1;
    },
  };

  collatzStepsMemo(n, hooks);

  rec
    .begin({
      zh: `最大步数 ${records[records.length - 1]?.steps ?? 0}（在 ${records[records.length - 1]?.value}）`,
      en: `Max steps ${records[records.length - 1]?.steps ?? 0} (at ${records[records.length - 1]?.value})`,
    })
    .setBars(
      rec.barsFrom(
        Array.from({ length: n }, (_, i) => i + 1),
        Object.fromEntries(records.map((r) => [r.value - 1, 'final' as BarRole])),
        Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `${i + 1}\n${steps[i + 1]}`])),
      ),
    )
    .setAux([
      {
        label: '记录保持者',
        value: records.map((r) => `${r.value}(${r.steps})`).join(' '),
        role: 'final',
      },
    ])
    .commit();

  return rec.build();
}
