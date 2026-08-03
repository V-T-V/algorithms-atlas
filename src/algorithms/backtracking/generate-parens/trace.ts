// =============================================================================
// 括号生成 · 录制帧序列
// 无柱状图语义，改用 setAux 呈现「当前串 / 已用左括号 / 已用右括号 / 已找到数」，
// 把回溯的「放左 / 放右 / 撤销 / 找到」过程可视化。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { generateparens, type GenerateParensHooks } from './impl.ts';

export const DEFAULT_INPUT = 3;

/** 录制演示帧序列。 */
export function buildTrace(n: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  if (!Number.isInteger(n) || n < 0) n = DEFAULT_INPUT;

  let current = '';
  let open = 0;
  let close = 0;
  let found = 0;
  let lastResult = '';

  const render = (
    note: { zh: string; en: string },
    opts: { result?: boolean; done?: boolean } = {},
  ): void => {
    const resultRole: BarRole = opts.result ? 'final' : 'compare';
    rec
      .begin(note)
      .setAux([
        {
          label: '当前串',
          value: current || '∅',
          role: opts.result ? 'final' : 'pivot',
        },
        { label: '已用左 (', value: String(open), role: 'frontier' },
        { label: '已用右 )', value: String(close), role: 'compare' },
        {
          label: opts.done ? '总组合数' : '已找到',
          value: String(opts.done ? found : found),
          role: resultRole,
        },
      ])
      .commit();
  };

  rec
    .begin({
      zh: `生成 ${n} 对括号的所有合法组合（共 ${catalan(n)} 个）。`,
      en: `Generate all valid combinations of ${n} pairs of parentheses (${catalan(n)} total).`,
    })
    .setAux([
      { label: '对数 n', value: String(n), role: 'compare' },
      { label: '规则', value: 'close ≤ open', role: 'frontier' },
    ])
    .commit();

  const hooks: GenerateParensHooks = {
    onAdd: (ch, o, c, s) => {
      current = s;
      open = o;
      close = c;
      render({
        zh: `放 ${ch}：串 "${current}"（左 ${open} / 右 ${close}）`,
        en: `Add ${ch}: "${current}" (open ${open} / close ${close})`,
      });
    },
    onBacktrack: (ch) => {
      // 撤销后状态需重算
      open = ch === '(' ? open - 1 : open;
      close = ch === ')' ? close - 1 : close;
      current = current.slice(0, -1);
      render({
        zh: `撤销 ${ch}，回溯。串 "${current || '∅'}"`,
        en: `Undo ${ch}, backtrack. "${current || '∅'}"`,
      });
    },
    onResult: (s) => {
      found += 1;
      lastResult = s;
      current = s;
      render({ zh: `找到：${s}`, en: `Found: ${s}` }, { result: true });
    },
  };

  const results = generateparens(n, hooks);

  rec
    .begin({
      zh: `完成：共 ${results.length} 个合法组合`,
      en: `Done: ${results.length} valid combinations`,
    })
    .setAux([
      { label: '总组合数', value: String(results.length), role: 'final' },
      { label: '示例', value: results[0] ?? '', role: 'frontier' },
    ])
    .commit();

  return rec.build();
}

/** 第 n 个卡特兰数（用于展示预期数量）。 */
function catalan(n: number): number {
  if (n <= 1) return 1;
  let c = 1;
  for (let k = 2; k <= n; k++) c = (c * (4 * k - 2)) / (k + 1);
  return Math.round(c);
}
