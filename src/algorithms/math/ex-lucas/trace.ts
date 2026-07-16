// 扩展Luc卡斯 · 录制帧序列

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { exLucas, type ExLucasHooks } from './impl.ts';

/** 默认演示：C(10, 4) mod 12 = 210 mod 12 = 6。 */
export const DEFAULT_INPUT: { n: bigint; m: bigint; mod: bigint } = {
  n: 10n,
  m: 4n,
  mod: 12n,
};

/** 录制演示帧序列。 */
export function buildTrace(input: { n: bigint; m: bigint; mod: bigint } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { n, m, mod: M } = input;

  rec
    .begin({
      zh: `计算 C(${n}, ${m}) mod ${M}`,
      en: `Compute C(${n}, ${m}) mod ${M}`,
    })
    .commit();

  const parts: Array<{ label: string; value: bigint }> = [];

  const hooks: ExLucasHooks = {
    onFactor: (p, q, pk) => {
      parts.push({ label: `${p}^${q}`, value: pk });
      rec
        .begin({ zh: `分解出因子 ${p}^${q} = ${pk}`, en: `Factor ${p}^${q} = ${pk}` })
        .setBars(rec.barsFrom(parts.map((x) => Number(x.value))))
        .commit();
    },
    onSubResult: (p, q, r) => {
      rec
        .begin({
          zh: `在 ${p}^${q} 下，C ≡ ${r}`,
          en: `Under ${p}^${q}: C ≡ ${r}`,
        })
        .setBars(rec.barsFrom([Number(r)], ['compare' as const]))
        .commit();
    },
    onCrt: (acc, total) => {
      rec
        .begin({
          zh: `CRT 合并：x ≡ ${acc} (mod ${total})`,
          en: `CRT merge: x ≡ ${acc} (mod ${total})`,
        })
        .setBars(rec.barsFrom([Number(acc)], ['swap' as const]))
        .commit();
    },
    onDone: (_n, _m, _M, result) => {
      rec
        .begin({
          zh: `最终结果 C(${n}, ${m}) mod ${M} = ${result}`,
          en: `Final C(${n}, ${m}) mod ${M} = ${result}`,
        })
        .setBars(rec.barsFrom([Number(result)], ['final' as const]))
        .commit();
    },
  };

  const result = exLucas(n, m, M, hooks);
  void result;

  return rec.build();
}
