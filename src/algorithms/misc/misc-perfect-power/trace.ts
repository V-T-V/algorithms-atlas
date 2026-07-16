// =============================================================================
// 完全幂判定 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { isPerfectPower, type PerfectPowerHooks } from './impl.ts';

export const DEFAULT_INPUT = 216;

export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const tried: Array<{ b: number; found: boolean; base: number | null }> = [];
  let result = {
    isPerfectPower: false,
    base: null as number | null,
    exponent: null as number | null,
  };

  rec
    .begin({ zh: `判定 ${input} 是否完全幂`, en: `Is ${input} a perfect power?` })
    .setAux([{ label: 'n', value: String(input), role: 'pivot' as BarRole }])
    .commit();

  const hooks: PerfectPowerHooks = {
    onResult: (r) => (result = r),
  };

  const wrappedHooks: PerfectPowerHooks = {
    onTryExponent: (b) => {
      tried.push({ b, found: false, base: null });
    },
    onResult: hooks.onResult,
  };

  const r = isPerfectPower(input, wrappedHooks);
  // 标记命中的指数
  if (r.isPerfectPower) {
    const hit = tried.find((t) => t.b === r.exponent);
    if (hit) {
      hit.found = true;
      hit.base = r.base;
    }
  }

  for (const t of tried) {
    rec
      .begin({
        zh: t.found
          ? `指数 b=${t.b}：命中！${input} = ${t.base}^${t.b}`
          : `指数 b=${t.b}：无整数底`,
        en: t.found
          ? `exponent b=${t.b}: HIT! ${input} = ${t.base}^${t.b}`
          : `exponent b=${t.b}: no integer base`,
      })
      .setAux([
        { label: '指数 b', value: String(t.b), role: 'compare' as BarRole },
        {
          label: '结果',
          value: t.found ? `a=${t.base}` : '无',
          role: (t.found ? 'final' : 'default') as BarRole,
        },
      ])
      .commit();
  }

  rec
    .begin({
      zh: result.isPerfectPower
        ? `${input} = ${result.base}^${result.exponent}（完全幂）`
        : `${input} 不是完全幂`,
      en: result.isPerfectPower
        ? `${input} = ${result.base}^${result.exponent} (perfect power)`
        : `${input} is not a perfect power`,
    })
    .setAux([
      { label: '判定', value: result.isPerfectPower ? '是' : '否', role: 'final' as BarRole },
      ...(result.isPerfectPower
        ? [
            { label: '底', value: String(result.base), role: 'pivot' as BarRole },
            { label: '指数', value: String(result.exponent), role: 'pivot' as BarRole },
          ]
        : []),
    ])
    .commit();

  return rec.build();
}
