// =============================================================================
// AKS 素性测试 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { isPrimeAks, type AksHooks } from './impl.ts';

export const DEFAULT_INPUT = 11;

export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input;
  const checks: Array<{ key: string; value: string; role?: BarRole }> = [];
  let result = false;

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setMap(checks.slice())
      .setAux([
        {
          label: '结论',
          value: result ? '素数' : '（检验中）',
          role: result ? 'final' : 'frontier',
        },
      ])
      .commit();
  };

  snap({ zh: `AKS 检验 ${n}`, en: `AKS test for ${n}` });

  const hooks: AksHooks = {
    onCoefficient: (k, coeff, divisible) => {
      checks.push({
        key: `C(${n},${k})`,
        value: `${coeff.toString()}${divisible ? ` 被 ${n} 整除 ✓` : ` 不被 ${n} 整除 ✗`}`,
        role: divisible ? 'default' : 'warn',
      });
      snap({
        zh: `C(${n},${k}) = ${coeff}，${divisible ? '整除' : '不整除'}`,
        en: `C(${n},${k}) = ${coeff}, ${divisible ? 'divisible' : 'not'}`,
      });
    },
    onResult: (prime) => {
      result = prime;
      checks.push({
        key: '结论',
        value: prime ? `${n} 是素数` : `${n} 是合数`,
        role: prime ? 'final' : 'warn',
      });
      snap({
        zh: prime ? `${n} 是素数` : `${n} 是合数`,
        en: prime ? `${n} is prime` : `${n} is composite`,
      });
    },
  };

  isPrimeAks(n, hooks);

  rec
    .begin({ zh: result ? '素数' : '合数', en: result ? 'Prime' : 'Composite' })
    .setMap([
      {
        key: `${n}`,
        value: result ? '素数' : '合数',
        role: (result ? 'final' : 'warn') as BarRole,
      },
    ])
    .setAux([{ label: '答案', value: result ? '素数' : '合数', role: result ? 'final' : 'warn' }])
    .commit();

  return rec.build();
}
