import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { FrontController } from './impl.ts';
export const DEFAULT_INPUT: any = [
  ['home', 'hi'],
  ['user', 'bob'],
  ['none', 'x'],
];
export function buildTrace(input: string[][] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '前端控制器', en: 'Front Controller' }).commit();
  const fc = new FrontController();
  fc.register('home', () => 'home page');
  fc.register('user', (r) => 'user ' + r);
  for (const [route, req] of input)
    fc.dispatch(route!, req!, {
      onDispatch: (r, resp) =>
        rec
          .begin({ zh: r + ' -> ' + resp, en: 'dispatch' })
          .setAux([
            { label: 'route', value: r, role: 'compare' as BarRole },
            {
              label: 'resp',
              value: resp,
              role: resp === '404' ? ('warn' as BarRole) : ('final' as BarRole),
            },
          ])
          .commit(),
    });
  rec
    .begin({ zh: '完成', en: 'done' })
    .setAux([{ label: 'done', value: 'ok', role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
