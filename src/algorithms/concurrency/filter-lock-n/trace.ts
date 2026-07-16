// =============================================================================
// n 线程过滤锁 · 录制帧序列
// 用 setAux 展示 level[] / victim[] / 临界区 / 各线程阶段。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateFilterLock, type FilterLockHooks, type FilterLockStep } from './impl.ts';

/** 默认演示：3 个线程，T0 进入临界区、T1/T2 在第 1 层等待。 */
export function defaultSteps(): { n: number; steps: FilterLockStep[] } {
  const n = 3;
  return {
    n,
    steps: [
      { thread: 0, action: 'enterLevel' }, // T0 -> level 1
      { thread: 0, action: 'enterLevel' }, // T0 -> level 2 = critical
      { thread: 1, action: 'enterLevel' }, // T1 -> level 1, victim=1, 等
      { thread: 2, action: 'enterLevel' }, // T2 -> level 1, victim=2
      { thread: 0, action: 'critical' },
      { thread: 0, action: 'exit' }, // T0 离开
      { thread: 1, action: 'enterLevel' }, // T1 重试 -> 通过
      { thread: 1, action: 'enterLevel' }, // T1 -> level 2 = critical
      { thread: 1, action: 'exit' },
      { thread: 2, action: 'enterLevel' },
      { thread: 2, action: 'enterLevel' },
      { thread: 2, action: 'exit' },
    ],
  };
}

interface TraceOptions {
  n: number;
  steps: FilterLockStep[];
}

export function buildTrace(opts: Partial<TraceOptions> = {}): Frame[] {
  const def = defaultSteps();
  const n = opts.n ?? def.n;
  const steps = opts.steps ?? def.steps;
  const rec = new TraceRecorder();

  const level = new Array<number>(n).fill(0);
  const victim = new Array<number>(n).fill(-1);
  const phase = new Array<string>(n).fill('idle');
  let inCritical: number[] = [];

  const phaseRole = (p: string): BarRole =>
    p === 'critical' ? 'final' : p === 'climbing' ? 'swap' : 'default';

  const snapshot = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setAux([
        ...level.map((lv, i) => ({
          label: `level[${i}]`,
          value: String(lv),
          role: (lv > 0 ? 'compare' : 'default') as BarRole,
        })),
        ...victim.slice(1).map((v, i) => ({
          label: `victim[${i + 1}]`,
          value: v === -1 ? '-' : `T${v}`,
          role: 'pivot' as BarRole,
        })),
        {
          label: '临界区',
          value: inCritical.length === 0 ? '空闲' : inCritical.map((t) => `T${t}`).join(','),
          role: (inCritical.length === 0 ? 'default' : 'final') as BarRole,
        },
        ...phase.map((p, i) => ({
          label: `T${i} 阶段`,
          value: p,
          role: phaseRole(p),
        })),
      ])
      .setBars(
        level.map((lv, i) => ({
          value: lv,
          role: phaseRole(phase[i]!),
          label: `T${i}:L${lv}`,
        })),
      )
      .commit();
  };

  snapshot({ zh: `初始化：${n} 个线程，level 全 0`, en: `Init: ${n} threads, all level 0` });

  const hooks: FilterLockHooks = {
    onLevel: (t, L) => {
      level[t] = L;
      phase[t] = 'climbing';
    },
    onVictim: (_t, L) => {
      victim[L] = _t;
    },
    onWait: (t, L, conflict) => {
      phase[t] = 'climbing';
      snapshot({
        zh: `T${t} 在层 ${L} 等待（与 T${conflict.join(',')} 冲突，victim=${t}）`,
        en: `T${t} waits at level ${L} (conflict with T${conflict.join(',')}, victim=${t})`,
      });
    },
    onEnter: (t) => {
      phase[t] = 'critical';
      if (!inCritical.includes(t)) inCritical.push(t);
    },
    onLeave: (t) => {
      level[t] = 0;
      phase[t] = 'idle';
      inCritical = inCritical.filter((x) => x !== t);
    },
  };

  for (const step of steps) {
    simulateFilterLock(n, [step], hooks);
    const actionZh =
      step.action === 'enterLevel'
        ? `T${step.thread} 尝试进入下一层`
        : step.action === 'critical'
          ? `T${step.thread} 在临界区`
          : `T${step.thread} 离开临界区`;
    const actionEn =
      step.action === 'enterLevel'
        ? `T${step.thread} tries next level`
        : step.action === 'critical'
          ? `T${step.thread} in critical section`
          : `T${step.thread} leaves critical section`;
    snapshot({ zh: actionZh, en: actionEn });
  }

  rec
    .begin({
      zh: '完成：所有线程依次进入临界区，全程互斥',
      en: 'Done: threads enter critical section one by one, mutual exclusion holds',
    })
    .setAux([
      ...level.map((_lv, i) => ({ label: `level[${i}]`, value: '0', role: 'final' as BarRole })),
      {
        label: '临界区',
        value: '空闲',
        role: 'final' as BarRole,
      },
    ])
    .setBars(level.map((_lv, i) => ({ value: 0, role: 'final' as BarRole, label: `T${i}:done` })))
    .commit();

  return rec.build();
}
