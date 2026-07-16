// =============================================================================
// 我能赢吗 · 录制帧序列
// 可视化：setArray 渲染 1..m 的可选数；setAux 展示状态与剩余目标。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { canIWin, type CanIWinHooks } from './impl.ts';

export interface CiwInput {
  maxChoosableInteger: number;
  desiredTotal: number;
}
export const DEFAULT_INPUT: CiwInput = { maxChoosableInteger: 10, desiredTotal: 11 };

function bin(m: number, state: number): string {
  let s = '';
  for (let i = 0; i < m; i++) s += (state >> i) & 1;
  return s;
}

/** 录制演示帧序列。 */
export function buildTrace(input: CiwInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { maxChoosableInteger: m, desiredTotal: t } = input;

  rec
    .begin({
      zh: `我能赢吗：m=${m}（可选 1..${m}），目标=${t}`,
      en: `Can I Win: m=${m} (pick 1..${m}), target=${t}`,
    })
    .setArray(
      Array.from({ length: m }, (_, i) => i + 1),
      Array.from({ length: m }, () => 'default' as BarRole),
      [],
    )
    .setAux([
      { label: 'm', value: String(m), role: 'default' },
      { label: '目标', value: String(t), role: 'pivot' },
      { label: '总和上界', value: String((m * (m + 1)) / 2), role: 'default' },
    ])
    .commit();

  if ((m * (m + 1)) / 2 < t) {
    rec
      .begin({
        zh: `总和上界 ${(m * (m + 1)) / 2} < 目标 ${t}：双方都无法赢`,
        en: `Max sum ${(m * (m + 1)) / 2} < target ${t}: nobody can win`,
      })
      .setArray(
        Array.from({ length: m }, (_, i) => i + 1),
        Array.from({ length: m }, () => 'warn' as BarRole),
        [],
      )
      .setAux([{ label: '结论', value: 'false', role: 'warn' }])
      .commit();
    return rec.build();
  }

  let lastState = 0;
  let lastRemaining = t;

  const hooks: CanIWinHooks = {
    onSearch: (state, remaining, result) => {
      lastState = state;
      lastRemaining = remaining;
      // 渲染可选数：已用的标 sorted，未用的标 default
      const roles: BarRole[] = [];
      for (let x = 1; x <= m; x++) {
        const used = (state >> (x - 1)) & 1;
        roles.push(used ? 'sorted' : 'default');
      }
      rec
        .begin({
          zh: `搜索：state=${bin(m, state)}（已用位=1），剩余目标=${remaining}，当前玩家${result ? '能' : '不能'}赢`,
          en: `Search: state=${bin(m, state)}, remaining=${remaining}, current ${result ? 'wins' : 'loses'}`,
        })
        .setArray(
          Array.from({ length: m }, (_, i) => i + 1),
          roles,
          [],
        )
        .setAux([
          { label: 'state', value: bin(m, state), role: 'pivot' },
          { label: '剩余目标', value: String(remaining), role: 'compare' },
          {
            label: '当前玩家',
            value: result ? '能赢' : '不能赢',
            role: result ? 'final' : ('warn' as BarRole),
          },
        ])
        .commit();
    },
  };

  const result = canIWin(m, t, hooks);

  rec
    .begin({
      zh: `完成：先手${result ? '能' : '不能'}保证获胜`,
      en: `Done: first player ${result ? 'can' : 'cannot'} force a win`,
    })
    .setArray(
      Array.from({ length: m }, (_, i) => i + 1),
      Array.from({ length: m }, () => (result ? 'final' : 'warn') as BarRole),
      [],
    )
    .setAux([
      {
        label: '先手能赢？',
        value: result ? '是' : '否',
        role: result ? 'final' : ('warn' as BarRole),
      },
    ])
    .commit();

  void lastState;
  void lastRemaining;
  return rec.build();
}
