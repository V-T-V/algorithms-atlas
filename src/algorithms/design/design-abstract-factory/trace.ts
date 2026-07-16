import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { DarkFactory, LightFactory, renderUI } from './impl.ts';

export const DEFAULT_INPUT = 'both';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const hooks = {
    onCreate: (factory: string, product: string, output: string) =>
      rec
        .begin({
          zh: `${factory} 工厂创建 ${product} → ${output}`,
          en: `${factory} factory creates ${product} → ${output}`,
        })
        .setAux([
          { label: '工厂', value: factory, role: 'pivot' as BarRole },
          { label: '产品', value: product, role: 'compare' as BarRole },
          { label: '渲染', value: output, role: 'frontier' as BarRole },
        ])
        .commit(),
    onResult: (family: string, products: string) =>
      rec
        .begin({
          zh: `${family} 族渲染：${products}`,
          en: `${family} family rendered: ${products}`,
        })
        .setAux([{ label: '族', value: family, role: 'final' as BarRole }])
        .commit(),
  };
  rec
    .begin({ zh: '抽象工厂创建 UI 族', en: 'Abstract factory creates UI family' })
    .setAux([{ label: '目标', value: input, role: 'default' as BarRole }])
    .commit();
  if (input === 'both') {
    renderUI(new DarkFactory(hooks), hooks);
    renderUI(new LightFactory(hooks), hooks);
  } else if (input === 'dark') {
    renderUI(new DarkFactory(hooks), hooks);
  } else {
    renderUI(new LightFactory(hooks), hooks);
  }
  return rec.build();
}
