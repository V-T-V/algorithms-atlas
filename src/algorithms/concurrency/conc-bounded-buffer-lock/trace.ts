import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateBoundedBuffer, type BbEvent } from './impl.ts';

export function defaultEvents(): BbEvent[] {
  return [{ who: 'P' }, { who: 'P' }, { who: 'P' }, { who: 'C' }, { who: 'C' }, { who: 'P' }];
}

export function buildTrace(opts: { events?: BbEvent[]; capacity?: number } = {}): Frame[] {
  const events = opts.events ?? defaultEvents();
  const capacity = opts.capacity ?? 3;
  const rec = new TraceRecorder();
  let buffer: number[] = [];
  let empty = capacity;
  let full = 0;

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(
        Array.from({ length: capacity }, (_, i) => ({
          value: i < buffer.length ? 3 : 1,
          role: (i < buffer.length ? 'final' : 'default') as BarRole,
          label: i < buffer.length ? `${buffer[i]}` : '_',
        })),
      )
      .setAux([
        { label: 'empty', value: empty.toString(), role: 'compare' as BarRole },
        { label: 'full', value: full.toString(), role: 'final' as BarRole },
        {
          label: 'buffer',
          value: buffer.length ? buffer.join(',') : '∅',
          role: 'final' as BarRole,
        },
      ])
      .commit();
  };

  snap({ zh: `初始化容量 ${capacity}`, en: `Init capacity ${capacity}` });

  for (const ev of events) {
    const steps = simulateBoundedBuffer([ev], capacity);
    const last = steps[steps.length - 1]!;
    buffer = [...last.buffer];
    empty = last.empty;
    full = last.full;
    snap({ zh: `${ev.who} 操作`, en: `${ev.who} op` });
  }

  rec
    .begin({ zh: `完成：empty=${empty} full=${full}`, en: `Done: empty=${empty} full=${full}` })
    .setAux([{ label: '结果', value: `最终 full=${full}`, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
