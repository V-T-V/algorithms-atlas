// SHA-256 · 录制帧序列
// 用 setAux 展示每个消息块处理后的中间哈希值。

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sha256, type SHA256Hooks } from './impl.ts';

export const DEFAULT_INPUT = 'abc';

export function buildTrace(message: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const blockHashes: string[] = [];

  rec
    .begin({
      zh: `输入："${message}"（${message.length} 字节）`,
      en: `Input: "${message}" (${message.length} bytes)`,
    })
    .setAux([
      { label: '输入', value: message, role: 'pivot' as BarRole },
      {
        label: '填充后块数',
        value: String(Math.ceil((message.length + 9) / 64)),
        role: 'default' as BarRole,
      },
    ])
    .commit();

  const hooks: SHA256Hooks = {
    onBlock: (idx, hash) => {
      blockHashes.push(hash);
      rec
        .begin({
          zh: `处理块 ${idx} 后中间哈希`,
          en: `After block ${idx}`,
        })
        .setAux([{ label: `块 ${idx} 哈希`, value: hash, role: 'compare' as BarRole }])
        .commit();
    },
  };

  const result = sha256(message, hooks);

  rec
    .begin({ zh: `最终哈希`, en: `Final hash` })
    .setAux([{ label: 'SHA-256', value: result, role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
