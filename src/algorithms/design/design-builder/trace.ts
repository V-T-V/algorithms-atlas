import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { HtmlBuilder, buildPageDoc } from './impl.ts';

export const DEFAULT_INPUT = 'page';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const hooks = {
    onStep: (step: string, value: string) =>
      rec
        .begin({
          zh: `步骤 ${step}：${value.length > 30 ? value.slice(0, 30) + '...' : value}`,
          en: `Step ${step}: ${value.length > 30 ? value.slice(0, 30) + '...' : value}`,
        })
        .setAux([
          { label: '步骤', value: step, role: 'pivot' as BarRole },
          {
            label: '值',
            value: value.length > 40 ? value.slice(0, 40) + '...' : value,
            role: 'frontier' as BarRole,
          },
        ])
        .commit(),
    onBuild: (html: string) =>
      rec
        .begin({
          zh: `build → ${html.length > 40 ? html.slice(0, 40) + '...' : html}`,
          en: `build → (truncated)`,
        })
        .setAux([
          {
            label: 'HTML',
            value: html.length > 50 ? html.slice(0, 50) + '...' : html,
            role: 'final' as BarRole,
          },
        ])
        .commit(),
  };
  rec
    .begin({ zh: '开始建造', en: 'Start building' })
    .setAux([{ label: '目标', value: input, role: 'default' as BarRole }])
    .commit();
  if (input === 'page') {
    buildPageDoc(hooks);
  } else {
    new HtmlBuilder(hooks).setTag('a').setAttr('href', '#').setText('link').build();
  }
  return rec.build();
}
