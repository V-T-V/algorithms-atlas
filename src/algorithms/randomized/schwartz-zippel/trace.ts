// =============================================================================
// Schwartz-Zippel 多项式恒等测试 · 录制帧序列
// 用 setAux 展示每次试验的随机点 r、求值结果与判定。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { schwartzZippelProduct, makeRng, type SchwartzZippelHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  // 检验 P = (x0-2)(x1-3)(x2-5) 是否为零多项式
  anchors: [2, 3, 5],
  // 取值范围 [0, p)，p=7。错误概率上界 d/p = 3/7
  p: 7,
  k: 5,
  seed: 42,
};

interface BuildTraceInput {
  anchors?: number[];
  p?: number;
  k?: number;
  seed?: number;
}

export function buildTrace(input: BuildTraceInput = {}): Frame[] {
  const anchors = input.anchors ?? DEFAULT_INPUT.anchors;
  const p = input.p ?? DEFAULT_INPUT.p;
  const k = input.k ?? DEFAULT_INPUT.k;
  const seed = input.seed ?? DEFAULT_INPUT.seed;

  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `Schwartz-Zippel 检验 P=Π(xᵢ−aᵢ)，a=[${anchors.join(',')}]，取值集 [0,${p})，${k} 次试验`,
      en: `Schwartz-Zippel test P=Π(xᵢ−aᵢ), a=[${anchors.join(',')}], range [0,${p}), ${k} trials`,
    })
    .setAux([
      { label: 'a (锚点)', value: `[${anchors.join(',')}]`, role: 'pivot' as BarRole },
      { label: '取值集 p', value: String(p), role: 'frontier' as BarRole },
      { label: '总次数 d', value: String(anchors.length), role: 'default' as BarRole },
      { label: '单次错误上界', value: `${anchors.length}/${p}`, role: 'default' as BarRole },
      { label: '试验次数 k', value: String(k), role: 'final' as BarRole },
    ])
    .commit();

  const hooks: SchwartzZippelHooks = {
    onRandomPoint: (t, r) => {
      rec
        .begin({
          zh: `试验 ${t + 1}：随机点 r=[${r.join(',')}]`,
          en: `Trial ${t + 1}: random point r=[${r.join(',')}]`,
        })
        .setAux([
          { label: '试验', value: String(t + 1), role: 'pivot' as BarRole },
          { label: 'r', value: `[${r.join(',')}]`, role: 'swap' as BarRole },
          { label: '步骤', value: '生成 r', role: 'frontier' as BarRole },
        ])
        .commit();
    },
    onEvaluate: (t, value, passed) => {
      rec
        .begin({
          zh: `试验 ${t + 1}：P(r) = ${value} → ${passed ? '非零（P 一定 ≠ 0）' : '为零（可能恒等）'}`,
          en: `Trial ${t + 1}: P(r) = ${value} → ${passed ? 'non-zero (P ≠ 0)' : 'zero (maybe identity)'}`,
        })
        .setAux([
          { label: '试验', value: String(t + 1), role: 'pivot' as BarRole },
          { label: 'P(r)', value: String(value), role: 'compare' as BarRole },
          {
            label: '结果',
            value: passed ? '非零' : '为零',
            role: (passed ? 'final' : 'warn') as BarRole,
          },
        ])
        .commit();
    },
    onResult: (distinct, trialsRun) => {
      rec
        .begin({
          zh: distinct
            ? `完成：第 ${trialsRun} 次试验得非零 → P 一定非零（恒等不成立）`
            : `完成：${trialsRun} 次试验全为 0 → 极可能 P≡0（错误 ≤ (${anchors.length}/${p})^${trialsRun}）`,
          en: distinct
            ? `Done: non-zero at trial ${trialsRun} → P is definitely non-zero`
            : `Done: all ${trialsRun} trials zero → P≡0 with high prob (err ≤ (${anchors.length}/${p})^${trialsRun})`,
        })
        .setAux([
          {
            label: '结论',
            value: distinct ? 'P 一定非零' : '极可能 P≡0',
            role: (distinct ? 'final' : 'frontier') as BarRole,
          },
          { label: '试验数', value: String(trialsRun), role: 'default' as BarRole },
        ])
        .commit();
    },
  };

  schwartzZippelProduct(anchors, p, k, makeRng(seed), hooks);

  return rec.build();
}
