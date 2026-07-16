# -*- coding: utf-8 -*-
# Parsing category: 20 new algorithms. Each dict has keys matching gen_bulk.py.
ALGS = []

def add(**kw):
    ALGS.append(kw)

# 1
add(cat="parsing", id="parse-rpn-eval",
    tzh="逆波兰求值", ten="Reverse Polish Notation Eval",
    szh="用栈对后缀表达式求值：遇操作数入栈，遇运算符弹栈计算。", sen="Evaluate a postfix (RPN) expression with a stack.",
    dzh="扫描后缀 token：操作数压栈；遇二元运算符弹两操作数按 (左 ⊙ 右) 计算后压栈；末了栈顶即结果。O(n)。",
    den="Scan postfix tokens: push operands; on binary op pop two, compute (left op right), push result. Final stack top is the answer.",
    tags="['parsing','stack','postfix','evaluation']", time="O(n)", space="O(n)",
    impl="""// 逆波兰求值 · 纯算法实现
export const RPN_OPS: Record<string, (a: number, b: number) => number> = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b,
  '%': (a, b) => a % b,
  '^': (a, b) => Math.pow(a, b),
};

export interface RpnHooks {
  onPush?: (value: number) => void;
  onApply?: (op: string, left: number, right: number, result: number) => void;
}

export function rpnEval(tokens: readonly string[], hooks: RpnHooks = {}): number {
  const stack: number[] = [];
  for (const tk of tokens) {
    const op = RPN_OPS[tk];
    if (op) {
      const b = stack.pop()!;
      const a = stack.pop()!;
      const r = op(a, b);
      hooks.onApply?.(tk, a, b, r);
      stack.push(r);
      hooks.onPush?.(r);
    } else {
      const v = Number(tk);
      stack.push(v);
      hooks.onPush?.(v);
    }
  }
  if (stack.length !== 1) throw new Error('invalid RPN expression');
  return stack[0]!;
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rpnEval, type RpnHooks } from './impl.ts';

export const DEFAULT_INPUT = ['3', '4', '2', '*', '+'];

export function buildTrace(tokens: string[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const stack: number[] = [];
  const snap = (note: { zh: string; en: string }): void => {
    rec.begin(note).setAux(stack.map((v, i) => ({
      label: `s[${i}]`, value: String(v),
      role: (i === stack.length - 1 ? 'frontier' : 'default') as BarRole,
    }))).commit();
  };
  snap({ zh: `后缀: ${tokens.join(' ')}`, en: `RPN: ${tokens.join(' ')}` });
  const hooks: RpnHooks = {
    onPush: () => snap({ zh: '压栈', en: 'push' }),
    onApply: (op, l, _r, res) => snap({ zh: `${l} ${op} ? = ${res}`, en: `${l} ${op} ? = ${res}` }),
  };
  const result = rpnEval(tokens, hooks);
  rec.begin({ zh: `结果 = ${result}`, en: `Result = ${result}` })
    .setAux([{ label: 'result', value: String(result), role: 'final' as BarRole }]).commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rpnEval } from '../../src/algorithms/parsing/parse-rpn-eval/impl.ts';

test('rpn-eval 基本算术', () => {
  assert.equal(rpnEval(['3', '4', '+']), 7);
  assert.equal(rpnEval(['3', '4', '2', '*', '+']), 11);
});
test('rpn-eval 幂运算', () => {
  assert.equal(rpnEval(['2', '3', '^']), 8);
});
test('rpn-eval 复合', () => {
  // 3 4 + 2 * = 14
  assert.equal(rpnEval(['3', '4', '+', '2', '*']), 14);
});
""")

# 2
add(cat="parsing", id="parse-error-recovery",
    tzh="错误恢复（Panic 模式）", ten="Panic-Mode Error Recovery",
    szh="遇错时跳过 token 直到同步点，尽量继续解析以报告更多错误。", sen="Skip tokens to a synchronizing set on error and resume parsing.",
    dzh="Panic-mode：错误时丢弃 token 直到同步集合（; ) } ]），然后继续，从而报告多个错误而非一处即停。",
    den="On error, drop tokens until a sync token (; ) } ]) appears, then resume, so multiple errors are reported per run.",
    tags="['parsing','error-recovery','compiler']", time="O(n)", space="O(n)",
    impl="""// Panic-mode 错误恢复 · 纯算法实现
export interface RecoveryHooks {
  onError?: (tk: string, pos: number) => void;
  onSkip?: (tk: string, pos: number) => void;
  onSync?: (tk: string, pos: number) => void;
}
export interface RecoveryResult { tokens: string[]; errors: number[]; }
const SYNC = new Set([';', ')', '}', ']']);

export function panicRecover(tokens: readonly string[], valid: Set<string>, hooks: RecoveryHooks = {}): RecoveryResult {
  const out: string[] = [];
  const errors: number[] = [];
  let i = 0;
  while (i < tokens.length) {
    const tk = tokens[i]!;
    if (SYNC.has(tk) || valid.has(tk)) { out.push(tk); if (SYNC.has(tk)) hooks.onSync?.(tk, i); i++; continue; }
    errors.push(i);
    hooks.onError?.(tk, i);
    i++;
    while (i < tokens.length && !SYNC.has(tokens[i]!) && !valid.has(tokens[i]!)) {
      hooks.onSkip?.(tokens[i]!, i);
      i++;
    }
  }
  return { tokens: out, errors };
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { panicRecover } from './impl.ts';

export const DEFAULT_INPUT = ['a', '@', 'b', ';', '!', 'c', '}'];

export function buildTrace(toks: string[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const valid = new Set(['a', 'b', 'c']);
  rec.begin({ zh: `输入: ${toks.join(' ')}`, en: `Input: ${toks.join(' ')}` }).commit();
  const r = panicRecover(toks, valid, {
    onError: (tk, p) => rec.begin({ zh: `错误 @${p}: "${tk}"`, en: `error @${p}: "${tk}"` })
      .setAux([{ label: 'err', value: tk, role: 'warn' as BarRole }]).commit(),
    onSkip: (tk, p) => rec.begin({ zh: `跳过 @${p} "${tk}"`, en: `skip @${p} "${tk}"` })
      .setAux([{ label: 'skip', value: tk, role: 'compare' as BarRole }]).commit(),
    onSync: (tk, p) => rec.begin({ zh: `同步点 @${p} "${tk}"`, en: `sync @${p} "${tk}"` })
      .setAux([{ label: 'sync', value: tk, role: 'final' as BarRole }]).commit(),
  });
  rec.begin({ zh: `恢复后: ${r.tokens.join(' ')}, 错误数=${r.errors.length}`, en: `Recovered: ${r.tokens.join(' ')}, errors=${r.errors.length}` }).commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { panicRecover } from '../../src/algorithms/parsing/parse-error-recovery/impl.ts';

test('panic recovery 保留有效与同步点', () => {
  const r = panicRecover(['a', '@', 'b', ';', '!', 'c', '}'], new Set(['a', 'b', 'c']));
  assert.deepEqual(r.tokens, ['a', 'b', ';', 'c', '}']);
  assert.equal(r.errors.length, 2);
});
test('panic recovery 无错误透传', () => {
  const r = panicRecover(['a', 'b', ';'], new Set(['a', 'b']));
  assert.deepEqual(r.tokens, ['a', 'b', ';']);
  assert.equal(r.errors.length, 0);
});
""")

# 3
add(cat="parsing", id="parse-left-recursion",
    tzh="消除左递归", ten="Left Recursion Elimination",
    szh="把直接左递归文法改写为等价的右递归形式，便于自顶向下解析。", sen="Rewrite a directly left-recursive grammar into an equivalent right-recursive form.",
    dzh="A → A α | β 改为 A → β A′, A′ → α A′ | ε。消除递归下降的无限递归。",
    den="A → A α | β becomes A → β A′, A′ → α A′ | ε, removing the cycle for top-down parsers.",
    tags="['parsing','grammar','rewrite']", time="O(n)", space="O(1)",
    impl="""// 消除直接左递归 · 纯算法实现
export interface Rule { head: string; alts: string[][]; }
export interface ElimResult { rules: Rule[]; changed: boolean; }

export function eliminateLeftRecursion(rule: Rule): ElimResult {
  const recursive: string[][] = [];
  const nonRecursive: string[][] = [];
  for (const alt of rule.alts) {
    if (alt.length > 0 && alt[0] === rule.head) recursive.push(alt.slice(1));
    else nonRecursive.push(alt);
  }
  if (recursive.length === 0) return { rules: [rule], changed: false };
  if (nonRecursive.length === 0) throw new Error('pure left recursion cannot be eliminated this way');
  const prime = `${rule.head}'`;
  return {
    rules: [
      { head: rule.head, alts: nonRecursive.map((b) => [...b, prime]) },
      { head: prime, alts: [...recursive.map((a) => [...a, prime]), []] },
    ],
    changed: true,
  };
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { eliminateLeftRecursion } from './impl.ts';

export const DEFAULT_INPUT = { head: 'E', alts: [['E', '+', 'T'], ['T']] };

export function buildTrace(input: { head: string; alts: string[][] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const fmt = (r: { head: string; alts: string[][] }): string =>
    `${r.head} -> ${r.alts.map((a) => (a.length ? a.join(' ') : 'ε')).join(' | ')}`;
  rec.begin({ zh: `原规则: ${fmt(input)}`, en: `Original: ${fmt(input)}` })
    .setAux([{ label: 'rule', value: fmt(input), role: 'compare' as BarRole }]).commit();
  const r = eliminateLeftRecursion(input);
  for (const rule of r.rules) {
    rec.begin({ zh: `生成: ${fmt(rule)}`, en: `emit: ${fmt(rule)}` })
      .setAux([{ label: rule.head, value: fmt(rule), role: 'final' as BarRole }]).commit();
  }
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { eliminateLeftRecursion } from '../../src/algorithms/parsing/parse-left-recursion/impl.ts';

test('eliminate-left-recursion 典型文法', () => {
  const r = eliminateLeftRecursion({ head: 'E', alts: [['E', '+', 'T'], ['T']] });
  assert.equal(r.changed, true);
  assert.equal(r.rules.length, 2);
  assert.deepEqual(r.rules[1]!.alts, [['+', 'T', "E'"], []]);
});
test('eliminate-left-recursion 无左递归不变', () => {
  const r = eliminateLeftRecursion({ head: 'S', alts: [['a'], ['b', 'S']] });
  assert.equal(r.changed, false);
});
""")

