// =============================================================================
// 哥德巴赫猜想 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { goldbach, type GoldbachHooks } from './impl.ts';

export const DEFAULT_INPUT = 28;

export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input;
  const tries: Array<{ key: string; value: string; role?: BarRole }> = [];
  let result: [number, number] | null = null;

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setMap(tries.slice())
      .setAux([
        {
          label: '结论',
          value: result ? `${n} = ${result[0]} + ${result[1]}` : '（搜索中）',
          role: result ? 'final' : 'frontier',
        },
      ])
      .commit();
  };

  snap({ zh: `验证 ${n} 的哥德巴赫分解`, en: `Verify Goldbach decomposition of ${n}` });

  const hooks: GoldbachHooks = {
    onTry: (p, q, pp, qp) => {
      const bothPrime = pp && qp;
      tries.push({
        key: `${p}+${q}`,
        value: `${p}${pp ? '✓' : '✗'} + ${q}${qp ? '✓' : '✗'}`,
        role: bothPrime ? 'final' : 'default',
      });
      snap({
        zh: `试 ${p}+${q}：${bothPrime ? '都是素数 ✓' : '至少一个非素数'}`,
        en: `Try ${p}+${q}: ${bothPrime ? 'both prime' : 'not both prime'}`,
      });
    },
    onResult: (found, pair) => {
      if (found && pair) {
        result = pair;
        snap({
          zh: `找到：${n} = ${pair[0]} + ${pair[1]}`,
          en: `Found: ${n} = ${pair[0]} + ${pair[1]}`,
        });
      } else {
        snap({ zh: '未找到（理论上不应发生于 >2 的偶数）', en: 'Not found' });
      }
    },
  };

  goldbach(n, hooks);

  rec
    .begin({
      zh: result ? `${n} = ${result[0]} + ${result[1]}` : '无解',
      en: result ? `${n} = ${result[0]} + ${result[1]}` : 'none',
    })
    .setMap(
      result
        ? [{ key: `${n}`, value: `${result[0]} + ${result[1]}`, role: 'final' as BarRole }]
        : [],
    )
    .setAux([{ label: '答案', value: result ? `${result[0]}+${result[1]}` : '无', role: 'final' }])
    .commit();

  return rec.build();
}
