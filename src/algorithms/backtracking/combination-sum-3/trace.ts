// =============================================================================
// 组合总和 III · 录制帧序列
// 可视化：setBars 渲染当前 chosen；setAux 展示 remaining/left 与候选范围。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { combinationSum3, type CombinationSum3Hooks } from './impl.ts';

export interface Cs3Input {
  k: number;
  n: number;
}
export const DEFAULT_INPUT: Cs3Input = { k: 3, n: 7 };

/** 录制演示帧序列。 */
export function buildTrace(input: Cs3Input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { k, n } = input;
  const chosen: number[] = [];
  let count = 0;

  const render = (
    note: { zh: string; en: string },
    remaining: number,
    left: number,
    final: boolean,
  ): void => {
    const bars = chosen.map((v) => ({ value: v, role: (final ? 'final' : 'pivot') as BarRole }));
    rec
      .begin(note)
      .setBars(bars)
      .setAux([
        { label: 'chosen', value: chosen.length ? chosen.join(' + ') : '∅', role: 'pivot' },
        { label: '剩余目标 remaining', value: String(remaining), role: 'compare' },
        { label: '还需选 left', value: `${left} / ${k}`, role: 'default' },
        { label: '已找到', value: String(count), role: 'default' },
      ])
      .commit();
  };

  rec
    .begin({
      zh: `从 1..9 选 ${k} 个不同数字使和为 ${n}`,
      en: `Pick ${k} distinct nums from 1..9 summing to ${n}`,
    })
    .setBars([])
    .setAux([
      { label: 'k', value: String(k), role: 'default' },
      { label: 'n', value: String(n), role: 'default' },
    ])
    .commit();

  const hooks: CombinationSum3Hooks = {
    onPick: (_v, c, rem, lft) => {
      chosen.length = 0;
      chosen.push(...c);
      render({ zh: `选取 ${c[c.length - 1]}`, en: `Pick ${c[c.length - 1]}` }, rem, lft, false);
    },
    onPrune: (reason, rem, lft) => {
      const msg = {
        'too-large': '当前数已超剩余目标',
        'too-few': '剩余候选不足以凑够个数',
        'too-small': '剩余目标过小',
      }[reason];
      render({ zh: `剪枝：${msg}`, en: `Prune: ${reason}` }, rem, lft, false);
    },
    onBacktrack: (_v, c) => {
      chosen.length = 0;
      chosen.push(...c);
      render({ zh: `回溯`, en: `Backtrack` }, 0, 0, false);
    },
    onCombination: (combo) => {
      count++;
      chosen.length = 0;
      chosen.push(...combo);
      render(
        {
          zh: `组合 #${count}：${combo.join(' + ')} = ${n}`,
          en: `Combo #${count}: ${combo.join(' + ')} = ${n}`,
        },
        0,
        0,
        true,
      );
    },
  };

  const result = combinationSum3(k, n, hooks);

  rec
    .begin({
      zh: `完成：共 ${result.length} 个组合`,
      en: `Done: ${result.length} combinations`,
    })
    .setBars((result[0] ?? []).map((v) => ({ value: v, role: 'final' as BarRole })))
    .setAux([{ label: '组合总数', value: String(result.length), role: 'final' }])
    .commit();

  return rec.build();
}
