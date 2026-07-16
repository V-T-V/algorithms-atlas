// =============================================================================
// LZW 编码 · 录制帧序列
// 用 setArray 展示输入字节流（扫描游标 + 已输出码字高亮），
// setAux 展示字典构建过程（code → string）与当前前缀。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lzw, type LzwHooks } from './impl.ts';

/** 展示用：把字符串渲染成可见的字符码（控制字符做可视化）。 */
export const DEFAULT_INPUT = 'ABABABA';

/** 把字符串转成「可见字符码」数组用于 setArray（保留字符 ASCII 值）。 */
function toCodes(s: string): number[] {
  return Array.from(s).map((c) => c.charCodeAt(0));
}

/** 把字符串里的不可见字符转义成可读形式。 */
function visible(s: string): string {
  return s.length === 0 ? '∅' : JSON.stringify(s);
}

/** 录制演示帧序列。 */
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const codes = toCodes(input);
  const dictEntries: Array<{ label: string; value: string; role: BarRole }> = [];
  // 字典初始 256 项太多，aux 只展示「新增」条目（code >= 256）
  let cursor = 0; // 当前扫描到的位置
  let curPrefix = '';
  const emittedCodes: number[] = [];

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = codes.map((_, i) => {
      if (i < cursor - 1) return 'final'; // 已输出覆盖的
      if (i === cursor - 1 || i === cursor) return 'compare'; // 当前前缀涉及
      return 'default';
    });
    const pointers: Array<{ index: number; label: string }> = [];
    if (cursor < codes.length) pointers.push({ index: cursor, label: 'i' });
    const aux = [
      ...dictEntries,
      {
        label: '前缀 P',
        value: visible(curPrefix),
        role: 'pivot' as BarRole,
      },
      {
        label: '已输出码字',
        value: emittedCodes.length ? emittedCodes.join(', ') : '∅',
        role: 'final' as BarRole,
      },
    ];
    rec
      .begin(note)
      .setArray([...codes], roles, pointers)
      .setAux(aux)
      .commit();
  };

  snapshot({
    zh: `输入「${input}」（${input.length} 字符）`,
    en: `Input "${input}" (${input.length} chars)`,
  });

  const hooks: LzwHooks = {
    onAdvance: (pos, p) => {
      cursor = pos;
      curPrefix = p;
      snapshot({
        zh: `前缀 P = ${visible(p)} 在字典中，继续扩展`,
        en: `Prefix P = ${visible(p)} in dict, extend`,
      });
    },
    onDictAdd: (code, entry) => {
      dictEntries.push({
        label: `${code}`,
        value: visible(entry),
        role: 'swap' as BarRole,
      });
    },
    onEmit: (code, entry) => {
      emittedCodes.push(code);
      dictEntries.forEach((e) => (e.role = 'final' as BarRole));
      snapshot({
        zh: `输出码字 ${code}（=${visible(entry)}），并把 ${visible(entry)} 加入字典`,
        en: `Emit code ${code} (=${visible(entry)}); add ${visible(entry)} to dict`,
      });
    },
  };

  const result = lzw(input, hooks);

  // 终态：码字流 + 完整字典
  rec
    .begin({
      zh: `完成：${result.codes.length} 个码字（原 ${input.length} 字符）`,
      en: `Done: ${result.codes.length} codes (from ${input.length} chars)`,
    })
    .setMap([
      { key: '输入 / input', value: input, role: 'default' as BarRole },
      {
        key: '码字流 / codes',
        value: result.codes.join(', '),
        role: 'final' as BarRole,
      },
      {
        key: '字典新增条目',
        value: String(result.dict.size - 256),
        role: 'pivot' as BarRole,
      },
    ])
    .commit();

  return rec.build();
}
