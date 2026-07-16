// =============================================================================
// Pratt 解析器 · 录制帧序列
// 用 setAux 展示解析位置、当前 token、结合力表与逐步求值。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { prattParse, tokenize, type PrattHooks } from './impl.ts';

export const DEFAULT_INPUT = '1 + 2 * 3 ^ 2';

/** 录制演示帧序列。 */
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const tokens = tokenize(input);
  let pos = 0;
  let curBp = 0;
  // 累积的运算历史
  const history: Array<{ op: string; left: number; right: number; result: number }> = [];

  const snapshot = (note: { zh: string; en: string }): void => {
    const consumed = tokens.slice(0, pos).join(' ');
    const remaining = tokens.slice(pos).join(' ');
    const aux: Array<{ label: string; value: string; role?: BarRole }> = [
      {
        label: '输入',
        value: `[${consumed}] ▍ ${remaining}`,
        role: 'compare' as BarRole,
      },
      { label: 'pos', value: String(pos), role: 'pivot' as BarRole },
      { label: '当前 token', value: tokens[pos] ?? '⟨EOF⟩', role: 'frontier' as BarRole },
      { label: '当前 minBp', value: String(curBp), role: 'default' as BarRole },
      {
        label: '结合力表',
        value: '+:-=10  *:/=20  ^:31/30(右结合)',
        role: 'default' as BarRole,
      },
      {
        label: '已求值',
        value: history.length
          ? history.map((h) => `${h.left}${h.op}${h.right}=${h.result}`).join(', ')
          : '∅',
        role: 'final' as BarRole,
      },
    ];
    rec.begin(note).setAux(aux).commit();
  };

  snapshot({
    zh: `Pratt 解析：${input}（token: ${tokens.join(' ')}）`,
    en: `Pratt parse: ${input} (tokens: ${tokens.join(' ')})`,
  });

  const hooks: PrattHooks = {
    onEnter: (minBp) => {
      curBp = minBp;
      snapshot({
        zh: `进入子表达式（minBp=${minBp}）：从此处开始解析，直到遇到结合力 ≤ ${minBp} 的运算符`,
        en: `Enter sub-expression (minBp=${minBp}): parse until an operator with bp ≤ ${minBp}`,
      });
    },
    onNumber: (v) => {
      pos++;
      snapshot({
        zh: `读取数字 ${v}`,
        en: `Read number ${v}`,
      });
    },
    onBinary: (op, left, right, result) => {
      history.push({ op, left, right, result });
      pos++; // 消费运算符（onBinary 在消费 op 之后调用）
      snapshot({
        zh: `二元运算：${left} ${op} ${right} = ${result}`,
        en: `Binary op: ${left} ${op} ${right} = ${result}`,
      });
    },
    onResult: (v) => {
      snapshot({
        zh: `解析完成，结果 = ${v}`,
        en: `Parse complete, result = ${v}`,
      });
    },
  };

  const result = prattParse(tokens, hooks);

  // 终态
  rec
    .begin({ zh: `结果：${result}`, en: `Result: ${result}` })
    .setAux([
      { label: '表达式', value: input, role: 'compare' as BarRole },
      { label: '结果', value: String(result), role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
