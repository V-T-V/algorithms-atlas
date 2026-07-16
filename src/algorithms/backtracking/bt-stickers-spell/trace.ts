// 贴纸拼词 · 录制帧序列
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { btStickersSpell, type BtStickersSpellHooks } from './impl.ts';

export const DEFAULT_INPUT = { stickers: ['with', 'example', 'science'], target: 'thehat' };

export function buildTrace(input: { stickers: string[]; target: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `贴纸 [${input.stickers.join(', ')}] 拼「${input.target}」`,
      en: `Stickers [${input.stickers.join(', ')}] to spell "${input.target}"`,
    })
    .setAux([
      { label: 'target', value: input.target, role: 'pivot' },
      { label: '贴纸数', value: String(input.stickers.length), role: 'default' },
    ])
    .commit();

  const hooks: BtStickersSpellHooks = {
    onApply: (si, remaining) => {
      rec
        .begin({
          zh: `用贴纸「${input.stickers[si]}」，剩余字母数 ${remaining}`,
          en: `Apply sticker "${input.stickers[si]}", ${remaining} letters left`,
        })
        .setAux([
          { label: 'sticker', value: input.stickers[si]!, role: 'compare' },
          { label: '剩余', value: String(remaining), role: remaining === 0 ? 'final' : 'default' },
        ])
        .commit();
    },
  };

  const res = btStickersSpell(input.stickers, input.target, hooks);

  rec
    .begin({
      zh: `完成：最少 ${res} 张贴纸`,
      en: `Done: min ${res} stickers`,
    })
    .setAux([{ label: '最少贴纸数', value: String(res), role: 'final' }])
    .commit();

  return rec.build();
}
