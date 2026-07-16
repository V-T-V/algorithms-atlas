import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { EventStore } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const es = new EventStore<{ balance: number }>(
    { balance: 0 },
    (s, e) => {
      if (e.type === 'deposit') return { balance: s.balance + (e.payload.amount as number) };
      if (e.type === 'withdraw') return { balance: s.balance - (e.payload.amount as number) };
      return s;
    },
    {
      onAppend: (t, n) =>
        rec
          .begin({ zh: `append ${t} (#${n})`, en: `append ${t} (#${n})` })
          .setAux([{ label: t, value: String(n), role: 'compare' as BarRole }])
          .commit(),
      onReplay: (c) =>
        rec
          .begin({ zh: `replay ${c} events`, en: '' })
          .setAux([{ label: 'events', value: String(c), role: 'final' as BarRole }])
          .commit(),
    },
  );
  es.append('deposit', { amount: 100 }, 1);
  es.append('withdraw', { amount: 30 }, 2);
  es.append('deposit', { amount: 50 }, 3);
  void es.currentState();
  return rec.build();
}
