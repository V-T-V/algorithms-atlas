import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateTanenbaum, type PhilEvent, type PhilState } from './impl.ts';

export const DEFAULT_N = 5;
export function defaultEvents(): PhilEvent[] {
  return [
    { philosopher: 0, action: 'take' },
    { philosopher: 2, action: 'take' },
    { philosopher: 1, action: 'take' }, // 邻接 0，被阻塞
    { philosopher: 0, action: 'put' }, // 唤醒 1
    { philosopher: 1, action: 'put' },
    { philosopher: 2, action: 'put' },
  ];
}

export function buildTrace(opts: { n?: number; events?: PhilEvent[] } = {}): Frame[] {
  const n = opts.n ?? DEFAULT_N;
  const events = opts.events ?? defaultEvents();
  const rec = new TraceRecorder();
  let states: PhilState[] = new Array(n).fill('THINKING');
  let blocked = false;

  const role = (s: PhilState): BarRole =>
    s === 'EATING' ? 'final' : s === 'HUNGRY' ? 'warn' : 'default';
  const val = (s: PhilState): number => (s === 'EATING' ? 3 : s === 'HUNGRY' ? 2 : 1);

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(
        Array.from({ length: n }, (_, i) => ({
          value: val(states[i]!),
          role: role(states[i]!),
          label: `P${i}:${states[i]![0]}`,
        })),
      )
      .setAux([
        ...Array.from({ length: n }, (_, i) => ({
          label: `P${i}`,
          value: states[i]!,
          role: role(states[i]!) as BarRole,
        })),
        {
          label: '本次阻塞',
          value: blocked ? '是' : '否',
          role: (blocked ? 'warn' : 'default') as BarRole,
        },
      ])
      .commit();
  };

  snap({ zh: `${n} 个哲学家初始化`, en: `${n} philosophers init` });

  for (const ev of events) {
    const steps = simulateTanenbaum(n, [ev]);
    const last = steps[steps.length - 1]!;
    states = [...last.states];
    blocked = last.blocked;
    snap({
      zh: `P${ev.philosopher} ${ev.action === 'take' ? '取叉' : '放叉'}`,
      en: `P${ev.philosopher} ${ev.action}`,
    });
  }

  rec
    .begin({ zh: '完成：无死锁', en: 'Done: deadlock-free' })
    .setBars(
      Array.from({ length: n }, (_, i) => ({ value: 1, role: 'final' as BarRole, label: `P${i}` })),
    )
    .setAux([{ label: '结果', value: '邻接不同时进餐', role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
