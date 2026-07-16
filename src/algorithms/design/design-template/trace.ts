import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { CsvPipeline, JsonPipeline } from './impl.ts';

interface TraceInput {
  csv: string;
  json: string;
}
export const DEFAULT_INPUT: TraceInput = { csv: 'a,b\n1,2\n3,4', json: '[{"x":1},{"x":2}]' };

export function buildTrace(input: TraceInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const hooks = {
    onStep: (stepName: string, inp: string, out: string) =>
      rec
        .begin({
          zh: `[${stepName}] ${inp.length > 30 ? inp.slice(0, 30) + '...' : inp} → ${out.length > 30 ? out.slice(0, 30) + '...' : out}`,
          en: `[${stepName}] → processed`,
        })
        .setAux([
          { label: '步骤', value: stepName, role: 'pivot' as BarRole },
          {
            label: '输出',
            value: out.length > 40 ? out.slice(0, 40) + '...' : out,
            role: 'frontier' as BarRole,
          },
        ])
        .commit(),
    onResult: (finalOutput: string) =>
      rec
        .begin({
          zh: `管道输出：${finalOutput.length > 40 ? finalOutput.slice(0, 40) + '...' : finalOutput}`,
          en: `Pipeline output (truncated)`,
        })
        .setAux([{ label: '输出', value: finalOutput, role: 'final' as BarRole }])
        .commit(),
  };
  rec
    .begin({ zh: '运行 CSV 管道', en: 'Run CSV pipeline' })
    .setAux([{ label: '管道', value: 'CSV', role: 'compare' as BarRole }])
    .commit();
  const csvOut = new CsvPipeline(hooks).run(input.csv);
  rec
    .begin({ zh: '运行 JSON 管道', en: 'Run JSON pipeline' })
    .setAux([{ label: '管道', value: 'JSON', role: 'compare' as BarRole }])
    .commit();
  const jsonOut = new JsonPipeline(hooks).run(input.json);
  rec
    .begin({
      zh: `CSV 行数=${JSON.parse(csvOut).length}, JSON 长度=${JSON.parse(jsonOut).length}`,
      en: `CSV rows=${JSON.parse(csvOut).length}, JSON len=${JSON.parse(jsonOut).length}`,
    })
    .setAux([
      { label: 'csv', value: String(JSON.parse(csvOut).length), role: 'final' as BarRole },
      { label: 'json', value: String(JSON.parse(jsonOut).length), role: 'sorted' as BarRole },
    ])
    .commit();
  return rec.build();
}
