import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateProducerConsumer, type PcEvent } from './impl.ts';

export function defaultEvents(): PcEvent[] {
  return [
    { who: 'producer', action: 'produce' },
    { who: 'producer', action: 'produce' },
    { who: 'consumer', action: 'consume' },
    { who: 'consumer', action: 'consume' },
    { who: 'consumer', action: 'consume' }, // 空了，阻塞
    { who: 'producer', action: 'produce' }, // 唤醒消费者
  ];
}

export function buildTrace(opts: { events?: PcEvent[]; capacity?: number } = {}): Frame[] {
  const events = opts.events ?? defaultEvents();
  const capacity = opts.capacity ?? 3;
  const rec = new TraceRecorder();
  let queue: number[] = [];
  let blockedProducers = 0;
  let blockedConsumers = 0;
  let totalProduced = 0;
  let totalConsumed = 0;

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars([
        {
          value: queue.length,
          role: (queue.length > 0 ? 'final' : 'default') as BarRole,
          label: `队列:${queue.length}/${capacity}`,
        },
        {
          value: blockedProducers,
          role: (blockedProducers > 0 ? 'warn' : 'default') as BarRole,
          label: `阻塞生产:${blockedProducers}`,
        },
        {
          value: blockedConsumers,
          role: (blockedConsumers > 0 ? 'warn' : 'default') as BarRole,
          label: `阻塞消费:${blockedConsumers}`,
        },
      ])
      .setAux([
        { label: '队列', value: queue.length ? queue.join(',') : '∅', role: 'final' as BarRole },
        {
          label: '生产/消费',
          value: `${totalProduced}/${totalConsumed}`,
          role: 'compare' as BarRole,
        },
      ])
      .commit();
  };

  snap({ zh: '初始化有界队列', en: 'Init bounded queue' });

  for (const ev of events) {
    const steps = simulateProducerConsumer([ev], capacity);
    const last = steps[steps.length - 1]!;
    queue = [...last.queue];
    blockedProducers = last.blockedProducers;
    blockedConsumers = last.blockedConsumers;
    totalProduced = last.totalProduced;
    totalConsumed = last.totalConsumed;
    snap({ zh: `${ev.who} ${ev.action}`, en: `${ev.who} ${ev.action}` });
  }

  rec
    .begin({
      zh: `完成：生产 ${totalProduced} 消费 ${totalConsumed}`,
      en: `Done: produced ${totalProduced} consumed ${totalConsumed}`,
    })
    .setAux([
      { label: '统计', value: `P=${totalProduced} C=${totalConsumed}`, role: 'final' as BarRole },
    ])
    .commit();
  return rec.build();
}
