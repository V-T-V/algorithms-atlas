// =============================================================================
// 火柴拼正方形 · 录制帧序列
// 可视化：setBars 渲染 4 条边当前长度（与 side 比较）；setAux 展示进度。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { matchsticksToSquare, type MatchsticksToSquareHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 1, 2, 2, 2];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const total = input.reduce((a, b) => a + b, 0);
  const side = total % 4 === 0 ? total / 4 : -1;
  const sides: number[] = [0, 0, 0, 0];

  rec
    .begin({
      zh: `${input.length} 根火柴 [${input.join(', ')}]，周长=${total}，边长=${side}`,
      en: `${input.length} sticks [${input.join(', ')}], perimeter=${total}, side=${side}`,
    })
    .setBars([0, 0, 0, 0].map(() => ({ value: 0, role: 'default' as BarRole })))
    .setAux([
      { label: '边长 side', value: String(side), role: 'pivot' },
      { label: '边1/边2/边3/边4', value: '0 / 0 / 0 / 0', role: 'default' },
    ])
    .commit();

  if (side < 0) {
    rec
      .begin({ zh: `周长不能被 4 整除，无法拼正方形`, en: `Perimeter not divisible by 4` })
      .setBars([0, 0, 0, 0].map(() => ({ value: 0, role: 'warn' as BarRole })))
      .setAux([{ label: '结论', value: 'false', role: 'warn' }])
      .commit();
    return rec.build();
  }

  const render = (note: { zh: string; en: string }, final: boolean): void => {
    const roles: BarRole[] = sides.map((s) => (s === side ? 'final' : final ? 'final' : 'pivot'));
    rec
      .begin(note)
      .setBars(sides.map((s) => ({ value: s, role: roles[sides.indexOf(s)] ?? 'default' })))
      .setAux([
        { label: '边长 side', value: String(side), role: 'pivot' },
        { label: '边1', value: String(sides[0]), role: roles[0] },
        { label: '边2', value: String(sides[1]), role: roles[1] },
        { label: '边3', value: String(sides[2]), role: roles[2] },
        { label: '边4', value: String(sides[3]), role: roles[3] },
      ])
      .commit();
  };

  const hooks: MatchsticksToSquareHooks = {
    onPlace: (_idx, _len, edge, s) => {
      sides.length = 0;
      sides.push(...s);
      render({ zh: `放入第 ${edge + 1} 条边`, en: `Place into edge ${edge + 1}` }, false);
    },
    onBacktrack: (_idx, _len, _edge, s) => {
      sides.length = 0;
      sides.push(...s);
      render({ zh: `回溯`, en: `Backtrack` }, false);
    },
    onPrune: () => {
      void 0;
    },
    onSuccess: () => {
      render({ zh: `成功：4 条边都等于 ${side}`, en: `Success: all edges = ${side}` }, true);
    },
  };

  const result = matchsticksToSquare(input, hooks);

  rec
    .begin({
      zh: result.canForm ? `可拼成正方形` : `无法拼成正方形`,
      en: result.canForm ? `Can form a square` : `Cannot form a square`,
    })
    .setBars(
      result.canForm
        ? result.sides.map((s) => ({ value: s, role: 'final' as BarRole }))
        : [0, 0, 0, 0].map(() => ({ value: 0, role: 'warn' as BarRole })),
    )
    .setAux([
      {
        label: '结论',
        value: result.canForm ? 'true' : 'false',
        role: result.canForm ? 'final' : ('warn' as BarRole),
      },
    ])
    .commit();

  return rec.build();
}
