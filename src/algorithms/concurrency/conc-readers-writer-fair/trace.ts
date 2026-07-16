import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateRwFair, type RwEvent } from './impl.ts';

export const DEFAULT_THREADS = 3; // T0 writer, T1/T2 readers
export function defaultEvents(): RwEvent[] {
  return [
    { thread: 1, role: 'reader', action: 'acquire' },
    { thread: 0, role: 'writer', action: 'acquire' }, // waits
    { thread: 2, role: 'reader', action: 'acquire' }, // waits behind writer (fair)
    { thread: 1, role: 'reader', action: 'release' },
    { thread: 0, role: 'writer', action: 'release' },
    { thread: 2, role: 'reader', action: 'release' },
  ];
}

export function buildTrace(opts: { events?: RwEvent[] } = {}): Frame[] {
  const events = opts.events ?? defaultEvents();
  const rec = new TraceRecorder();
  let activeReaders = 0;
  let activeWriter = 0;
  let waiters: Array<{ thread: number; role: string }> = [];

  const snap = (note: { zh: string; en: string }): void => {
    const max = Math.max(1, activeReaders, activeWriter);
    rec
      .begin(note)
      .setBars([
        {
          value: activeReaders,
          role: (activeReaders > 0 ? 'final' : 'default') as BarRole,
          label: `读者:${activeReaders}`,
        },
        {
          value: activeWriter,
          role: (activeWriter > 0 ? 'swap' : 'default') as BarRole,
          label: `写者:${activeWriter}`,
        },
        {
          value: waiters.length,
          role: (waiters.length > 0 ? 'warn' : 'default') as BarRole,
          label: `等待:${waiters.length}`,
        },
      ])
      .setAux([
        { label: '活跃读者', value: activeReaders.toString(), role: 'final' as BarRole },
        { label: '活跃写者', value: activeWriter === 1 ? '1' : '0', role: 'swap' as BarRole },
        {
          label: '等待队列',
          value: waiters.length
            ? waiters.map((w) => `T${w.thread}(${w.role[0]!.toUpperCase()})`).join('→')
            : '∅',
          role: 'warn' as BarRole,
        },
      ])
      .commit();
    void max;
  };

  snap({ zh: '初始化公平读写锁', en: 'Init fair RW lock' });

  for (const ev of events) {
    const steps = simulateRwFair([ev]);
    const last = steps[steps.length - 1]!;
    activeReaders = last.activeReaders;
    activeWriter = last.activeWriter;
    waiters = [...last.waiters];
    snap({
      zh: `T${ev.thread}(${ev.role}) ${ev.action}`,
      en: `T${ev.thread}(${ev.role}) ${ev.action}`,
    });
  }

  rec
    .begin({
      zh: '完成：读者并发、写者独占且公平',
      en: 'Done: readers concurrent, writer exclusive and fair',
    })
    .setAux([{ label: '结果', value: '无饥饿', role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
