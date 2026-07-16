// =============================================================================
// FizzBuzz · 录制帧序列
// 用 setArray 展示逐步生成的输出序列；setAux 显示当前数的判定。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { fizzBuzz, type FizzBuzzHooks } from './impl.ts';

export const DEFAULT_INPUT = 15;

/** 录制演示帧序列。 */
export function buildTrace(n: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const collected: string[] = [];

  const render = (note: { zh: string; en: string }, curIndex: number, label: string): void => {
    // values：已确定的部分填字符串数值化的「类别码」（1=Fizz,2=Buzz,3=FizzBuzz,0=数字本身）
    const values: number[] = [];
    const roles: BarRole[] = [];
    for (let i = 0; i < n; i++) {
      if (i < collected.length) {
        const v = collected[i]!;
        values.push(v === 'FizzBuzz' ? 3 : v === 'Fizz' ? 1 : v === 'Buzz' ? 2 : Number(v));
        roles.push(i === curIndex - 1 ? 'final' : 'sorted');
      } else {
        values.push(0);
        roles.push(i === curIndex - 1 ? 'compare' : 'default');
      }
    }
    rec
      .begin(note)
      .setArray(
        values,
        roles,
        curIndex - 1 >= 0 && curIndex - 1 < n ? [{ index: curIndex - 1, label: 'i' }] : [],
      )
      .setAux([
        { label: '当前 i', value: String(curIndex), role: 'pivot' as BarRole },
        { label: '输出', value: label, role: 'final' as BarRole },
        {
          label: 'i%3',
          value: curIndex % 3 === 0 ? '0 (Fizz)' : String(curIndex % 3),
          role: 'compare' as BarRole,
        },
        {
          label: 'i%5',
          value: curIndex % 5 === 0 ? '0 (Buzz)' : String(curIndex % 5),
          role: 'compare' as BarRole,
        },
      ])
      .commit();
  };

  rec
    .begin({
      zh: `从 1 数到 ${n}，按 3/5 整除规则输出。`,
      en: `Count 1 to ${n}, output by divisibility rules for 3 and 5.`,
    })
    .setArray(new Array(n).fill(0), new Array(n).fill('default' as BarRole), [])
    .setAux([
      { label: '上界 n', value: String(n), role: 'pivot' as BarRole },
      { label: '规则', value: '%3→Fizz, %5→Buzz', role: 'compare' as BarRole },
    ])
    .commit();

  const hooks: FizzBuzzHooks = {
    onNumber: (i, label) => {
      collected.push(label);
      render(
        {
          zh: `i=${i}：${i % 3 === 0 ? '被 3 整除' : '不被 3 整除'}，${i % 5 === 0 ? '被 5 整除' : '不被 5 整除'} → "${label}"`,
          en: `i=${i}: ${i % 3 === 0 ? 'div by 3' : 'not div by 3'}, ${i % 5 === 0 ? 'div by 5' : 'not div by 5'} → "${label}"`,
        },
        i,
        label,
      );
    },
  };

  fizzBuzz(n, hooks);

  // 终态
  const finalValues = collected.map((v) =>
    v === 'FizzBuzz' ? 3 : v === 'Fizz' ? 1 : v === 'Buzz' ? 2 : Number(v),
  );
  rec
    .begin({
      zh: `完成。序列：${collected.join(', ')}`,
      en: `Done. Sequence: ${collected.join(', ')}`,
    })
    .setArray(
      finalValues,
      finalValues.map(() => 'sorted' as BarRole),
      [],
    )
    .setAux([{ label: '总数', value: String(n), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
