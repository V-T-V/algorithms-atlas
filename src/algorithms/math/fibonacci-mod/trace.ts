// =============================================================================
// 斐波那契取模·矩阵快速幂 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { fibMod, type FibModHooks } from './impl.ts';

export const DEFAULT_INPUT = { n: 10, mod: 1000 };

export function buildTrace(input: { n: number; mod: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { n, mod } = input;
  let expBits = BigInt(n).toString(2);
  let result = 0;
  let curExp = BigInt(n);

  const render = (note: { zh: string; en: string }): void => {
    // 展示二进制位
    const bits = BigInt(n).toString(2).padStart(1, '0');
    const values = bits.split('').map((_, i) => i + 1);
    const roles: Record<number, BarRole> = {};
    const labels: Record<number, string> = {};
    for (let i = 0; i < bits.length; i++) {
      labels[i] = `2^${bits.length - 1 - i}\n${bits[i]}`;
      if (bits[i] === '1') roles[i] = 'final';
      else roles[i] = 'default';
    }
    rec
      .begin(note)
      .setBars(rec.barsFrom(values, roles, labels))
      .setAux([
        { label: 'n', value: String(n), role: 'pivot' },
        { label: 'mod', value: String(mod), role: 'frontier' },
        { label: '二进制', value: expBits, role: 'compare' },
        { label: '当前指数', value: curExp.toString(), role: 'compare' },
        { label: '结果', value: result ? String(result) : '（计算中）', role: 'final' },
      ])
      .commit();
    void values;
  };

  render({ zh: `F(${n}) mod ${mod}`, en: `F(${n}) mod ${mod}` });

  const hooks: FibModHooks = {
    onSquare: (e) => {
      curExp = e;
      render({ zh: `指数 ${e} 平方`, en: `Square at exp ${e}` });
    },
    onMultiply: (info) => {
      expBits = info;
      render({ zh: info, en: info });
    },
    onResult: (v) => {
      result = v;
      render({ zh: `F(${n}) mod ${mod} = ${v}`, en: `F(${n}) mod ${mod} = ${v}` });
    },
  };

  fibMod(n, mod, hooks);

  rec
    .begin({ zh: `F(${n}) mod ${mod} = ${result}`, en: `F(${n}) mod ${mod} = ${result}` })
    .setBars([{ value: result, role: 'final' as BarRole, label: String(result) }])
    .setAux([{ label: '答案', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}
