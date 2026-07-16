// =============================================================================
// Miller-Rabin 素性测试 · 录制帧序列
// 用 setAux 展示分解 n-1=d·2^s、每个见证底数 a 的平方链与判定。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { millerRabin, type MillerRabinHooks, type WitnessOutcome } from './impl.ts';

export const DEFAULT_INPUT: { n: number } = { n: 10403 }; // 10403 = 101·103，无小素因子，能展示见证流程

/** 录制演示帧序列。 */
export function buildTrace(input: { n: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { n } = input;

  let s = 0;
  let d = 0n;
  let curA = 0;
  let curChain: number[] = [];
  let outcomes: WitnessOutcome[] = [];
  let finalComposite = true;

  const auxRows = (note: { zh: string; en: string }, verdictRole: BarRole = 'default'): void => {
    const aux = [
      { label: 'n', value: String(n), role: 'pivot' as BarRole },
      { label: 'n-1 = d·2^s', value: `d=${d}, s=${s}`, role: 'default' as BarRole },
      { label: '见证基 a', value: curA ? String(curA) : '—', role: 'frontier' as BarRole },
      {
        label: '平方链',
        value: curChain.length
          ? curChain.map((v) => (v === n - 1 ? `${v}(-1)` : String(v))).join(' → ')
          : '—',
        role: verdictRole,
      },
      {
        label: '已检测',
        value: outcomes.length
          ? outcomes.map((o) => `a=${o.a}:${o.composite ? '合数' : '过'}`).join(', ')
          : '—',
        role: 'default' as BarRole,
      },
    ];
    rec.begin(note).setAux(aux).commit();
  };

  auxRows({ zh: `测试 ${n} 是否为素数`, en: `Test whether ${n} is prime` });

  const hooks: MillerRabinHooks = {
    onDecompose: (ss, dd) => {
      s = ss;
      d = dd;
      auxRows({
        zh: `分解 n-1 = ${n - 1} = ${d} · 2^${s}`,
        en: `Decompose n-1 = ${n - 1} = ${d} · 2^${s}`,
      });
    },
    onWitness: (a) => {
      curA = a;
      curChain = [];
      auxRows({ zh: `选取见证基 a=${a}`, en: `Pick witness base a=${a}` });
    },
    onSquare: (value, hitOne, hitMinusOne) => {
      curChain.push(Number(value));
      let role: BarRole = 'compare';
      let note: { zh: string; en: string };
      if (hitMinusOne) {
        role = 'final';
        note = { zh: `余数 = n-1，本轮通过`, en: `Remainder = n-1, base passes` };
      } else if (hitOne) {
        role = 'warn';
        note = { zh: `余数 = 1（未先遇 -1）`, en: `Remainder = 1 (no -1 seen first)` };
      } else {
        note = { zh: `平方：余数 = ${value}`, en: `Square: remainder = ${value}` };
      }
      auxRows(note, role);
    },
    onWitnessDone: (out) => {
      outcomes = [...outcomes, out];
      const role: BarRole = out.composite ? 'warn' : 'final';
      auxRows(
        {
          zh: `a=${out.a}：${out.composite ? '发现见证 → 合数' : '通过（无法证伪）'}`,
          en: `a=${out.a}: ${out.composite ? 'witness found → composite' : 'passes (cannot disprove)'}`,
        },
        role,
      );
    },
    onDone: (nn, isComposite) => {
      finalComposite = isComposite;
      rec
        .begin({
          zh: `${nn} ${finalComposite ? '是合数' : '是素数'}`,
          en: `${nn} is ${finalComposite ? 'composite' : 'prime'}`,
        })
        .setAux([
          {
            label: '结论',
            value: finalComposite ? '合数 composite' : '素数 prime',
            role: (finalComposite ? 'warn' : 'final') as BarRole,
          },
          { label: '检测轮数', value: String(outcomes.length), role: 'default' as BarRole },
        ])
        .commit();
    },
  };

  millerRabin(n, 12, hooks);

  return rec.build();
}
