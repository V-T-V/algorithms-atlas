// =============================================================================
// 有效完全平方数 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { isPerfectSquare, type ValidSquareHooks } from './impl.ts';

export const DEFAULT_INPUT = 16;

export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const probes: Array<{ mid: number; sq: number }> = [];

  rec
    .begin({ zh: `判定 ${input} 是否完全平方数`, en: `Is ${input} a perfect square?` })
    .setAux([{ label: 'num', value: String(input), role: 'pivot' as BarRole }])
    .commit();

  const hooks: ValidSquareHooks = {
    onProbe: (mid, sq) => probes.push({ mid, sq }),
  };

  const result = isPerfectSquare(input, hooks);

  for (let i = 0; i < probes.length; i++) {
    const p = probes[i]!;
    rec
      .begin({
        zh: `二分 mid=${p.mid}, mid*mid=${p.sq} ${p.sq === input ? '== 命中' : p.sq < input ? '< num' : '> num'}`,
        en: `Probe mid=${p.mid}, sq=${p.sq} ${p.sq === input ? '== HIT' : p.sq < input ? '< num' : '> num'}`,
      })
      .setAux([
        { label: 'mid', value: String(p.mid), role: 'compare' as BarRole },
        { label: 'mid^2', value: String(p.sq), role: 'final' as BarRole },
      ])
      .commit();
  }

  rec
    .begin({
      zh: `${input} ${result ? '是' : '不是'}完全平方数`,
      en: `${input} is ${result ? '' : 'not '}a perfect square`,
    })
    .setAux([{ label: '答案', value: result ? '是' : '否', role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
