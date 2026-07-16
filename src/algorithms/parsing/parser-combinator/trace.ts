// =============================================================================
// 解析器组合子 · 录制帧序列
// 用 array2d 展示逐步解析的输入位置 + 已识别的键值对，
// 用 aux 展示当前事件（try/success/fail）与进度。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { run, buildPairParser, type CombinatorHooks, type Pair, DEMO_INPUT } from './impl.ts';

export const DEFAULT_INPUT = DEMO_INPUT;

interface TryEvent {
  kind: 'try' | 'success' | 'failure';
  name: string;
  pos: number;
  newPos?: number;
}

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const events: TryEvent[] = [];

  const hooks: CombinatorHooks = {
    onTry: (name, pos) => events.push({ kind: 'try', name, pos }),
    onSuccess: (name, pos, newPos) => events.push({ kind: 'success', name, pos, newPos }),
    onFailure: (name, pos) => events.push({ kind: 'failure', name, pos }),
  };

  const parser = buildPairParser(hooks);
  const result = run(parser, input);

  // 初始帧
  rec
    .begin({ zh: `用组合子解析："${input}"`, en: `Parse with combinators: "${input}"` })
    .setAux([
      {
        label: '文法',
        value: 'pairs → pair (";" pair)* ; pair → key "=" value',
        role: 'default' as BarRole,
      },
      { label: '输入', value: input, role: 'compare' as BarRole },
    ])
    .commit();

  // 按 success 事件（每个 key/value 识别）录关键帧
  let lastEventStr = '';
  for (let i = 0; i < events.length; i++) {
    const ev = events[i]!;
    lastEventStr = `${ev.kind} ${ev.name}@${ev.pos}`;
    if (ev.kind !== 'success') continue;
    // 找到该 success 时已识别的 pair（重新解析到该位置）
    const partialInput = input.slice(0, 'newPos' in ev ? ev.pos : ev.pos);
    // 简单展示：用输入字符行 + 高亮当前位置
    const chars = input.split('');
    const grid: { v: string; role: BarRole }[][] = [];
    // 第一行：输入字符
    grid.push(
      chars.map((ch, idx) => ({
        v: ch === ' ' ? '·' : ch,
        role: (idx < ev.pos ? 'sorted' : idx === ev.pos ? 'pivot' : 'default') as BarRole,
      })),
    );
    // 第二行：最近事件链
    const recent = events.slice(Math.max(0, i - 3), i + 1);
    grid.push(
      recent.map((e) => ({
        v: `${e.kind[0]!.toUpperCase()}${e.name}`,
        role: (e.kind === 'failure'
          ? 'warn'
          : e.kind === 'success'
            ? 'final'
            : 'compare') as BarRole,
      })),
    );
    rec
      .begin({ zh: `成功 ${ev.name} @${ev.pos}`, en: `Success ${ev.name} @${ev.pos}` })
      .setGrid(grid.map((row) => row.map((c) => ({ v: c.v, role: c.role }))))
      .setAux([
        { label: '输入', value: input, role: 'compare' as BarRole },
        { label: '位置', value: String(ev.pos), role: 'frontier' as BarRole },
        { label: '最近事件', value: lastEventStr, role: 'default' as BarRole },
      ])
      .commit();
    void partialInput;
  }

  // 最终帧
  const pairs = (result.ok && Array.isArray(result.value) ? result.value : []) as Pair[];
  rec
    .begin({ zh: '完成', en: 'Done' })
    .setGrid([
      input.split('').map((ch) => ({
        v: ch === ' ' ? '·' : ch,
        role: (result.ok ? 'final' : 'warn') as BarRole,
      })),
    ])
    .setAux([
      {
        label: '结果',
        value: result.ok ? `${pairs.length} 个键值对` : `失败：${result.error}`,
        role: (result.ok ? 'final' : 'warn') as BarRole,
      },
      {
        label: '键值对',
        value: pairs.map((p) => `${p.key}=${p.value}`).join('; '),
        role: 'compare' as BarRole,
      },
    ])
    .commit();

  return rec.build();
}
