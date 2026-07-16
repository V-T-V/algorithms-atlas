// 顺序锁 · 实现
export interface SeqEvent {
  thread: number;
  action: 'write-begin' | 'write-end' | 'read';
}
export interface SeqHooks {
  onWriteBegin?: (t: number, seq: number) => void;
  onWriteEnd?: (t: number, seq: number) => void;
  onReadRetry?: (t: number, seq: number) => void;
  onReadOk?: (t: number, seq: number, value: number) => void;
}
export interface SeqStep {
  thread: number;
  seq: number;
  value: number;
}
export function simulateSeqLock(events: SeqEvent[], hooks: SeqHooks = {}): SeqStep[] {
  let seq = 0;
  let value = 0;
  const steps: SeqStep[] = [];
  for (const ev of events) {
    if (ev.action === 'write-begin') {
      seq++;
      hooks.onWriteBegin?.(ev.thread, seq);
    } else if (ev.action === 'write-end') {
      value++;
      seq++;
      hooks.onWriteEnd?.(ev.thread, seq);
    } else {
      // 读：若 seq 奇则重试
      if (seq % 2 === 1) {
        hooks.onReadRetry?.(ev.thread, seq);
        seq++;
        hooks.onReadOk?.(ev.thread, seq, value);
      } else hooks.onReadOk?.(ev.thread, seq, value);
    }
    steps.push({ thread: ev.thread, seq, value });
  }
  return steps;
}
