import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateConditionVariable, type CvEvent } from './impl.ts';

export function defaultEvents(): CvEvent[] {
  return [
    { thread: 1, action: 'consume' }, // buffer 空 -> 等待
    { thread: 0, action: 'produce' }, // 唤醒 T1
    { thread: 2, action: 'consume' }, // 消费成功
  ];
}

export function buildTrace(opts: { events?: CvEvent[] } = {}): Frame[] {
  const events = opts.events ?? defaultEvents();
  const rec = new TraceRecorder();
  let buffer: number[] = [];
  let waiting: number[] = [];
  let signalCount = 0;

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars([
        {
          value: buffer.length,
          role: (buffer.length > 0 ? 'final' : 'default') as BarRole,
          label: `buffer:${buffer.length}`,
        },
        {
          value: waiting.length,
          role: (waiting.length > 0 ? 'warn' : 'default') as BarRole,
          label: `wait:${waiting.length}`,
        },
      ])
      .setAux([
        {
          label: '缓冲区',
          value: buffer.length ? buffer.join(',') : '∅',
          role: 'final' as BarRole,
        },
        {
          label: '等待线程',
          value: waiting.length ? waiting.map((t) => `T${t}`).join(',') : '∅',
          role: 'warn' as BarRole,
        },
        { label: '信号计数', value: signalCount.toString(), role: 'compare' as BarRole },
      ])
      .commit();
  };

  snap({ zh: '初始化条件变量 + 缓冲区', en: 'Init condition variable + buffer' });

  for (const ev of events) {
    const steps = simulateConditionVariable([ev]);
    const last = steps[steps.length - 1]!;
    buffer = [...last.buffer];
    waiting = [...last.waiting];
    signalCount = last.signalCount;
    snap({ zh: `T${ev.thread} ${ev.action}`, en: `T${ev.thread} ${ev.action}` });
  }

  rec
    .begin({ zh: `完成：共 ${signalCount} 次 signal`, en: `Done: ${signalCount} signals` })
    .setAux([{ label: '结果', value: `信号 ${signalCount} 次`, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
