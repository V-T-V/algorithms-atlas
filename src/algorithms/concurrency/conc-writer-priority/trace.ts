import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateWriterPriority, type WpEvent } from './impl.ts';

export function defaultEvents(): WpEvent[] {
  return [
    { thread: 1, role: 'reader', action: 'acquire' },
    { thread: 0, role: 'writer', action: 'acquire' }, // waits
    { thread: 2, role: 'reader', action: 'acquire' }, // blocked by writer priority
    { thread: 1, role: 'reader', action: 'release' },
    { thread: 0, role: 'writer', action: 'release' },
    { thread: 2, role: 'reader', action: 'release' },
  ];
}

export function buildTrace(opts: { events?: WpEvent[] } = {}): Frame[] {
  const events = opts.events ?? defaultEvents();
  const rec = new TraceRecorder();
  let activeReaders = 0;
  let activeWriter = 0;
  let waitingWriters = 0;
  let waitingReaders = 0;

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars([
        {
          value: activeReaders,
          role: (activeReaders > 0 ? 'final' : 'default') as BarRole,
          label: `读:${activeReaders}`,
        },
        {
          value: activeWriter,
          role: (activeWriter > 0 ? 'swap' : 'default') as BarRole,
          label: `写:${activeWriter}`,
        },
        {
          value: waitingWriters,
          role: (waitingWriters > 0 ? 'warn' : 'default') as BarRole,
          label: `等写:${waitingWriters}`,
        },
        {
          value: waitingReaders,
          role: (waitingReaders > 0 ? 'warn' : 'default') as BarRole,
          label: `等读:${waitingReaders}`,
        },
      ])
      .setAux([
        { label: '活跃', value: `读${activeReaders}/写${activeWriter}`, role: 'final' as BarRole },
        {
          label: '等待',
          value: `写${waitingWriters}/读${waitingReaders}`,
          role: 'warn' as BarRole,
        },
      ])
      .commit();
  };

  snap({ zh: '初始化写者优先锁', en: 'Init writer-priority lock' });

  for (const ev of events) {
    const steps = simulateWriterPriority([ev]);
    const last = steps[steps.length - 1]!;
    activeReaders = last.activeReaders;
    activeWriter = last.activeWriter;
    waitingWriters = last.waitingWriters;
    waitingReaders = last.waitingReaders;
    snap({
      zh: `T${ev.thread}(${ev.role}) ${ev.action}`,
      en: `T${ev.thread}(${ev.role}) ${ev.action}`,
    });
  }

  rec
    .begin({ zh: '完成：写者优先', en: 'Done: writer priority' })
    .setAux([{ label: '结果', value: '写者不被读者饿死', role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
