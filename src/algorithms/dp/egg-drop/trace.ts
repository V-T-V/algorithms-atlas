// =============================================================================
// 扔鸡蛋 · 录制帧序列
// 用 setBars 展示「每个鸡蛋数 k 当前能分辨的楼层数 dp[k]」，
// 随尝试次数 t 增长；达到目标楼层标 'final'。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { eggDrop, type EggDropHooks } from './impl.ts';

export const DEFAULT_INPUT = { eggs: 2, floors: 100 };

/** 录制演示帧序列。 */
export function buildTrace(input: { eggs: number; floors: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { eggs, floors } = input;

  const dp = new Array<number>(eggs + 1).fill(0);
  let curK = -1;
  let reached = false;

  const renderBars = () => {
    // index 0..eggs：柱高 = dp[k]，展示每个鸡蛋数能分辨的层数
    const vals: number[] = [];
    const roles: Record<number, BarRole> = {};
    for (let k = 0; k <= eggs; k++) {
      vals.push(dp[k]!);
      if (k === eggs) roles[k] = reached ? 'final' : 'pivot';
      else if (k === curK) roles[k] = 'compare';
    }
    return rec.barsFrom(vals, roles, Object.fromEntries(vals.map((_, k) => [k, `k=${k}`])));
  };

  const snapshot = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(renderBars())
      .setAux([
        { label: '目标楼层', value: String(floors), role: 'final' },
        { label: 'k 个鸡蛋可分辨', value: String(dp[eggs]!), role: 'compare' },
      ])
      .commit();
  };

  snapshot({ zh: `${eggs} 个鸡蛋、${floors} 层楼`, en: `${eggs} eggs, ${floors} floors` });

  const hooks: EggDropHooks = {
    onStep: (t, k) => {
      curK = k;
      snapshot({
        zh: `t=${t}：f(${t}, ${k}) = ${dp[k]}`,
        en: `t=${t}: f(${t}, ${k}) = ${dp[k]}`,
      });
    },
    onFound: (t) => {
      reached = true;
      curK = -1;
      snapshot({
        zh: `f(${t}, ${eggs}) ≥ ${floors}，最少 ${t} 次`,
        en: `f(${t}, ${eggs}) ≥ ${floors}, need ${t} tries`,
      });
    },
  };

  const ans = eggDrop(eggs, floors, hooks);
  void ans;
  reached = true;
  rec
    .begin({ zh: `答案：最少 ${ans} 次尝试`, en: `Answer: ${ans} tries minimum` })
    .setBars(renderBars())
    .commit();

  return rec.build();
}
