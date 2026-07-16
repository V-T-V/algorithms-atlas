// =============================================================================
// 最长公共前缀（多串）· 录制帧序列
// setArray 展示当前列各串的字符码，pointer 标记列；setAux 展示当前前缀。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { longestCommonPrefix, type LCPHooks } from './impl.ts';

export const DEFAULT_INPUT = ['flower', 'flow', 'flight'];

const CODE = (s: string): number[] => Array.from(s, (c) => c.charCodeAt(0));

export function buildTrace(input: string[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const strs = input;
  let col = -1;
  let prefix = '';

  const snap = (note: { zh: string; en: string }): void => {
    // 用最长的串做坐标轴；每个串在该列的字符
    const maxLen = strs.reduce((m, s) => Math.max(m, s.length), 0);
    const values: number[] = [];
    const roles: BarRole[] = [];
    const pointers: Array<{ index: number; label: string }> = [];
    // 把各串按行拼接展示较复杂，这里简化：展示第一个串，col 处高亮
    const first = strs[0] ?? '';
    for (let i = 0; i < first.length; i++) {
      values.push(first.charCodeAt(i)!);
      roles.push(i === col ? 'compare' : 'default');
    }
    if (col >= 0 && col < first.length) pointers.push({ index: col, label: 'col' });
    void maxLen;
    rec
      .begin(note)
      .setArray(values, roles, pointers)
      .setAux([
        { label: '当前前缀', value: prefix || '∅', role: 'final' as BarRole },
        { label: '列', value: col < 0 ? '-' : String(col), role: 'pivot' as BarRole },
        ...strs.map((s, i) => ({
          label: `s${i}`,
          value: `'${s}'`,
          role: 'compare' as BarRole,
        })),
      ])
      .commit();
  };

  snap({
    zh: `查找 LCP：${strs.map((s) => `'${s}'`).join(', ')}`,
    en: `Find LCP of: ${strs.map((s) => `'${s}'`).join(', ')}`,
  });

  const hooks: LCPHooks = {
    onColumnCompare: (c, base, allEqual) => {
      col = c;
      if (allEqual) {
        prefix = (strs[0] ?? '').slice(0, c + 1);
      }
      snap({
        zh: `第 ${c} 列：基准 '${base}'，${allEqual ? '全相等' : '出现分歧'}`,
        en: `Col ${c}: base '${base}', ${allEqual ? 'all equal' : 'diverged'}`,
      });
    },
    onColumnMatch: (c, char) => {
      col = c;
      prefix = (strs[0] ?? '').slice(0, c + 1);
      void char;
      snap({
        zh: `纳入前缀：'${prefix}'`,
        en: `Include in prefix: '${prefix}'`,
      });
    },
    onDiverge: (c, reason) => {
      col = c;
      snap({
        zh: `第 ${c} 列${reason === 'short' ? '串长度不足' : '字符不等'}，停止`,
        en: `Col ${c} ${reason === 'short' ? 'too short' : 'differs'}, stop`,
      });
    },
  };

  const lcp = longestCommonPrefix(strs, hooks);
  void CODE;

  rec
    .begin({
      zh: `完成：LCP = '${lcp}'`,
      en: `Done: LCP = '${lcp}'`,
    })
    .setArray(
      CODE(lcp),
      CODE(lcp).map(() => 'final' as BarRole),
      [],
    )
    .setAux([
      { label: 'LCP', value: `'${lcp}'`, role: 'final' as BarRole },
      { label: '长度', value: String(lcp.length) },
    ])
    .commit();

  return rec.build();
}
