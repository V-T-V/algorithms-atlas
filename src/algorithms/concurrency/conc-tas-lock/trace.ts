import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateTasLock, type TState } from './impl.ts';

function s2bars(states: TState[]): Array<{ value: number; role: BarRole; label: string }> {
  return states.map((st, i) => ({
    value: st === 'critical' ? 2 : st === 'spinning' ? 1 : 0,
    role: (st === 'critical' ? 'final' : st === 'spinning' ? 'warn' : 'default') as BarRole,
    label: 'T' + i,
  }));
}
function aux(f: number, h: number) {
  return [
    { label: 'flag', value: String(f), role: 'compare' as BarRole },
    { label: 'holder', value: h < 0 ? '-' : 'T' + h, role: 'final' as BarRole },
  ];
}

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const events = [
    { thread: 0, action: 'lock' as const },
    { thread: 1, action: 'lock' as const },
    { thread: 0, action: 'unlock' as const },
    { thread: 1, action: 'lock' as const },
    { thread: 1, action: 'unlock' as const },
  ];
  rec
    .begin({ zh: 'TAS 锁：2 线程竞争', en: 'TAS lock: 2 threads contend' })
    .setBars([
      { value: 0, role: 'default' },
      { value: 0, role: 'default' },
    ])
    .setAux(aux(0, -1))
    .commit();

  const events2: Array<{ thread: number; action: 'lock' | 'unlock' }> = events;
  const steps = simulateTasLock(2, events2, 3);
  for (const s of steps) {
    rec
      .begin({
        zh: `T${s.thread} ${s.action} (flag=${s.flag})`,
        en: `T${s.thread} ${s.action} (flag=${s.flag})`,
      })
      .setBars(s2bars(s.states))
      .setAux(aux(s.flag, s.holder))
      .commit();
  }
  return rec.build();
}
