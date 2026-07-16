import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rpnEval, type RpnHooks } from './impl.ts';

export const DEFAULT_INPUT = ['3', '4', '2', '*', '+'];

export function buildTrace(tokens: string[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const stack: number[] = [];
  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setAux(
        stack.map((v, i) => ({
          label: `s[${i}]`,
          value: String(v),
          role: (i === stack.length - 1 ? 'frontier' : 'default') as BarRole,
        })),
      )
      .commit();
  };
  snap({ zh: `后缀: ${tokens.join(' ')}`, en: `RPN: ${tokens.join(' ')}` });
  const hooks: RpnHooks = {
    onPush: () => snap({ zh: '压栈', en: 'push' }),
    onApply: (op, l, _r, res) => snap({ zh: `${l} ${op} ? = ${res}`, en: `${l} ${op} ? = ${res}` }),
  };
  const result = rpnEval(tokens, hooks);
  rec
    .begin({ zh: `结果 = ${result}`, en: `Result = ${result}` })
    .setAux([{ label: 'result', value: String(result), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
