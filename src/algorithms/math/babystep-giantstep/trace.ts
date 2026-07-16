// =============================================================================
// 小步大步算法 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { babyStepGiantStep, type BsgsHooks } from './impl.ts';

export const DEFAULT_INPUT = { a: 3, b: 13, p: 17 };

export function buildTrace(input: { a: number; b: number; p: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { a, b, p } = input;
  const baby: Array<{ key: string; value: string; role?: BarRole }> = [];
  const giant: Array<{ key: string; value: string; role?: BarRole }> = [];
  let phase: 'baby' | 'giant' | 'done' = 'baby';
  let result: number | null = null;

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setMap([...baby, ...giant])
      .setAux([
        {
          label: '阶段',
          value: phase === 'baby' ? '小步' : phase === 'giant' ? '大步' : '完成',
          role: 'frontier',
        },
        { label: '结论', value: result === null ? '（搜索中）' : `x=${result}`, role: 'final' },
      ])
      .commit();
  };

  snap({ zh: `求 ${a}^x ≡ ${b} (mod ${p})`, en: `Solve ${a}^x ≡ ${b} (mod ${p})` });

  const hooks: BsgsHooks = {
    onBabyStep: (j, val) => {
      phase = 'baby';
      baby.push({ key: `a^${j}`, value: String(val), role: 'default' });
      snap({ zh: `小步：a^${j} = ${val}`, en: `Baby: a^${j} = ${val}` });
    },
    onGiantStep: (i, val, hit) => {
      phase = 'giant';
      giant.push({
        key: `γ(${i})`,
        value: `${val}${hit ? ' ✓命中' : ''}`,
        role: hit ? 'final' : 'frontier',
      });
      snap({
        zh: `大步 i=${i}：γ=${val}${hit ? '（命中）' : ''}`,
        en: `Giant i=${i}: γ=${val}${hit ? ' (hit)' : ''}`,
      });
    },
    onResult: (x) => {
      phase = 'done';
      result = x;
      snap({ zh: x === null ? '无解' : `x = ${x}`, en: x === null ? 'No solution' : `x = ${x}` });
    },
  };

  babyStepGiantStep(a, b, p, hooks);

  rec
    .begin({
      zh: result === null ? '无解' : `x=${result}`,
      en: result === null ? 'none' : `x=${result}`,
    })
    .setMap([
      {
        key: `${a}^x ≡ ${b}`,
        value: result === null ? '无解' : `x=${result}`,
        role: 'final' as BarRole,
      },
    ])
    .setAux([{ label: '答案', value: result === null ? '无' : String(result), role: 'final' }])
    .commit();

  return rec.build();
}
