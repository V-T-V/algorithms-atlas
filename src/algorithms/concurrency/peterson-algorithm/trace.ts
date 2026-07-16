// =============================================================================
// Peterson 算法 · 录制帧序列
// 用 setAux 展示 flag[0]、flag[1]、turn 与当前在临界区的线程；
// 用 setBars 展示两线程的号牌/状态。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  simulatePeterson,
  type PetersonHooks,
  type PetersonStep,
  type PetersonState,
} from './impl.ts';

/** 默认步骤序列：演示两线程交错 lock/unlock，验证互斥。 */
export function defaultSteps(): PetersonStep[] {
  return [
    { thread: 0, action: 'lock' }, // T0 进入
    { thread: 1, action: 'lock' }, // T1 谦让后等待（turn=0，flag[0]=true）
    { thread: 0, action: 'critical' },
    { thread: 0, action: 'unlock' }, // T0 退出，唤醒 T1
    { thread: 1, action: 'critical' },
    { thread: 1, action: 'unlock' },
  ];
}

interface TraceOptions {
  steps: PetersonStep[];
}

const stateLabel = (s: PetersonState['states'][0]): string =>
  s === 'idle' ? '空闲' : s === 'wanting' ? '想进' : s === 'waiting' ? '等待' : '临界区';
const stateRole = (s: PetersonState['states'][0]): BarRole =>
  s === 'critical' ? 'final' : s === 'waiting' ? 'warn' : s === 'wanting' ? 'swap' : 'default';

/** 录制演示帧序列。 */
export function buildTrace(opts: Partial<TraceOptions> = {}): Frame[] {
  const steps = opts.steps ?? defaultSteps();
  const rec = new TraceRecorder();

  let flag: [boolean, boolean] = [false, false];
  let turn: 0 | 1 = 0;
  let inCritical = -1;
  const states: PetersonState['states'] = ['idle', 'idle'];

  const snapshot = (note: { zh: string; en: string }): void => {
    const aux = [
      {
        label: 'flag[0]',
        value: flag[0] ? 'true' : 'false',
        role: (flag[0] ? 'swap' : 'default') as BarRole,
      },
      {
        label: 'flag[1]',
        value: flag[1] ? 'true' : 'false',
        role: (flag[1] ? 'swap' : 'default') as BarRole,
      },
      { label: 'turn', value: String(turn), role: 'pivot' as BarRole },
      {
        label: '临界区',
        value: inCritical === -1 ? '空闲' : `T${inCritical}`,
        role: (inCritical === -1 ? 'default' : 'final') as BarRole,
      },
      { label: 'T0 状态', value: stateLabel(states[0]), role: stateRole(states[0]) },
      { label: 'T1 状态', value: stateLabel(states[1]), role: stateRole(states[1]) },
    ];
    const bars = [
      { value: flag[0] ? 1 : 0, role: stateRole(states[0]), label: `T0:${stateLabel(states[0])}` },
      { value: flag[1] ? 1 : 0, role: stateRole(states[1]), label: `T1:${stateLabel(states[1])}` },
    ];
    rec.begin(note).setAux(aux).setBars(bars).commit();
  };

  snapshot({
    zh: `初始化：flag=[false,false]，turn=0`,
    en: `Init: flag=[false,false], turn=0`,
  });

  const hooks: PetersonHooks = {
    onFlag: (t, f) => {
      flag = [f[0], f[1]];
      states[t] = 'wanting';
    },
    onYield: (t, tn) => {
      turn = tn;
    },
    onWait: (t) => {
      states[t] = 'waiting';
    },
    onEnter: (t) => {
      states[t] = 'critical';
      inCritical = t;
    },
    onLeave: (t) => {
      flag[t] = false;
      states[t] = 'idle';
      if (inCritical === t) inCritical = -1;
    },
  };

  for (const step of steps) {
    simulatePeterson([step], hooks);
    const actionZh =
      step.action === 'lock'
        ? `T${step.thread} 想进并谦让 (turn←${1 - step.thread})`
        : step.action === 'critical'
          ? `T${step.thread} 在临界区`
          : `T${step.thread} 退出 (flag[${step.thread}]←false)`;
    const actionEn =
      step.action === 'lock'
        ? `T${step.thread} wants in and yields (turn←${1 - step.thread})`
        : step.action === 'critical'
          ? `T${step.thread} in critical section`
          : `T${step.thread} leaves (flag[${step.thread}]←false)`;
    snapshot({ zh: actionZh, en: actionEn });
  }

  // 终态
  rec
    .begin({
      zh: `完成：两线程交替进入临界区，全程互斥`,
      en: `Done: two threads alternate, mutual exclusion holds throughout`,
    })
    .setAux([
      { label: 'flag[0]', value: 'false', role: 'final' as BarRole },
      { label: 'flag[1]', value: 'false', role: 'final' as BarRole },
      { label: 'turn', value: String(turn), role: 'default' as BarRole },
      { label: '临界区', value: '空闲', role: 'final' as BarRole },
    ])
    .setBars([
      { value: 0, role: 'final' as BarRole, label: 'T0:完成' },
      { value: 0, role: 'final' as BarRole, label: 'T1:完成' },
    ])
    .commit();

  return rec.build();
}
