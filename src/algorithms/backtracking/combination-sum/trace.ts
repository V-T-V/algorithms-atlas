// =============================================================================
// 组合总和 · 录制帧序列
// 用 setArray 渲染候选集（高亮「正在考虑」的候选），用 setAux 展示当前组合
// 与剩余目标，逐步呈现回溯的「选 / 剪枝 / 撤销 / 找到」过程。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { combinationsum, type CombinationSumHooks } from './impl.ts';

export const DEFAULT_INPUT = { candidates: [2, 3, 6, 7], target: 7 };

type Ctx = { value: number; index: number };

/** 录制演示帧序列。 */
export function buildTrace(
  input: { candidates: number[]; target: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { candidates, target } = input;
  // 渲染用候选（与 impl 排序一致：升序）
  const sortedVals = [...candidates].filter((v) => Number.isInteger(v) && v > 0).sort((a, b) => a - b);
  const n = sortedVals.length;

  // 当前组合 + 剩余目标（由 hook 维护）
  const combo: number[] = [];
  let remain = target;
  let highlightIdx: number | null = null; // 当前正在考虑的候选（排序后下标）
  let resultFlash = false;

  const idxOfValue = (v: number): number => sortedVals.indexOf(v);

  const render = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = new Array(n).fill('default');
    if (highlightIdx !== null && !resultFlash) roles[highlightIdx] = 'pivot';
    rec
      .begin(note)
      .setArray([...sortedVals], roles, highlightIdx !== null && !resultFlash ? [{ index: highlightIdx, label: 'cur' }] : [])
      .setAux([
        { label: '目标', value: String(target), role: 'compare' },
        { label: '剩余', value: String(remain), role: remain === 0 ? 'final' : 'pivot' },
        { label: '当前组合', value: combo.length ? `[${combo.join(',')}]` : '∅', role: resultFlash ? 'final' : 'frontier' },
      ])
      .commit();
  };

  rec
    .begin({
      zh: `候选 [${sortedVals.join(', ')}]，目标 ${target}。可重复选，求和为目标的组合。`,
      en: `Candidates [${sortedVals.join(', ')}], target ${target}. Pick with repetition to sum to target.`,
    })
    .setArray([...sortedVals], new Array(n).fill('default'), [])
    .setAux([{ label: '目标', value: String(target), role: 'compare' }])
    .commit();

  const hooks: CombinationSumHooks = {
    onPick: (value, _index, nextRemain) => {
      combo.push(value);
      remain = nextRemain;
      highlightIdx = idxOfValue(value);
      render({
        zh: `选 ${value}：组合 [${combo.join(',')}]，剩余 ${remain}`,
        en: `Pick ${value}: combo [${combo.join(',')}], remain ${remain}`,
      });
    },
    onSkip: (value, _index, curRemain) => {
      highlightIdx = idxOfValue(value);
      remain = curRemain;
      render({
        zh: `${value} > 剩余 ${remain}，剪枝（后续更大者亦跳过）`,
        en: `${value} > remain ${remain}: prune (later larger ones skipped too)`,
      });
    },
    onBacktrack: (value, _index) => {
      combo.pop();
      remain = target - combo.reduce((s, x) => s + x, 0);
      highlightIdx = idxOfValue(value);
      render({
        zh: `撤销 ${value}，回溯。组合 [${combo.length ? combo.join(',') : '∅'}]`,
        en: `Undo ${value}, backtrack. combo [${combo.length ? combo.join(',') : '∅'}]`,
      });
    },
    onResult: (c) => {
      resultFlash = true;
      remain = 0;
      rec
        .begin({
          zh: `找到组合：[${c.join(',')}]`,
          en: `Found combo: [${c.join(',')}]`,
        })
        .setArray([...sortedVals], new Array(n).fill('default'), [])
        .setAux([
          { label: '目标', value: String(target), role: 'compare' },
          { label: '剩余', value: '0', role: 'final' },
          { label: '当前组合', value: `[${c.join(',')}]`, role: 'final' },
        ])
        .commit();
      resultFlash = false;
    },
  };

  const result = combinationsum(candidates, target, hooks);

  // 终态：列出全部组合
  rec
    .begin({
      zh: `完成：共 ${result.length} 个组合`,
      en: `Done: ${result.length} combination(s)`,
    })
    .setArray([...sortedVals], new Array(n).fill('final'), [])
    .setAux([
      { label: '组合数', value: String(result.length), role: 'final' },
      {
        label: '全部组合',
        value: result.length ? result.map((c) => `[${c.join(',')}]`).join(' ') : '∅',
        role: 'frontier',
      },
    ])
    .commit();

  return rec.build();
}
