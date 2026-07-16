// =============================================================================
// 确定性 Miller-Rabin · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { isPrimeMillerRabin, type MillerRabinDetHooks } from './impl.ts';

export const DEFAULT_INPUT: { n: bigint } = { n: 998244353n };

export function buildTrace(input: { n: number | bigint } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = typeof input.n === 'number' ? BigInt(input.n) : input.n;

  let curD = 0n;
  let curR = 0;
  const witnesses: Array<{ a: string; pass: boolean }> = [];

  rec
    .begin({ zh: `判定 ${n} 是否为素数`, en: `Test whether ${n} is prime` })
    .setAux([{ label: 'n', value: n.toString(), role: 'frontier' }])
    .commit();

  const hooks: MillerRabinDetHooks = {
    onDecompose: (d, r) => {
      curD = d;
      curR = r;
      rec
        .begin({ zh: `分解 n-1 = d·2^r：d=${d}, r=${r}`, en: `Factor n-1 = d·2^r: d=${d}, r=${r}` })
        .setAux([
          { label: 'd', value: d.toString(), role: 'compare' },
          { label: 'r', value: String(r), role: 'compare' },
        ])
        .commit();
    },
    onWitness: (a, passed) => {
      witnesses.push({ a: a.toString(), pass: passed });
      rec
        .begin({
          zh: `Witness a=${a}：${passed ? '通过' : '未通过（合数）'}`,
          en: `Witness a=${a}: ${passed ? 'pass' : 'fail (composite)'}`,
        })
        .setAux(
          witnesses.map((w, i) => ({
            label: `a=${w.a}`,
            value: w.pass ? '通过' : '失败',
            role: i === witnesses.length - 1 ? (w.pass ? 'final' : 'warn') : 'default',
          })),
        )
        .commit();
    },
  };

  const ans = isPrimeMillerRabin(n, hooks);

  rec
    .begin({
      zh: `${n} ${ans ? '是素数' : '是合数'}`,
      en: `${n} is ${ans ? 'prime' : 'composite'}`,
    })
    .setAux([
      { label: '结果', value: ans ? '素数' : '合数', role: ans ? 'final' : 'warn' },
      { label: 'd', value: curD.toString(), role: 'default' },
      { label: 'r', value: String(curR), role: 'default' },
    ])
    .commit();

  return rec.build();
}
