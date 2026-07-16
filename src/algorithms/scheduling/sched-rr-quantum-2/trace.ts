// 时间片轮转（可变量子）· 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { roundRobinQuantum, type RRProcess } from './impl.ts';

export const DEFAULT_INPUT = {
  procs: [
    { pid: 'P1', arrival: 0, burst: 5, quantum: 2 },
    { pid: 'P2', arrival: 0, burst: 3, quantum: 2 },
    { pid: 'P3', arrival: 1, burst: 4, quantum: 3 },
  ] as RRProcess[],
};

export function buildTrace(input: { procs: RRProcess[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const pids = input.procs.map((p) => p.pid);

  rec
    .begin({
      zh: `RR（可变量子）：${pids.join(', ')}`,
      en: `RR (variable quantum): ${pids.join(', ')}`,
    })
    .setBars(input.procs.map((p) => ({ value: p.burst, role: 'pivot' as BarRole, label: p.pid })))
    .commit();

  const hooks = {
    onDispatch: (pid: string, run: number, rem: number, time: number) => {
      rec
        .begin({
          zh: `t=${time} ${pid} 运行 ${run}（剩 ${rem}）`,
          en: `t=${time} ${pid} runs ${run} (rem ${rem})`,
        })
        .setBars(
          input.procs.map((p) => ({
            value: p.pid === pid ? rem : p.burst,
            role: (p.pid === pid ? 'compare' : 'default') as BarRole,
            label: p.pid,
          })),
        )
        .setAux([{ label: '当前', value: pid, role: 'final' as BarRole }])
        .commit();
    },
    onComplete: (pid: string, ct: number) => {
      rec
        .begin({ zh: `${pid} 完成 @ t=${ct}`, en: `${pid} done @ t=${ct}` })
        .setAux([{ label: '完成', value: `${pid}@${ct}`, role: 'final' as BarRole }])
        .commit();
    },
  };

  const result = roundRobinQuantum(input.procs, hooks);

  rec
    .begin({
      zh: `平均等待 ${result.avgWaiting.toFixed(2)}`,
      en: `Avg wait ${result.avgWaiting.toFixed(2)}`,
    })
    .setBars(
      pids.map((pid) => ({ value: result.waiting[pid]!, role: 'sorted' as BarRole, label: pid })),
    )
    .commit();

  return rec.build();
}
