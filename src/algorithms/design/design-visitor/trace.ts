import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { Circle, Rectangle, AreaVisitor, PerimeterVisitor, sumVisit, type Shape } from './impl.ts';

export const DEFAULT_INPUT: Shape[] = [new Circle(2), new Rectangle(3, 4)];

export function buildTrace(input: readonly Shape[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `形状数：${input.length}`, en: `Shapes: ${input.length}` })
    .setAux([{ label: '形状数', value: String(input.length), role: 'pivot' as BarRole }])
    .commit();
  const areaVisitor = new AreaVisitor({
    onVisit: (name, result) =>
      rec
        .begin({
          zh: `面积访问 ${name} = ${result.toFixed(3)}`,
          en: `Area visit ${name} = ${result.toFixed(3)}`,
        })
        .setAux([{ label: '面积', value: result.toFixed(3), role: 'frontier' as BarRole }])
        .commit(),
  });
  const perimeterVisitor = new PerimeterVisitor({
    onVisit: (name, result) =>
      rec
        .begin({
          zh: `周长访问 ${name} = ${result.toFixed(3)}`,
          en: `Perimeter visit ${name} = ${result.toFixed(3)}`,
        })
        .setAux([{ label: '周长', value: result.toFixed(3), role: 'compare' as BarRole }])
        .commit(),
  });
  const totalArea = sumVisit(input, areaVisitor);
  const totalPerimeter = sumVisit(input, perimeterVisitor);
  rec
    .begin({
      zh: `总面积=${totalArea.toFixed(3)}, 总周长=${totalPerimeter.toFixed(3)}`,
      en: `Total area=${totalArea.toFixed(3)}, total perimeter=${totalPerimeter.toFixed(3)}`,
    })
    .setAux([
      { label: '总面积', value: totalArea.toFixed(3), role: 'final' as BarRole },
      { label: '总周长', value: totalPerimeter.toFixed(3), role: 'sorted' as BarRole },
    ])
    .commit();
  return rec.build();
}
