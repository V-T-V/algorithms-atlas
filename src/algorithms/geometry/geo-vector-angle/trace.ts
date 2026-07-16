// 向量夹角 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { vectorAngle, type Vec2 } from './impl.ts';
export const DEFAULT_INPUT: { a: Vec2; b: Vec2 } = { a: { x: 3, y: 0 }, b: { x: 1, y: 1 } };
export function buildTrace(input: { a: Vec2; b: Vec2 } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = input.a,
    b = input.b;
  const deg = (r: number) => ((r * 180) / Math.PI).toFixed(1) + '°';
  rec
    .begin({ zh: '向量 a 与 b', en: 'Vectors a and b' })
    .setAux([
      { label: 'a', value: '(' + a.x + ',' + a.y + ')', role: 'pivot' as BarRole },
      { label: 'b', value: '(' + b.x + ',' + b.y + ')', role: 'frontier' as BarRole },
    ])
    .commit();
  const theta = vectorAngle(a, b, {
    onDot: (d) =>
      rec
        .begin({ zh: '点积 a·b = ' + d, en: 'dot a·b = ' + d })
        .setAux([{ label: 'a·b', value: String(d), role: 'compare' as BarRole }])
        .commit(),
    onResult: (t) =>
      rec
        .begin({ zh: '夹角 θ = ' + deg(t), en: 'angle θ = ' + deg(t) })
        .setAux([{ label: 'θ', value: deg(t), role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '结果：θ ≈ ' + deg(theta), en: 'Result: θ ≈ ' + deg(theta) })
    .setAux([
      { label: '弧度', value: theta.toFixed(4), role: 'final' as BarRole },
      { label: '角度', value: deg(theta), role: 'final' as BarRole },
    ])
    .commit();
  return rec.build();
}