# 4
add(cat="parsing", id="parse-left-factor",
    tzh="提取左公共因子", ten="Left Factoring",
    szh="把共享前缀的产生式拆为公共前缀 + 新非终结符。", sen="Split alternatives sharing a common prefix into prefix plus a new non-terminal.",
    dzh="A → α β₁ | α β₂ 改为 A → α A″, A″ → β₁ | β₂。消除 FIRST 集冲突，使 LL(1) 可行。",
    den="A → α β₁ | α β₂ becomes A → α A″, A″ → β₁ | β₂, removing FIRST-set ambiguity.",
    tags="['parsing','grammar','rewrite']", time="O(n²)", space="O(n)",
    impl="""// 提取左公共因子 · 纯算法实现
export interface Rule { head: string; alts: string[][]; }
export interface FactorResult { rules: Rule[]; changed: boolean; }

function commonPrefixLen(a: string[], b: string[]): number {
  const n = Math.min(a.length, b.length);
  let i = 0;
  while (i < n && a[i] === b[i]) i++;
  return i;
}

export function leftFactor(rule: Rule): FactorResult {
  const alts = rule.alts;
  if (alts.length < 2) return { rules: [rule], changed: false };
  let best = 0;
  for (let i = 0; i < alts.length; i++) {
    for (let j = i + 1; j < alts.length; j++) {
      const p = commonPrefixLen(alts[i]!, alts[j]!);
      if (p > best) best = p;
    }
  }
  if (best === 0) return { rules: [rule], changed: false };
  const prefix = alts.find((a) => a.length >= best)!.slice(0, best);
  const prime = `${rule.head}"`;
  const covered = new Set<number>();
  const primeAlts: string[][] = [];
  for (let i = 0; i < alts.length; i++) {
    const alt = alts[i]!;
    if (alt.length >= best && prefix.every((t, k) => alt[k] === t)) {
      covered.add(i);
      primeAlts.push(alt.slice(best));
    }
  }
  const newHeadAlts: string[][] = [];
  let addedPrime = false;
  for (let i = 0; i < alts.length; i++) {
    if (covered.has(i)) {
      if (!addedPrime) { newHeadAlts.push([...prefix, prime]); addedPrime = true; }
    } else {
      newHeadAlts.push([...alts[i]!]);
    }
  }
  return { rules: [{ head: rule.head, alts: newHeadAlts }, { head: prime, alts: primeAlts }], changed: true };
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { leftFactor } from './impl.ts';

export const DEFAULT_INPUT = { head: 'S', alts: [['if', 'c', 'then', 'S'], ['if', 'c', 'then', 'S', 'else', 'S']] };

export function buildTrace(input: { head: string; alts: string[][] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const fmt = (r: { head: string; alts: string[][] }): string =>
    `${r.head} -> ${r.alts.map((a) => (a.length ? a.join(' ') : 'ε')).join(' | ')}`;
  rec.begin({ zh: `原: ${fmt(input)}`, en: `Original: ${fmt(input)}` }).commit();
  const r = leftFactor(input);
  for (const rule of r.rules) {
    rec.begin({ zh: `生成: ${fmt(rule)}`, en: `emit: ${fmt(rule)}` })
      .setAux([{ label: rule.head, value: fmt(rule), role: 'final' as BarRole }]).commit();
  }
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { leftFactor } from '../../src/algorithms/parsing/parse-left-factor/impl.ts';

test('left-factor if-then-else', () => {
  const r = leftFactor({ head: 'S', alts: [['if', 'c', 'then', 'S'], ['if', 'c', 'then', 'S', 'else', 'S']] });
  assert.equal(r.changed, true);
  assert.equal(r.rules.length, 2);
  assert.equal(r.rules[1]!.head, 'S"');
});
test('left-factor 无公共前缀不变', () => {
  const r = leftFactor({ head: 'S', alts: [['a'], ['b']] });
  assert.equal(r.changed, false);
});
""")

# 5
add(cat="parsing", id="parse-pda",
    tzh="下推自动机", ten="Pushdown Automaton (PDA)",
    szh="带栈的有限自动机，识别上下文无关语言。", sen="A finite automaton augmented with a stack; recognizes context-free languages.",
    dzh="PDA 每步依状态、输入、栈顶决定动作：替换栈顶并转移。识别 aⁿbⁿ 等 CFL。",
    den="A PDA transitions based on state, input symbol, and top-of-stack; recognizes languages like aⁿbⁿ.",
    tags="['parsing','automaton','stack','cfl']", time="O(n)", space="O(n)",
    impl="""// 下推自动机 PDA · 纯算法实现
export interface PdaTransition {
  state: string;
  input: string | null; // null = ε
  pop: string;
  next: string;
  push: string[]; // 自底向上（左先）
}
export interface PdaHooks {
  onStep?: (state: string, stack: string[], input: string | null) => void;
  onAccept?: () => void;
}

export class PDA {
  private stack: string[] = ['Z0'];
  constructor(
    private readonly transitions: PdaTransition[],
    private start: string,
    private accept: Set<string>,
    private hooks: PdaHooks = {},
  ) {}
  run(input: string[]): boolean {
    let state = this.start;
    let i = 0;
    this.hooks.onStep?.(state, [...this.stack], input[i] ?? null);
    while (true) {
      const sym = input[i];
      const top = this.stack[this.stack.length - 1]!;
      const t = this.transitions.find(
        (x) => x.state === state && x.pop === top && (x.input === sym || x.input === null),
      );
      if (!t) break;
      this.stack.pop();
      for (let k = t.push.length - 1; k >= 0; k--) this.stack.push(t.push[k]!);
      state = t.next;
      if (t.input !== null) i++;
      this.hooks.onStep?.(state, [...this.stack], input[i] ?? null);
      if (i === input.length && this.accept.has(state) && this.stack.length === 1 && this.stack[0] === 'Z0') {
        this.hooks.onAccept?.();
        return true;
      }
    }
    return i === input.length && this.accept.has(state) && this.stack.length === 1 && this.stack[0] === 'Z0';
  }
}

// 经典：识别 a^n b^n
export function buildAnBnPda(hooks: PdaHooks = {}): PDA {
  const t: PdaTransition[] = [
    { state: 'q0', input: 'a', pop: 'Z0', next: 'q0', push: ['A', 'Z0'] },
    { state: 'q0', input: 'a', pop: 'A', next: 'q0', push: ['A', 'A'] },
    { state: 'q0', input: 'b', pop: 'A', next: 'q1', push: [] },
    { state: 'q1', input: 'b', pop: 'A', next: 'q1', push: [] },
    { state: 'q1', input: null, pop: 'Z0', next: 'qf', push: ['Z0'] },
  ];
  return new PDA(t, 'q0', new Set(['qf']), hooks);
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildAnBnPda } from './impl.ts';

export const DEFAULT_INPUT = ['a', 'a', 'b', 'b'];

export function buildTrace(input: string[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: `输入: ${input.join('')}`, en: `Input: ${input.join('')}` })
    .setAux([{ label: 'input', value: input.join(''), role: 'compare' as BarRole }]).commit();
  const pda = buildAnBnPda({
    onStep: (st, stack, sym) => rec.begin({ zh: `状态 ${st} | 栈 ${stack.join('/')}`, en: `state ${st} | stack ${stack.join('/')}` })
      .setAux([
        { label: 'state', value: st, role: 'pivot' as BarRole },
        { label: 'stack', value: stack.join('/'), role: 'frontier' as BarRole },
        { label: 'next', value: sym ?? 'ε', role: 'compare' as BarRole },
      ]).commit(),
  });
  const ok = pda.run(input);
  rec.begin({ zh: ok ? '接受' : '拒绝', en: ok ? 'accept' : 'reject' })
    .setAux([{ label: 'result', value: ok ? 'accept' : 'reject', role: 'final' as BarRole }]).commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildAnBnPda } from '../../src/algorithms/parsing/parse-pda/impl.ts';

test('pda a^n b^n 接受', () => {
  assert.equal(buildAnBnPda().run(['a', 'a', 'b', 'b']), true);
  assert.equal(buildAnBnPda().run([]), true);
  assert.equal(buildAnBnPda().run(['a', 'b']), true);
});
test('pda a^n b^n 拒绝', () => {
  assert.equal(buildAnBnPda().run(['a', 'a', 'b']), false);
  assert.equal(buildAnBnPda().run(['b', 'a']), false);
  assert.equal(buildAnBnPda().run(['a', 'b', 'b']), false);
});
""")

