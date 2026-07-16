// =============================================================================
// 亲和数对 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { amicablePartner, type AmicableHooks } from './impl.ts';

export const DEFAULT_INPUT = 220; // 配对 284

export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  let partner: number | null = null;
  let result = false;
  let phase = '求 σ(n)';
  const values: number[] = [input];

  const render = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(
        values.map((v, i) => ({
          value: v,
          role: (i === 0 ? 'pivot' : 'frontier') as BarRole,
          label: String(v),
        })),
      )
      .setAux([
        { label: '阶段', value: phase, role: 'compare' },
        { label: 'n', value: String(input), role: 'pivot' },
        {
          label: '配对 σ(n)',
          value: partner === null ? '（待定）' : String(partner),
          role: result ? 'final' : 'warn',
        },
        {
          label: '判定',
          value: result ? '亲和数对' : '（判定中）',
          role: result ? 'final' : 'warn',
        },
      ])
      .commit();
  };

  render({ zh: `判定 n = ${input}`, en: `Test n = ${input}` });

  const hooks: AmicableHooks = {
    onSum: (n, sum) => {
      if (n === input) {
        phase = `σ(${input}) = ${sum}`;
        values[1] = sum;
      } else {
        phase = `σ(${n}) = ${sum}（验证）`;
        values[2] = sum;
      }
      render({ zh: `σ(${n}) = ${sum}`, en: `σ(${n}) = ${sum}` });
    },
    onCheck: (_a, b, ok) => {
      phase = '校验反向';
      partner = ok ? b : null;
      render({
        zh: ok ? `${input} ↔ ${b} 互为亲和` : `反向不匹配`,
        en: ok ? `${input} ↔ ${b} amicable` : `mismatch`,
      });
    },
    onResult: (p, ok) => {
      partner = p;
      result = ok;
      render({
        zh: ok ? `${input} 与 ${p} 是亲和数对` : `${input} 无亲和配对`,
        en: ok ? `${input}, ${p} amicable` : `${input} has no partner`,
      });
    },
  };

  amicablePartner(input, hooks);

  rec
    .begin({
      zh: result ? `亲和数对 (${input}, ${partner})` : '非亲和数',
      en: result ? `Amicable (${input}, ${partner})` : 'Not amicable',
    })
    .setBars(
      [input, partner ?? 0].map((v, i) => ({
        value: v,
        role: (result ? 'final' : i === 0 ? 'pivot' : 'warn') as BarRole,
        label: String(v),
      })),
    )
    .setAux([
      {
        label: '结论',
        value: result ? `亲和数对 (${input}, ${partner})` : '非亲和数',
        role: result ? 'final' : 'warn',
      },
    ])
    .commit();

  return rec.build();
}
