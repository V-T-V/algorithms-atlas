// 多级反馈队列 (MLFQ) · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mlfq, type MLFQProcess } from './impl.ts';

export const DEFAULT_INPUT = {
  procs: [
    { pid: 'P1', arrival: 0, burst: 8 },
    { pid: 'P2', arrival: 0, burst: 4 },
    { pid: 'P3', arrival: 0, burst: 2 },
  ] as MLFQProcess[],
  levels: 3,
  quanta: [2, 4, 8],
};

export function buildTrace(
  input: { procs: MLFQProcess[]; levels?: number; quanta?: number[] } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `MLFQ（${input.levels ?? 3} 级）`, en: `MLFQ (${input.levels ?? 3} levels)` })
    .setBars(input.procs.map((p) => ({ value: p.burst, role: 'pivot' as BarRole, label: p.pid })))
    .setAux(
      input.quanta!.map((q, i) => ({
        label: `Q${i}`,
        value: String(q),
        role: 'frontier' as BarRole,
      })),
    )
    .commit();

  const hooks = {
    onDispatch: (pid: string, level: number, run: number, time: number) => {
      rec
        .begin({
          zh: `t=${time} ${pid}@Q${level} 跑 ${run}`,
          en: `t=${time} ${pid}@Q${level} run ${run}`,
        })
        .setBars(
          input.procs.map((p) => ({
            value: p.burst,
            role: (p.pid === pid ? 'compare' : 'default') as BarRole,
            label: p.pid,
          })),
        )
        .setAux([{ label: '运行', value: `${pid}@Q${level}`, role: 'final' as BarRole }])
        .commit();
    },
    onDemote: (pid: string, from: number, to: number) => {
      rec
        .begin({ zh: `${pid} 降级 Q${from}→Q${to}`, en: `${pid} demote Q${from}→Q${to}` })
        .setAux([{ label: '降级', value: `${pid} Q${from}→Q${to}`, role: 'warn' as BarRole }])
        .commit();
    },
  };

  const result = mlfq(input.procs, input.levels ?? 3, input.quanta ?? [2, 4, 8], hooks);

  rec
    .begin({ zh: `平均等待 ${result.waiting.P1 !== undefined ? '完成' : ''}`, en: `Done` })
    .setBars(
      input.procs.map((p) => ({
        value: result.completion[p.pid]!,
        role: 'sorted' as BarRole,
        label: p.pid,
      })),
    )
    .commit();

  return rec.build();
}
