// =============================================================================
// 生成括号 · 录制帧序列
// 用 setBars 展示当前构建的字符串（每字符一个 bar），用 setAux 展示已生成列表与状态。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { generateParentheses, catalan, type GenerateParenthesesHooks } from './impl.ts';

export const DEFAULT_INPUT = 3;

/** 录制演示帧序列。 */
export function buildTrace(n: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  let current = '';
  const collected: string[] = [];
  let lastCh = '';
  let lastAction: 'add' | 'backtrack' | 'collect' | 'none' = 'none';

  const render = (note: { zh: string; en: string }): void => {
    // bars：当前串的每个字符
    const bars = Array.from(current).map((ch, i) => ({
      value: i === current.length - 1 && lastAction === 'add' ? 2 : 1,
      role: (ch === '(' ? 'compare' : 'swap') as BarRole,
      label: ch,
    }));

    const aux: Array<{ label: string; value: string; role?: BarRole }> = [
      { label: '当前串', value: current || '∅', role: 'pivot' as BarRole },
      {
        label: 'open/close',
        value: `${(current.match(/\(/g) ?? []).length}/${(current.match(/\)/g) ?? []).length}`,
        role: 'frontier' as BarRole,
      },
      {
        label: '已生成',
        value: collected.length ? `${collected.length}: ${collected.join(', ')}` : '∅',
        role: 'final' as BarRole,
      },
      { label: '目标数', value: `${catalan(n)} (C_${n})`, role: 'compare' as BarRole },
    ];
    if (lastAction === 'backtrack') {
      aux.push({ label: '动作', value: `回溯（弹出 ${lastCh}）`, role: 'warn' as BarRole });
    } else if (lastAction === 'add') {
      aux.push({ label: '动作', value: `加入 ${lastCh}`, role: 'swap' as BarRole });
    } else if (lastAction === 'collect') {
      aux.push({ label: '动作', value: `收集 ✓`, role: 'final' as BarRole });
    }

    rec.begin(note).setBars(bars).setAux(aux).commit();
    lastAction = 'none';
  };

  render({
    zh: `生成 ${n} 对括号的所有合法组合（共 C_${n}=${catalan(n)} 个）`,
    en: `Generate all well-formed combinations of ${n} pairs (C_${n}=${catalan(n)} total)`,
  });

  const hooks: GenerateParenthesesHooks = {
    onAdd: (cur, ch) => {
      current = cur;
      lastCh = ch;
      lastAction = 'add';
      render({
        zh: `加入 '${ch}'：当前 "${current}"`,
        en: `Add '${ch}': now "${current}"`,
      });
    },
    onBacktrack: (cur, _open, _close) => {
      // cur 是弹出后的串；记录被弹出的字符
      lastCh = current.slice(-1);
      current = cur;
      lastAction = 'backtrack';
      render({
        zh: `回溯：弹出 '${lastCh}'，回到 "${current || '∅'}"`,
        en: `Backtrack: pop '${lastCh}', back to "${current || '∅'}"`,
      });
    },
    onCollect: (s, idx) => {
      collected.push(s);
      current = s;
      lastAction = 'collect';
      render({
        zh: `收集 #${idx + 1}: "${s}"`,
        en: `Collect #${idx + 1}: "${s}"`,
      });
    },
  };

  generateParentheses(n, hooks);

  // 终态
  rec
    .begin({
      zh: `完成：共 ${collected.length} 个合法组合（卡塔兰数 C_${n}=${catalan(n)}）`,
      en: `Done: ${collected.length} well-formed combinations (Catalan C_${n}=${catalan(n)})`,
    })
    .setBars(
      collected.map((s) => ({
        value: s.length,
        role: 'final' as BarRole,
        label: s,
      })),
    )
    .setAux([
      { label: '总数', value: String(collected.length), role: 'final' as BarRole },
      { label: 'C_' + n, value: String(catalan(n)), role: 'pivot' as BarRole },
      { label: '结果', value: collected.join(', '), role: 'frontier' as BarRole },
    ])
    .commit();

  return rec.build();
}
