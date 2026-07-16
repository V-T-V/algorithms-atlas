import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { VectorRenderer, RasterRenderer, CircleShape, RectangleShape, type Shape } from './impl.ts';

export const DEFAULT_INPUT = 'all';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const hooks = {
    onRender: (shape: string, renderer: string, output: string) =>
      rec
        .begin({
          zh: `画 ${shape} 用 ${renderer} → ${output}`,
          en: `Draw ${shape} with ${renderer} → ${output}`,
        })
        .setAux([
          { label: '形状', value: shape, role: 'compare' as BarRole },
          { label: '渲染器', value: renderer, role: 'pivot' as BarRole },
          { label: '输出', value: output, role: 'frontier' as BarRole },
        ])
        .commit(),
    onResult: (outputs: string) =>
      rec
        .begin({ zh: `完成：${outputs}`, en: `Done: ${outputs}` })
        .setAux([{ label: '汇总', value: outputs, role: 'final' as BarRole }])
        .commit(),
  };
  const shapes: Shape[] = [
    new CircleShape(new VectorRenderer(), 0, 0, 5, hooks),
    new CircleShape(new RasterRenderer(), 1, 1, 3, hooks),
    new RectangleShape(new VectorRenderer(), 0, 0, 4, 2, hooks),
    new RectangleShape(new RasterRenderer(), 2, 2, 6, 3, hooks),
  ];
  rec
    .begin({
      zh: `桥接 2 形状 × 2 渲染器（模式 ${input}）`,
      en: `Bridge 2 shapes x 2 renderers (mode ${input})`,
    })
    .setAux([{ label: '组合数', value: String(shapes.length), role: 'default' as BarRole }])
    .commit();
  const outs = shapes.map((s) => s.draw());
  hooks.onResult?.(outs.join(' | '));
  return rec.build();
}
