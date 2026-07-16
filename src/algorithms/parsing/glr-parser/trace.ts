// =============================================================================
// 广义 LR 解析 · 录制帧序列
// 策略：先完整跑一遍解析、按输入位置收集事件；再按位置回放逐帧录制。
// 每帧用 array2d 展示 token 行（已消费/当前/未处理）+ 栈头行（数量随分裂增长）。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { glrParse, demoGrammar, DEMO_TOKENS, type GlrHooks, type Rule } from './impl.ts';

export const DEFAULT_INPUT = DEMO_TOKENS.join(' ');

const describeRule = (rule: Rule): string => `${rule.lhs} → ${rule.rhs.join(' ')}`;

export function buildTrace(inputTokens: string[] = DEMO_TOKENS): Frame[] {
  const rec = new TraceRecorder();
  const { rules, startLhs } = demoGrammar();
  const tokens = inputTokens;

  // 按输入位置收集事件 + 栈头数
  const eventsByPos = new Map<number, string[]>();
  const headsByPos = new Map<number, number>();
  let lastPos = -1;
  let finalAccepted = false;
  let finalTrees = 0;

  const push = (pos: number, msg: string): void => {
    const arr = eventsByPos.get(pos) ?? [];
    arr.push(msg);
    eventsByPos.set(pos, arr);
  };

  const hooks: GlrHooks = {
    onToken: (pos, token, numHeads) => {
      lastPos = pos;
      headsByPos.set(pos, numHeads);
      push(pos, `读入 "${token}"`);
    },
    onShift: (_pos, _token, fs, ts) => push(lastPos, `移进 S${fs}→S${ts}`),
    onReduce: (_pos, rule, state) => push(lastPos, `归约 ${describeRule(rule)} @S${state}`),
    onSplit: (pos, numHeads) => {
      push(pos, `栈头分裂 → ${numHeads} 个`);
      headsByPos.set(pos, numHeads);
    },
    onResult: (accepted, numTrees) => {
      finalAccepted = accepted;
      finalTrees = numTrees;
      push(tokens.length, accepted ? `接受（${numTrees} 棵解析树）` : '拒绝');
    },
  };

  glrParse(tokens, rules, startLhs, hooks);

  // —— 初始帧 ——
  rec
    .begin({
      zh: `初始：单个栈头 S0，解析 "${tokens.join(' ')}"`,
      en: `Init: single head S0, parse "${tokens.join(' ')}"`,
    })
    .setGrid([
      tokens.map((t) => ({ v: t, role: 'default' as BarRole })),
      [{ v: '#0: S0', role: 'compare' as BarRole }],
    ])
    .setAux([
      { label: '文法', value: 'E → E+E | E*E | n', role: 'default' as BarRole },
      { label: '输入', value: tokens.join(' '), role: 'compare' as BarRole },
    ])
    .commit();

  // —— 按位置回放关键帧 ——
  for (let pos = 0; pos < tokens.length; pos++) {
    const ev = eventsByPos.get(pos) ?? [];
    const numHeads = headsByPos.get(pos) ?? 1;
    const hasSplit = ev.some((e) => e.includes('分裂'));
    const consumed = tokens.slice(0, pos + 1).join(' ');
    const remaining = tokens.slice(pos + 1).join(' ');
    const tokenRow = tokens.map((t, i) => ({
      v: t,
      role: (i <= pos ? 'sorted' : i === pos + 1 ? 'pivot' : 'default') as BarRole,
    }));
    // 栈头行：每行一个头（最多展示 4 个）
    const headRows = Array.from({ length: Math.min(numHeads, 4) }, (_, i) => [
      {
        v: `头#${i}: S${hasSplit ? '↯' : '?'}`,
        role: (hasSplit ? 'frontier' : 'compare') as BarRole,
      },
    ]);
    rec.begin({ zh: `位置 ${pos}：${ev.join('；')}`, en: `Position ${pos}: ${ev.join('; ')}` });
    rec.setGrid([tokenRow, ...headRows]);
    rec
      .setAux([
        { label: '输入', value: `[${consumed}] ▍ ${remaining}`, role: 'compare' as BarRole },
        {
          label: '栈头数',
          value: String(numHeads),
          role: (hasSplit ? 'frontier' : 'default') as BarRole,
        },
        { label: '事件', value: ev.join(' ; ') || '—', role: 'default' as BarRole },
      ])
      .commit();
  }

  // —— 最终帧 ——
  const finalEv = eventsByPos.get(tokens.length) ?? [];
  rec
    .begin({ zh: '完成', en: 'Done' })
    .setGrid([tokens.map((t) => ({ v: t, role: (finalAccepted ? 'final' : 'warn') as BarRole }))])
    .setAux([
      {
        label: '结果',
        value: finalAccepted ? `接受（${finalTrees} 棵解析树）` : '拒绝',
        role: (finalAccepted ? 'final' : 'warn') as BarRole,
      },
      {
        label: '说明',
        value: 'GLR 在 * 处分裂为多个栈头，并行跟踪所有归约路径',
        role: 'default' as BarRole,
      },
      { label: '末尾事件', value: finalEv.join(' ; ') || '—', role: 'default' as BarRole },
    ])
    .commit();

  return rec.build();
}
