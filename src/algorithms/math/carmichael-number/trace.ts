// =============================================================================
// Carmichael 数判定 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { isCarmichael, type CarmichaelHooks } from './impl.ts';

export const DEFAULT_INPUT = 561; // 最小 Carmichael 数

export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const factors: number[] = [];
  let squareFree = false;
  const divChecks: Array<{ p: number; ok: boolean }> = [];
  let result = false;
  let phase: 'decompose' | 'squarefree' | 'korselt' = 'decompose';

  const render = (note: { zh: string; en: string }): void => {
    const aux: Array<{ label: string; value: string; role?: BarRole }> = [
      { label: 'n', value: String(input), role: 'frontier' },
      { label: 'n-1', value: String(input - 1), role: 'frontier' },
      { label: '阶段', value: phase, role: 'compare' },
      {
        label: '素因子',
        value: factors.length ? factors.join(' · ') : '（分解中）',
        role: 'pivot',
      },
      {
        label: 'square-free',
        value: squareFree ? '是' : '否',
        role: squareFree ? 'final' : 'warn',
      },
    ];
    for (const dc of divChecks) {
      aux.push({
        label: `(p-1)|(n-1)`,
        value: `p=${dc.p}: ${dc.ok ? '是' : '否'}`,
        role: dc.ok ? 'final' : 'warn',
      });
    }
    aux.push({
      label: '判定',
      value: result ? 'Carmichael 数' : '非 Carmichael',
      role: result ? 'final' : 'warn',
    });
    rec.begin(note).setAux(aux).commit();
  };

  render({ zh: `判定 n = ${input}`, en: `Test n = ${input}` });

  const hooks: CarmichaelHooks = {
    onFactor: (p) => {
      phase = 'decompose';
      factors.push(p);
      render({ zh: `发现素因子 ${p}`, en: `Prime factor ${p}` });
    },
    onCheckSquareFree: (ok) => {
      phase = 'squarefree';
      squareFree = ok;
      render({
        zh: ok ? 'n 无平方因子' : 'n 含平方因子 → 非 Carmichael',
        en: ok ? 'square-free' : 'not square-free',
      });
    },
    onCheckDivisibility: (p, ok) => {
      phase = 'korselt';
      divChecks.push({ p, ok });
      render({
        zh: `(p-1)=${p - 1} | (n-1)=${input - 1}：${ok ? '是' : '否'}`,
        en: `(p-1)=${p - 1} | (n-1)=${input - 1}: ${ok}`,
      });
    },
    onResult: (r) => {
      result = r;
      render({
        zh: r ? '是 Carmichael 数' : '非 Carmichael 数',
        en: r ? 'Carmichael' : 'not Carmichael',
      });
    },
  };

  isCarmichael(input, hooks);

  const barValues = [input, input - 1, ...factors];
  rec
    .begin({
      zh: result ? 'Carmichael 数' : '非 Carmichael 数',
      en: result ? 'Carmichael' : 'Not Carmichael',
    })
    .setBars(
      rec.barsFrom(
        barValues,
        Object.fromEntries(factors.map((_, i) => [i + 2, 'pivot' as BarRole])),
        Object.fromEntries(
          barValues.map((v, i) => [i, i === 0 ? 'n' : i === 1 ? 'n-1' : `p=${v}`]),
        ),
      ),
    )
    .setAux([
      {
        label: '结论',
        value: result ? 'Carmichael 数' : '非 Carmichael',
        role: result ? 'final' : 'warn',
      },
    ])
    .commit();

  return rec.build();
}
