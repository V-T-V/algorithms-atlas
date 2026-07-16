// =============================================================================
// 失配函数（KMP 前缀函数 π）· 录制帧序列
// setArray 展示模式串（字符码），pointer 标注 i；setAux 展示 fail 数组与当前 len。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { failureFunction, type FailureFunctionHooks } from './impl.ts';

export const DEFAULT_INPUT = 'ABABCABAB';

const CODE = (s: string): number[] => Array.from(s, (c) => c.charCodeAt(0));

/** 录制演示帧序列。 */
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const pat = input;
  const m = pat.length;
  let i = -1;
  let curLen = 0;
  let roleI: BarRole = 'default';
  const fail: number[] = new Array<number>(m).fill(0);

  const aux = (): Array<{ label: string; value: string; role?: BarRole }> => [
    { label: 'pat', value: pat },
    { label: 'i', value: i < 0 ? '-' : String(i), role: 'compare' },
    { label: 'len', value: String(curLen), role: 'frontier' },
    { label: 'fail', value: `[${fail.join(', ')}]` },
  ];

  const snap = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = new Array(m).fill('default');
    const pointers: Array<{ index: number; label: string }> = [];
    if (i >= 0) {
      pointers.push({ index: i, label: 'i' });
      roles[i] = roleI;
      if (curLen > 0 && curLen < m) pointers.push({ index: curLen, label: 'len' });
    }
    rec.begin(note).setArray(CODE(pat), roles, pointers).setAux(aux()).commit();
    roleI = 'default';
  };

  snap({ zh: `构造失配函数：${pat}`, en: `Build failure function: ${pat}` });

  const hooks: FailureFunctionHooks = {
    onFallback: (idx, from, to) => {
      i = idx;
      curLen = to;
      roleI = 'warn';
      snap({ zh: `失配：len 从 ${from} 回退到 ${to}`, en: `Mismatch: len falls ${from} -> ${to}` });
    },
    onSet: (idx, value) => {
      fail[idx] = value;
      curLen = value;
      i = idx;
      roleI = value > 0 ? 'compare' : 'default';
      snap({ zh: `fail[${idx}] = ${value}`, en: `fail[${idx}] = ${value}` });
    },
    onDone: () => {
      /* 终态 */
    },
  };

  failureFunction(pat, hooks);

  rec
    .begin({ zh: `完成：fail = [${fail.join(', ')}]`, en: `Done: fail = [${fail.join(', ')}]` })
    .setArray(CODE(pat), new Array(m).fill('final'), [])
    .setAux(aux())
    .commit();

  return rec.build();
}
