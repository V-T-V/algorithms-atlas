// =============================================================================
// 回溯线搜索 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { backtrackLineSearch, type BacktrackHooks, type Vec } from './impl.ts';

// f(x) = (x-3)² + (y+1)²，从 (0,0) 沿 −g=[-6,2] 搜索
export const DEFAULT_INPUT = {
  f: (x: Vec): number => (x[0]! - 3) ** 2 + (x[1]! + 1) ** 2,
  x: [0, 0],
  g: [-6, 2],
  p: [6, -2],
};

export function buildTrace(input: typeof DEFAULT_INPUT = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { f, x, g, p } = input;
  const fx = f(x);

  rec
    .begin({
      zh: `回溯线搜索：x=(${x.join(',')})，方向 p=(${p.join(',')})，初始 α=1。`,
      en: `Backtracking line search: x=(${x.join(',')}), dir p=(${p.join(',')}), init α=1.`,
    })
    .setAux([
      { label: 'f(x)', value: fx.toFixed(6), role: 'pivot' as BarRole },
      {
        label: 'pᵀg',
        value: (g[0]! * p[0]! + g[1]! * p[1]!).toFixed(4),
        role: 'compare' as BarRole,
      },
      { label: 'α₀', value: '1', role: 'frontier' as BarRole },
    ])
    .commit();

  const hooks: BacktrackHooks = {
    onTrial: (iter, alpha, fnew, armijo) => {
      rec
        .begin({
          zh: `试探 ${iter}：α=${alpha.toFixed(4)}, f=${fnew.toFixed(6)}, Armijo=${armijo ? '满足' : '不满足'}`,
          en: `Trial ${iter}: α=${alpha.toFixed(4)}, f=${fnew.toFixed(6)}, Armijo=${armijo ? 'yes' : 'no'}`,
        })
        .setAux([
          { label: '试探', value: String(iter), role: 'pivot' as BarRole },
          { label: 'α', value: alpha.toFixed(4), role: 'compare' as BarRole },
          { label: 'f(x+αp)', value: fnew.toFixed(6), role: 'final' as BarRole },
          {
            label: 'Armijo',
            value: armijo ? '满足' : '不满足',
            role: (armijo ? 'final' : 'warn') as BarRole,
          },
        ])
        .commit();
    },
  };

  const result = backtrackLineSearch(f, x, fx, g, p, { alpha0: 1, rho: 0.5, c: 1e-4 }, hooks);

  rec
    .begin({
      zh: `完成：α=${result.alpha.toFixed(4)}, f=${result.fnew.toFixed(6)}（${result.iterations} 次试探）`,
      en: `Done: α=${result.alpha.toFixed(4)}, f=${result.fnew.toFixed(6)} (${result.iterations} trials)`,
    })
    .setAux([
      { label: 'α*', value: result.alpha.toFixed(6), role: 'final' as BarRole },
      { label: 'f*', value: result.fnew.toFixed(6), role: 'final' as BarRole },
      { label: '试探次数', value: String(result.iterations), role: 'compare' as BarRole },
      {
        label: '接受',
        value: result.accepted ? '是' : '否',
        role: (result.accepted ? 'final' : 'warn') as BarRole,
      },
    ])
    .commit();

  return rec.build();
}
