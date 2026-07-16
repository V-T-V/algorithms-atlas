// =============================================================================
// LZ77 滑动窗口 · 录制帧序列
// 用 setArray 展示输入字节流（窗口边界 + 当前指针 + 匹配区），
// setAux 展示滑动窗口内容、当前匹配与已输出的三元组。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lz77, toCodePoints, type Lz77Hooks, type Lz77Token } from './impl.ts';

export const DEFAULT_INPUT = 'ABABABABABC';

/** 码点 → 可见字符（控制字符转义）。 */
function vis(c: number): string {
  if (c < 32 || c > 126) return `·${c}`;
  return String.fromCodePoint(c);
}

/** 录制演示帧序列。 */
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const data = toCodePoints(input);
  const windowSize = 8; // 演示用小窗口
  const lookahead = 8;
  const emitted: Lz77Token[] = [];

  let pos = 0;
  let matchRange: { from: number; to: number; dist: number; len: number } | null = null;

  const snapshot = (note: { zh: string; en: string }): void => {
    const winStart = Math.max(0, pos - windowSize);
    const roles: BarRole[] = data.map((_, i) => {
      if (i < winStart) return 'final'; // 已滑出窗口
      if (i < pos) return 'sorted'; // 搜索缓冲区
      if (matchRange && i >= pos && i < pos + matchRange.len) return 'compare'; // 当前匹配的前看区
      if (i === pos) return 'pivot';
      return 'default'; // 未触及
    });
    const pointers: Array<{ index: number; label: string }> = [
      { index: Math.min(pos, data.length - 1 < 0 ? 0 : data.length), label: 'pos' },
    ];
    if (pos < data.length) pointers[0] = { index: pos, label: 'pos' };

    const winStr = data.slice(winStart, pos).map(vis).join('');
    const lookStr = data
      .slice(pos, pos + lookahead)
      .map(vis)
      .join('');
    const aux = [
      { label: '搜索窗口', value: winStr || '∅', role: 'sorted' as BarRole },
      { label: '前看缓冲', value: lookStr || '∅', role: 'pivot' as BarRole },
      {
        label: '当前匹配',
        value: matchRange ? `dist=${matchRange.dist}, len=${matchRange.len}` : '无匹配',
        role: (matchRange ? 'compare' : 'default') as BarRole,
      },
      {
        label: '已输出 token',
        value: emitted.length
          ? emitted
              .map((t) => `(${t.distance},${t.length},${t.next < 0 ? 'EOF' : vis(t.next)})`)
              .join(' ')
          : '∅',
        role: 'final' as BarRole,
      },
    ];
    rec
      .begin(note)
      .setArray([...data], roles, pointers)
      .setAux(aux)
      .commit();
    matchRange = null;
  };

  snapshot({
    zh: `输入「${input}」（${data.length} 码点），窗口=${windowSize}，前看=${lookahead}`,
    en: `Input "${input}" (${data.length} pts), window=${windowSize}, lookahead=${lookahead}`,
  });

  const hooks: Lz77Hooks = {
    onAdvance: (p) => {
      pos = p;
      snapshot({
        zh: `指针前移到 ${p}，寻找最长匹配`,
        en: `Advance to ${p}, search for longest match`,
      });
    },
    onMatch: (p, dist, len) => {
      matchRange = { from: p - dist, to: p - dist + len, dist, len };
      snapshot({
        zh: `在距离 ${dist} 处找到长度 ${len} 的匹配`,
        en: `Found match of length ${len} at distance ${dist}`,
      });
    },
    onEmit: (token) => {
      emitted.push(token);
      snapshot({
        zh: `输出三元组 (${token.distance}, ${token.length}, ${token.next < 0 ? 'EOF' : vis(token.next)})`,
        en: `Emit (${token.distance}, ${token.length}, ${token.next < 0 ? 'EOF' : vis(token.next)})`,
      });
    },
  };

  const result = lz77(input, windowSize, lookahead, hooks);
  pos = data.length;

  // 终态：token 序列 + 还原校验
  rec
    .begin({
      zh: `完成：${result.tokens.length} 个三元组（原 ${data.length} 码点）`,
      en: `Done: ${result.tokens.length} tokens (from ${data.length} pts)`,
    })
    .setMap([
      { key: '输入 / input', value: input, role: 'default' as BarRole },
      {
        key: '三元组 / tokens',
        value: result.tokens
          .map((t) => `(${t.distance},${t.length},${t.next < 0 ? 'EOF' : vis(t.next)})`)
          .join(' '),
        role: 'final' as BarRole,
      },
    ])
    .commit();

  return rec.build();
}
