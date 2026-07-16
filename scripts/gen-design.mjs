// design 类别 · 30 个算法规范（设计模式 + 架构模式）
import { add } from './gen-batch.mjs';

// 1. design-null-object
add({
  cat: 'design', id: 'design-null-object',
  title: { zh: '空对象模式', en: 'Null Object' },
  summary: { zh: '用中性对象替代 null 检查。', en: 'Neutral object replaces null checks.' },
  description: { zh: '空对象模式提供一个实现相同接口但无操作的默认对象，消除调用方的 null 判断分支。', en: 'The Null Object pattern provides a default no-op object implementing the same interface, removing null-check branches in callers.' },
  tags: ['design','pattern','null-object','behavioral'],
  complexity: { time: 'O(1)', space: 'O(1)' },
  impl: `export interface Logger { log(msg: string): void; }
export class ConsoleLogger implements Logger { log(msg: string): void { /* write */ } }
export class NullLogger implements Logger { log(_msg: string): void { /* no-op */ } }
export interface NhHooks { onLog?: (target: string, msg: string) => void; }
export function runWithLogger(log: Logger, messages: string[], hooks: NhHooks = {}): number {
  let count = 0;
  for (const m of messages) { log.log(m); hooks.onLog?.(log instanceof NullLogger ? 'null' : 'console', m); count++; }
  return count;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { runWithLogger, NullLogger, type Logger } from './impl.ts';
export const DEFAULT_INPUT: any = { target: 'null', messages: ['a','b','c'] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '空对象', en: 'Null Object' }).commit();
  const log: Logger = input.target === 'null' ? new NullLogger() : ({ log: (_m: string) => {} } as Logger);
  const n = runWithLogger(log, input.messages, {
    onLog: (t, m) => rec.begin({ zh: t + ' <- ' + m, en: 'log' }).setAux([{label:'target',value:t,role:'compare' as BarRole},{label:'msg',value:m,role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: n + ' 条', en: n + ' msgs' }).setAux([{label:'count',value:String(n),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runWithLogger, NullLogger } from '../../src/algorithms/design/design-null-object/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-null-object/trace.ts';
test('null logger 计数仍准确', () => assert.equal(runWithLogger(new NullLogger(), ['a','b']), 2));
test('null-object trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 2. design-specification
add({
  cat: 'design', id: 'design-specification',
  title: { zh: '规约模式', en: 'Specification' },
  summary: { zh: '用可组合谓词表达业务规则。', en: 'Composable predicates for business rules.' },
  description: { zh: '规约模式把每条业务规则封装成对象，提供 and/or/not 组合，使规则可复用、可测试、可链式组合。', en: 'The Specification pattern wraps each rule as a composable object with and/or/not, enabling reuse, testing, and chaining.' },
  tags: ['design','pattern','specification','behavioral'],
  complexity: { time: 'O(n)', space: 'O(1)' },
  impl: `export type Spec<T> = { isSatisfiedBy: (t: T) => boolean };
export function andSpec<T>(a: Spec<T>, b: Spec<T>): Spec<T> { return { isSatisfiedBy: (t) => a.isSatisfiedBy(t) && b.isSatisfiedBy(t) }; }
export function orSpec<T>(a: Spec<T>, b: Spec<T>): Spec<T> { return { isSatisfiedBy: (t) => a.isSatisfiedBy(t) || b.isSatisfiedBy(t) }; }
export function notSpec<T>(a: Spec<T>): Spec<T> { return { isSatisfiedBy: (t) => !a.isSatisfiedBy(t) }; }
export interface SpHooks { onCheck?: (item: number, ok: boolean) => void; }
export function filterBy<T>(items: T[], spec: Spec<T>, hooks: SpHooks = {}): T[] {
  return items.filter((it, i) => { const ok = spec.isSatisfiedBy(it); hooks.onCheck?.(i, ok); return ok; });
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { filterBy, andSpec, type Spec } from './impl.ts';
const gt2: Spec<number> = { isSatisfiedBy: (n) => n > 2 };
const lt8: Spec<number> = { isSatisfiedBy: (n) => n < 8 };
export const DEFAULT_INPUT: any = [1,3,5,9,4];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '规约 >2 AND <8', en: 'spec' }).commit();
  const out = filterBy(input, andSpec(gt2, lt8), {
    onCheck: (i, ok) => rec.begin({ zh: 'item ' + i, en: 'check' }).setAux([{label:'item',value:String(i),role:'compare' as BarRole},{label:'ok',value:String(ok),role:ok?'final' as BarRole:'warn' as BarRole}]).commit(),
  });
  rec.begin({ zh: '通过 [' + out.join(',') + ']', en: 'pass' }).setAux([{label:'pass',value:out.join(','),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { filterBy, andSpec, orSpec, notSpec, type Spec } from '../../src/algorithms/design/design-specification/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-specification/trace.ts';
const gt2: Spec<number> = { isSatisfiedBy: (n) => n > 2 };
const lt8: Spec<number> = { isSatisfiedBy: (n) => n < 8 };
test('and 组合', () => assert.deepEqual(filterBy([1,3,5,9], andSpec(gt2, lt8)), [3,5]));
test('or/not 组合', () => assert.deepEqual(filterBy([1,3,9], notSpec(gt2)), [1]));
test('spec trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 3. design-interpreter
add({
  cat: 'design', id: 'design-interpreter',
  title: { zh: '解释器模式', en: 'Interpreter' },
  summary: { zh: '用语法树解释语言表达式。', en: 'Evaluate expressions via a syntax tree.' },
  description: { zh: '解释器模式为每种语法规则定义一个表达式类，递归求值语法树，常用于查询语言、规则引擎。', en: 'The Interpreter pattern defines an expression class per grammar rule and recursively evaluates the AST; used in query languages and rule engines.' },
  tags: ['design','pattern','interpreter','behavioral'],
  complexity: { time: 'O(n)', space: 'O(h)' },
  impl: `export type Expr = { eval: (ctx: Map<string, number>) => number };
export const num = (v: number): Expr => ({ eval: () => v });
export const varr = (name: string): Expr => ({ eval: (ctx) => ctx.get(name) ?? 0 });
export const addE = (a: Expr, b: Expr): Expr => ({ eval: (ctx) => a.eval(ctx) + b.eval(ctx) });
export const mulE = (a: Expr, b: Expr): Expr => ({ eval: (ctx) => a.eval(ctx) * b.eval(ctx) });
export interface IpHooks { onEval?: (depth: number, val: number) => void; }
export function evaluate(e: Expr, ctx: Map<string, number>, hooks: IpHooks = {}, depth = 0): number {
  const v = e.eval(ctx); hooks.onEval?.(depth, v); return v;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { evaluate, num, varr, addE, mulE } from './impl.ts';
export const DEFAULT_INPUT: any = { x: 3, y: 4 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '解释 (x+y)*x', en: 'interp' }).commit();
  const ctx = new Map([['x', input.x], ['y', input.y]]);
  const ast = mulE(addE(varr('x'), varr('y')), varr('x'));
  const v = evaluate(ast, ctx, {
    onEval: (d, val) => rec.begin({ zh: '深度 ' + d + ' = ' + val, en: 'eval' }).setAux([{label:'depth',value:String(d),role:'compare' as BarRole}]).commit(),
  });
  rec.begin({ zh: '结果 ' + v, en: 'result' }).setAux([{label:'result',value:String(v),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { evaluate, num, varr, addE, mulE } from '../../src/algorithms/design/design-interpreter/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-interpreter/trace.ts';
test('解释 (3+4)*3', () => { const ctx = new Map([['x',3],['y',4]]); assert.equal(evaluate(mulE(addE(varr('x'),varr('y')),varr('x')), ctx), 21); });
test('解释器 trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 4. design-multiton
add({
  cat: 'design', id: 'design-multiton',
  title: { zh: '多例模式', en: 'Multiton' },
  summary: { zh: '按键缓存有限个单例。', en: 'Caches a bounded set of singletons by key.' },
  description: { zh: '多例模式维护一个键到唯一实例的映射，保证同一键返回同一实例，是单例的推广，常用于连接池、缓存命名空间。', en: 'The Multiton pattern maps keys to unique instances, guaranteeing the same instance per key; generalizes Singleton. Used in pools and cache namespaces.' },
  tags: ['design','pattern','multiton','creational'],
  complexity: { time: 'O(1)', space: 'O(k)' },
  impl: `export interface MtHooks { onAccess?: (key: string, created: boolean) => void; }
export class Multiton {
  private instances = new Map<string, { id: number }>();
  private next = 0;
  get(key: string, hooks: MtHooks = {}): { id: number } {
    let it = this.instances.get(key);
    const created = !it;
    if (!it) { it = { id: this.next++ }; this.instances.set(key, it); }
    hooks.onAccess?.(key, created);
    return it;
  }
  size(): number { return this.instances.size; }
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { Multiton } from './impl.ts';
export const DEFAULT_INPUT: any = ['a','b','a','c','a'];
export function buildTrace(input: string[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '多例', en: 'Multiton' }).commit();
  const m = new Multiton();
  for (const k of input) { const it = m.get(k, { onAccess: (key, created) => rec.begin({ zh: key + (created ? ' 新建' : ' 复用'), en: 'access' }).setAux([{label:'key',value:key,role:'compare' as BarRole},{label:'created',value:String(created),role:created?'final' as BarRole:'warn' as BarRole}]).commit() }); void it; }
  rec.begin({ zh: '共 ' + m.size() + ' 实例', en: m.size() + ' instances' }).setAux([{label:'size',value:String(m.size()),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Multiton } from '../../src/algorithms/design/design-multiton/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-multiton/trace.ts';
test('multiton 同键同实例', () => { const m = new Multiton(); assert.equal(m.get('a'), m.get('a')); assert.notEqual(m.get('a'), m.get('b')); });
test('multiton 大小', () => { const m = new Multiton(); m.get('x'); m.get('y'); m.get('x'); assert.equal(m.size(), 2); });
test('multiton trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 5. design-fluent-interface
add({
  cat: 'design', id: 'design-fluent-interface',
  title: { zh: '流式接口', en: 'Fluent Interface' },
  summary: { zh: '方法链式返回 this。', en: 'Methods return this for chaining.' },
  description: { zh: '流式接口让每个修改方法返回 this，使调用可链式写成一行的查询/构建语句，常见于 jQuery、Stream、QueryBuilder。', en: 'A fluent interface has each mutator return this, enabling one-line chained calls; seen in jQuery, Stream, QueryBuilder.' },
  tags: ['design','pattern','fluent','creational'],
  complexity: { time: 'O(1) per op', space: 'O(1)' },
  impl: `export interface FiHooks { onOp?: (op: string, val: number) => void; }
export class Counter {
  private n = 0;
  add(x: number, hooks: FiHooks = {}): this { this.n += x; hooks.onOp?.('add', x); return this; }
  sub(x: number, hooks: FiHooks = {}): this { this.n -= x; hooks.onOp?.('sub', x); return this; }
  mul(x: number, hooks: FiHooks = {}): this { this.n *= x; hooks.onOp?.('mul', x); return this; }
  value(): number { return this.n; }
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { Counter } from './impl.ts';
export const DEFAULT_INPUT: any = null;
export function buildTrace(_input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '流式', en: 'Fluent' }).commit();
  const c = new Counter();
  c.add(5).sub(2).mul(3).add(1, { onOp: (op, v) => rec.begin({ zh: op + ' ' + v, en: 'op' }).setAux([{label:'op',value:op,role:'compare' as BarRole},{label:'val',value:String(v),role:'pivot' as BarRole}]).commit() });
  rec.begin({ zh: '结果 ' + c.value(), en: 'value' }).setAux([{label:'value',value:String(c.value()),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Counter } from '../../src/algorithms/design/design-fluent-interface/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-fluent-interface/trace.ts';
test('流式 ((5-2)*3)+1 = 10', () => assert.equal(new Counter().add(5).sub(2).mul(3).add(1).value(), 10));
test('fluent trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 6. design-monostate
add({
  cat: 'design', id: 'design-monostate',
  title: { zh: '单态模式', en: 'Monostate' },
  summary: { zh: '所有实例共享同一状态。', en: 'All instances share the same state.' },
  description: { zh: '单态模式通过静态字段让所有实例共享同一状态，调用方感觉是普通对象但行为等同单例，比单例更易测试。', en: 'Monostate shares state via static fields so all instances behave like one singleton while looking like normal objects; easier to test than Singleton.' },
  tags: ['design','pattern','monostate','creational'],
  complexity: { time: 'O(1)', space: 'O(1)' },
  impl: `export interface MsHooks { onSet?: (instanceId: number, value: number) => void; }
export class Monostate {
  private static shared = 0;
  private id: number;
  constructor(id: number) { this.id = id; }
  set(v: number, hooks: MsHooks = {}): void { Monostate.shared = v; hooks.onSet?.(this.id, v); }
  get(): number { return Monostate.shared; }
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { Monostate } from './impl.ts';
export const DEFAULT_INPUT: any = [[1,10],[2,20],[1,99]];
export function buildTrace(input: number[][] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '单态', en: 'Monostate' }).commit();
  const a = new Monostate(1); const b = new Monostate(2);
  for (const [id, v] of input) { (id === 1 ? a : b).set(v!, { onSet: (iid, val) => rec.begin({ zh: 'inst ' + iid + ' set ' + val, en: 'set' }).setAux([{label:'inst',value:String(iid),role:'compare' as BarRole}]).commit() }); }
  rec.begin({ zh: '共享值 ' + a.get(), en: 'shared' }).setAux([{label:'shared',value:String(a.get()),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Monostate } from '../../src/algorithms/design/design-monostate/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-monostate/trace.ts';
test('monostate 共享状态', () => { const a = new Monostate(1); const b = new Monostate(2); a.set(42); assert.equal(b.get(), 42); });
test('monostate trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 7. design-role-object
add({
  cat: 'design', id: 'design-role-object',
  title: { zh: '角色对象模式', en: 'Role Object' },
  summary: { zh: '按角色动态挂载接口。', en: 'Dynamically attach role-specific interfaces.' },
  description: { zh: '角色对象模式让一个核心对象按需动态获得不同角色接口(如 Customer 同时是 Buyer 和 Payer)，避免巨型类。', en: 'The Role Object pattern lets a core object dynamically acquire role-specific interfaces (Customer as Buyer, Payer), avoiding god classes.' },
  tags: ['design','pattern','role-object','structural'],
  complexity: { time: 'O(1)', space: 'O(r)' },
  impl: `export interface Role { play(): string; }
export class Core { private roles = new Map<string, Role>(); private n = 0;
  addRole(name: string, r: Role, hooks: { onAdd?: (n: string) => void } = {}): void { this.roles.set(name, r); this.n++; hooks.onAdd?.(name); }
  as(name: string): Role | undefined { return this.roles.get(name); }
  count(): number { return this.n; }
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { Core, type Role } from './impl.ts';
const buyer: Role = { play: () => 'buy' };
const payer: Role = { play: () => 'pay' };
export const DEFAULT_INPUT: any = [['buyer'],['payer'],['buyer']];
export function buildTrace(input: string[][] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '角色对象', en: 'Role Object' }).commit();
  const c = new Core();
  for (const [name] of input) { const existing = c.as(name!); if (!existing) c.addRole(name!, name === 'buyer' ? buyer : payer, { onAdd: (n) => rec.begin({ zh: '挂载 ' + n, en: 'add role' }).setAux([{label:'role',value:n,role:'compare' as BarRole}]).commit() }); else rec.begin({ zh: '已有 ' + name, en: 'exists' }).setAux([{label:'role',value:name!,role:'warn' as BarRole}]).commit(); }
  rec.begin({ zh: '共 ' + c.count() + ' 角色', en: c.count() + ' roles' }).setAux([{label:'roles',value:String(c.count()),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Core, type Role } from '../../src/algorithms/design/design-role-object/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-role-object/trace.ts';
test('role-object 动态挂载', () => { const c = new Core(); c.addRole('x', { play: () => 'a' }); assert.equal(c.as('x')?.play(), 'a'); assert.equal(c.as('y'), undefined); });
test('role-object trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 8. design-extension-object
add({
  cat: 'design', id: 'design-extension-object',
  title: { zh: '扩展对象模式', en: 'Extension Object' },
  summary: { zh: '运行时查询附加接口。', en: 'Query附加 interface at runtime.' },
  description: { zh: '扩展对象模式允许在不修改核心类的前提下，按需为对象附加扩展接口，客户端通过类型查询获取扩展。', en: 'The Extension Object pattern attaches extension interfaces to a core object at runtime without modifying it; clients query by type.' },
  tags: ['design','pattern','extension-object','structural'],
  complexity: { time: 'O(1)', space: 'O(e)' },
  impl: `export interface Ext { id: string; }
export class Subject { private exts = new Map<string, Ext>();
  setExtension(id: string, e: Ext): void { this.exts.set(id, e); }
  getExtension(id: string): Ext | undefined { return this.exts.get(id); }
}
export interface EoHooks { onQuery?: (id: string, found: boolean) => void; }
export function queryExt(s: Subject, id: string, hooks: EoHooks = {}): Ext | undefined { const e = s.getExtension(id); hooks.onQuery?.(id, !!e); return e; }`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { Subject, queryExt } from './impl.ts';
export const DEFAULT_INPUT: any = ['a','b','c'];
export function buildTrace(input: string[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '扩展对象', en: 'Extension Object' }).commit();
  const s = new Subject(); s.setExtension('a', { id: 'a' });
  for (const id of input) queryExt(s, id, { onQuery: (i, f) => rec.begin({ zh: '查询 ' + i + ' ' + (f ? '命中' : '缺失'), en: 'query' }).setAux([{label:'id',value:i,role:'compare' as BarRole},{label:'found',value:String(f),role:f?'final' as BarRole:'warn' as BarRole}]).commit() });
  rec.begin({ zh: '完成', en: 'done' }).setAux([{label:'done',value:'ok',role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Subject, queryExt } from '../../src/algorithms/design/design-extension-object/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-extension-object/trace.ts';
test('ext 命中', () => { const s = new Subject(); s.setExtension('x', { id: 'x' }); assert.equal(queryExt(s, 'x')?.id, 'x'); assert.equal(queryExt(s, 'y'), undefined); });
test('ext trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 9. design-type-object
add({
  cat: 'design', id: 'design-type-object',
  title: { zh: '类型对象模式', en: 'Type Object' },
  summary: { zh: '把类型抽成可共享数据对象。', en: 'Lift type info into a shared data object.' },
  description: { zh: '类型对象模式把一个类的共享属性(名字、最大血量、抗性)抽成单独的类型对象，实例引用它，便于动态加新类型。', en: 'The Type Object pattern extracts shared class data (name, max HP, resist) into a separate type object referenced by instances, easing dynamic new types (e.g. game units).' },
  tags: ['design','pattern','type-object','structural'],
  complexity: { time: 'O(1)', space: 'O(t)' },
  impl: `export interface TypeObj { name: string; maxHp: number; attack: number; }
export class Instance { hp: number;
  constructor(public type: TypeObj) { this.hp = type.maxHp; }
}
export interface ToHooks { onHit?: (target: Instance, dmg: number, hpAfter: number) => void; }
export function attack(a: Instance, b: Instance, hooks: ToHooks = {}): void { b.hp = Math.max(0, b.hp - a.type.attack); hooks.onHit?.(b, a.type.attack, b.hp); }`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { Instance, attack, type TypeObj } from './impl.ts';
const dragon: TypeObj = { name: 'dragon', maxHp: 30, attack: 8 };
const hero: TypeObj = { name: 'hero', maxHp: 20, attack: 5 };
export const DEFAULT_INPUT: any = null;
export function buildTrace(_input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '类型对象', en: 'Type Object' }).commit();
  const d = new Instance(dragon); const h = new Instance(hero);
  for (let i = 0; i < 4; i++) { attack(h, d, { onHit: (_t, dmg, hp) => rec.begin({ zh: 'hero -> dragon -' + dmg + ' hp=' + hp, en: 'hit' }).setAux([{label:'dmg',value:String(dmg),role:'compare' as BarRole},{label:'hp',value:String(hp),role:'final' as BarRole}]).commit() }); if (d.hp === 0) break; }
  rec.begin({ zh: d.hp === 0 ? 'dragon 死' : 'dragon hp ' + d.hp, en: 'done' }).setAux([{label:'hp',value:String(d.hp),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Instance, attack, type TypeObj } from '../../src/algorithms/design/design-type-object/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-type-object/trace.ts';
const t: TypeObj = { name: 'a', maxHp: 10, attack: 4 };
test('type-object 共享类型', () => { const i1 = new Instance(t); const i2 = new Instance(t); assert.equal(i1.hp, 10); attack(i1, i2); assert.equal(i2.hp, 6); });
test('type-object trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 10. design-private-class-data
add({
  cat: 'design', id: 'design-private-class-data',
  title: { zh: '私有类数据模式', en: 'Private Class Data' },
  summary: { zh: '把可变状态封装到独立对象。', en: 'Encapsulate mutable state in a separate object.' },
  description: { zh: '私有类数据模式把类的内部状态抽到独立数据对象，主类只持只读引用，防止方法意外修改、便于加锁保护。', en: 'The Private Class Data pattern moves mutable state into a separate data object the main class reads; prevents accidental mutation and eases locking.' },
  tags: ['design','pattern','private-data','structural'],
  complexity: { time: 'O(1)', space: 'O(1)' },
  impl: `export class CircleData { constructor(public radius: number, public color: string) {} }
export class Circle { constructor(private data: CircleData) {}
  area(): number { return Math.PI * this.data.radius * this.data.radius; }
  describe(): string { return this.data.color + ' r=' + this.data.radius; }
}
export interface PdHooks { onCall?: (method: string, result: number | string) => void; }`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { Circle, CircleData } from './impl.ts';
export const DEFAULT_INPUT: any = { radius: 3, color: 'red' };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '私有数据', en: 'Private Data' }).commit();
  const c = new Circle(new CircleData(input.radius, input.color));
  rec.begin({ zh: c.describe(), en: 'describe' }).setAux([{label:'desc',value:c.describe(),role:'compare' as BarRole}]).commit();
  const a = c.area();
  rec.begin({ zh: '面积 ' + a.toFixed(2), en: 'area' }).setAux([{label:'area',value:a.toFixed(2),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Circle, CircleData } from '../../src/algorithms/design/design-private-class-data/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-private-class-data/trace.ts';
test('circle 面积', () => { const c = new Circle(new CircleData(2, 'blue')); assert.equal(c.area(), Math.PI * 4); });
test('private-data trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 11. design-front-controller
add({
  cat: 'design', id: 'design-front-controller',
  title: { zh: '前端控制器', en: 'Front Controller' },
  summary: { zh: '单一入口分发所有请求。', en: 'Single entry dispatches all requests.' },
  description: { zh: '前端控制器模式用一个控制器接收所有请求，统一鉴权、日志后分发到具体处理器，常见于 Web MVC 框架。', en: 'The Front Controller pattern routes all requests through one controller that does auth/logging then dispatches; standard in Web MVC frameworks.' },
  tags: ['design','pattern','front-controller','architectural'],
  complexity: { time: 'O(1) per request', space: 'O(h)' },
  impl: `export type Handler = (req: string) => string;
export class FrontController { private handlers = new Map<string, Handler>();
  register(route: string, h: Handler): void { this.handlers.set(route, h); }
  dispatch(route: string, req: string, hooks: { onDispatch?: (r: string, resp: string) => void } = {}): string {
    const h = this.handlers.get(route); const resp = h ? h(req) : '404';
    hooks.onDispatch?.(route, resp); return resp;
  }
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { FrontController } from './impl.ts';
export const DEFAULT_INPUT: any = [['home','hi'],['user','bob'],['none','x']];
export function buildTrace(input: string[][] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '前端控制器', en: 'Front Controller' }).commit();
  const fc = new FrontController(); fc.register('home', () => 'home page'); fc.register('user', (r) => 'user ' + r);
  for (const [route, req] of input) fc.dispatch(route!, req!, { onDispatch: (r, resp) => rec.begin({ zh: r + ' -> ' + resp, en: 'dispatch' }).setAux([{label:'route',value:r,role:'compare' as BarRole},{label:'resp',value:resp,role:resp==='404'?'warn' as BarRole:'final' as BarRole}]).commit() });
  rec.begin({ zh: '完成', en: 'done' }).setAux([{label:'done',value:'ok',role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FrontController } from '../../src/algorithms/design/design-front-controller/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-front-controller/trace.ts';
test('fc 分发命中', () => { const fc = new FrontController(); fc.register('a', () => 'A'); assert.equal(fc.dispatch('a', ''), 'A'); assert.equal(fc.dispatch('z', ''), '404'); });
test('fc trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 12. design-page-controller
add({
  cat: 'design', id: 'design-page-controller',
  title: { zh: '页面控制器', en: 'Page Controller' },
  summary: { zh: '每页一个控制器对象。', en: 'One controller per page.' },
  description: { zh: '页面控制器模式为每个页面/视图分配一个专门控制器处理该页输入与渲染，比单一前端控制器更细粒度。', en: 'The Page Controller pattern assigns a dedicated controller per page/view for input handling and rendering; finer-grained than Front Controller.' },
  tags: ['design','pattern','page-controller','architectural'],
  complexity: { time: 'O(1)', space: 'O(p)' },
  impl: `export abstract class PageController { abstract handle(req: string): string; }
export class HomePage extends PageController { handle(_req: string): string { return 'home render'; } }
export class AboutPage extends PageController { handle(req: string): string { return 'about ' + req; } }
export interface PcHooks { onRender?: (page: string, html: string) => void; }
export function render(pc: PageController, name: string, req: string, hooks: PcHooks = {}): string { const html = pc.handle(req); hooks.onRender?.(name, html); return html; }`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { HomePage, AboutPage, render, type PageController } from './impl.ts';
export const DEFAULT_INPUT: any = [['home','x'],['about','me']];
export function buildTrace(input: string[][] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '页面控制器', en: 'Page Controller' }).commit();
  const pages: Record<string, PageController> = { home: new HomePage(), about: new AboutPage() };
  for (const [name, req] of input) { const pc = pages[name!]!; render(pc, name!, req!, { onRender: (p, html) => rec.begin({ zh: p + ' -> ' + html, en: 'render' }).setAux([{label:'page',value:p,role:'compare' as BarRole}]).commit() }); }
  rec.begin({ zh: '完成', en: 'done' }).setAux([{label:'done',value:'ok',role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { HomePage, AboutPage, render } from '../../src/algorithms/design/design-page-controller/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-page-controller/trace.ts';
test('page-controller 渲染', () => { assert.equal(render(new HomePage(), 'home', ''), 'home render'); assert.equal(render(new AboutPage(), 'about', 'me'), 'about me'); });
test('page-controller trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 13. design-view-helper
add({
  cat: 'design', id: 'design-view-helper',
  title: { zh: '视图助手', en: 'View Helper' },
  summary: { zh: '视图与业务逻辑分离的助手。', en: 'Helpers separating view from logic.' },
  description: { zh: '视图助手模式把视图中不该有的格式化、国际化和业务逻辑抽到 helper 类/函数，保持视图纯展示。', en: 'The View Helper pattern pulls formatting, i18n and business logic out of the view into helper classes/functions, keeping views presentation-only.' },
  tags: ['design','pattern','view-helper','architectural'],
  complexity: { time: 'O(1)', space: 'O(1)' },
  impl: `export class FormatHelper { static money(n: number, sym: string): string { return sym + n.toFixed(2); } static date(d: Date): string { return d.toISOString().slice(0, 10); } static truncate(s: string, n: number): string { return s.length <= n ? s : s.slice(0, n) + '...'; } }
export interface VhHooks { onFormat?: (kind: string, out: string) => void; }
export function renderView(price: number, title: string, hooks: VhHooks = {}): string {
  const p = FormatHelper.money(price, '$'); hooks.onFormat?.('money', p);
  const t = FormatHelper.truncate(title, 10); hooks.onFormat?.('truncate', t);
  return '<h1>' + t + '</h1><span>' + p + '</span>';
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { renderView } from './impl.ts';
export const DEFAULT_INPUT: any = { price: 19.5, title: 'A Very Long Product Title' };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '视图助手', en: 'View Helper' }).commit();
  const html = renderView(input.price, input.title, { onFormat: (k, o) => rec.begin({ zh: k + ' -> ' + o, en: 'format' }).setAux([{label:'kind',value:k,role:'compare' as BarRole},{label:'out',value:o,role:'final' as BarRole}]).commit() });
  rec.begin({ zh: html, en: 'html' }).setAux([{label:'html',value:html,role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FormatHelper, renderView } from '../../src/algorithms/design/design-view-helper/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-view-helper/trace.ts';
test('money 格式', () => assert.equal(FormatHelper.money(19.5, '$'), '$19.50'));
test('truncate', () => assert.equal(FormatHelper.truncate('abcdef', 3), 'abc...'));
test('view-helper trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 14. design-composite-view
add({
  cat: 'design', id: 'design-composite-view',
  title: { zh: '组合视图', en: 'Composite View' },
  summary: { zh: '由多个子视图组合成页面。', en: 'Page composed of sub-views.' },
  description: { zh: '组合视图模式把页面拆成可复用的子视图(页眉、列表、页脚)再组合，类似复合组件，提高复用与一致性。', en: 'The Composite View pattern splits a page into reusable sub-views (header, list, footer) then composes them, improving reuse and consistency.' },
  tags: ['design','pattern','composite-view','architectural'],
  complexity: { time: 'O(v)', space: 'O(v)' },
  impl: `export type View = { render(): string };
export class LeafView implements View { constructor(private html: string) {} render(): string { return this.html; } }
export class CompositeView implements View { private kids: View[] = [];
  add(v: View): this { this.kids.push(v); return this; }
  render(): string { return this.kids.map((k) => k.render()).join('\\n'); }
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { LeafView, CompositeView, type View } from './impl.ts';
export const DEFAULT_INPUT: any = null;
export function buildTrace(_input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '组合视图', en: 'Composite View' }).commit();
  const page = new CompositeView();
  const parts: View[] = [new LeafView('<header>'), new LeafView('<list>'), new LeafView('<footer>')];
  for (const v of parts) { page.add(v); rec.begin({ zh: '加子视图', en: 'add' }).setAux([{label:'kid',value:v.render(),role:'compare' as BarRole}]).commit(); }
  const html = page.render();
  rec.begin({ zh: html.split('\\n').length + ' 段', en: 'segments' }).setAux([{label:'segments',value:String(html.split('\\n').length),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LeafView, CompositeView } from '../../src/algorithms/design/design-composite-view/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-composite-view/trace.ts';
test('composite view 拼接', () => { const p = new CompositeView().add(new LeafView('a')).add(new LeafView('b')); assert.equal(p.render(), 'a\\nb'); });
test('composite-view trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 15. design-transform-view
add({
  cat: 'design', id: 'design-transform-view',
  title: { zh: '转换视图', en: 'Transform View' },
  summary: { zh: '逐条转换模型为展示。', en: 'Transform each model row to display.' },
  description: { zh: '转换视图模式遍历数据，对每条记录应用转换函数生成展示输出，常用于把 DB 行转 HTML 表格行。', en: 'The Transform View pattern iterates data, applying a transform per record to produce display output (e.g. DB rows to HTML table rows).' },
  tags: ['design','pattern','transform-view','architectural'],
  complexity: { time: 'O(n)', space: 'O(n)' },
  impl: `export interface TvHooks { onRow?: (i: number, html: string) => void; }
export function transformRows<T>(rows: T[], tfn: (r: T, i: number) => string, hooks: TvHooks = {}): string {
  const parts = rows.map((r, i) => { const h = tfn(r, i); hooks.onRow?.(i, h); return h; });
  return parts.join('');
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { transformRows } from './impl.ts';
const TFN = (r: { name: string; age: number }) => '<tr><td>' + r.name + '</td><td>' + r.age + '</td></tr>';
export const DEFAULT_INPUT: any = [{ name: 'Ann', age: 30 }, { name: 'Bob', age: 25 }];
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '转换视图', en: 'Transform View' }).commit();
  const html = transformRows(input, TFN, { onRow: (i, h) => rec.begin({ zh: '行 ' + i, en: 'row' }).setAux([{label:'row',value:String(i),role:'compare' as BarRole}]).commit() });
  rec.begin({ zh: html.length + ' 字符', en: 'chars' }).setAux([{label:'chars',value:String(html.length),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { transformRows } from '../../src/algorithms/design/design-transform-view/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-transform-view/trace.ts';
const TFN = (r: { name: string }) => '<b>' + r.name + '</b>';
test('transform view 转换', () => assert.equal(transformRows([{name:'a'},{name:'b'}], TFN), '<b>a</b><b>b</b>'));
test('transform-view trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 16. design-two-step-view
add({
  cat: 'design', id: 'design-two-step-view',
  title: { zh: '两步视图', en: 'Two Step View' },
  summary: { zh: '先转逻辑视图再转展示。', en: 'Domain to logical, then logical to display.' },
  description: { zh: '两步视图先把领域数据转成逻辑 DOM(与主题无关)，再用主题/皮肤渲染成 HTML，便于多主题切换。', en: 'The Two Step View first converts domain data to a theme-neutral logical DOM, then renders to HTML per theme, easing multi-theme support.' },
  tags: ['design','pattern','two-step-view','architectural'],
  complexity: { time: 'O(n)', space: 'O(n)' },
  impl: `export type Logical = { tag: string; text: string };
export interface TsHooks { onLogical?: (i: number, l: Logical) => void; onRender?: (html: string) => void; }
export function twoStep<T>(data: T[], toLogical: (r: T) => Logical, theme: (l: Logical) => string, hooks: TsHooks = {}): string {
  const html = data.map((r, i) => { const l = toLogical(r); hooks.onLogical?.(i, l); return theme(l); }).join('');
  hooks.onRender?.(html); return html;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { twoStep, type Logical } from './impl.ts';
const toL = (r: { name: string }): Logical => ({ tag: 'h1', text: r.name });
const theme = (l: Logical): string => '<' + l.tag + '>' + l.text + '</' + l.tag + '>';
export const DEFAULT_INPUT: any = [{ name: 'Ann' }, { name: 'Bob' }];
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '两步视图', en: 'Two Step' }).commit();
  const html = twoStep(input, toL, theme, { onLogical: (i, l) => rec.begin({ zh: '逻辑 ' + l.tag + ':' + l.text, en: 'logical' }).setAux([{label:'i',value:String(i),role:'compare' as BarRole}]).commit(), onRender: (h) => rec.begin({ zh: '渲染 ' + h.length + ' 字符', en: 'render' }).setAux([{label:'len',value:String(h.length),role:'final' as BarRole}]).commit() });
  void html;
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { twoStep, type Logical } from '../../src/algorithms/design/design-two-step-view/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-two-step-view/trace.ts';
const toL = (n: string): Logical => ({ tag: 'p', text: n });
const theme = (l: Logical): string => '<' + l.tag + '>' + l.text + '</' + l.tag + '>';
test('two-step 渲染', () => assert.equal(twoStep(['a','b'], toL, theme), '<p>a</p><p>b</p>'));
test('two-step trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 17. design-page-template
add({
  cat: 'design', id: 'design-page-template',
  title: { zh: '模板页面布局', en: 'Template Page Layout' },
  summary: { zh: '页面共享布局、子页填充内容。', en: 'Shared layout; subpages fill content.' },
  description: { zh: '模板页面布局定义共享页头页脚骨架，子页面只填内容槽，避免每页重复写布局结构。', en: 'Template Page Layout defines a shared header/footer skeleton; subpages only fill content slots, avoiding repeated layout markup.' },
  tags: ['design','pattern','layout','architectural'],
  complexity: { time: 'O(1)', space: 'O(1)' },
  impl: `export interface PtHooks { onSlot?: (name: string, content: string) => void; }
export function renderPage(title: string, slots: Record<string, string>, hooks: PtHooks = {}): string {
  const slotHtml = Object.entries(slots).map(([k, v]) => { hooks.onSlot?.(k, v); return '<div id="' + k + '">' + v + '</div>'; }).join('');
  return '<html><head><title>' + title + '</title></head><body>' + slotHtml + '</body></html>';
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { renderPage } from './impl.ts';
export const DEFAULT_INPUT: any = { title: 'Home', slots: { main: 'welcome', side: 'menu' } };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '模板布局', en: 'Layout' }).commit();
  const html = renderPage(input.title, input.slots, { onSlot: (k, v) => rec.begin({ zh: '槽 ' + k, en: 'slot' }).setAux([{label:'slot',value:k,role:'compare' as BarRole},{label:'content',value:v,role:'final' as BarRole}]).commit() });
  rec.begin({ zh: html.length + ' 字符', en: 'chars' }).setAux([{label:'chars',value:String(html.length),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderPage } from '../../src/algorithms/design/design-page-template/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-page-template/trace.ts';
test('layout 含 title 与 slot', () => { const h = renderPage('T', { a: 'x' }); assert.ok(h.includes('<title>T</title>')); assert.ok(h.includes('id="a">x</div>')); });
test('layout trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 18. design-filter-pipe (distinct from filter-chain)
add({
  cat: 'design', id: 'design-pipeline-filter',
  title: { zh: '管道-过滤器', en: 'Pipes and Filters' },
  summary: { zh: '过滤器经管道串联处理流。', en: 'Filters chained via pipes process a stream.' },
  description: { zh: '管道-过滤器架构把处理拆成独立过滤器，用管道连接，数据单向流动，每个过滤器可独立替换/并行，编译器常见。', en: 'The Pipes and Filters architecture splits processing into independent filters connected by pipes; data flows one way, each filter replaceable/parallelizable (compilers).' },
  tags: ['design','pattern','pipes-filters','architectural'],
  complexity: { time: 'O(n*f)', space: 'O(n)' },
  impl: `export type Filter<T> = (input: T) => T;
export interface PfHooks { onFilter?: (i: number, input: T_desc, output: T_desc) => void; }
type T_desc = number[];
export function runPipeline<T>(input: T, filters: Array<(x: T) => T>, hooks: { onFilter?: (i: number, inp: unknown, out: unknown) => void } = {}): T {
  let cur = input;
  filters.forEach((f, i) => { const out = f(cur); hooks.onFilter?.(i, cur, out); cur = out; });
  return cur;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { runPipeline } from './impl.ts';
const fs: Array<(x: number[]) => number[]> = [ (x) => x.map((v) => v + 1), (x) => x.filter((v) => v > 3), (x) => x.map((v) => v * 2) ];
export const DEFAULT_INPUT: any = [1,2,3,4,5];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '管道过滤器', en: 'Pipes and Filters' }).commit();
  const out = runPipeline(input, fs, { onFilter: (i, inp, outp) => rec.begin({ zh: '过滤 ' + i, en: 'filter' }).setAux([{label:'i',value:String(i),role:'compare' as BarRole},{label:'in',value:(inp as number[]).join(','),role:'pivot' as BarRole},{label:'out',value:(outp as number[]).join(','),role:'final' as BarRole}]).commit() });
  rec.begin({ zh: '结果 [' + out.join(',') + ']', en: 'out' }).setAux([{label:'out',value:out.join(','),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runPipeline } from '../../src/algorithms/design/design-pipeline-filter/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-pipeline-filter/trace.ts';
const fs: Array<(x: number[]) => number[]> = [(x)=>x.map(v=>v+1),(x)=>x.filter(v=>v>3)];
test('pipeline 串联', () => assert.deepEqual(runPipeline([1,2,3,4,5], fs), [4,5]));
test('pipeline-filter trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 19. design-broker
add({
  cat: 'design', id: 'design-broker',
  title: { zh: '代理中介模式', en: 'Broker' },
  summary: { zh: '中介协调解耦的组件通信。', en: 'Broker coordinates decoupled components.' },
  description: { zh: '代理中介模式让客户端通过 broker 找到并调用远程/解耦服务，broker 负责寻址、消息转发，常见于消息中间件、微服务网格。', en: 'The Broker pattern lets clients locate and invoke decoupled services via a broker that handles addressing and message forwarding (message middleware, service mesh).' },
  tags: ['design','pattern','broker','architectural'],
  complexity: { time: 'O(1)', space: 'O(s)' },
  impl: `export type Service = (req: string) => string;
export class Broker { private services = new Map<string, Service>();
  register(name: string, s: Service): void { this.services.set(name, s); }
  call(name: string, req: string, hooks: { onCall?: (n: string, resp: string) => void } = {}): string { const s = this.services.get(name); const resp = s ? s(req) : 'unknown'; hooks.onCall?.(name, resp); return resp; }
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { Broker } from './impl.ts';
export const DEFAULT_INPUT: any = [['greet','hi'],['add','1,2']];
export function buildTrace(input: string[][] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '代理中介', en: 'Broker' }).commit();
  const b = new Broker(); b.register('greet', (r) => 'hello ' + r); b.register('add', (r) => { const [a,c] = r.split(',').map(Number); return String(a + c); });
  for (const [name, req] of input) b.call(name!, req!, { onCall: (n, resp) => rec.begin({ zh: n + ' -> ' + resp, en: 'call' }).setAux([{label:'svc',value:n,role:'compare' as BarRole},{label:'resp',value:resp,role:'final' as BarRole}]).commit() });
  rec.begin({ zh: '完成', en: 'done' }).setAux([{label:'done',value:'ok',role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Broker } from '../../src/algorithms/design/design-broker/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-broker/trace.ts';
test('broker 调用', () => { const b = new Broker(); b.register('echo', (r) => r); assert.equal(b.call('echo', 'x'), 'x'); assert.equal(b.call('nope', ''), 'unknown'); });
test('broker trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 20. design-model-view-intent
add({
  cat: 'design', id: 'design-model-view-intent',
  title: { zh: 'MVI 模式', en: 'Model-View-Intent' },
  summary: { zh: '单向数据流 intent->model->view。', en: 'One-way flow intent to model to view.' },
  description: { zh: 'MVI 模式让用户意图(intent)经 reducer 更新 model，再渲染 view，全程单向不可变，反应式前端常用(Cycle.js)。', en: 'MVI routes user intents through a reducer to update the model then renders the view; fully one-way and immutable, common in reactive front-ends (Cycle.js).' },
  tags: ['design','pattern','mvi','architectural'],
  complexity: { time: 'O(1)', space: 'O(1)' },
  impl: `export type Intent = { type: string; payload: number };
export type Model = { count: number };
export type View = string;
export function reduce(m: Model, intent: Intent): Model { switch (intent.type) { case 'inc': return { count: m.count + intent.payload }; case 'dec': return { count: m.count - intent.payload }; default: return m; } }
export function view(m: Model): View { return 'count=' + m.count; }
export interface MviHooks { onIntent?: (i: Intent) => void; onModel?: (m: Model) => void; onView?: (v: View) => void; }
export function cycle(m: Model, intent: Intent, hooks: MviHooks = {}): { model: Model; view: View } { hooks.onIntent?.(intent); const nm = reduce(m, intent); hooks.onModel?.(nm); const v = view(nm); hooks.onView?.(v); return { model: nm, view: v }; }`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { cycle, type Model, type Intent } from './impl.ts';
const intents: Intent[] = [{type:'inc',payload:1},{type:'inc',payload:5},{type:'dec',payload:2}];
export const DEFAULT_INPUT: any = null;
export function buildTrace(_input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'MVI', en: 'MVI' }).commit();
  let m: Model = { count: 0 };
  for (const i of intents) { m = cycle(m, i, { onIntent: (it) => rec.begin({ zh: 'intent ' + it.type + '+' + it.payload, en: 'intent' }).setAux([{label:'type',value:it.type,role:'compare' as BarRole}]).commit(), onView: (v) => rec.begin({ zh: 'view ' + v, en: 'view' }).setAux([{label:'view',value:v,role:'final' as BarRole}]).commit() }).model; }
  rec.begin({ zh: '终态 ' + m.count, en: 'final' }).setAux([{label:'count',value:String(m.count),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reduce, view, type Model } from '../../src/algorithms/design/design-model-view-intent/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-model-view-intent/trace.ts';
test('mvi reduce', () => { let m: Model = {count:0}; m = reduce(m, {type:'inc',payload:3}); m = reduce(m, {type:'dec',payload:1}); assert.equal(m.count, 2); });
test('mvi view', () => assert.equal(view({count:5}), 'count=5'));
test('mvi trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 21. design-blackboard
add({
  cat: 'design', id: 'design-blackboard',
  title: { zh: '黑板模式', en: 'Blackboard' },
  summary: { zh: '专家共享黑板协同求解。', en: 'Experts share a blackboard to solve.' },
  description: { zh: '黑板模式让多个知识源观察共享黑板，条件满足时修改黑板，控制壳循环调度，用于语音识别、AI 推理等无确定算法问题。', en: 'The Blackboard pattern lets knowledge sources watch a shared board and modify it when conditions hold; a control shell loops. Used for speech, AI reasoning with no deterministic algorithm.' },
  tags: ['design','pattern','blackboard','architectural'],
  complexity: { time: 'O(k*n)', space: 'O(b)' },
  impl: `export type KnowledgeSource = { canHandle: (b: Map<string, string>) => boolean; apply: (b: Map<string, string>) => void; name: string };
export interface BbHooks { onApply?: (ks: string) => void; onRound?: (round: number) => void; }
export function runBlackboard(board: Map<string, string>, sources: KnowledgeSource[], maxRounds: number, hooks: BbHooks = {}): void {
  for (let r = 0; r < maxRounds; r++) { hooks.onRound?.(r); let progress = false; for (const ks of sources) { if (ks.canHandle(board)) { ks.apply(board); hooks.onApply?.(ks.name); progress = true; } } if (!progress) break; }
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { runBlackboard, type KnowledgeSource } from './impl.ts';
const sources: KnowledgeSource[] = [
  { name: 'A', canHandle: (b) => !b.has('x'), apply: (b) => b.set('x', '1') },
  { name: 'B', canHandle: (b) => b.get('x') === '1' && !b.has('y'), apply: (b) => b.set('y', '2') },
];
export const DEFAULT_INPUT: any = null;
export function buildTrace(_input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '黑板', en: 'Blackboard' }).commit();
  const board = new Map<string, string>();
  runBlackboard(board, sources, 5, { onRound: (r) => rec.begin({ zh: '轮 ' + r, en: 'round' }).setAux([{label:'round',value:String(r),role:'pivot' as BarRole}]).commit(), onApply: (ks) => rec.begin({ zh: '应用 ' + ks, en: 'apply' }).setAux([{label:'ks',value:ks,role:'final' as BarRole}]).commit() });
  rec.begin({ zh: '黑板大小 ' + board.size, en: 'size' }).setAux([{label:'size',value:String(board.size),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runBlackboard, type KnowledgeSource } from '../../src/algorithms/design/design-blackboard/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-blackboard/trace.ts';
test('blackboard 收敛', () => { const b = new Map<string,string>(); const ks: KnowledgeSource[] = [{name:'A',canHandle:(m)=>!m.has('done'),apply:(m)=>m.set('done','1')}]; runBlackboard(b, ks, 3); assert.equal(b.get('done'), '1'); });
test('blackboard trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 22. design-reactor
add({
  cat: 'design', id: 'design-reactor',
  title: { zh: '反应器模式', en: 'Reactor' },
  summary: { zh: '事件多路复用分发处理。', en: 'Event demultiplex dispatch.' },
  description: { zh: '反应器模式用单个事件循环多路复用 IO 事件，事件就绪时分发到对应 handler，是 Node.js、Netty、Nginx 的核心。', en: 'The Reactor pattern multiplexes I/O events in one event loop and dispatches ready events to handlers; core of Node.js, Netty, Nginx.' },
  tags: ['design','pattern','reactor','concurrency'],
  complexity: { time: 'O(e)', space: 'O(h)' },
  impl: `export type EventHandler = (fd: number, data: string) => void;
export class Reactor { private handlers = new Map<number, EventHandler>();
  register(fd: number, h: EventHandler): void { this.handlers.set(fd, h); }
  fire(events: Array<{ fd: number; data: string }>, hooks: { onEvent?: (fd: number) => void } = {}): void { for (const e of events) { const h = this.handlers.get(e.fd); hooks.onEvent?.(e.fd); h?.(e.fd, e.data); } }
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { Reactor } from './impl.ts';
export const DEFAULT_INPUT: any = [{fd:1,data:'a'},{fd:2,data:'b'},{fd:1,data:'c'}];
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '反应器', en: 'Reactor' }).commit();
  const r = new Reactor();
  r.register(1, (fd, d) => rec.begin({ zh: 'fd' + fd + ' <- ' + d, en: 'handle' }).setAux([{label:'fd',value:String(fd),role:'compare' as BarRole}]).commit());
  r.register(2, (fd, d) => rec.begin({ zh: 'fd' + fd + ' <- ' + d, en: 'handle' }).setAux([{label:'fd',value:String(fd),role:'final' as BarRole}]).commit());
  r.fire(input, { onEvent: (fd) => void fd });
  rec.begin({ zh: '完成', en: 'done' }).setAux([{label:'done',value:'ok',role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Reactor } from '../../src/algorithms/design/design-reactor/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-reactor/trace.ts';
test('reactor 分发', () => { const r = new Reactor(); const log: string[] = []; r.register(1, (_fd, d) => log.push(d)); r.fire([{fd:1,data:'x'}]); assert.deepEqual(log, ['x']); });
test('reactor trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 23. design-acceptor-connector
add({
  cat: 'design', id: 'design-acceptor-connector',
  title: { zh: '接受器-连接器', en: 'Acceptor-Connector' },
  summary: { zh: '分离被动接受与主动连接。', en: 'Separate passive accept from active connect.' },
  description: { zh: '接受器-连接器模式把被动监听连接(acceptor)与主动发起连接(connector)解耦，连接建立后由二者初始化 service handler。', en: 'The Acceptor-Connector pattern decouples passive connection acceptance from active connection initiation; both set up a service handler after connect.' },
  tags: ['design','pattern','acceptor-connector','concurrency'],
  complexity: { time: 'O(1)', space: 'O(n)' },
  impl: `export interface ShHooks { onConnect?: (role: string, peer: string) => void; }
export class ServiceHandler { constructor(public peer: string) {} open(role: string, hooks: ShHooks = {}): void { hooks.onConnect?.(role, this.peer); } }
export class Acceptor { private conns: ServiceHandler[] = [];
  accept(peer: string, hooks: ShHooks = {}): ServiceHandler { const sh = new ServiceHandler(peer); sh.open('server', hooks); this.conns.push(sh); return sh; }
}
export class Connector { connect(peer: string, hooks: ShHooks = {}): ServiceHandler { const sh = new ServiceHandler(peer); sh.open('client', hooks); return sh; }
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { Acceptor, Connector } from './impl.ts';
export const DEFAULT_INPUT: any = null;
export function buildTrace(_input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '接受器-连接器', en: 'Acceptor-Connector' }).commit();
  const acc = new Acceptor(); const con = new Connector();
  acc.accept('peer1', { onConnect: (role, peer) => rec.begin({ zh: role + ' <- ' + peer, en: 'connect' }).setAux([{label:'role',value:role,role:'compare' as BarRole}]).commit() });
  con.connect('peer2', { onConnect: (role, peer) => rec.begin({ zh: role + ' -> ' + peer, en: 'connect' }).setAux([{label:'role',value:role,role:'final' as BarRole}]).commit() });
  rec.begin({ zh: '完成', en: 'done' }).setAux([{label:'done',value:'ok',role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Acceptor, Connector } from '../../src/algorithms/design/design-acceptor-connector/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-acceptor-connector/trace.ts';
test('acceptor/connector 创建 handler', () => { assert.equal(new Acceptor().accept('p').peer, 'p'); assert.equal(new Connector().connect('q').peer, 'q'); });
test('acceptor-connector trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 24. design-half-sync-half-async
add({
  cat: 'design', id: 'design-half-sync-half-async',
  title: { zh: '半同步半异步', en: 'Half-Sync/Half-Async' },
  summary: { zh: '异步层与同步层解耦。', en: 'Decouple async and sync layers.' },
  description: { zh: '半同步半异步模式用异步层快速接收 IO，放入队列后由同步工作线程处理，兼顾响应性与简洁性，常见于服务器。', en: 'Half-Sync/Half-Async uses an async layer to receive I/O quickly and a queue feeding sync worker threads; balances responsiveness and simplicity in servers.' },
  tags: ['design','pattern','half-sync','concurrency'],
  complexity: { time: 'O(n)', space: 'O(q)' },
  impl: `export interface HsHooks { onEnqueue?: (n: number) => void; onProcess?: (n: number) => void; }
export class HsQueue { private q: number[] = []; private processed: number[] = [];
  enqueue(n: number, hooks: HsHooks = {}): void { this.q.push(n); hooks.onEnqueue?.(n); }
  drainSync(hooks: HsHooks = {}): number[] { while (this.q.length) { const n = this.q.shift()!; this.processed.push(n * 2); hooks.onProcess?.(n); } return [...this.processed]; }
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { HsQueue } from './impl.ts';
export const DEFAULT_INPUT: any = [1,2,3,4];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '半同步半异步', en: 'Half-Sync/Async' }).commit();
  const q = new HsQueue();
  for (const n of input) q.enqueue(n, { onEnqueue: (x) => rec.begin({ zh: '入队 ' + x, en: 'enqueue' }).setAux([{label:'n',value:String(x),role:'compare' as BarRole}]).commit() });
  const out = q.drainSync({ onProcess: (x) => rec.begin({ zh: '处理 ' + x, en: 'process' }).setAux([{label:'n',value:String(x),role:'final' as BarRole}]).commit() });
  rec.begin({ zh: '[' + out.join(',') + ']', en: 'out' }).setAux([{label:'out',value:out.join(','),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { HsQueue } from '../../src/algorithms/design/design-half-sync-half-async/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-half-sync-half-async/trace.ts';
test('hs-async 入队+处理', () => { const q = new HsQueue(); q.enqueue(1); q.enqueue(2); assert.deepEqual(q.drainSync(), [2,4]); });
test('hs-async trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 25. design-leader-followers
add({
  cat: 'design', id: 'design-leader-followers',
  title: { zh: '领导者-追随者', en: 'Leader-Followers' },
  summary: { zh: '领导者监听、追随者待命。', en: 'Leader listens; followers wait.' },
  description: { zh: '领导者-追随者模式一组线程中一个为领导者监听事件，事件到来后它晋升处理并选一个追随者当新领导者，避免锁竞争。', en: 'In Leader-Followers one thread of a pool is the leader listening for events; on arrival it processes and promotes a follower, reducing lock contention.' },
  tags: ['design','pattern','leader-followers','concurrency'],
  complexity: { time: 'O(t)', space: 'O(t)' },
  impl: `export class LfPool {
  private leader = 0; private size = 1;
  setSize(n: number): void { this.size = Math.max(1, n); this.leader = 0; }
  currentLeader(): number { return this.leader; }
  promote(): number { this.leader = (this.leader + 1) % this.size; return this.leader; }
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { LfPool } from './impl.ts';
export const DEFAULT_INPUT: any = { size: 3, events: 4 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '领导者-追随者', en: 'Leader-Followers' }).commit();
  const p = new LfPool(); p.setSize(input.size);
  for (let i = 0; i < input.events; i++) { const leader = p.currentLeader(); rec.begin({ zh: '事件 ' + i + ' 由 ' + leader + ' 处理', en: 'event' }).setAux([{label:'leader',value:String(leader),role:'compare' as BarRole}]).commit(); p.promote(); }
  rec.begin({ zh: '终态领导者 ' + p.currentLeader(), en: 'leader' }).setAux([{label:'leader',value:String(p.currentLeader()),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LfPool } from '../../src/algorithms/design/design-leader-followers/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-leader-followers/trace.ts';
test('lf promote 轮转', () => { const p = new LfPool(); p.setSize(3); assert.equal(p.currentLeader(), 0); assert.equal(p.promote(), 1); assert.equal(p.promote(), 2); assert.equal(p.promote(), 0); });
test('lf trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 26. design-thread-specific-storage
add({
  cat: 'design', id: 'design-thread-specific-storage',
  title: { zh: '线程专属存储', en: 'Thread-Specific Storage' },
  summary: { zh: '每线程独立副本避免锁。', en: 'Per-thread copy avoids locks.' },
  description: { zh: '线程专属存储模式为每线程维护数据副本(线程局部变量)，访问无需加锁，常见于连接、事务、日志缓冲区。', en: 'Thread-Specific Storage keeps a per-thread data copy (thread-local) accessed without locks; used for connections, transactions, log buffers.' },
  tags: ['design','pattern','thread-local','concurrency'],
  complexity: { time: 'O(1)', space: 'O(t)' },
  impl: `export interface TssHooks { onAccess?: (thread: number, val: number) => void; }
export class TssCounter { private map = new Map<number, number>();
  inc(thread: number, hooks: TssHooks = {}): number { const v = (this.map.get(thread) ?? 0) + 1; this.map.set(thread, v); hooks.onAccess?.(thread, v); return v; }
  get(thread: number): number { return this.map.get(thread) ?? 0; }
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { TssCounter } from './impl.ts';
export const DEFAULT_INPUT: any = [[1],[2],[1],[1],[2],[3]];
export function buildTrace(input: number[][] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '线程专属存储', en: 'TSS' }).commit();
  const c = new TssCounter();
  for (const [t] of input) c.inc(t!, { onAccess: (th, v) => rec.begin({ zh: '线程 ' + th + ' 计数 ' + v, en: 'access' }).setAux([{label:'thread',value:String(th),role:'compare' as BarRole}]).commit() });
  rec.begin({ zh: '完成', en: 'done' }).setAux([{label:'done',value:'ok',role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TssCounter } from '../../src/algorithms/design/design-thread-specific-storage/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-thread-specific-storage/trace.ts';
test('tss 各自独立', () => { const c = new TssCounter(); c.inc(1); c.inc(1); c.inc(2); assert.equal(c.get(1), 2); assert.equal(c.get(2), 1); assert.equal(c.get(99), 0); });
test('tss trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 27. design-active-object
add({
  cat: 'design', id: 'design-active-object',
  title: { zh: '主动对象', en: 'Active Object' },
  summary: { zh: '对象拥有自己的执行线程。', en: 'Object has its own thread of execution.' },
  description: { zh: '主动对象模式把方法调用与执行解耦：调用入队成 method request，对象内部线程按调度执行并返回 future，使并发对象看起来像顺序的。', en: 'The Active Object pattern decouples method invocation from execution: calls enqueue as method requests, an internal thread executes them, returning futures; the object looks sequential.' },
  tags: ['design','pattern','active-object','concurrency'],
  complexity: { time: 'O(n)', space: 'O(q)' },
  impl: `type Method = () => void;
export class ActiveObject { private q: Method[] = []; private log: string[] = [];
  schedule(m: Method): void { this.q.push(m); }
  runSync(hooks: { onExec?: (i: number) => void } = {}): string[] { let i = 0; while (this.q.length) { const m = this.q.shift()!; m(); hooks.onExec?.(i++); } return this.log; }
  pushLog(s: string): void { this.log.push(s); }
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ActiveObject } from './impl.ts';
export const DEFAULT_INPUT: any = ['a','b','c'];
export function buildTrace(input: string[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '主动对象', en: 'Active Object' }).commit();
  const ao = new ActiveObject();
  for (const s of input) ao.schedule(() => ao.pushLog(s.toUpperCase()));
  const log = ao.runSync({ onExec: (i) => rec.begin({ zh: '执行 ' + i, en: 'exec' }).setAux([{label:'i',value:String(i),role:'compare' as BarRole}]).commit() });
  rec.begin({ zh: '[' + log.join(',') + ']', en: 'log' }).setAux([{label:'log',value:log.join(','),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ActiveObject } from '../../src/algorithms/design/design-active-object/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-active-object/trace.ts';
test('active object 顺序执行', () => { const ao = new ActiveObject(); ao.schedule(()=>ao.pushLog('1')); ao.schedule(()=>ao.pushLog('2')); assert.deepEqual(ao.runSync(), ['1','2']); });
test('active-object trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 28. design-monitor-object
add({
  cat: 'design', id: 'design-monitor-object',
  title: { zh: '监视器对象', en: 'Monitor Object' },
  summary: { zh: '对象内条件变量同步。', en: 'Synchronize via condition variables.' },
  description: { zh: '监视器对象模式把对象方法互斥化，并提供条件变量让方法等待/通知，保证对象内部不变量，Java synchronized 即此模式。', en: 'The Monitor Object pattern serializes methods and provides condition variables for wait/notify, preserving invariants; Java synchronized embodies it.' },
  tags: ['design','pattern','monitor','concurrency'],
  complexity: { time: 'O(n)', space: 'O(1)' },
  impl: `export interface MoHooks { onWait?: (size: number) => void; onSignal?: () => void; }
export class BoundedMonitor { private items: number[] = []; constructor(private cap: number) {}
  put(x: number, hooks: MoHooks = {}): void { while (this.items.length >= this.cap) hooks.onWait?.(this.items.length); this.items.push(x); hooks.onSignal?.(); }
  get(hooks: MoHooks = {}): number { while (this.items.length === 0) hooks.onWait?.(0); const v = this.items.shift()!; hooks.onSignal?.(); return v; }
  size(): number { return this.items.length; }
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { BoundedMonitor } from './impl.ts';
export const DEFAULT_INPUT: any = { cap: 2, items: [1,2,3] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '监视器', en: 'Monitor' }).commit();
  const m = new BoundedMonitor(input.cap);
  for (const x of input.items) { m.put(x, { onSignal: () => rec.begin({ zh: 'put ' + x + ' size=' + m.size(), en: 'put' }).setAux([{label:'x',value:String(x),role:'compare' as BarRole}]).commit() }); }
  rec.begin({ zh: 'size ' + m.size(), en: 'size' }).setAux([{label:'size',value:String(m.size()),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BoundedMonitor } from '../../src/algorithms/design/design-monitor-object/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-monitor-object/trace.ts';
test('monitor put/get', () => { const m = new BoundedMonitor(3); m.put(1); m.put(2); assert.equal(m.get(), 1); assert.equal(m.size(), 1); });
test('monitor trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 29. design-immutable-value
add({
  cat: 'design', id: 'design-immutable-value',
  title: { zh: '不可变值对象', en: 'Immutable Value Object' },
  summary: { zh: '创建后状态永不改变。', en: 'State never changes after creation.' },
  description: { zh: '不可变值对象一旦构造所有字段只读，任何修改返回新实例，天然线程安全、易推理，是函数式编程核心(FP)、Java record。', en: 'An Immutable Value Object has only read-only fields after construction; any change returns a new instance. Thread-safe and easy to reason about; core to FP and Java records.' },
  tags: ['design','pattern','immutable','creational'],
  complexity: { time: 'O(1)', space: 'O(1)' },
  impl: `export class Money { constructor(public readonly amount: number, public readonly currency: string) {}
  add(other: Money): Money { if (other.currency !== this.currency) throw new Error('currency mismatch'); return new Money(this.amount + other.amount, this.currency); }
  multiply(factor: number): Money { return new Money(this.amount * factor, this.currency); }
  equals(other: Money): boolean { return this.amount === other.amount && this.currency === other.currency; }
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { Money } from './impl.ts';
export const DEFAULT_INPUT: any = { amount: 10, currency: 'USD' };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '不可变值对象', en: 'Immutable' }).commit();
  const m1 = new Money(input.amount, input.currency);
  const m2 = m1.multiply(3);
  rec.begin({ zh: 'm1 ' + m1.amount + ' ' + m1.currency, en: 'm1' }).setAux([{label:'amount',value:String(m1.amount),role:'compare' as BarRole}]).commit();
  rec.begin({ zh: 'm2=m1*3 -> ' + m2.amount, en: 'm2' }).setAux([{label:'amount',value:String(m2.amount),role:'final' as BarRole}]).commit();
  rec.begin({ zh: 'm1 不变 ' + m1.amount, en: 'unchanged' }).setAux([{label:'m1',value:String(m1.amount),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Money } from '../../src/algorithms/design/design-immutable-value/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-immutable-value/trace.ts';
test('immutable 返回新实例', () => { const a = new Money(5, 'USD'); const b = a.multiply(2); assert.equal(a.amount, 5); assert.equal(b.amount, 10); assert.notEqual(a, b); });
test('immutable equals', () => assert.ok(new Money(1, 'X').equals(new Money(1, 'X'))));
test('immutable trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 30. design-event-driven-arch
add({
  cat: 'design', id: 'design-event-driven-arch',
  title: { zh: '事件驱动架构', en: 'Event-Driven Architecture' },
  summary: { zh: '生产者发事件、消费者响应。', en: 'Producers emit events; consumers react.' },
  description: { zh: '事件驱动架构以事件为通信媒介：生产者发事件到总线/主题，消费者异步订阅响应，组件高度解耦、易扩展。', en: 'Event-Driven Architecture uses events as the communication medium: producers emit to a bus/topic, consumers subscribe and react asynchronously; highly decoupled and extensible.' },
  tags: ['design','pattern','event-driven','architectural'],
  complexity: { time: 'O(e*c)', space: 'O(s)' },
  impl: `export type Event = { type: string; payload: number };
export type Listener = (e: Event) => void;
export class EventBus { private listeners = new Map<string, Listener[]>();
  subscribe(type: string, l: Listener): void { (this.listeners.get(type) ?? this.listeners.set(type, []).get(type)!).push(l); }
  emit(e: Event, hooks: { onEmit?: (type: string, count: number) => void } = {}): void { const ls = this.listeners.get(e.type) ?? []; hooks.onEmit?.(e.type, ls.length); ls.forEach((l) => l(e)); }
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { EventBus } from './impl.ts';
export const DEFAULT_INPUT: any = [{type:'click',payload:1},{type:'click',payload:2},{type:'hover',payload:3}];
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '事件驱动', en: 'Event-Driven' }).commit();
  const bus = new EventBus();
  bus.subscribe('click', (e) => rec.begin({ zh: 'click 处理 ' + e.payload, en: 'click' }).setAux([{label:'payload',value:String(e.payload),role:'compare' as BarRole}]).commit());
  bus.subscribe('hover', (e) => rec.begin({ zh: 'hover 处理 ' + e.payload, en: 'hover' }).setAux([{label:'payload',value:String(e.payload),role:'final' as BarRole}]).commit());
  for (const e of input) bus.emit(e, { onEmit: (t, c) => void (t + c) });
  rec.begin({ zh: '完成', en: 'done' }).setAux([{label:'done',value:'ok',role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EventBus } from '../../src/algorithms/design/design-event-driven-arch/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-event-driven-arch/trace.ts';
test('eda 订阅与触发', () => { const bus = new EventBus(); const log: number[] = []; bus.subscribe('x', (e) => log.push(e.payload)); bus.emit({type:'x',payload:5}); bus.emit({type:'y',payload:9}); assert.deepEqual(log, [5]); });
test('eda trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

console.log('design specs loaded');