# 6
add(cat="parsing", id="parse-turing-machine",
    tzh="图灵机模拟", ten="Turing Machine Simulator",
    szh="用双向纸带 + 有限状态控制模拟图灵机，识别递归可枚举语言。", sen="Simulate a Turing machine: bidirectional tape + finite control.",
    dzh="δ(q, a) = (q′, b, D)：状态、当前格 → 新状态、写入、读写头方向。",
    den="delta(q, a) = (q', b, D): state and tape cell determine new state, written symbol, and head direction.",
    tags="['parsing','automaton','turing-machine']", time="O(steps)", space="O(tape)",
    impl="""// 图灵机模拟器 · 纯算法实现
export interface TmTransition { state: string; read: string; next: string; write: string; dir: 'L' | 'R'; }
export interface TmHooks { onStep?: (state: string, head: number, tape: Map<number, string>) => void; }

export class TuringMachine {
  private tape = new Map<number, string>();
  private head = 0;
  private state: string;
  private steps = 0;
  constructor(
    private readonly transitions: TmTransition[],
    start: string,
    private readonly blank: string,
    private readonly halt: Set<string>,
    private hooks: TmHooks = {},
  ) { this.state = start; }
  run(input: string[], maxSteps = 10000): { halted: boolean; steps: number; tape: Map<number, string> } {
    for (let i = 0; i < input.length; i++) this.tape.set(i, input[i]!);
    while (!this.halt.has(this.state) && this.steps < maxSteps) {
      const cell = this.tape.get(this.head) ?? this.blank;
      const t = this.transitions.find((x) => x.state === this.state && x.read === cell);
      if (!t) break;
      this.tape.set(this.head, t.write);
      this.state = t.next;
      this.head += t.dir === 'R' ? 1 : -1;
      this.steps++;
      this.hooks.onStep?.(this.state, this.head, new Map(this.tape));
    }
    return { halted: this.halt.has(this.state), steps: this.steps, tape: this.tape };
  }
}

// 例：小端二进制 +1
export function buildIncTm(hooks: TmHooks = {}): TuringMachine {
  const t: TmTransition[] = [
    { state: 'q0', read: '0', next: 'q0', write: '1', dir: 'L' },
    { state: 'q0', read: '1', next: 'q0', write: '0', dir: 'L' },
    { state: 'q0', read: '_', next: 'h', write: '_', dir: 'R' },
  ];
  return new TuringMachine(t, 'q0', '_', new Set(['h']), hooks);
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildIncTm } from './impl.ts';

export const DEFAULT_INPUT = ['1', '0', '1', '1'];

export function buildTrace(input: string[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: `输入: ${input.join('')}`, en: `Input: ${input.join('')}` })
    .setAux([{ label: 'tape', value: input.join(''), role: 'compare' as BarRole }]).commit();
  const tm = buildIncTm({
    onStep: (st, head, tape) => {
      const lo = Math.min(head, 0);
      const hi = Math.max(head, ...tape.keys(), input.length - 1);
      const cells: string[] = [];
      for (let i = lo; i <= hi; i++) cells.push(tape.get(i) ?? '_');
      rec.begin({ zh: `状态 ${st}, 头 @${head}`, en: `state ${st}, head @${head}` })
        .setAux([
          { label: 'state', value: st, role: 'pivot' as BarRole },
          { label: 'tape', value: cells.join(' '), role: 'frontier' as BarRole },
          { label: 'head', value: String(head), role: 'compare' as BarRole },
        ]).commit();
    },
  });
  const r = tm.run(input);
  rec.begin({ zh: `停机, 步数=${r.steps}`, en: `halted, steps=${r.steps}` })
    .setAux([{ label: 'steps', value: String(r.steps), role: 'final' as BarRole }]).commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildIncTm } from '../../src/algorithms/parsing/parse-turing-machine/impl.ts';

test('tm 二进制 +1', () => {
  const r = buildIncTm().run(['1', '0', '1', '1']);
  // little-endian 1011 +1 = 1100 -> tape cells 0..3 = 0,1,1,1 (little-endian of 1110)?
  // 小端 1011 = 1+2+0+8 = 11, +1 = 12 = 小端 0011
  const out = [r.tape.get(0), r.tape.get(1), r.tape.get(2), r.tape.get(3)];
  assert.deepEqual(out, ['0', '0', '1', '1']);
});
""")

# 7
add(cat="parsing", id="parse-mealy-machine",
    tzh="Mealy 机", ten="Mealy Machine",
    szh="输出依附于转移的有限状态机。", sen="FSM whose output depends on the current transition, not the state.",
    dzh="Mealy: 每条转移 (q -a-> q′) 产生输出。比 Moore 状态少，输出与输入绑定。",
    den="Mealy outputs are attached to transitions; fewer states than Moore, output tied to input.",
    tags="['parsing','automaton','fsm']", time="O(n)", space="O(1)",
    impl="""// Mealy 机 · 纯算法实现
export interface MealyEdge { from: string; input: string; to: string; output: string; }
export interface MealyHooks { onEdge?: (from: string, input: string, to: string, out: string) => void; }

export class MealyMachine {
  constructor(private edges: MealyEdge[], private start: string, private hooks: MealyHooks = {}) {}
  run(input: string[]): string[] {
    let st = this.start;
    const out: string[] = [];
    for (const a of input) {
      const e = this.edges.find((x) => x.from === st && x.input === a);
      if (!e) throw new Error(`no edge from ${st} on ${a}`);
      out.push(e.output);
      this.hooks.onEdge?.(st, a, e.to, e.output);
      st = e.to;
    }
    return out;
  }
}

// 例：检测连续 "11"
export function buildSeqDetector(hooks: MealyHooks = {}): MealyMachine {
  return new MealyMachine([
    { from: 'S', input: '1', to: 'A', output: '0' },
    { from: 'S', input: '0', to: 'S', output: '0' },
    { from: 'A', input: '1', to: 'A', output: '1' },
    { from: 'A', input: '0', to: 'S', output: '0' },
  ], 'S', hooks);
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildSeqDetector } from './impl.ts';

export const DEFAULT_INPUT = ['1', '1', '0', '1', '1', '1'];

export function buildTrace(input: string[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: `输入: ${input.join('')}`, en: `Input: ${input.join('')}` }).commit();
  const out = buildSeqDetector({
    onEdge: (f, a, to, o) => rec.begin({ zh: `${f} -${a}-> ${to} / 出 ${o}`, en: `${f} -${a}-> ${to} / out ${o}` })
      .setAux([
        { label: 'state', value: to, role: 'pivot' as BarRole },
        { label: 'out', value: o, role: (o === '1' ? 'final' : 'default') as BarRole },
      ]).commit(),
  }).run(input);
  rec.begin({ zh: `输出: ${out.join('')}`, en: `Output: ${out.join('')}` })
    .setAux([{ label: 'output', value: out.join(''), role: 'final' as BarRole }]).commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildSeqDetector } from '../../src/algorithms/parsing/parse-mealy-machine/impl.ts';

test('mealy "11" 检测', () => {
  assert.deepEqual(buildSeqDetector().run(['1', '1', '0', '1', '1', '1']), ['0', '1', '0', '0', '1', '1']);
});
""")

