// Per-CPU 计数器 · 实现
export interface PcEvent {
  cpu: number;
  action: 'inc' | 'dec' | 'sum';
  delta?: number;
}
export interface PcHooks {
  onInc?: (cpu: number, total: number) => void;
  onSum?: (total: number) => void;
}
export interface PcStep {
  cpu: number;
  perCpu: number[];
}
export function simulatePerCpu(nCpu: number, events: PcEvent[], hooks: PcHooks = {}): PcStep[] {
  const perCpu: number[] = new Array(nCpu).fill(0);
  const steps: PcStep[] = [];
  for (const ev of events) {
    if (ev.action === 'inc') {
      perCpu[ev.cpu]! += ev.delta ?? 1;
      hooks.onInc?.(
        ev.cpu,
        perCpu.reduce((a, b) => a + b, 0),
      );
    } else if (ev.action === 'dec') {
      perCpu[ev.cpu]! -= ev.delta ?? 1;
      hooks.onInc?.(
        ev.cpu,
        perCpu.reduce((a, b) => a + b, 0),
      );
    } else {
      const total = perCpu.reduce((a, b) => a + b, 0);
      hooks.onSum?.(total);
    }
    steps.push({ cpu: ev.cpu, perCpu: [...perCpu] });
  }
  return steps;
}
