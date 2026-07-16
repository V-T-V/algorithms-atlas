import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { Light, LightOnCommand, LightOffCommand, RemoteControl, MacroCommand } from './impl.ts';

export const DEFAULT_INPUT = ['on', 'off', 'undo', 'macro'];

type Op = string;

export function buildTrace(input: readonly Op[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const light = new Light();
  const onCmd = new LightOnCommand('on', light);
  const offCmd = new LightOffCommand('off', light);
  const remote = new RemoteControl({
    onExecute: (name, result) =>
      rec
        .begin({
          zh: `执行 ${name} → ${result}（灯泡 ${light.on ? '亮' : '灭'}）`,
          en: `Execute ${name} → ${result} (light ${light.on ? 'on' : 'off'})`,
        })
        .setAux([
          {
            label: '灯泡',
            value: light.on ? 'on' : 'off',
            role: (light.on ? 'final' : 'default') as BarRole,
          },
          { label: '历史栈', value: String(remote.getHistoryDepth()), role: 'pivot' as BarRole },
        ])
        .commit(),
    onUndo: (name, result) =>
      rec
        .begin({
          zh: `撤销 ${name} → ${result}（灯泡 ${light.on ? '亮' : '灭'}）`,
          en: `Undo ${name} → ${result} (light ${light.on ? 'on' : 'off'})`,
        })
        .setAux([
          {
            label: '灯泡',
            value: light.on ? 'on' : 'off',
            role: (light.on ? 'final' : 'compare') as BarRole,
          },
          { label: '历史栈', value: String(remote.getHistoryDepth()), role: 'compare' as BarRole },
        ])
        .commit(),
  });
  rec
    .begin({ zh: '初始灯泡灭', en: 'Initial light off' })
    .setAux([{ label: '灯泡', value: 'off', role: 'default' as BarRole }])
    .commit();
  for (const op of input) {
    if (op === 'on') remote.execute(onCmd);
    else if (op === 'off') remote.execute(offCmd);
    else if (op === 'undo') remote.undo();
    else if (op === 'macro') {
      const m = new MacroCommand('macro', [onCmd, offCmd]);
      remote.execute(m);
    }
  }
  rec
    .begin({
      zh: `最终灯泡 ${light.on ? '亮' : '灭'}`,
      en: `Final light ${light.on ? 'on' : 'off'}`,
    })
    .setAux([{ label: '灯泡', value: light.on ? 'on' : 'off', role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