# 8
add(cat="parsing", id="parse-moore-machine",
    tzh="Moore 机", ten="Moore Machine",
    szh="输出依附于状态的有限状态机。", sen="FSM whose output is a function of state only.",
    dzh="Moore: 每状态 q 有输出 λ(q)。输出比 Mealy 慢一拍但与输入无关。",
    den="Moore: each state has an output lambda(q); output lags one step but is independent of input.",
    tags="['parsing','automaton','fsm']", time="O(n)", space="O(1)",
    impl="""// Moore 机 · 纯算法实现
export interface MooreState { name: string; output: string; }
export interface MooreEdge { from: string; input: string; to: string; }
export interface MooreHooks { onState?: (s: string, out: string) => void; }

export class MooreMachine {
  constructor(
    private states: Map<string, MooreState>,
    private edges: MooreEdge[],
    private start: string,
    private hooks: MooreHooks = {},
  ) {}
  run(input: string[]): string[] {
    let st = this.start;
    const out: string[] = [this.states.get(st)!.output];
    this.hooks.onState?.(st, this.states.get(st)!.output);
    for (const a of input) {
      const e = this.edges.find((x) => x.from === st && x.input === a);
      if (!e) throw new Error(`no edge from ${st} on ${a}`);
      st = e.to;
      const o = this.states.get(st)!.output;
      out.push(o);
      this.hooks.onState?.(st, o);
    }
    return out;
  }
}

export function buildMooreSeq(hooks: MooreHooks = {}): MooreMachine {
  const states = new Map<string, MooreState>([
    ['S', { name: 'S', output: '0' }],
    ['A', { name: 'A', output: '0' }],
    ['B', { name: 'B', output: '1' }],
  ]);
  const edges: MooreEdge[] = [
    { from: 'S', input: '1', to: 'A' },
    { from: 'S', input: '0', to: 'S' },
    { from: 'A', input: '1', to: 'B' },
    { from: 'A', input: '0', to: 'S' },
    { from: 'B', input: '1', to: 'B' },
    { from: 'B', input: '0', to: 'S' },
  ];
  return new MooreMachine(states, edges, 'S', hooks);
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildMooreSeq } from './impl.ts';

export const DEFAULT_INPUT = ['1', '1', '0', '1', '1'];

export function buildTrace(input: string[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: `输入: ${input.join('')}`, en: `Input: ${input.join('')}` }).commit();
  const out = buildMooreSeq({
    onState: (s, o) => rec.begin({ zh: `状态 ${s} / 出 ${o}`, en: `state ${s} / out ${o}` })
      .setAux([
        { label: 'state', value: s, role: 'pivot' as BarRole },
        { label: 'out', value: o, role: (o === '1' ? 'final' : 'default') as BarRole },
      ]).commit(),
  }).run(input);
  rec.begin({ zh: `输出: ${out.join('')}`, en: `Output: ${out.join('')}` })
    .setAux([{ label: 'output', value: out.join(''), role: 'final' as BarRole }]).commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildMooreSeq } from '../../src/algorithms/parsing/parse-moore-machine/impl.ts';

test('moore "11" 检测', () => {
  const out = buildMooreSeq().run(['1', '1', '0', '1', '1']);
  assert.deepEqual(out, ['0', '0', '1', '0', '0', '1']);
});
""")

# 9
add(cat="parsing", id="parse-dfa-minimize",
    tzh="DFA 最小化", ten="DFA Minimization (Hopcroft)",
    szh="Hopcroft 算法把 DFA 划分到等价类，得到状态数最少的等价 DFA。", sen="Partition a DFA into equivalence classes to get the minimal equivalent DFA.",
    dzh="反复细化状态划分：若同类状态对某输入落到不同类则拆分。结束时每类合成一个状态。",
    den="Refine the partition by splitting classes whose members transition to different classes on the same symbol.",
    tags="['parsing','automaton','dfa','partition']", time="O(n log n)", space="O(n)",
    impl="""// DFA 最小化 (Hopcroft 简化版) · 纯算法实现
export interface DfaSpec {
  states: string[];
  alphabet: string[];
  delta: Record<string, Record<string, string>>;
  start: string;
  accept: string[];
}

export function minimizeDfa(dfa: DfaSpec): string[][] {
  const accept = new Set(dfa.accept);
  let parts: string[][] = [[], []];
  for (const s of dfa.states) (accept.has(s) ? parts[0]! : parts[1]!).push(s);
  if (parts[1]!.length === 0) parts = [parts[0]!];
  let changed = true;
  while (changed) {
    changed = false;
    const next: string[][] = [];
    for (const part of parts) {
      if (part.length <= 1) { next.push(part); continue; }
      const groups = new Map<string, string[]>();
      for (const s of part) {
        const sig = dfa.alphabet.map((a) => parts.findIndex((p) => p.includes(dfa.delta[s]![a]!))).join(',');
        const g = groups.get(sig) ?? [];
        g.push(s);
        groups.set(sig, g);
      }
      for (const g of groups.values()) next.push(g);
      if (groups.size > 1) changed = true;
    }
    parts = next;
  }
  return parts.filter((p) => p.length > 0);
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { minimizeDfa, type DfaSpec } from './impl.ts';

export const DEFAULT_INPUT: DfaSpec = {
  states: ['A', 'B', 'C', 'D'],
  alphabet: ['0', '1'],
  delta: {
    A: { '0': 'B', '1': 'A' },
    B: { '0': 'C', '1': 'A' },
    C: { '0': 'C', '1': 'D' },
    D: { '0': 'D', '1': 'D' },
  },
  start: 'A',
  accept: ['D'],
};

export function buildTrace(input: DfaSpec = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: `原始 ${input.states.length} 状态`, en: `Original ${input.states.length} states` })
    .setAux(input.states.map((s) => ({ label: s, value: s, role: 'default' as BarRole }))).commit();
  const parts = minimizeDfa(input);
  for (let i = 0; i < parts.length; i++) {
    rec.begin({ zh: `类 ${i} = {${parts[i]!.join(',')}}`, en: `Class ${i} = {${parts[i]!.join(',')}}` })
      .setAux(parts[i]!.map((s) => ({ label: s, value: s, role: 'final' as BarRole }))).commit();
  }
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { minimizeDfa } from '../../src/algorithms/parsing/parse-dfa-minimize/impl.ts';

test('minimize-dfa 合并等价', () => {
  const dfa = {
    states: ['A', 'B', 'C', 'D'],
    alphabet: ['0', '1'],
    delta: {
      A: { '0': 'B', '1': 'A' },
      B: { '0': 'B', '1': 'C' },
      C: { '0': 'B', '1': 'D' },
      D: { '0': 'B', '1': 'A' },
    } as Record<string, Record<string, string>>,
    start: 'A',
    accept: ['C'],
  };
  const parts = minimizeDfa(dfa);
  assert.ok(parts.find((p) => p.includes('A') && p.includes('D')));
});
""")

# 10
add(cat="parsing", id="parse-nfa-epsilon",
    tzh="ε-NFA", ten="NFA with epsilon-transitions",
    szh="允许 ε 转移的非确定有限自动机，用 ε-闭包 + 子集构造跑输入。", sen="Nondeterministic finite automaton with epsilon-moves, run via epsilon-closure.",
    dzh="每步维护一个状态集合；读符号前做 ε-闭包扩展，读符号后转移再求闭包。",
    den="Track a set of states; take epsilon-closure before each symbol, then transition and close again.",
    tags="['parsing','automaton','nfa','epsilon']", time="O(n*|Q|^2)", space="O(|Q|)",
    impl="""// ε-NFA · 纯算法实现
export interface EpsilonNfa {
  states: string[];
  alphabet: string[];
  edges: Array<{ from: string; input: string | null; to: string }>; // null = ε
  start: string;
  accept: string[];
}

export function epsilonClosure(nfa: EpsilonNfa, states: Set<string>): Set<string> {
  const out = new Set(states);
  const stack = [...states];
  while (stack.length) {
    const s = stack.pop()!;
    for (const e of nfa.edges) {
      if (e.from === s && e.input === null && !out.has(e.to)) {
        out.add(e.to);
        stack.push(e.to);
      }
    }
  }
  return out;
}

export function nfaRun(nfa: EpsilonNfa, input: string[]): boolean {
  let cur = epsilonClosure(nfa, new Set([nfa.start]));
  for (const a of input) {
    const next = new Set<string>();
    for (const s of cur) for (const e of nfa.edges) if (e.from === s && e.input === a) next.add(e.to);
    cur = epsilonClosure(nfa, next);
    if (cur.size === 0) return false;
  }
  return [...cur].some((s) => nfa.accept.includes(s));
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { epsilonClosure, nfaRun, type EpsilonNfa } from './impl.ts';

export const DEFAULT_INPUT: { nfa: EpsilonNfa; input: string[] } = {
  nfa: {
    states: ['q0', 'q1', 'q2'],
    alphabet: ['a', 'b'],
    edges: [
      { from: 'q0', input: null, to: 'q1' },
      { from: 'q0', input: 'a', to: 'q0' },
      { from: 'q1', input: 'b', to: 'q2' },
    ],
    start: 'q0',
    accept: ['q2'],
  },
  input: ['a', 'a', 'b'],
};

export function buildTrace(input: { nfa: EpsilonNfa; input: string[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  let cur = epsilonClosure(input.nfa, new Set([input.nfa.start]));
  rec.begin({ zh: `初始闭包: {${[...cur].join(',')}}`, en: `init closure: {${[...cur].join(',')}}` })
    .setAux([...cur].map((s) => ({ label: s, value: s, role: 'pivot' as BarRole }))).commit();
  for (const a of input.input) {
    const next = new Set<string>();
    for (const s of cur) for (const e of input.nfa.edges) if (e.from === s && e.input === a) next.add(e.to);
    cur = epsilonClosure(input.nfa, next);
    rec.begin({ zh: `读 ${a} → 闭包 {${[...cur].join(',')}}`, en: `read ${a} -> closure {${[...cur].join(',')}}` })
      .setAux([...cur].map((s) => ({ label: s, value: s, role: 'frontier' as BarRole }))).commit();
  }
  const ok = nfaRun(input.nfa, input.input);
  rec.begin({ zh: ok ? '接受' : '拒绝', en: ok ? 'accept' : 'reject' })
    .setAux([{ label: 'result', value: ok ? 'accept' : 'reject', role: 'final' as BarRole }]).commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nfaRun, epsilonClosure, type EpsilonNfa } from '../../src/algorithms/parsing/parse-nfa-epsilon/impl.ts';

const nfa: EpsilonNfa = {
  states: ['q0', 'q1', 'q2'], alphabet: ['a', 'b'],
  edges: [
    { from: 'q0', input: null, to: 'q1' },
    { from: 'q0', input: 'a', to: 'q0' },
    { from: 'q1', input: 'b', to: 'q2' },
  ],
  start: 'q0', accept: ['q2'],
};
test('epsilon-nfa 闭包', () => {
  const c = epsilonClosure(nfa, new Set(['q0']));
  assert.ok(c.has('q0') && c.has('q1'));
});
test('epsilon-nfa 接受', () => {
  assert.equal(nfaRun(nfa, ['a', 'a', 'b']), true);
  assert.equal(nfaRun(nfa, ['b']), true);
});
test('epsilon-nfa 拒绝', () => {
  assert.equal(nfaRun(nfa, ['a', 'a']), false);
});
""")

