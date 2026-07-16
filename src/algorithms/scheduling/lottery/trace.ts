// =============================================================================
// 彩票调度 · 录制帧序列
// 用 setBars 展示各进程剩余时间 + 中奖号，用 setAux 展示彩票区间与抽奖记录。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lotterySchedule, mulberry32, type LotteryHooks, type Process } from './impl.ts';

export type { Process };

export const DEFAULT_INPUT: { processes: Process[]; seed: number } = {
  processes: [
    { id: 'A', tickets: 4, burst: 4 },
    { id: 'B', tickets: 2, burst: 3 },
    { id: 'C', tickets: 1, burst: 2 },
  ],
  seed: 42,
};

export interface LotteryTraceInput {
  processes: Process[];
  seed: number;
}

/** 录制演示帧序列。 */
export function buildTrace(input: LotteryTraceInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { processes, seed } = input;

  // 各进程剩余时间
  const remaining = new Map<string, number>();
  for (const p of processes) remaining.set(p.id, p.burst);
  const completed = new Set<string>();

  let winningTicket = -1;
  let winnerId = '';
  const drawHistory: string[] = [];

  const snapshot = (note: { zh: string; en: string }): void => {
    // bars：每个进程剩余时间
    const bars = processes.map((p) => {
      const rem = remaining.get(p.id)!;
      const role: BarRole = completed.has(p.id) ? 'final' : p.id === winnerId ? 'swap' : 'compare';
      return { value: rem, role, label: `${p.id}(t=${p.tickets},rem=${rem})` };
    });

    // 彩票区间（仅存活进程）
    const ranges: Array<{ id: string; lo: number; hi: number }> = [];
    let acc = 0;
    for (const p of processes) {
      if (remaining.get(p.id)! > 0) {
        ranges.push({ id: p.id, lo: acc, hi: acc + p.tickets });
        acc += p.tickets;
      }
    }
    const total = ranges.length > 0 ? ranges[ranges.length - 1]!.hi : 0;

    const aux: Array<{ label: string; value: string; role?: BarRole }> = [
      { label: '种子', value: String(seed), role: 'pivot' as BarRole },
      { label: '总彩票', value: String(total), role: 'frontier' as BarRole },
      {
        label: '中奖号',
        value: winningTicket >= 0 ? String(winningTicket) : '—',
        role: 'swap' as BarRole,
      },
      ...ranges.map((r) => ({
        label: `${r.id} 区间`,
        value: `[${r.lo}, ${r.hi})`,
        role: (r.id === winnerId ? 'swap' : 'default') as BarRole,
      })),
      {
        label: '抽奖记录',
        value: drawHistory.slice(-6).join(', ') || '∅',
        role: 'frontier' as BarRole,
      },
    ];

    rec.begin(note).setBars(bars).setAux(aux).commit();
    winningTicket = -1;
    winnerId = '';
  };

  snapshot({
    zh: `共 ${processes.length} 个进程，总彩票 ${processes.reduce((s, p) => s + p.tickets, 0)}，PRNG 种子 ${seed}`,
    en: `${processes.length} processes, total tickets ${processes.reduce((s, p) => s + p.tickets, 0)}, PRNG seed ${seed}`,
  });

  const hooks: LotteryHooks = {
    onDraw: (_total, winning) => {
      winningTicket = winning;
    },
    onWin: (proc, winning) => {
      winnerId = proc.id;
      winningTicket = winning;
      drawHistory.push(`${winning}→${proc.id}`);
    },
    onRun: (proc) => {
      winnerId = proc.id;
      snapshot({
        zh: `抽中 ${winningTicket}：${proc.id} 运行 1 单位`,
        en: `Drew ${winningTicket}: ${proc.id} runs 1 unit`,
      });
    },
    onComplete: (proc, comp) => {
      remaining.set(proc.id, 0);
      completed.add(proc.id);
      snapshot({
        zh: `${proc.id} 完成（t=${comp}）`,
        en: `${proc.id} complete (t=${comp})`,
      });
    },
  };

  // 注意：onRun 在 burst 减 1 之前触发，这里手动同步 remaining
  const wrappedHooks: LotteryHooks = {
    onDraw: hooks.onDraw,
    onWin: hooks.onWin,
    onRun: (proc, time) => {
      const before = remaining.get(proc.id)!;
      remaining.set(proc.id, before - 1);
      hooks.onRun?.(proc, time);
    },
    onComplete: hooks.onComplete,
  };

  const result = lotterySchedule(processes, seed, wrappedHooks);

  // 终态
  rec
    .begin({
      zh: `调度完成：共抽奖 ${result.draws} 次，所有进程完成`,
      en: `Done: ${result.draws} draws, all processes complete`,
    })
    .setBars(
      processes.map((p) => ({
        value: 0,
        role: 'final' as BarRole,
        label: `${p.id}(done)`,
      })),
    )
    .setAux([
      {
        label: '运行顺序',
        value: result.segments.map((s) => s.id).join(' → '),
        role: 'final' as BarRole,
      },
      { label: '抽奖次数', value: String(result.draws), role: 'frontier' as BarRole },
      {
        label: '各进程份额',
        value: processes
          .map(
            (p) =>
              `${p.id}:${((p.tickets / processes.reduce((s, x) => s + x.tickets, 0)) * 100).toFixed(0)}%`,
          )
          .join(' '),
        role: 'pivot' as BarRole,
      },
    ])
    .commit();

  return rec.build();
}

void mulberry32;
