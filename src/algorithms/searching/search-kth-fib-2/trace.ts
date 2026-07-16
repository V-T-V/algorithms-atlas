import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { kthFibonacci2, type Fib2Hooks } from './impl.ts';

export const DEFAULT_INPUT = 10;

export function buildTrace(k: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const values: number[] = [0, 1];
  rec
    .begin({ zh: `计算 F(0)=0, F(1)=1`, en: `Start F(0)=0, F(1)=1` })
    .setBars(rec.barsFrom(values))
    .commit();
  const hooks: Fib2Hooks = {
    onStep: (kk, value) => {
      values.push(value);
      rec
        .begin({ zh: `F(${kk}) = ${value}`, en: `F(${kk}) = ${value}` })
        .setBars(rec.barsFrom(values))
        .commit();
    },
  };
  kthFibonacci2(k, hooks);
  return rec.build();
}