# 11
add(cat="parsing", id="parse-regex-thompson",
    tzh="Thompson 构造法", ten="Thompson Construction",
    szh="把正则表达式编译成 ε-NFA。", sen="Compile a regular expression to an epsilon-NFA with linear states.",
    dzh="对字符 c 建 N(c)；A|B 用 ε 分流起点；AB 串接；A* 加 ε 回环。状态数线性。",
    den="For c build N(c); A|B epsilon-splits start; AB concatenates; A* adds an epsilon loop.",
    tags="['parsing','regex','nfa','thompson']", time="O(n)", space="O(n)",
    impl="""// Thompson 构造法 · 纯算法实现
export interface NfaFragment { start: number; accept: number; }
export interface ThompsonNfa {
  states: number;
  edges: Array<{ from: number; input: string | null; to: number }>;
  start: number;
  accept: number;
}
type RegexAst =
  | { t: 'lit'; c: string }
  | { t: 'or'; a: RegexAst; b: RegexAst }
  | { t: 'cat'; a: RegexAst; b: RegexAst }
  | { t: 'star'; a: RegexAst };

export class ThompsonBuilder {
  states = 0;
  edges: Array<{ from: number; input: string | null; to: number }> = [];
  fresh(): number { return this.states++; }
  add(from: number, input: string | null, to: number): void { this.edges.push({ from, input, to }); }
  build(ast: RegexAst): NfaFragment {
    if (ast.t === 'lit') {
      const s = this.fresh(); const a = this.fresh();
      this.add(s, ast.c, a);
      return { start: s, accept: a };
    }
    if (ast.t === 'or') {
      const s = this.fresh(); const a = this.fresh();
      const A = this.build(ast.a); const B = this.build(ast.b);
      this.add(s, null, A.start); this.add(s, null, B.start);
      this.add(A.accept, null, a); this.add(B.accept, null, a);
      return { start: s, accept: a };
    }
    if (ast.t === 'cat') {
      const A = this.build(ast.a); const B = this.build(ast.b);
      this.add(A.accept, null, B.start);
      return { start: A.start, accept: B.accept };
    }
    // star
    const s = this.fresh(); const a = this.fresh();
    const A = this.build(ast.a);
    this.add(s, null, A.start); this.add(s, null, a);
    this.add(A.accept, null, A.start); this.add(A.accept, null, a);
    return { start: s, accept: a };
  }
}

export function buildFromAst(ast: RegexAst): ThompsonNfa {
  const b = new ThompsonBuilder();
  const f = b.build(ast);
  return { states: b.states, edges: b.edges, start: f.start, accept: f.accept };
}
export const lit = (c: string): RegexAst => ({ t: 'lit', c });
export const or_ = (a: RegexAst, b: RegexAst): RegexAst => ({ t: 'or', a, b });
export const cat = (a: RegexAst, b: RegexAst): RegexAst => ({ t: 'cat', a, b });
export const star = (a: RegexAst): RegexAst => ({ t: 'star', a });
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildFromAst, lit, cat, star, or_ } from './impl.ts';

export const DEFAULT_AST = cat(star(or_(lit('a'), lit('b'))), lit('c'));

export function buildTrace(input = DEFAULT_AST): Frame[] {
  const rec = new TraceRecorder();
  const nfa = buildFromAst(input);
  rec.begin({ zh: `Thompson NFA: ${nfa.states} 状态, ${nfa.edges.length} 边`, en: `Thompson NFA: ${nfa.states} states, ${nfa.edges.length} edges` })
    .setAux(nfa.edges.map((e, i) => ({
      label: `e${i}`, value: `${e.from} -${e.input ?? 'ε'}-> ${e.to}`,
      role: ((e.from === nfa.start || e.to === nfa.accept) ? 'pivot' : 'default') as BarRole,
    }))).commit();
  rec.begin({ zh: `起点 ${nfa.start}, 接受 ${nfa.accept}`, en: `start ${nfa.start}, accept ${nfa.accept}` })
    .setAux([
      { label: 'start', value: String(nfa.start), role: 'final' as BarRole },
      { label: 'accept', value: String(nfa.accept), role: 'final' as BarRole },
    ]).commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildFromAst, lit, cat, star, or_ } from '../../src/algorithms/parsing/parse-regex-thompson/impl.ts';

test('thompson 单字', () => {
  const n = buildFromAst(lit('a'));
  assert.equal(n.states, 2);
  assert.equal(n.edges.length, 1);
});
test('thompson 或', () => {
  const n = buildFromAst(or_(lit('a'), lit('b')));
  assert.ok(n.states >= 6);
});
test('thompson 星', () => {
  const n = buildFromAst(star(lit('a')));
  assert.ok(n.states >= 4);
});
test('thompson 串接', () => {
  const n = buildFromAst(cat(lit('a'), lit('b')));
  assert.equal(n.states, 4);
});
""")

# 12
add(cat="parsing", id="parse-cnf-conversion",
    tzh="Chomsky 范式化", ten="Grammar to Chomsky Normal Form",
    szh="把 CFG 改写为 A → BC | a 形式，是 CYK 的前置。", sen="Convert a CFG to Chomsky Normal Form (A → BC | a), a precondition for CYK.",
    dzh="步骤：长产生式拆为二元（A → X1 X2 X3 X4 拆为 A → X1 N1, N1 → X2 N2, N2 → X3 X4）；终结符包成新非终结符。",
    den="Binarize long productions; wrap terminals in fresh non-terminals; result rules have 2 non-terminals or 1 terminal.",
    tags="['parsing','grammar','cfg','cnf']", time="O(n)", space="O(n)",
    impl="""// CFG → Chomsky Normal Form · 纯算法实现
export interface Rule { head: string; syms: string[]; }
export function isNonTerminal(s: string): boolean { return /^[A-Z]/.test(s); }

export function toCnf(rules: Rule[]): Rule[] {
  let out: Rule[] = [];
  let counter = 0;
  const fresh = (): string => `N${counter++}`;
  // 二元化
  for (const r of rules) {
    if (r.syms.length <= 2) { out.push(r); continue; }
    let prev = r.syms[0]!;
    for (let i = 1; i < r.syms.length - 1; i++) {
      const name = fresh();
      out.push({ head: i === 1 ? r.head : prev, syms: [i === 1 ? r.syms[0]! : prev, name] });
      prev = name;
    }
    out.push({ head: prev, syms: [r.syms[r.syms.length - 2]!, r.syms[r.syms.length - 1]!] });
  }
  // 终结符打包（仅在二元规则中替换终结符）
  const termWrap = new Map<string, string>();
  let tc = 0;
  out = out.map((r) => {
    if (r.syms.length === 2) {
      return { head: r.head, syms: r.syms.map((s) => {
        if (!isNonTerminal(s)) {
          let name = termWrap.get(s);
          if (!name) { name = `T${tc++}`; termWrap.set(s, name); }
          return name;
        }
        return s;
      }) };
    }
    return r;
  });
  for (const [t, name] of termWrap) out.push({ head: name, syms: [t] });
  return out;
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { toCnf, type Rule } from './impl.ts';

export const DEFAULT_INPUT: Rule[] = [{ head: 'S', syms: ['A', 'B', 'C', 'D'] }];

export function buildTrace(input: Rule[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const fmt = (r: Rule): string => `${r.head} -> ${r.syms.join(' ')}`;
  rec.begin({ zh: '原始规则', en: 'Original rules' })
    .setAux(input.map((r) => ({ label: r.head, value: fmt(r), role: 'compare' as BarRole }))).commit();
  const cnf = toCnf(input);
  rec.begin({ zh: `CNF: ${cnf.length} 条`, en: `CNF: ${cnf.length} rules` })
    .setAux(cnf.map((r) => ({ label: r.head, value: fmt(r), role: 'final' as BarRole }))).commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toCnf } from '../../src/algorithms/parsing/parse-cnf-conversion/impl.ts';

test('cnf 二元化', () => {
  const cnf = toCnf([{ head: 'S', syms: ['A', 'B', 'C', 'D'] }]);
  assert.ok(cnf.length >= 3);
  for (const r of cnf) assert.ok(r.syms.length <= 2);
});
test('cnf 终结符打包', () => {
  const cnf = toCnf([{ head: 'S', syms: ['a', 'b'] }]);
  // 二元规则中 a, b 应被替换为 T0, T1
  assert.deepEqual(cnf[0]!.syms, ['T0', 'T1']);
});
""")

