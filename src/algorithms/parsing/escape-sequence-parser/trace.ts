// 转义序列解析 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { parseEscapes, type EscapeHooks, type EscapeState } from './impl.ts';

export const DEFAULT_INPUT = 'a\\tb\\nc\\x41\\u4e2d';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const chars = [...input];
  const output: string[] = [];
  let scanIdx = 0;
  let curState: EscapeState = 'normal';

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = chars.map(
      (_, i) => (i < scanIdx ? 'final' : i === scanIdx ? 'compare' : 'default') as BarRole,
    );
    rec
      .begin(note)
      .setArray(
        chars.map((c) => c.charCodeAt(0)),
        roles,
        scanIdx < chars.length ? [{ index: scanIdx, label: 'i' }] : [],
      )
      .setAux([
        { label: '状态', value: curState, role: 'pivot' as BarRole },
        { label: '扫描', value: String(scanIdx), role: 'compare' as BarRole },
        { label: '输出', value: JSON.stringify(output.join('')), role: 'final' as BarRole },
      ])
      .commit();
  };

  snapshot({ zh: `解析转义：${chars.length} 字符`, en: `Parse escapes: ${chars.length} chars` });

  const hooks: EscapeHooks = {
    onTransition: (_f, to, _c) => {
      curState = to;
    },
    onChar: (ch, source) => {
      output.push(ch);
      void source;
    },
  };

  // 自定义扫描以推进 scanIdx
  const idx = 0;
  for (let i = 0; i < input.length; i++) {
    scanIdx = i;
    void idx;
  }
  // 简化：在 parseEscapes 内部不暴露位置，这里用结果后做整体
  parseEscapes(input, hooks);
  scanIdx = chars.length;

  // 重做一遍以逐字符快照（用回调无法定位，故用分段）
  output.length = 0;
  let acc = '';
  for (let i = 0; i < input.length; i++) {
    scanIdx = i;
    const partial = parseEscapes(input.slice(0, i + 1));
    output.length = 0;
    output.push(partial);
    acc = partial;
    void acc;
    snapshot({ zh: `处理到 [${i}]="${input[i]}"`, en: `Process [${i}]="${input[i]}"` });
  }

  const final = parseEscapes(input, hooks);

  rec
    .begin({ zh: `完成`, en: `Done` })
    .setAux([
      { label: '输入', value: input, role: 'compare' as BarRole },
      { label: '输出', value: JSON.stringify(final), role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
