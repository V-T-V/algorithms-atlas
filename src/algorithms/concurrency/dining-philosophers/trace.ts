// =============================================================================
// 哲学家就餐 · 录制帧序列
// 用 setMap 展示每位哲学家的状态 + 叉子占用，演示资源分级避免死锁。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { diningPhilosophers, type DiningHooks, type PhilosopherState } from './impl.ts';

export const DEFAULT_N = 5;
export const DEFAULT_MEALS = 1;

/** 录制演示帧序列。 */
export function buildTrace(n: number = DEFAULT_N, meals: number = DEFAULT_MEALS): Frame[] {
  const rec = new TraceRecorder();
  const states: PhilosopherState[] = new Array(n).fill('thinking');
  const forkHeld: number[] = new Array(n).fill(-1); // 持有者，-1 = 空闲
  let active: number = -1;
  let activeFork: number = -1;

  const stateLabel = (s: PhilosopherState): string =>
    s === 'thinking' ? '思考' : s === 'hungry' ? '饥饿' : '就餐';

  const stateRole = (s: PhilosopherState): BarRole =>
    s === 'thinking' ? 'default' : s === 'hungry' ? 'warn' : 'final';

  const snapshot = (note: { zh: string; en: string }): void => {
    // 哲学家 map
    const entries = Array.from({ length: n }, (_, i) => {
      const isMe = i === active;
      let role: BarRole = stateRole(states[i]!);
      if (isMe && states[i] !== 'eating') role = 'swap';
      return {
        key: `P${i}`,
        value: stateLabel(states[i]!),
        role,
      };
    });
    // 叉子状态拼到 aux
    const forkAux = Array.from({ length: n }, (_, f) => ({
      label: `fork ${f}`,
      value: forkHeld[f]! === -1 ? '空闲' : `P${forkHeld[f]!}`,
      role: (f === activeFork ? 'swap' : 'default') as BarRole,
    }));

    rec.begin(note).setMap(entries).setAux(forkAux).commit();
    activeFork = -1;
  };

  snapshot({
    zh: `${n} 位哲学家围坐，每人 ${meals} 餐。资源分级：先拿编号小的叉子`,
    en: `${n} philosophers seated, ${meals} meal(s) each. Resource ordering: pick the lower-numbered fork first`,
  });

  const hooks: DiningHooks = {
    onHungry: (i) => {
      active = i;
      states[i] = 'hungry';
      snapshot({
        zh: `P${i} 饿了，想拿叉子`,
        en: `P${i} is hungry, wants forks`,
      });
    },
    onPick: (i, fork) => {
      active = i;
      forkHeld[fork] = i;
      activeFork = fork;
      snapshot({
        zh: `P${i} 拿起叉子 ${fork}`,
        en: `P${i} picks up fork ${fork}`,
      });
    },
    onEat: (i) => {
      active = i;
      states[i] = 'eating';
      snapshot({
        zh: `P${i} 拿到两把叉子，开始就餐`,
        en: `P${i} has both forks, starts eating`,
      });
    },
    onPut: (i, fork) => {
      active = i;
      forkHeld[fork] = -1;
      activeFork = fork;
      snapshot({
        zh: `P${i} 放下叉子 ${fork}`,
        en: `P${i} puts down fork ${fork}`,
      });
    },
    onThink: (i) => {
      active = i;
      states[i] = 'thinking';
      snapshot({
        zh: `P${i} 回到思考`,
        en: `P${i} returns to thinking`,
      });
    },
  };

  diningPhilosophers(n, meals, hooks);

  // 终态：全部思考（已吃完）
  rec
    .begin({
      zh: `全部完成：每人就餐 ${meals} 次，全程无死锁`,
      en: `All done: each ate ${meals} time(s), no deadlock`,
    })
    .setMap(
      Array.from({ length: n }, (_, i) => ({
        key: `P${i}`,
        value: '完成',
        role: 'final' as BarRole,
      })),
    )
    .setAux(
      Array.from({ length: n }, (_, f) => ({
        label: `fork ${f}`,
        value: '空闲',
        role: 'final' as BarRole,
      })),
    )
    .commit();

  return rec.build();
}
