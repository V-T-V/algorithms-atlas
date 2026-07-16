import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateBridge, type BridgeEvent } from './impl.ts';

export function defaultEvents(): BridgeEvent[] {
  return [
    { car: 1, dir: 'N', action: 'arrive' },
    { car: 2, dir: 'N', action: 'arrive' },
    { car: 3, dir: 'S', action: 'arrive' }, // 等待
    { car: 1, dir: 'N', action: 'exit' },
    { car: 2, dir: 'N', action: 'exit' },
    // 桥空，方向切到 S
    { car: 3, dir: 'S', action: 'exit' },
  ];
}

export function buildTrace(opts: { events?: BridgeEvent[]; maxPerDir?: number } = {}): Frame[] {
  const events = opts.events ?? defaultEvents();
  const maxPerDir = opts.maxPerDir ?? 3;
  const rec = new TraceRecorder();
  let currentDir: string | null = null;
  let onBridge = 0;
  let waitingN = 0;
  let waitingS = 0;

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars([
        {
          value: onBridge,
          role: (onBridge > 0 ? 'final' : 'default') as BarRole,
          label: `桥上:${onBridge}`,
        },
        {
          value: waitingN,
          role: (waitingN > 0 ? 'warn' : 'default') as BarRole,
          label: `等N:${waitingN}`,
        },
        {
          value: waitingS,
          role: (waitingS > 0 ? 'warn' : 'default') as BarRole,
          label: `等S:${waitingS}`,
        },
      ])
      .setAux([
        {
          label: '当前方向',
          value: currentDir ?? '空',
          role: (currentDir ? 'final' : 'default') as BarRole,
        },
        { label: '桥上', value: onBridge.toString(), role: 'final' as BarRole },
      ])
      .commit();
  };

  snap({ zh: '初始化窄桥', en: 'Init narrow bridge' });

  const steps = simulateBridge(events, maxPerDir);
  for (const s of steps) {
    currentDir = s.currentDir;
    onBridge = s.onBridge;
    waitingN = s.waitingN;
    waitingS = s.waitingS;
    snap({ zh: `车${s.car} ${s.action}`, en: `car${s.car} ${s.action}` });
  }

  rec
    .begin({ zh: '完成：单向交替通行', en: 'Done: alternating one-way' })
    .setAux([{ label: '结果', value: '无饥饿', role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