# 13
add(cat="parsing", id="parse-regex-to-postfix",
    tzh="正则转后缀", ten="Regex to Postfix",
    szh="用调度场把正则（含 | * ·）转为后缀，便于 Thompson 构造。", sen="Insert explicit concat then run shunting yard to get postfix.",
    dzh="显式插入连接运算符 ·，定义优先级（* > · > |），用调度场得到后缀串。",
    den="Insert explicit concatenation operator ., set precedence (* > . > |), run shunting yard.",
    tags="['parsing','regex','postfix','shunting-yard']", time="O(n)", space="O(n)",
    impl="""// 正则转后缀 · 纯算法实现
export const PREC: Record<string, number> = { '|': 1, '.': 2, '*': 3 };

function isLiteral(c: string): boolean { return /[a-zA-Z0-9]/.test(c); }

export function insertConcat(re: string): string {
  const out: string[] = [];
  for (let i = 0; i < re.length; i++) {
    out.push(re[i]!);
    const a = re[i]!;
    const b = re[i + 1];
    if (!b) continue;
    const aEnd = isLiteral(a) || a === '*' || a === ')';
    const bStart = isLiteral(b) || b === '(';
    if (aEnd && bStart) out.push('.');
  }
  return out.join('');
}

export function regexToPostfix(re: string): string {
  const s = insertConcat(re);
  const out: string[] = [];
  const op: string[] = [];
  for (const c of s) {
    if (isLiteral(c)) { out.push(c); continue; }
    if (c === '(') { op.push(c); continue; }
    if (c === ')') {
      while (op.length && op[op.length - 1] !== '(') out.push(op.pop()!);
      op.pop();
      continue;
    }
    while (op.length && op[op.length - 1] !== '(' && PREC[op[op.length - 1]!]! >= PREC[c]!) out.push(op.pop()!);
    op.push(c);
  }
  while (op.length) out.push(op.pop()!);
  return out.join('');
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { regexToPostfix, insertConcat } from './impl.ts';

export const DEFAULT_INPUT = '(a|b)*c';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const cat = insertConcat(input);
  rec.begin({ zh: `插入连接: ${cat}`, en: `With concat: ${cat}` })
    .setAux([{ label: 'concat', value: cat, role: 'compare' as BarRole }]).commit();
  const post = regexToPostfix(input);
  rec.begin({ zh: `后缀: ${post}`, en: `Postfix: ${post}` })
    .setAux(post.split('').map((c, i) => ({ label: `p${i}`, value: c, role: 'final' as BarRole }))).commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { regexToPostfix, insertConcat } from '../../src/algorithms/parsing/parse-regex-to-postfix/impl.ts';

test('regex-postfix 单字', () => assert.equal(regexToPostfix('a'), 'a'));
test('regex-postfix 连接', () => assert.equal(regexToPostfix('ab'), 'ab.'));
test('regex-postfix 或与星', () => assert.equal(regexToPostfix('(a|b)*'), 'ab|*'));
test('regex-postfix (a|b)*c', () => assert.equal(regexToPostfix('(a|b)*c'), 'ab|*c.'));
""")

# 14
add(cat="parsing", id="parse-lexer-state",
    tzh="状态词法分析器", ten="Stateful Lexer",
    szh="支持状态切换的词法分析器：不同上下文使用不同规则集。", sen="A lexer that switches rule sets based on a current state.",
    dzh="每状态一组 (pattern, action)；action 可改状态（如遇 \" 进入字符串态）。",
    den="Each state has its own rules; matching tokens may change the lexer state.",
    tags="['parsing','lexer','stateful']", time="O(n)", space="O(1)",
    impl="""// 状态词法分析器 · 纯算法实现
export interface Token { type: string; value: string; }
export interface LexerRule { re: RegExp; type: string; pushState?: string; popState?: boolean; }
export type Rules = Record<string, LexerRule[]>;
export interface LexerHooks { onToken?: (t: Token, state: string) => void; onStateChange?: (s: string) => void; }

export class StatefulLexer {
  private state = 'INIT';
  constructor(private rules: Rules, private hooks: LexerHooks = {}) {}
  lex(src: string): Token[] {
    const out: Token[] = [];
    let i = 0;
    while (i < src.length) {
      const rs = this.rules[this.state];
      if (!rs) throw new Error(`no rules for state ${this.state}`);
      let matched = false;
      for (const r of rs) {
        r.re.lastIndex = i;
        const m = r.re.exec(src);
        if (m && m.index === i) {
          const text = m[0];
          if (text.length === 0) throw new Error('zero-length rule');
          if (r.type !== 'SKIP') {
            const t: Token = { type: r.type, value: text };
            out.push(t);
            this.hooks.onToken?.(t, this.state);
          }
          if (r.pushState) { this.state = r.pushState; this.hooks.onStateChange?.(this.state); }
          if (r.popState) { this.state = 'INIT'; this.hooks.onStateChange?.(this.state); }
          i += text.length;
          matched = true;
          break;
        }
      }
      if (!matched) throw new Error(`no rule matches at ${i}: ${src.slice(i, i + 10)}`);
    }
    return out;
  }
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { StatefulLexer } from './impl.ts';

export const DEFAULT_INPUT = 'foo(1) "hi" bar';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const rules = {
    INIT: [
      { re: /[A-Za-z_]\w*/g, type: 'ID' },
      { re: /\d+/g, type: 'NUM' },
      { re: /[()]/g, type: 'PUNCT' },
      { re: /"/g, type: 'QUOTE', pushState: 'STR' },
      { re: /\s+/g, type: 'SKIP' },
    ],
    STR: [
      { re: /[^"]+/g, type: 'STRTEXT' },
      { re: /"/g, type: 'QUOTE', popState: true },
    ],
  };
  const lex = new StatefulLexer(rules, {
    onToken: (t, st) => rec.begin({ zh: `${t.type}: "${t.value}" @${st}`, en: `${t.type}: "${t.value}" @${st}` })
      .setAux([
        { label: 'type', value: t.type, role: 'pivot' as BarRole },
        { label: 'value', value: t.value, role: 'frontier' as BarRole },
        { label: 'state', value: st, role: 'compare' as BarRole },
      ]).commit(),
    onStateChange: (s) => rec.begin({ zh: `切换状态 → ${s}`, en: `enter state ${s}` })
      .setAux([{ label: 'state', value: s, role: 'final' as BarRole }]).commit(),
  });
  lex.lex(input);
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { StatefulLexer } from '../../src/algorithms/parsing/parse-lexer-state/impl.ts';

test('stateful lexer 标识符与数字', () => {
  const lex = new StatefulLexer({ INIT: [
    { re: /[A-Za-z_]\w*/g, type: 'ID' },
    { re: /\d+/g, type: 'NUM' },
    { re: /\s+/g, type: 'SKIP' },
  ] });
  assert.deepEqual(lex.lex('foo 42'), [{ type: 'ID', value: 'foo' }, { type: 'NUM', value: '42' }]);
});
test('stateful lexer 字符串状态', () => {
  const lex = new StatefulLexer({
    INIT: [
      { re: /"/g, type: 'QUOTE', pushState: 'STR' },
      { re: /[^"]/g, type: 'OTHER' },
    ],
    STR: [
      { re: /[^"]+/g, type: 'STRTEXT' },
      { re: /"/g, type: 'QUOTE', popState: true },
    ],
  });
  assert.deepEqual(lex.lex('"ab"').map((x) => x.type), ['QUOTE', 'STRTEXT', 'QUOTE']);
});
""")

