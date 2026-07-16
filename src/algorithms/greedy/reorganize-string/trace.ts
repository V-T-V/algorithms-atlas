// =============================================================================
// 重构字符串 · 录制帧序列
// 可视化：setArray 渲染结果数组（字符 ASCII 为值）；setAux 展示频次。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { reorganizeString, type ReorganizeStringHooks } from './impl.ts';

export const DEFAULT_INPUT = 'aab';

/** 录制演示帧序列。 */
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  const result: string[] = new Array<string>(n).fill('');

  const toValues = (arr: string[]): number[] => arr.map((c) => (c ? c.charCodeAt(0) : 0));

  rec
    .begin({
      zh: `重构字符串 "${input}" 使相邻字符不同`,
      en: `Reorganize "${input}" so neighbors differ`,
    })
    .setArray(
      toValues(result),
      result.map(() => 'default' as BarRole),
      [],
    )
    .setAux([{ label: '原串', value: input, role: 'default' }])
    .commit();

  const hooks: ReorganizeStringHooks = {
    onCount: (freq) => {
      rec
        .begin({
          zh: `频次：${freq.map((f) => `${f.ch}=${f.count}`).join(' ')}`,
          en: `Freq: ${freq.map((f) => `${f.ch}=${f.count}`).join(' ')}`,
        })
        .setAux(
          freq.map((f) => ({ label: f.ch, value: String(f.count), role: 'pivot' as BarRole })),
        )
        .commit();
    },
    onPlace: (ch, pos, r) => {
      result.length = 0;
      result.push(...r);
      rec
        .begin({ zh: `把 '${ch}' 填入下标 ${pos}`, en: `Place '${ch}' at idx ${pos}` })
        .setArray(
          toValues(result),
          result.map((_, k) => (k === pos ? ('swap' as BarRole) : ('default' as BarRole))),
          [{ index: pos, label: `'${ch}'` }],
        )
        .setAux([{ label: '当前结果', value: result.join('') || '·', role: 'pivot' }])
        .commit();
    },
  };

  const r = reorganizeString(input, hooks);

  rec
    .begin({
      zh: r.possible ? `完成：${r.value}` : `不可行（某字符频次超过半数）`,
      en: r.possible ? `Done: ${r.value}` : `Impossible (a char exceeds half)`,
    })
    .setArray(
      r.possible ? toValues([...r.value]) : toValues([...input]),
      (r.possible ? [...r.value] : [...input]).map(() =>
        r.possible ? ('final' as BarRole) : ('warn' as BarRole),
      ),
      [],
    )
    .setAux([
      {
        label: '结果',
        value: r.possible ? r.value : '(空)',
        role: r.possible ? 'final' : ('warn' as BarRole),
      },
    ])
    .commit();

  return rec.build();
}
