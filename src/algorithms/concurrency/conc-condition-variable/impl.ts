// 条件变量 · 实现（模拟 wait/signal/notifyAll）

export interface CvStep {
  thread: number;
  action: string;
  buffer: number[];
  waiting: number[];
  signalCount: number;
}

export interface CvEvent {
  thread: number;
  action: 'produce' | 'consume' | 'wait' | 'signal' | 'signalAll';
}

export interface CvHooks {
  onWait?: (thread: number) => void;
  onSignal?: (thread: number, woken: number) => void;
  onProduce?: (thread: number, item: number) => void;
  onConsume?: (thread: number, item: number) => void;
}

export function simulateConditionVariable(
  events: CvEvent[],
  _capacity = 3,
  hooks: CvHooks = {},
): CvStep[] {
  const buffer: number[] = [];
  const waiting: number[] = [];
  let signalCount = 0;
  let itemId = 0;
  const steps: CvStep[] = [];

  for (const ev of events) {
    if (ev.action === 'produce') {
      const item = itemId++;
      buffer.push(item);
      hooks.onProduce?.(ev.thread, item);
      // produce 后自动 signal 一个等待者
      if (waiting.length > 0) {
        const w = waiting.shift()!;
        hooks.onSignal?.(ev.thread, w);
        signalCount++;
      }
    } else if (ev.action === 'consume') {
      if (buffer.length > 0) {
        const item = buffer.shift()!;
        hooks.onConsume?.(ev.thread, item);
      } else {
        waiting.push(ev.thread);
        hooks.onWait?.(ev.thread);
      }
    } else if (ev.action === 'wait') {
      waiting.push(ev.thread);
      hooks.onWait?.(ev.thread);
    } else if (ev.action === 'signal') {
      if (waiting.length > 0) {
        const w = waiting.shift()!;
        hooks.onSignal?.(ev.thread, w);
        signalCount++;
      }
    } else if (ev.action === 'signalAll') {
      const n = waiting.length;
      while (waiting.length > 0) {
        const w = waiting.shift()!;
        hooks.onSignal?.(ev.thread, w);
        signalCount++;
      }
      void n;
    }
    steps.push({
      thread: ev.thread,
      action: ev.action,
      buffer: [...buffer],
      waiting: [...waiting],
      signalCount,
    });
  }
  return steps;
}