# 15
add(cat="parsing", id="parse-suffix-array",
    tzh="后缀数组", ten="Suffix Array",
    szh="对字符串所有后缀排序得到索引数组，是字符串处理基础结构。", sen="Sort all suffixes to get an index array; foundational for string algorithms.",
    dzh="生成 0..n-1 的下标数组，按 s[i..] 升序排列。",
    den="Index array 0..n-1 sorted lexicographically by s[i..].",
    tags="['parsing','suffix-array','string']", time="O(n^2 log n)", space="O(n)",
    impl="""// 后缀数组 · 纯算法实现
export function buildSuffixArray(s: string): number[] {
  const n = s.length;
  const sa = Array.from({ length: n }, (_, i) => i);
  sa.sort((a, b) => {
    let i = a, j = b;
    while (i < n && j < n) {
      if (s[i] !== s[j]) return s.charCodeAt(i) - s.charCodeAt(j);
      i++; j++;
    }
    return (n - a) - (n - b);
  });
  return sa;
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildSuffixArray } from './impl.ts';

export const DEFAULT_INPUT = 'banana';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: `输入: "${input}"`, en: `Input: "${input}"` }).commit();
  const sa = buildSuffixArray(input);
  rec.begin({ zh: '后缀数组', en: 'Suffix array' })
    .setAux(sa.map((idx, i) => ({ label: `sa[${i}]`, value: `${idx}: ${input.slice(idx)}`, role: (i === 0 ? 'final' : 'default') as BarRole }))).commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildSuffixArray } from '../../src/algorithms/parsing/parse-suffix-array/impl.ts';

test('suffix-array banana', () => {
  assert.deepEqual(buildSuffixArray('banana'), [5, 3, 1, 0, 4, 2]);
});
test('suffix-array 空', () => {
  assert.deepEqual(buildSuffixArray(''), []);
});
""")

# 16
add(cat="parsing", id="parse-aho-corasick",
    tzh="Aho-Corasick", ten="Aho-Corasick Multi-Pattern",
    szh="构造 AC 自动机，一次扫描文本同时匹配多模式。", sen="Build an automaton to scan text once and match many patterns simultaneously.",
    dzh="Trie + 失败指针（最长真后缀链）。匹配失败时沿失败链回退，避免重新扫描。",
    den="Trie plus failure links; on mismatch, follow failure links instead of rescanning.",
    tags="['parsing','automaton','multi-pattern']", time="O(n+m+z)", space="O(m)",
    impl="""// Aho-Corasick · 纯算法实现
export interface AcNode { children: Map<string, number>; fail: number; out: string[]; }

export class AhoCorasick {
  private nodes: AcNode[] = [{ children: new Map(), fail: 0, out: [] }];
  constructor(patterns: string[]) {
    for (const p of patterns) this.insert(p);
    this.buildFail();
  }
  private insert(p: string): void {
    let cur = 0;
    for (const c of p) {
      let nx = this.nodes[cur]!.children.get(c);
      if (nx === undefined) {
        nx = this.nodes.length;
        this.nodes.push({ children: new Map(), fail: 0, out: [] });
        this.nodes[cur]!.children.set(c, nx);
      }
      cur = nx;
    }
    this.nodes[cur]!.out.push(p);
  }
  private buildFail(): void {
    const q: number[] = [];
    for (const [, c] of this.nodes[0]!.children) q.push(c);
    while (q.length) {
      const u = q.shift()!;
      for (const [ch, v] of this.nodes[u]!.children) {
        q.push(v);
        let f = this.nodes[u]!.fail;
        while (f !== 0 && !this.nodes[f]!.children.has(ch)) f = this.nodes[f]!.fail;
        const ff = this.nodes[f]!.children.get(ch);
        this.nodes[v]!.fail = ff && ff !== v ? ff : 0;
        this.nodes[v]!.out.push(...this.nodes[this.nodes[v]!.fail]!.out);
      }
    }
  }
  search(text: string): Array<{ at: number; pattern: string }> {
    const res: Array<{ at: number; pattern: string }> = [];
    let cur = 0;
    for (let i = 0; i < text.length; i++) {
      const c = text[i]!;
      while (cur !== 0 && !this.nodes[cur]!.children.has(c)) cur = this.nodes[cur]!.fail;
      cur = this.nodes[cur]!.children.get(c) ?? 0;
      for (const p of this.nodes[cur]!.out) res.push({ at: i - p.length + 1, pattern: p });
    }
    return res;
  }
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { AhoCorasick } from './impl.ts';

export const DEFAULT_INPUT = { text: 'ushers', patterns: ['he', 'she', 'his', 'hers'] };

export function buildTrace(input: { text: string; patterns: string[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const ac = new AhoCorasick(input.patterns);
  rec.begin({ zh: `文本: "${input.text}", 模式: ${input.patterns.join('/')}`, en: `Text: "${input.text}", patterns: ${input.patterns.join('/')}` }).commit();
  const hits = ac.search(input.text);
  for (const h of hits) {
    rec.begin({ zh: `命中 "${h.pattern}" @${h.at}`, en: `match "${h.pattern}" @${h.at}` })
      .setAux([{ label: 'match', value: h.pattern, role: 'final' as BarRole }]).commit();
  }
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AhoCorasick } from '../../src/algorithms/parsing/parse-aho-corasick/impl.ts';

test('aho-corasick 多模式', () => {
  const ac = new AhoCorasick(['he', 'she', 'his', 'hers']);
  const got = ac.search('ushers').map((h) => `${h.pattern}@${h.at}`).sort();
  assert.deepEqual(got, ['he@2', 'hers@2', 'she@1']);
});
""")

# 17
add(cat="parsing", id="parse-grammar-ambiguity",
    tzh="CFG 歧义检测", ten="CFG Ambiguity Detection",
    szh="启发式检测文法歧义（共享 FIRST 集 / 同时左右递归）。", sen="Heuristically flag patterns that often cause ambiguity.",
    dzh="CFG 歧义性不可判定，但可检测常见模式：多产生式共享 FIRST，或同一非终结符同时左右递归。",
    den="Ambiguity is undecidable; we flag shared FIRST sets or simultaneous left/right recursion.",
    tags="['parsing','grammar','ambiguity']", time="O(n^2)", space="O(n)",
    impl="""// CFG 歧义检测 · 纯算法实现
export interface Rule { head: string; alts: string[][]; }
export interface AmbiguityWarning { rule: string; reason: string; }

export function detectAmbiguity(rules: Rule[]): AmbiguityWarning[] {
  const out: AmbiguityWarning[] = [];
  for (const r of rules) {
    const firstMap = new Map<string, number>();
    for (const alt of r.alts) {
      const f = alt[0] ?? 'ε';
      firstMap.set(f, (firstMap.get(f) ?? 0) + 1);
    }
    for (const [f, c] of firstMap) if (c > 1) out.push({ rule: r.head, reason: `multiple alternatives start with "${f}"` });
    const hasLeft = r.alts.some((a) => a[0] === r.head);
    const hasRight = r.alts.some((a) => a[a.length - 1] === r.head);
    if (hasLeft && hasRight) out.push({ rule: r.head, reason: 'both left- and right-recursive — likely ambiguous' });
  }
  return out;
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { detectAmbiguity, type Rule } from './impl.ts';

export const DEFAULT_INPUT: Rule[] = [{ head: 'S', alts: [['S', '+', 'S'], ['id']] }];

export function buildTrace(input: Rule[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: `规则数: ${input.length}`, en: `${input.length} rules` })
    .setAux(input.map((r) => ({ label: r.head, value: r.alts.map((a) => a.join(' ')).join(' | '), role: 'compare' as BarRole }))).commit();
  const warns = detectAmbiguity(input);
  for (const w of warns) {
    rec.begin({ zh: `[${w.rule}] ${w.reason}`, en: `[${w.rule}] ${w.reason}` })
      .setAux([{ label: w.rule, value: w.reason, role: 'warn' as BarRole }]).commit();
  }
  if (warns.length === 0) rec.begin({ zh: '无明显歧义', en: 'no obvious ambiguity' }).commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { detectAmbiguity } from '../../src/algorithms/parsing/parse-grammar-ambiguity/impl.ts';

test('detect-ambiguity 共享首符', () => {
  const w = detectAmbiguity([{ head: 'S', alts: [['id', '+', 'S'], ['id']] }]);
  assert.equal(w.length, 1);
  assert.equal(w[0]!.rule, 'S');
});
test('detect-ambiguity 左右递归共存', () => {
  const w = detectAmbiguity([{ head: 'A', alts: [['A', '+', 'x'], ['x', '+', 'A'], ['x']] }]);
  assert.ok(w.some((x) => x.reason.includes('left- and right-recursive')));
});
""")

