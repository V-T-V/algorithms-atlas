import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { LegacyLogger, LoggerAdapter } from './impl.ts';

interface TraceInput {
  entries: Array<['info' | 'warn' | 'error', string]>;
}
export const DEFAULT_INPUT: TraceInput = {
  entries: [
    ['info', 'started'],
    ['warn', 'low memory'],
    ['error', 'crash'],
  ],
};

export function buildTrace(input: TraceInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const adapter = new LoggerAdapter(new LegacyLogger(), {
    onAdapt: (inp, level, output) =>
      rec
        .begin({ zh: `适配 "${inp}" → "${output}"`, en: `Adapt "${inp}" → "${output}"` })
        .setAux([
          { label: 'level', value: level, role: 'pivot' as BarRole },
          { label: '输出', value: output, role: 'frontier' as BarRole },
        ])
        .commit(),
  });
  rec
    .begin({ zh: '准备适配日志', en: 'Ready to adapt logs' })
    .setAux([{ label: '条目数', value: String(input.entries.length), role: 'default' as BarRole }])
    .commit();
  const outputs: string[] = [];
  for (const [level, msg] of input.entries) outputs.push(adapter.log(level, msg));
  rec
    .begin({ zh: `共 ${outputs.length} 条已转换`, en: `${outputs.length} entries converted` })
    .setAux([{ label: '总条数', value: String(outputs.length), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
