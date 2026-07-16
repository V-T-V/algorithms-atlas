// =============================================================================
// 外星人词典 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { alienOrder, type AlienDictHooks } from './impl.ts';

export const DEFAULT_WORDS = ['wrt', 'wrf', 'er', 'ett', 'rftt'];

export function buildTrace(words: string[] = DEFAULT_WORDS): Frame[] {
  const rec = new TraceRecorder();
  const order: string[] = [];
  let result = '';

  const snap = (note: { zh: string; en: string }): void => {
    const chars = new Set<string>();
    words.forEach((w) => w.split('').forEach((c) => chars.add(c)));
    const all = [...chars].sort();
    const roles: BarRole[] = all.map((c) => (order.includes(c) ? 'final' : 'default'));
    rec
      .begin(note)
      .setBars(all.map((c, i) => ({ value: c.charCodeAt(0), role: roles[i]!, label: c })))
      .setAux([{ label: '顺序', value: order.length ? order.join(' → ') : '∅', role: 'frontier' }])
      .commit();
  };

  snap({ zh: `词典 ${words.length} 词`, en: `${words.length} words` });

  const hooks: AlienDictHooks = {
    onEdge: (a, b) => snap({ zh: `边 ${a}→${b}`, en: `Edge ${a}→${b}` }),
    onOutput: (c) => {
      order.push(c);
      snap({ zh: `输出 ${c}`, en: `Output ${c}` });
    },
    onResult: (r) => {
      result = r;
      snap({ zh: r ? `完成：${r}` : '无解（环）', en: r ? `Done: ${r}` : 'No solution (cycle)' });
    },
  };

  alienOrder(words, hooks);

  rec
    .begin({ zh: result ? '完成' : '无解', en: result ? 'Done' : 'No solution' })
    .setAux([{ label: '字母序 / order', value: result || '(empty)', role: 'final' }])
    .commit();

  return rec.build();
}