# 18
add(cat="parsing", id="parse-grammar-reachability",
    tzh="文法可达性", ten="Grammar Reachability Analysis",
    szh="找出文法中可达与不可达非终结符，便于裁剪无用产生式。", sen="Find reachable vs unreachable non-terminals to prune useless productions.",
    dzh="从起始符 BFS：能到达的为可达；其余不可达可删。",
    den="BFS from start: reachable non-terminals are kept; the rest can be removed.",
    tags="['parsing','grammar','analysis']", time="O(n)", space="O(n)",
    impl="""// 文法可达性分析 · 纯算法实现
export interface Rule { head: string; syms: string[]; }
export function isNonTerminal(s: string): boolean { return /^[A-Z]/.test(s); }

export interface ReachResult { reachable: Set<string>; unreachable: string[]; }

export function analyzeReachability(rules: Rule[], start: string): ReachResult {
  const heads = new Set(rules.map((r) => r.head));
  const edges = new Map<string, string[]>();
  for (const r of rules) {
    const arr = edges.get(r.head) ?? [];
    for (const s of r.syms) if (isNonTerminal(s) && heads.has(s)) arr.push(s);
    edges.set(r.head, arr);
  }
  const reachable = new Set<string>([start]);
  const queue = [start];
  while (queue.length) {
    const h = queue.shift()!;
    for (const n of edges.get(h) ?? []) if (!reachable.has(n)) { reachable.add(n); queue.push(n); }
  }
  const unreachable = [...heads].filter((h) => !reachable.has(h));
  return { reachable, unreachable };
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { analyzeReachability, type Rule } from './impl.ts';

export const DEFAULT_INPUT: { rules: Rule[]; start: string } = {
  rules: [
    { head: 'S', syms: ['A', 'B'] },
    { head: 'A', syms: ['x'] },
    { head: 'B', syms: ['A'] },
    { head: 'C', syms: ['y'] },
  ],
  start: 'S',
};

export function buildTrace(input: { rules: Rule[]; start: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: `起始符: ${input.start}`, en: `Start: ${input.start}` }).commit();
  const r = analyzeReachability(input.rules, input.start);
  rec.begin({ zh: `可达: {${[...r.reachable].join(',')}}`, en: `Reachable: {${[...r.reachable].join(',')}}` })
    .setAux([...r.reachable].map((s) => ({ label: s, value: s, role: 'final' as BarRole }))).commit();
  if (r.unreachable.length) {
    rec.begin({ zh: `不可达: {${r.unreachable.join(',')}}`, en: `Unreachable: {${r.unreachable.join(',')}}` })
      .setAux(r.unreachable.map((s) => ({ label: s, value: s, role: 'warn' as BarRole }))).commit();
  }
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { analyzeReachability } from '../../src/algorithms/parsing/parse-grammar-reachability/impl.ts';

test('reachability 找出不可达', () => {
  const r = analyzeReachability([
    { head: 'S', syms: ['A', 'B'] },
    { head: 'A', syms: ['x'] },
    { head: 'B', syms: ['A'] },
    { head: 'C', syms: ['y'] },
  ], 'S');
  assert.ok(r.reachable.has('S') && r.reachable.has('A') && r.reachable.has('B'));
  assert.deepEqual(r.unreachable, ['C']);
});
""")

# 19
add(cat="parsing", id="parse-jsonpath",
    tzh="JSONPath 查询", ten="JSONPath Query",
    szh="用路径表达式查询嵌套 JSON 数据。", sen="Query nested JSON with path expressions like $.a.b[0].c.",
    dzh="解析 $.a.b[0].c 路径，沿对象/数组指针逐级访问。支持通配符 * 与索引 [i]。",
    den="Parse $.a.b[0].c and walk object/array pointers. Supports * and [i].",
    tags="['parsing','json','query','jsonpath']", time="O(n)", space="O(path)",
    impl="""// JSONPath 查询 · 纯算法实现
export interface PathSeg { kind: 'key' | 'index' | 'wildcard'; value?: string | number; }

export function parsePath(path: string): PathSeg[] {
  const out: PathSeg[] = [];
  const re = /\\.(\\w+)|\\[(\\d+|\\*)\\]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(path)) !== null) {
    if (m[1] !== undefined) out.push({ kind: 'key', value: m[1] });
    else if (m[2] === '*') out.push({ kind: 'wildcard' });
    else if (m[2] !== undefined) out.push({ kind: 'index', value: Number(m[2]) });
  }
  return out;
}

export function queryPath(root: unknown, path: string): unknown[] {
  const segs = parsePath(path);
  let cur: unknown[] = [root];
  for (const seg of segs) {
    const next: unknown[] = [];
    for (const v of cur) {
      if (seg.kind === 'key' && v !== null && typeof v === 'object' && !Array.isArray(v)) {
        const k = (v as Record<string, unknown>)[seg.value as string];
        if (k !== undefined) next.push(k);
      } else if (seg.kind === 'index' && Array.isArray(v)) {
        const i = seg.value as number;
        if (i >= 0 && i < v.length) next.push(v[i]!);
      } else if (seg.kind === 'wildcard') {
        if (Array.isArray(v)) next.push(...v);
        else if (v !== null && typeof v === 'object') next.push(...Object.values(v as Record<string, unknown>));
      }
    }
    cur = next;
  }
  return cur;
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { parsePath, queryPath } from './impl.ts';

export const DEFAULT_INPUT = { data: { store: { book: [{ title: 'A' }, { title: 'B' }] } }, path: '$.store.book[*].title' };

export function buildTrace(input: { data: unknown; path: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const segs = parsePath(input.path);
  rec.begin({ zh: `路径: ${input.path}`, en: `Path: ${input.path}` })
    .setAux(segs.map((s, i) => ({ label: `s${i}`, value: s.kind + (s.value !== undefined ? `:${s.value}` : ''), role: 'compare' as BarRole }))).commit();
  const res = queryPath(input.data, input.path);
  rec.begin({ zh: `结果: ${JSON.stringify(res)}`, en: `Result: ${JSON.stringify(res)}` })
    .setAux(res.map((v, i) => ({ label: `r${i}`, value: JSON.stringify(v), role: 'final' as BarRole }))).commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parsePath, queryPath } from '../../src/algorithms/parsing/parse-jsonpath/impl.ts';

test('jsonpath 解析', () => {
  assert.deepEqual(parsePath('$.a.b[0].c'), [
    { kind: 'key', value: 'a' },
    { kind: 'key', value: 'b' },
    { kind: 'index', value: 0 },
    { kind: 'key', value: 'c' },
  ]);
});
test('jsonpath 查询', () => {
  const data = { a: { b: [{ c: 1 }, { c: 2 }] } };
  assert.deepEqual(queryPath(data, '$.a.b[0].c'), [1]);
  assert.deepEqual(queryPath(data, '$.a.b[*].c'), [1, 2]);
});
""")

# 20
add(cat="parsing", id="parse-csv-streaming",
    tzh="流式 CSV 解析", ten="Streaming CSV Parser",
    szh="逐块输入、跨块保留状态地解析 CSV（支持引号、换行）。", sen="Parse CSV incrementally across chunks, handling quotes and embedded newlines.",
    dzh="维护当前字段缓冲与引号状态；遇分隔符或换行提交记录；块尾时保留缓冲等下一块。",
    den="Keep a field buffer and in-quote flag; emit records on delimiter/newline; preserve state across chunks.",
    tags="['parsing','csv','streaming']", time="O(n)", space="O(line)",
    impl="""// 流式 CSV 解析 · 纯算法实现
export interface CsvHooks { onRow?: (fields: string[]) => void; }

export class StreamingCsv {
  private field = '';
  private row: string[] = [];
  private inQuotes = false;
  constructor(private sep = ',', private hooks: CsvHooks = {}) {}
  feed(chunk: string): void {
    for (let i = 0; i < chunk.length; i++) {
      const c = chunk[i]!;
      if (this.inQuotes) {
        if (c === '"') {
          if (chunk[i + 1] === '"') { this.field += '"'; i++; }
          else this.inQuotes = false;
        } else this.field += c;
      } else if (c === '"') this.inQuotes = true;
      else if (c === this.sep) { this.row.push(this.field); this.field = ''; }
      else if (c === '\\n' || c === '\\r') {
        if (c === '\\r' && chunk[i + 1] === '\\n') i++;
        this.row.push(this.field); this.field = '';
        this.hooks.onRow?.(this.row); this.row = [];
      } else this.field += c;
    }
  }
  end(): void {
    if (this.field.length > 0 || this.row.length > 0) {
      this.row.push(this.field); this.field = '';
      this.hooks.onRow?.(this.row); this.row = [];
    }
  }
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { StreamingCsv } from './impl.ts';

export const DEFAULT_INPUT = 'a,b\\nc,"x,y"\\nz';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: `输入: ${JSON.stringify(input)}`, en: `Input: ${JSON.stringify(input)}` }).commit();
  const parser = new StreamingCsv(',', {
    onRow: (r) => rec.begin({ zh: `行: ${JSON.stringify(r)}`, en: `Row: ${JSON.stringify(r)}` })
      .setAux(r.map((f, i) => ({ label: `f${i}`, value: f, role: 'final' as BarRole }))).commit(),
  });
  parser.feed(input);
  parser.end();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { StreamingCsv } from '../../src/algorithms/parsing/parse-csv-streaming/impl.ts';

test('streaming-csv 基本', () => {
  const rows: string[][] = [];
  const p = new StreamingCsv(',', { onRow: (r) => rows.push(r) });
  p.feed('a,b\\nc,d'); p.end();
  assert.deepEqual(rows, [['a', 'b'], ['c', 'd']]);
});
test('streaming-csv 引号包裹', () => {
  const rows: string[][] = [];
  const p = new StreamingCsv(',', { onRow: (r) => rows.push(r) });
  p.feed('"x,y",z'); p.end();
  assert.deepEqual(rows, [['x,y', 'z']]);
});
test('streaming-csv 跨块', () => {
  const rows: string[][] = [];
  const p = new StreamingCsv(',', { onRow: (r) => rows.push(r) });
  p.feed('a,b'); p.feed('\\nc,d'); p.end();
  assert.deepEqual(rows, [['a', 'b'], ['c', 'd']]);
});
""")
