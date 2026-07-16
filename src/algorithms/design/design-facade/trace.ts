import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ComputerFacade } from './impl.ts';

export const DEFAULT_INPUT = 'boot';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const facade = new ComputerFacade({
    onSubStep: (subsystem, action, result) =>
      rec
        .begin({
          zh: `[${subsystem}] ${action} → ${result}`,
          en: `[${subsystem}] ${action} → ${result}`,
        })
        .setAux([
          { label: '子系统', value: subsystem, role: 'pivot' as BarRole },
          { label: '动作', value: action, role: 'compare' as BarRole },
        ])
        .commit(),
    onResult: (success, log) =>
      rec
        .begin({
          zh: `${success ? '成功' : '失败'}：${log.length > 40 ? log.slice(0, 40) + '...' : log}`,
          en: `${success ? 'OK' : 'FAIL'}: ${log.length > 40 ? log.slice(0, 40) + '...' : log}`,
        })
        .setAux([
          {
            label: '结果',
            value: success ? '成功' : '失败',
            role: (success ? 'final' : 'warn') as BarRole,
          },
        ])
        .commit(),
  });
  rec
    .begin({ zh: '按电源键', en: 'Press power button' })
    .setAux([{ label: '指令', value: input, role: 'default' as BarRole }])
    .commit();
  if (input === 'boot') facade.boot();
  else facade.shutdown();
  return rec.build();
}
