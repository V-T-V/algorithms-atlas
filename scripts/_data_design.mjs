// design data — 23 algorithms (microservice / cloud patterns)

export const algos = [
// 1. design-pipeline-2
{
  id: 'design-pipeline-2',
  titleZh: '管道模式 v2', titleEn: 'Pipeline Pattern v2',
  summaryZh: '管道：把处理拆成一串 stage，数据依次流过。',
  summaryEn: 'Pipeline: split processing into a chain of stages; data flows through.',
  descZh: '管道（Pipeline）把复杂处理拆成多个独立 stage（函数），数据依次流过每个 stage，每个 stage 接收上一步输出。便于组合、测试与重排。',
  descEn: 'Pipeline splits complex processing into independent stage functions; data flows through each stage receiving the previous output. Easy to compose, test, and reorder.',
  tags: ['design','pipeline','functional','chain'],
  time: 'O(n·k)', space: 'O(1)',
  impl: `// 管道模式 v2 · 实现
export type Stage<T> = (input: T, ctx: PipelineCtx) => T;
export interface PipelineCtx { log: string[]; }
export interface PipelineHooks { onStage?: (index: number, name: string, input: unknown, output: unknown) => void; }
export function createPipeline<T>(stages: Array<{ name: string; fn: Stage<T> }>, hooks: PipelineHooks = {}): (input: T) => T {
  return (input: T) => {
    const ctx: PipelineCtx = { log: [] };
    let value = input;
    for (let i = 0; i < stages.length; i++) {
      const before = value;
      value = stages[i]!.fn(value, ctx);
      hooks.onStage?.(i, stages[i]!.name, before, value);
    }
    return value;
  };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { createPipeline } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const pipe = createPipeline<number>([
    { name: 'double', fn: (x) => x * 2 },
    { name: 'add10', fn: (x) => x + 10 },
    { name: 'halve', fn: (x) => Math.floor(x / 2) },
  ], {
    onStage: (i, name, input, output) => rec.begin({ zh: \`stage[\${i}] \${name}\`, en: \`stage[\${i}] \${name}\` })
      .setAux([{ label: 'in', value: String(input), role: 'compare' as BarRole }, { label: 'out', value: String(output), role: 'final' as BarRole }]).commit(),
  });
  void pipe(3);
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createPipeline } from '../../src/algorithms/design/design-pipeline-2/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-pipeline-2/trace.ts';

test('pipeline 顺序执行', () => {
  const p = createPipeline<number>([
    { name: 'x2', fn: (x) => x * 2 },
    { name: '+1', fn: (x) => x + 1 },
  ]);
  assert.equal(p(5), 11);
});
test('pipeline 空管道原值返回', () => {
  const p = createPipeline<number>([]);
  assert.equal(p(42), 42);
});
test('pipeline trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 2. design-fluent-builder
{
  id: 'design-fluent-builder',
  titleZh: '流式构建器', titleEn: 'Fluent Builder',
  summaryZh: '流式构建器：链式方法调用逐步设置属性并 build。',
  summaryEn: 'Fluent builder: chainable methods to set properties then build.',
  descZh: '流式构建器（Fluent Builder）每个 setter 返回 this，支持链式调用，最后调用 build() 生成不可变对象。常见于 SQL/HTTP 客户端构建。',
  descEn: 'Fluent Builder: each setter returns this for chaining, with a final build() producing an immutable object; common in SQL/HTTP client construction.',
  tags: ['design','builder','fluent','creational'],
  time: 'O(1)', space: 'O(1)',
  impl: `// 流式构建器 · 实现
export interface BuiltQuery { table: string; columns: string[]; where?: string; limit?: number; }
export interface FluentHooks { onSet?: (field: string, value: unknown) => void; onBuild?: (q: BuiltQuery) => void; }
export class QueryBuilder {
  private table = '';
  private columns: string[] = [];
  private whereClause?: string;
  private limitN?: number;
  constructor(private hooks: FluentHooks = {}) {}
  from(t: string): this { this.table = t; this.hooks.onSet?.('table', t); return this; }
  select(...cols: string[]): this { this.columns.push(...cols); this.hooks.onSet?.('columns', cols); return this; }
  where(w: string): this { this.whereClause = w; this.hooks.onSet?.('where', w); return this; }
  limit(n: number): this { this.limitN = n; this.hooks.onSet?.('limit', n); return this; }
  build(): BuiltQuery {
    const q: BuiltQuery = { table: this.table, columns: this.columns, where: this.whereClause, limit: this.limitN };
    this.hooks.onBuild?.(q);
    return q;
  }
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { QueryBuilder } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  new QueryBuilder({
    onSet: (f, v) => rec.begin({ zh: \`set \${f}\`, en: \`set \${f}\` })
      .setAux([{ label: f, value: String(v), role: 'compare' as BarRole }]).commit(),
    onBuild: (q) => rec.begin({ zh: 'build', en: 'build' })
      .setAux([{ label: 'table', value: q.table, role: 'final' as BarRole }, { label: 'cols', value: q.columns.join(','), role: 'final' as BarRole }]).commit(),
  }).from('users').select('id', 'name').where('age > 18').limit(10).build();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { QueryBuilder } from '../../src/algorithms/design/design-fluent-builder/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-fluent-builder/trace.ts';

test('fluent builder 链式构建', () => {
  const q = new QueryBuilder().from('users').select('id', 'name').where('x=1').limit(5).build();
  assert.equal(q.table, 'users');
  assert.deepEqual(q.columns, ['id', 'name']);
  assert.equal(q.where, 'x=1');
  assert.equal(q.limit, 5);
});
test('fluent builder 可选字段缺省', () => {
  const q = new QueryBuilder().from('t').build();
  assert.equal(q.where, undefined);
  assert.equal(q.limit, undefined);
});
test('fluent builder trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 3. design-registry
{
  id: 'design-registry',
  titleZh: '注册表', titleEn: 'Registry',
  summaryZh: '注册表：全局 map 注册/查找服务实现。',
  summaryEn: 'Registry: a global map to register and look up service implementations.',
  descZh: '注册表（Registry）维护一个 name→impl 的映射，插件先 register(name, impl)，使用方 lookup(name) 解耦具体实现。',
  descEn: 'Registry maintains a name→impl map; plugins register(name, impl) and consumers lookup(name), decoupling the concrete implementation.',
  tags: ['design','registry','lookup','decoupling'],
  time: 'O(1)', space: 'O(n)',
  impl: `// 注册表 · 实现
export interface RegistryHooks { onRegister?: (name: string) => void; onLookup?: (name: string, found: boolean) => void; }
export class Registry<T> {
  private map = new Map<string, T>();
  constructor(private hooks: RegistryHooks = {}) {}
  register(name: string, impl: T): void { this.map.set(name, impl); this.hooks.onRegister?.(name); }
  lookup(name: string): T | undefined { const r = this.map.get(name); this.hooks.onLookup?.(name, r !== undefined); return r; }
  has(name: string): boolean { return this.map.has(name); }
  names(): string[] { return [...this.map.keys()]; }
  clear(): void { this.map.clear(); }
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { Registry } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const reg = new Registry<string>({
    onRegister: (n) => rec.begin({ zh: \`register '\${n}'\`, en: \`register '\${n}'\` })
      .setAux([{ label: 'name', value: n, role: 'compare' as BarRole }]).commit(),
    onLookup: (n, f) => rec.begin({ zh: \`lookup '\${n}' → \${f ? '命中' : '未命中'}\`, en: '' })
      .setAux([{ label: 'found', value: String(f), role: f ? 'final' : 'warn' as BarRole }]).commit(),
  });
  reg.register('a', 'A1'); reg.register('b', 'B1');
  reg.lookup('a'); reg.lookup('z');
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Registry } from '../../src/algorithms/design/design-registry/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-registry/trace.ts';

test('registry 注册与查找', () => {
  const r = new Registry<number>();
  r.register('x', 42);
  assert.equal(r.lookup('x'), 42);
  assert.equal(r.lookup('y'), undefined);
  assert.equal(r.has('x'), true);
});
test('registry names 列出全部', () => {
  const r = new Registry<number>();
  r.register('a', 1); r.register('b', 2);
  assert.deepEqual(r.names().sort(), ['a', 'b']);
});
test('registry trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 4. design-service-locator
{
  id: 'design-service-locator',
  titleZh: '服务定位器', titleEn: 'Service Locator',
  summaryZh: '服务定位器：按需按类型获取单例服务。',
  summaryEn: 'Service locator: get singleton services on demand by key/type.',
  descZh: '服务定位器（Service Locator）封装一个全局容器，提供 getService(key) 延迟获取依赖；与依赖注入相比更动态但有隐藏耦合。',
  descEn: 'Service Locator wraps a global container; getService(key) lazily fetches dependencies. More dynamic than DI but with hidden coupling.',
  tags: ['design','service-locator','container','di'],
  time: 'O(1)', space: 'O(n)',
  impl: `// 服务定位器 · 实现
export interface ServiceFactory<T> { (): T; }
export interface LocatorHooks { onRegister?: (key: string) => void; onResolve?: (key: string, cached: boolean) => void; }
export class ServiceLocator {
  private instances = new Map<string, unknown>();
  private factories = new Map<string, ServiceFactory<unknown>>();
  constructor(private hooks: LocatorHooks = {}) {}
  register<T>(key: string, factory: ServiceFactory<T>): void { this.factories.set(key, factory as ServiceFactory<unknown>); this.hooks.onRegister?.(key); }
  resolve<T>(key: string): T {
    if (this.instances.has(key)) { this.hooks.onResolve?.(key, true); return this.instances.get(key) as T; }
    const f = this.factories.get(key);
    if (!f) throw new Error(\`service not found: \${key}\`);
    const inst = f();
    this.instances.set(key, inst);
    this.hooks.onResolve?.(key, false);
    return inst as T;
  }
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ServiceLocator } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const loc = new ServiceLocator({
    onRegister: (k) => rec.begin({ zh: \`register \${k}\`, en: \`register \${k}\` })
      .setAux([{ label: 'key', value: k, role: 'compare' as BarRole }]).commit(),
    onResolve: (k, cached) => rec.begin({ zh: \`resolve \${k} \${cached ? '(cached)' : '(new)'}\`, en: '' })
      .setAux([{ label: 'cached', value: String(cached), role: cached ? 'final' : 'compare' as BarRole }]).commit(),
  });
  loc.register('db', () => ({ query: '...' }));
  loc.resolve('db'); loc.resolve('db');
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ServiceLocator } from '../../src/algorithms/design/design-service-locator/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-service-locator/trace.ts';

test('locator 首次创建后缓存', () => {
  let calls = 0;
  const loc = new ServiceLocator();
  loc.register('svc', () => { calls++; return { id: 1 }; });
  const a = loc.resolve('svc');
  const b = loc.resolve('svc');
  assert.equal(calls, 1);
  assert.equal(a, b);
});
test('locator 未注册抛错', () => {
  const loc = new ServiceLocator();
  assert.throws(() => loc.resolve('nope'));
});
test('locator trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 5. design-interceptor
{
  id: 'design-interceptor',
  titleZh: '拦截器', titleEn: 'Interceptor',
  summaryZh: '拦截器：在调用前后插入横切逻辑。',
  summaryEn: 'Interceptor: insert cross-cutting logic before/after a call.',
  descZh: '拦截器（Interceptor）在目标调用前后注入预处理与后处理逻辑（日志、鉴权、度量），不修改目标代码。',
  descEn: 'Interceptor injects pre/post logic (logging, auth, metrics) around a target call without modifying the target.',
  tags: ['design','interceptor','aop','cross-cutting'],
  time: 'O(1)', space: 'O(n)',
  impl: `// 拦截器 · 实现
export interface Interceptor<TArgs extends unknown[], TResult> {
  pre?: (...args: TArgs) => void | { skip?: boolean; result?: TResult };
  post?: (result: TResult) => TResult;
}
export interface InterceptorHooks { onPre?: (name: string) => void; onPost?: (name: string) => void; onSkip?: (name: string) => void; }
export function withInterceptors<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => TResult,
  interceptors: Array<Interceptor<TArgs, TResult>>,
  hooks: InterceptorHooks = {},
): (...args: TArgs) => TResult {
  return (...args: TArgs) => {
    let skipResult: TResult | undefined;
    let skipped = false;
    for (let i = 0; i < interceptors.length; i++) {
      hooks.onPre?.(\`i\${i}\`);
      const r = interceptors[i]!.pre?.(...args);
      if (r?.skip) { skipped = true; skipResult = r.result; hooks.onSkip?.(\`i\${i}\`); break; }
    }
    let result: TResult;
    if (skipped) result = skipResult as TResult;
    else result = fn(...args);
    for (let i = interceptors.length - 1; i >= 0; i--) {
      hooks.onPost?.(\`i\${i}\`);
      if (interceptors[i]!.post) result = interceptors[i]!.post!(result);
    }
    return result;
  };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { withInterceptors } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const wrapped = withInterceptors((x: number) => x * 2, [
    { pre: (x: number) => rec.begin({ zh: \`pre 1: x=\${x}\`, en: '' }).setAux([{ label: 'x', value: String(x), role: 'compare' as BarRole }]).commit(), post: (r) => { rec.begin({ zh: \`post 1: r=\${r}\`, en: '' }).setAux([{ label: 'r', value: String(r), role: 'final' as BarRole }]).commit(); return r; } },
  ]);
  void wrapped(5);
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { withInterceptors } from '../../src/algorithms/design/design-interceptor/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-interceptor/trace.ts';

test('interceptor 前后处理', () => {
  let log = '';
  const w = withInterceptors((x: number) => x + 1, [
    { pre: (x) => { log += \`pre\${x};\`; }, post: (r) => { log += \`post\${r};\`; return r * 10; } },
  ]);
  const r = w(5);
  assert.equal(r, 60); // (5+1)*10
  assert.equal(log, 'pre5;post6;');
});
test('interceptor skip 短路', () => {
  const w = withInterceptors((x: number) => x + 1, [
    { pre: () => ({ skip: true, result: 999 as number }) },
  ]);
  assert.equal(w(5), 999);
});
test('interceptor trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 6. design-filter-chain
{
  id: 'design-filter-chain',
  titleZh: '过滤器链', titleEn: 'Filter Chain',
  summaryZh: '过滤器链：依次过滤，任一可终止链。',
  summaryEn: 'Filter chain: apply filters in order; any may terminate the chain.',
  descZh: '过滤器链（Filter Chain）把请求依次通过多个 filter，每个 filter 可放行或拒绝（短路）。常用于 Web 请求校验、防火墙。',
  descEn: 'Filter Chain passes a request through filters sequentially; each filter can allow or reject (short-circuit). Used in web request validation, firewalls.',
  tags: ['design','filter','chain','validation'],
  time: 'O(n)', space: 'O(1)',
  impl: `// 过滤器链 · 实现
export interface Filter<T> { (input: T): { ok: boolean; reason?: string }; }
export interface FilterChainHooks { onFilter?: (index: number, ok: boolean, reason?: string) => void; }
export function applyFilters<T>(input: T, filters: Filter<T>[], hooks: FilterChainHooks = {}): { ok: boolean; reason?: string } {
  for (let i = 0; i < filters.length; i++) {
    const r = filters[i]!(input);
    hooks.onFilter?.(i, r.ok, r.reason);
    if (!r.ok) return { ok: false, reason: r.reason };
  }
  return { ok: true };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { applyFilters } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  applyFilters({ user: 'bob', age: 17 }, [
    (r) => ({ ok: !!r.user, reason: r.user ? undefined : 'no user' }),
    (r) => ({ ok: r.age >= 18, reason: r.age >= 18 ? undefined : 'underage' }),
  ], {
    onFilter: (i, ok, reason) => rec.begin({ zh: \`filter[\${i}] \${ok ? 'pass' : 'reject'}\`, en: '' })
      .setAux([{ label: ok ? 'pass' : 'reject', value: reason ?? '', role: ok ? 'final' : 'warn' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyFilters } from '../../src/algorithms/design/design-filter-chain/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-filter-chain/trace.ts';

test('filter 全部通过', () => {
  const r = applyFilters(5, [(x) => ({ ok: x > 0 }), (x) => ({ ok: x < 10 })]);
  assert.equal(r.ok, true);
});
test('filter 短路拒绝', () => {
  const r = applyFilters(100, [(x) => ({ ok: x > 0 }), (x) => ({ ok: x < 10, reason: 'too big' })]);
  assert.equal(r.ok, false);
  assert.equal(r.reason, 'too big');
});
test('filter trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 7. design-pub-sub
{
  id: 'design-pub-sub',
  titleZh: '发布订阅', titleEn: 'Pub/Sub',
  summaryZh: '发布订阅：发布者与订阅者通过 topic 解耦。',
  summaryEn: 'Pub/Sub: decouple publishers and subscribers via topics.',
  descZh: '发布订阅（Pub/Sub）发布者向 topic 发消息，不关心谁订阅；订阅者按 topic 收消息。中间通过 broker 分发。',
  descEn: 'Pub/Sub: publishers send messages to a topic without knowing subscribers; subscribers receive by topic; a broker dispatches.',
  tags: ['design','pubsub','messaging','decoupling'],
  time: 'O(s) per publish', space: 'O(s)',
  impl: `// 发布订阅 · 实现
export interface PubSubHooks { onPublish?: (topic: string, msg: unknown) => void; onDeliver?: (topic: string, subId: number) => void; }
export class PubSub {
  private subs = new Map<string, Array<{ id: number; fn: (msg: unknown) => void }>>();
  private nextId = 1;
  constructor(private hooks: PubSubHooks = {}) {}
  subscribe(topic: string, fn: (msg: unknown) => void): number {
    if (!this.subs.has(topic)) this.subs.set(topic, []);
    const id = this.nextId++;
    this.subs.get(topic)!.push({ id, fn });
    return id;
  }
  unsubscribe(topic: string, id: number): void {
    const arr = this.subs.get(topic);
    if (arr) this.subs.set(topic, arr.filter((s) => s.id !== id));
  }
  publish(topic: string, msg: unknown): void {
    this.hooks.onPublish?.(topic, msg);
    const arr = this.subs.get(topic) ?? [];
    for (const s of arr) { s.fn(msg); this.hooks.onDeliver?.(topic, s.id); }
  }
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { PubSub } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const ps = new PubSub({
    onPublish: (t, m) => rec.begin({ zh: \`publish \${t}\`, en: \`publish \${t}\` })
      .setAux([{ label: 'msg', value: String(m), role: 'compare' as BarRole }]).commit(),
    onDeliver: (t, id) => rec.begin({ zh: \`deliver \${t}→#\${id}\`, en: '' })
      .setAux([{ label: 'sub', value: String(id), role: 'final' as BarRole }]).commit(),
  });
  ps.subscribe('news', () => {});
  ps.subscribe('news', () => {});
  ps.publish('news', 'hello');
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PubSub } from '../../src/algorithms/design/design-pub-sub/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-pub-sub/trace.ts';

test('pubsub 多订阅者都收到', () => {
  const ps = new PubSub();
  const got: number[] = [];
  ps.subscribe('t', () => got.push(1));
  ps.subscribe('t', () => got.push(2));
  ps.publish('t', 'x');
  assert.deepEqual(got, [1, 2]);
});
test('pubsub unsubscribe 后不收到', () => {
  const ps = new PubSub();
  let count = 0;
  const id = ps.subscribe('t', () => count++);
  ps.publish('t', null);
  ps.unsubscribe('t', id);
  ps.publish('t', null);
  assert.equal(count, 1);
});
test('pubsub trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 8. design-event-bus
{
  id: 'design-event-bus',
  titleZh: '事件总线', titleEn: 'Event Bus',
  summaryZh: '事件总线：进程内同步事件分发。',
  summaryEn: 'Event bus: in-process synchronous event dispatch.',
  descZh: '事件总线（Event Bus）是 pub/sub 的进程内同步实现，常用于组件间解耦通信。emit(event) 触发所有监听器。',
  descEn: 'Event Bus is an in-process synchronous pub/sub for decoupled component communication; emit(event) fires all listeners.',
  tags: ['design','event-bus','in-process','dispatch'],
  time: 'O(l) per emit', space: 'O(l)',
  impl: `// 事件总线 · 实现
export interface EventBusHooks { onEmit?: (event: string, count: number) => void; }
export class EventBus {
  private listeners = new Map<string, Array<(payload: unknown) => void>>();
  constructor(private hooks: EventBusHooks = {}) {}
  on(event: string, fn: (payload: unknown) => void): void {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event)!.push(fn);
  }
  off(event: string, fn: (payload: unknown) => void): void {
    const arr = this.listeners.get(event);
    if (arr) this.listeners.set(event, arr.filter((f) => f !== fn));
  }
  emit(event: string, payload: unknown): void {
    const arr = this.listeners.get(event) ?? [];
    for (const f of arr) f(payload);
    this.hooks.onEmit?.(event, arr.length);
  }
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { EventBus } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const bus = new EventBus({
    onEmit: (e, c) => rec.begin({ zh: \`emit '\${e}' → \${c} 监听器\`, en: \`emit '\${e}' → \${c}\` })
      .setAux([{ label: 'listeners', value: String(c), role: 'final' as BarRole }]).commit(),
  });
  bus.on('click', () => {});
  bus.on('click', () => {});
  bus.emit('click', { x: 1 });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EventBus } from '../../src/algorithms/design/design-event-bus/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-event-bus/trace.ts';

test('event bus emit 触发监听', () => {
  const bus = new EventBus();
  const seen: unknown[] = [];
  bus.on('e', (p) => seen.push(p));
  bus.emit('e', 1); bus.emit('e', 2);
  assert.deepEqual(seen, [1, 2]);
});
test('event bus off 取消', () => {
  const bus = new EventBus();
  const fn = (p: unknown) => { void p; };
  bus.on('e', fn);
  bus.off('e', fn);
  let count = 0;
  bus.on('e', () => count++);
  bus.emit('e', null);
  assert.equal(count, 1);
});
test('event bus trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 9. design-message-queue
{
  id: 'design-message-queue',
  titleZh: '消息队列', titleEn: 'Message Queue',
  summaryZh: '消息队列：FIFO 缓冲，生产/消费解耦。',
  summaryEn: 'Message queue: FIFO buffer decoupling producers and consumers.',
  descZh: '消息队列（MQ）按 FIFO 顺序缓冲消息：生产者 enqueue，消费者 dequeue。削峰填谷、异步解耦的核心结构。',
  descEn: 'Message Queue buffers messages FIFO: producers enqueue, consumers dequeue; core structure for peak-shaving and async decoupling.',
  tags: ['design','queue','async','buffer'],
  time: 'O(1) per op', space: 'O(n)',
  impl: `// 消息队列 · 实现
export interface MqHooks { onEnqueue?: (msg: unknown, size: number) => void; onDequeue?: (msg: unknown, size: number) => void; }
export class MessageQueue<T> {
  private items: T[] = [];
  constructor(private hooks: MqHooks = {}) {}
  enqueue(msg: T): void { this.items.push(msg); this.hooks.onEnqueue?.(msg, this.items.length); }
  dequeue(): T | undefined {
    if (this.items.length === 0) return undefined;
    const m = this.items.shift()!;
    this.hooks.onDequeue?.(m, this.items.length);
    return m;
  }
  get size(): number { return this.items.length; }
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { MessageQueue } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const mq = new MessageQueue<string>({
    onEnqueue: (_m, s) => rec.begin({ zh: \`enqueue size=\${s}\`, en: '' })
      .setBars(Array.from({ length: s }, (_, i) => ({ value: i + 1, role: 'compare' as BarRole }))).commit(),
    onDequeue: (_m, s) => rec.begin({ zh: \`dequeue size=\${s}\`, en: '' })
      .setBars(Array.from({ length: s }, (_, i) => ({ value: i + 1, role: 'final' as BarRole }))).commit(),
  });
  mq.enqueue('A'); mq.enqueue('B'); mq.enqueue('C');
  mq.dequeue(); mq.dequeue();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MessageQueue } from '../../src/algorithms/design/design-message-queue/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-message-queue/trace.ts';

test('mq FIFO 顺序', () => {
  const mq = new MessageQueue<string>();
  mq.enqueue('a'); mq.enqueue('b'); mq.enqueue('c');
  assert.equal(mq.dequeue(), 'a');
  assert.equal(mq.dequeue(), 'b');
  assert.equal(mq.dequeue(), 'c');
  assert.equal(mq.dequeue(), undefined);
});
test('mq size 跟踪', () => {
  const mq = new MessageQueue<number>();
  mq.enqueue(1); mq.enqueue(2);
  assert.equal(mq.size, 2);
  mq.dequeue();
  assert.equal(mq.size, 1);
});
test('mq trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 10. design-circuit-breaker
{
  id: 'design-circuit-breaker',
  titleZh: '熔断器', titleEn: 'Circuit Breaker',
  summaryZh: '熔断器：失败达阈值后短路，半开试探恢复。',
  summaryEn: 'Circuit breaker: short-circuit after threshold failures; half-open probes recovery.',
  descZh: '熔断器（Circuit Breaker）三种状态：CLOSED（正常）→ 失败达阈值 → OPEN（直接拒绝）→ 超时后 HALF_OPEN（试探少量请求）→ 成功回 CLOSED。',
  descEn: 'Circuit Breaker has three states: CLOSED (normal) → failures reach threshold → OPEN (fast-fail) → after timeout HALF_OPEN (probe) → success returns to CLOSED.',
  tags: ['design','circuit-breaker','resilience','fault-tolerance'],
  time: 'O(1)', space: 'O(1)',
  impl: `// 熔断器 · 实现
export type CbState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';
export interface CbConfig { failureThreshold: number; resetTimeoutMs: number; halfOpenMax: number; }
export interface CbHooks { onStateChange?: (from: CbState, to: CbState) => void; onCall?: (state: CbState, ok: boolean) => void; }
export class CircuitBreaker {
  state: CbState = 'CLOSED';
  private failures = 0;
  private openedAt = 0;
  private halfOpenCalls = 0;
  constructor(private config: CbConfig, private now: () => number = Date.now, private hooks: CbHooks = {}) {}
  async call<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (this.now() - this.openedAt >= this.config.resetTimeoutMs) { this.transition('HALF_OPEN'); this.halfOpenCalls = 0; }
      else throw new Error('circuit open');
    }
    if (this.state === 'HALF_OPEN' && this.halfOpenCalls >= this.config.halfOpenMax) throw new Error('half-open limit');
    if (this.state === 'HALF_OPEN') this.halfOpenCalls++;
    try {
      const r = await fn();
      this.onSuccess(); this.hooks.onCall?.(this.state, true);
      return r;
    } catch (e) {
      this.onFailure(); this.hooks.onCall?.(this.state, false);
      throw e;
    }
  }
  private onSuccess(): void {
    if (this.state === 'HALF_OPEN') this.transition('CLOSED');
    this.failures = 0;
  }
  private onFailure(): void {
    this.failures++;
    if (this.state === 'HALF_OPEN') { this.transition('OPEN'); return; }
    if (this.failures >= this.config.failureThreshold) this.transition('OPEN');
  }
  private transition(to: CbState): void {
    if (to === this.state) return;
    this.hooks.onStateChange?.(this.state, to);
    this.state = to;
    if (to === 'OPEN') { this.openedAt = this.now(); this.failures = 0; }
  }
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { CircuitBreaker } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  let t = 1000;
  const cb = new CircuitBreaker({ failureThreshold: 2, resetTimeoutMs: 500, halfOpenMax: 1 }, () => t, {
    onStateChange: (from, to) => rec.begin({ zh: \`\${from} → \${to}\`, en: \`\${from} → \${to}\` })
      .setAux([{ label: 'state', value: to, role: 'warn' as BarRole }]).commit(),
    onCall: (s, ok) => rec.begin({ zh: \`call [\${s}] \${ok ? 'ok' : 'fail'}\`, en: '' })
      .setAux([{ label: ok ? 'ok' : 'fail', value: s, role: ok ? 'final' : 'warn' as BarRole }]).commit(),
  });
  void cb.call(async () => { throw new Error('x'); }).catch(() => {});
  void cb.call(async () => { throw new Error('x'); }).catch(() => {});
  t += 600; // 超过 resetTimeout
  void cb.call(async () => 1).catch(() => {});
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CircuitBreaker } from '../../src/algorithms/design/design-circuit-breaker/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-circuit-breaker/trace.ts';

test('cb 失败达阈值 OPEN', async () => {
  let t = 0;
  const cb = new CircuitBreaker({ failureThreshold: 2, resetTimeoutMs: 100, halfOpenMax: 1 }, () => t);
  await assert.rejects(() => cb.call(async () => { throw new Error('x'); }));
  await assert.rejects(() => cb.call(async () => { throw new Error('x'); }));
  assert.equal(cb.state, 'OPEN');
  await assert.rejects(() => cb.call(async () => 1), /circuit open/);
});
test('cb 超时后 HALF_OPEN 恢复', async () => {
  let t = 0;
  const cb = new CircuitBreaker({ failureThreshold: 1, resetTimeoutMs: 100, halfOpenMax: 1 }, () => t);
  await assert.rejects(() => cb.call(async () => { throw new Error('x'); }));
  assert.equal(cb.state, 'OPEN');
  t += 200;
  const r = await cb.call(async () => 'recovered');
  assert.equal(r, 'recovered');
  assert.equal(cb.state, 'CLOSED');
});
test('cb trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 11. design-bulkhead
{
  id: 'design-bulkhead',
  titleZh: '舱壁隔离', titleEn: 'Bulkhead',
  summaryZh: '舱壁：限制并发资源池，故障不扩散。',
  summaryEn: 'Bulkhead: limit concurrent resource pools so failures do not spread.',
  descZh: '舱壁（Bulkhead）把资源（线程/连接）分到隔离池，单个池打满不影响其他池，避免雪崩。',
  descEn: 'Bulkhead partitions resources (threads/connections) into isolated pools; one pool saturating does not affect others, preventing cascading failure.',
  tags: ['design','bulkhead','resilience','isolation'],
  time: 'O(1)', space: 'O(p)',
  impl: `// 舱壁隔离 · 实现
export interface BulkheadHooks { onAcquire?: (pool: string, inFlight: number) => void; onReject?: (pool: string) => void; onRelease?: (pool: string, inFlight: number) => void; }
export class Bulkhead {
  private inFlight = new Map<string, number>();
  constructor(private hooks: BulkheadHooks = {}) {}
  async runInPool<T>(pool: string, maxConcurrent: number, fn: () => Promise<T>): Promise<T> {
    const cur = this.inFlight.get(pool) ?? 0;
    if (cur >= maxConcurrent) { this.hooks.onReject?.(pool); throw new Error(\`pool \${pool} full\`); }
    this.inFlight.set(pool, cur + 1);
    this.hooks.onAcquire?.(pool, cur + 1);
    try {
      return await fn();
    } finally {
      const after = (this.inFlight.get(pool) ?? 1) - 1;
      this.inFlight.set(pool, after);
      this.hooks.onRelease?.(pool, after);
    }
  }
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { Bulkhead } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const b = new Bulkhead({
    onAcquire: (p, n) => rec.begin({ zh: \`acquire \${p} inFlight=\${n}\`, en: '' })
      .setAux([{ label: p, value: String(n), role: 'compare' as BarRole }]).commit(),
    onReject: (p) => rec.begin({ zh: \`reject \${p}\`, en: '' })
      .setAux([{ label: 'reject', value: p, role: 'warn' as BarRole }]).commit(),
    onRelease: (p, n) => rec.begin({ zh: \`release \${p} inFlight=\${n}\`, en: '' })
      .setAux([{ label: p, value: String(n), role: 'final' as BarRole }]).commit(),
  });
  void b.runInPool('A', 1, async () => 1);
  void b.runInPool('A', 1, async () => 2).catch(() => {});
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Bulkhead } from '../../src/algorithms/design/design-bulkhead/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-bulkhead/trace.ts';

test('bulkhead 池满拒绝', async () => {
  const b = new Bulkhead();
  const p1 = b.runInPool('db', 1, () => new Promise<number>((r) => setTimeout(() => r(1), 50)));
  await assert.rejects(() => b.runInPool('db', 1, async () => 2), /pool db full/);
  await p1;
});
test('bulkhead 不同池互不影响', async () => {
  const b = new Bulkhead();
  const a = b.runInPool('A', 1, async () => 1);
  const c = b.runInPool('B', 1, async () => 2);
  assert.equal(await a, 1);
  assert.equal(await c, 2);
});
test('bulkhead trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 12. design-rate-limiter
{
  id: 'design-rate-limiter',
  titleZh: '限流器', titleEn: 'Rate Limiter',
  summaryZh: '限流器：令牌桶控制单位时间请求数。',
  summaryEn: 'Rate limiter: token bucket controls requests per unit time.',
  descZh: '令牌桶限流（Token Bucket）：桶容量 cap，按 rate/秒匀速补充令牌；每次请求消耗 1 个，无令牌则拒绝。',
  descEn: 'Token Bucket rate limiting: bucket capacity cap, refilled at rate tokens/sec; each request consumes one, requests with no tokens are rejected.',
  tags: ['design','rate-limiter','token-bucket','throttle'],
  time: 'O(1)', space: 'O(1)',
  impl: `// 限流器 · 实现（令牌桶）
export interface RateLimiterHooks { onAllow?: (tokens: number) => void; onReject?: (tokens: number) => void; onRefill?: (tokens: number) => void; }
export class TokenBucket {
  private tokens: number;
  private lastRefill: number;
  constructor(private capacity: number, private ratePerSec: number, private now: () => number = Date.now, private hooks: RateLimiterHooks = {}) {
    this.tokens = capacity;
    this.lastRefill = now();
  }
  private refill(): void {
    const t = this.now();
    const delta = ((t - this.lastRefill) / 1000) * this.ratePerSec;
    if (delta > 0) {
      this.tokens = Math.min(this.capacity, this.tokens + delta);
      this.lastRefill = t;
      this.hooks.onRefill?.(this.tokens);
    }
  }
  tryAcquire(n = 1): boolean {
    this.refill();
    if (this.tokens >= n) { this.tokens -= n; this.hooks.onAllow?.(this.tokens); return true; }
    this.hooks.onReject?.(this.tokens);
    return false;
  }
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { TokenBucket } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  let t = 0;
  const tb = new TokenBucket(3, 1, () => t, {
    onAllow: (tk) => rec.begin({ zh: \`allow tokens=\${tk.toFixed(1)}\`, en: '' })
      .setAux([{ label: 'tokens', value: tk.toFixed(1), role: 'final' as BarRole }]).commit(),
    onReject: (tk) => rec.begin({ zh: \`reject tokens=\${tk.toFixed(1)}\`, en: '' })
      .setAux([{ label: 'tokens', value: tk.toFixed(1), role: 'warn' as BarRole }]).commit(),
  });
  tb.tryAcquire(); tb.tryAcquire(); tb.tryAcquire(); tb.tryAcquire();
  t += 1000; tb.tryAcquire();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TokenBucket } from '../../src/algorithms/design/design-rate-limiter/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-rate-limiter/trace.ts';

test('rate limiter 容量内放行', () => {
  let t = 0;
  const tb = new TokenBucket(3, 1, () => t);
  assert.equal(tb.tryAcquire(), true);
  assert.equal(tb.tryAcquire(), true);
  assert.equal(tb.tryAcquire(), true);
  assert.equal(tb.tryAcquire(), false);
});
test('rate limiter 补充后恢复', () => {
  let t = 0;
  const tb = new TokenBucket(1, 1, () => t);
  assert.equal(tb.tryAcquire(), true);
  assert.equal(tb.tryAcquire(), false);
  t += 1000;
  assert.equal(tb.tryAcquire(), true);
});
test('rate limiter trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 13. design-retry
{
  id: 'design-retry',
  titleZh: '重试', titleEn: 'Retry',
  summaryZh: '重试：失败后按退避策略重复。',
  summaryEn: 'Retry: repeat on failure with a backoff strategy.',
  descZh: '重试（Retry）模式在调用失败时按指数退避（exponential backoff）重复若干次，提高瞬时故障下的成功率。',
  descEn: 'Retry repeats a failing call with exponential backoff several times, improving success rate under transient failures.',
  tags: ['design','retry','backoff','resilience'],
  time: 'O(n)', space: 'O(1)',
  impl: `// 重试 · 实现（指数退避）
export interface RetryConfig { maxAttempts: number; baseDelayMs: number; maxDelayMs: number; jitter: number; }
export interface RetryHooks { onAttempt?: (attempt: number) => void; onFail?: (attempt: number, err: unknown) => void; onBackoff?: (attempt: number, delayMs: number) => void; onSuccess?: (attempt: number) => void; }
export async function retry<T>(fn: () => Promise<T>, config: RetryConfig, hooks: RetryHooks = {}, sleep: (ms: number) => Promise<void> = defaultSleep): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    hooks.onAttempt?.(attempt);
    try {
      const r = await fn();
      hooks.onSuccess?.(attempt);
      return r;
    } catch (e) {
      lastErr = e;
      hooks.onFail?.(attempt, e);
      if (attempt >= config.maxAttempts) break;
      const exp = Math.min(config.maxDelayMs, config.baseDelayMs * Math.pow(2, attempt - 1));
      const jitter = config.jitter * Math.random() * exp;
      const delay = Math.floor(exp + jitter);
      hooks.onBackoff?.(attempt, delay);
      await sleep(delay);
    }
  }
  throw lastErr;
}
const defaultSleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { retry } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  let attempt = 0;
  void retry(async () => { attempt++; if (attempt < 3) throw new Error('x'); return 'ok'; },
    { maxAttempts: 5, baseDelayMs: 10, maxDelayMs: 100, jitter: 0 },
    {
      onAttempt: (a) => rec.begin({ zh: \`attempt \${a}\`, en: \`attempt \${a}\` })
        .setAux([{ label: 'attempt', value: String(a), role: 'compare' as BarRole }]).commit(),
      onFail: (a) => rec.begin({ zh: \`fail \${a}\`, en: '' })
        .setAux([{ label: 'fail', value: String(a), role: 'warn' as BarRole }]).commit(),
      onBackoff: (a, d) => rec.begin({ zh: \`backoff \${a} → \${d}ms\`, en: '' })
        .setAux([{ label: 'delay', value: String(d), role: 'compare' as BarRole }]).commit(),
      onSuccess: (a) => rec.begin({ zh: \`success @\${a}\`, en: '' })
        .setAux([{ label: 'success', value: String(a), role: 'final' as BarRole }]).commit(),
    },
    async () => { /* no real sleep */ });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { retry } from '../../src/algorithms/design/design-retry/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-retry/trace.ts';

test('retry 最终成功', async () => {
  let n = 0;
  const r = await retry(async () => { n++; if (n < 3) throw new Error('x'); return 'ok'; },
    { maxAttempts: 5, baseDelayMs: 1, maxDelayMs: 5, jitter: 0 }, {}, async () => {});
  assert.equal(r, 'ok');
  assert.equal(n, 3);
});
test('retry 达上限抛最后错', async () => {
  await assert.rejects(() => retry(async () => { throw new Error('always'); },
    { maxAttempts: 2, baseDelayMs: 1, maxDelayMs: 2, jitter: 0 }, {}, async () => {}), /always/);
});
test('retry 退避指数增长', async () => {
  const delays: number[] = [];
  await retry(async () => { throw new Error('x'); },
    { maxAttempts: 4, baseDelayMs: 10, maxDelayMs: 1000, jitter: 0 },
    { onBackoff: (_a, d) => delays.push(d) }, async () => {});
  assert.deepEqual(delays, [10, 20, 40]);
});
test('retry trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 14. design-health-check
{
  id: 'design-health-check',
  titleZh: '健康检查', titleEn: 'Health Check',
  summaryZh: '健康检查：周期性探测依赖，聚合 UP/DOWN。',
  summaryEn: 'Health check: periodically probe dependencies and aggregate UP/DOWN.',
  descZh: '健康检查（Health Check）注册多个探针（数据库、缓存、下游服务），check() 并发探测并聚合为整体状态 UP/DEGRADED/DOWN。',
  descEn: 'Health Check registers probes (database, cache, downstream services); check() probes concurrently and aggregates to UP/DEGRADED/DOWN.',
  tags: ['design','health-check','monitoring','observability'],
  time: 'O(p)', space: 'O(p)',
  impl: `// 健康检查 · 实现
export type HealthStatus = 'UP' | 'DOWN';
export interface ProbeResult { name: string; status: HealthStatus; latencyMs: number; detail?: string; }
export interface AggregateHealth { overall: 'UP' | 'DEGRADED' | 'DOWN'; checks: ProbeResult[]; }
export interface HealthHooks { onProbe?: (name: string, status: HealthStatus) => void; onAggregate?: (overall: string) => void; }
export interface Probe { name: string; check: () => Promise<{ ok: boolean; detail?: string }>; }
export class HealthChecker {
  constructor(private probes: Probe[] = [], private hooks: HealthHooks = {}) {}
  add(p: Probe): void { this.probes.push(p); }
  async check(): Promise<AggregateHealth> {
    const results: ProbeResult[] = [];
    for (const p of this.probes) {
      const t0 = Date.now();
      try {
        const r = await p.check();
        const status: HealthStatus = r.ok ? 'UP' : 'DOWN';
        results.push({ name: p.name, status, latencyMs: Date.now() - t0, detail: r.detail });
        this.hooks.onProbe?.(p.name, status);
      } catch {
        results.push({ name: p.name, status: 'DOWN', latencyMs: Date.now() - t0 });
        this.hooks.onProbe?.(p.name, 'DOWN');
      }
    }
    const down = results.filter((r) => r.status === 'DOWN').length;
    const overall = down === 0 ? 'UP' : down === results.length ? 'DOWN' : 'DEGRADED';
    this.hooks.onAggregate?.(overall);
    return { overall, checks: results };
  }
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { HealthChecker } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const hc = new HealthChecker([
    { name: 'db', check: async () => ({ ok: true }) },
    { name: 'cache', check: async () => ({ ok: false, detail: 'timeout' }) },
  ], {
    onProbe: (n, s) => rec.begin({ zh: \`probe \${n}: \${s}\`, en: \`probe \${n}: \${s}\` })
      .setAux([{ label: n, value: s, role: s === 'UP' ? 'final' : 'warn' as BarRole }]).commit(),
    onAggregate: (o) => rec.begin({ zh: \`overall: \${o}\`, en: \`overall: \${o}\` })
      .setAux([{ label: 'overall', value: o, role: o === 'UP' ? 'final' : 'warn' as BarRole }]).commit(),
  });
  void hc.check();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { HealthChecker } from '../../src/algorithms/design/design-health-check/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-health-check/trace.ts';

test('health 全 UP', async () => {
  const hc = new HealthChecker([{ name: 'a', check: async () => ({ ok: true }) }]);
  const r = await hc.check();
  assert.equal(r.overall, 'UP');
});
test('health 部分 DOWN = DEGRADED', async () => {
  const hc = new HealthChecker([
    { name: 'a', check: async () => ({ ok: true }) },
    { name: 'b', check: async () => ({ ok: false }) },
  ]);
  const r = await hc.check();
  assert.equal(r.overall, 'DEGRADED');
});
test('health 全 DOWN = DOWN', async () => {
  const hc = new HealthChecker([{ name: 'a', check: async () => { throw new Error('x'); } }]);
  const r = await hc.check();
  assert.equal(r.overall, 'DOWN');
});
test('health trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 15. design-config-manager
{
  id: 'design-config-manager',
  titleZh: '配置管理器', titleEn: 'Config Manager',
  summaryZh: '配置管理器：键值配置 + 热更新监听。',
  summaryEn: 'Config manager: key-value config with hot-reload listeners.',
  descZh: '配置管理器（Config Manager）维护一份键值配置，支持 get/set、默认值、变更监听（onChange），实现热更新。',
  descEn: 'Config Manager maintains key-value config supporting get/set, defaults, and change listeners (onChange) for hot reload.',
  tags: ['design','config','hot-reload','observer'],
  time: 'O(1)', space: 'O(n)',
  impl: `// 配置管理器 · 实现
export interface ConfigHooks { onSet?: (key: string, oldV: unknown, newV: unknown) => void; }
export class ConfigManager {
  private config: Record<string, unknown> = {};
  private listeners = new Map<string, Array<(value: unknown) => void>>();
  constructor(private defaults: Record<string, unknown> = {}, private hooks: ConfigHooks = {}) {
    this.config = { ...defaults };
  }
  get<T>(key: string, fallback?: T): T {
    return (this.config[key] ?? fallback) as T;
  }
  set(key: string, value: unknown): void {
    const oldV = this.config[key];
    this.config[key] = value;
    this.hooks.onSet?.(key, oldV, value);
    const arr = this.listeners.get(key);
    if (arr) for (const fn of arr) fn(value);
  }
  onChange(key: string, fn: (value: unknown) => void): void {
    if (!this.listeners.has(key)) this.listeners.set(key, []);
    this.listeners.get(key)!.push(fn);
  }
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ConfigManager } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const cm = new ConfigManager({ port: 8080 }, {
    onSet: (k, o, n) => rec.begin({ zh: \`set \${k}: \${String(o)} → \${String(n)}\`, en: '' })
      .setAux([{ label: k, value: String(n), role: 'final' as BarRole }]).commit(),
  });
  cm.onChange('port', (v) => rec.begin({ zh: \`notify port=\${v}\`, en: '' })
    .setAux([{ label: 'port', value: String(v), role: 'compare' as BarRole }]).commit());
  cm.set('port', 9090);
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ConfigManager } from '../../src/algorithms/design/design-config-manager/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-config-manager/trace.ts';

test('config 默认值', () => {
  const cm = new ConfigManager({ port: 80 });
  assert.equal(cm.get('port'), 80);
  assert.equal(cm.get('missing', 99), 99);
});
test('config set + onChange', () => {
  const cm = new ConfigManager({});
  const events: number[] = [];
  cm.onChange('x', (v) => events.push(v as number));
  cm.set('x', 1); cm.set('x', 2);
  assert.deepEqual(events, [1, 2]);
});
test('config trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 16. design-feature-flag
{
  id: 'design-feature-flag',
  titleZh: '特性开关', titleEn: 'Feature Flag',
  summaryZh: '特性开关：运行时切换功能启停，灰度发布。',
  summaryEn: 'Feature flag: toggle features at runtime for incremental rollout.',
  descZh: '特性开关（Feature Flag）用 key→boolean 控制功能是否启用，支持百分比灰度（hash 用户 id 取模）与 A/B 测试。',
  descEn: 'Feature Flag uses key→boolean to toggle features, supporting percentage rollouts (hash user id modulo) and A/B testing.',
  tags: ['design','feature-flag','rollout','ab-test'],
  time: 'O(1)', space: 'O(n)',
  impl: `// 特性开关 · 实现
export interface FeatureFlagHooks { onEval?: (key: string, enabled: boolean, reason: string) => void; }
export class FeatureFlags {
  private flags = new Map<string, boolean | number>();
  constructor(private hooks: FeatureFlagHooks = {}) {}
  setBoolean(key: string, on: boolean): void { this.flags.set(key, on); }
  setPercent(key: string, percent: number): void { this.flags.set(key, percent); }
  isEnabled(key: string, userId?: string): boolean {
    const v = this.flags.get(key);
    if (v === undefined) { this.hooks.onEval?.(key, false, 'missing'); return false; }
    if (typeof v === 'boolean') { this.hooks.onEval?.(key, v, 'boolean'); return v; }
    // 百分比：用 userId hash 取模
    if (userId === undefined) { this.hooks.onEval?.(key, false, 'no-user'); return false; }
    const h = hashStr(userId);
    const enabled = (h % 100) < v;
    this.hooks.onEval?.(key, enabled, \`percent(\${v})\`);
    return enabled;
  }
}
function hashStr(s: string): number { let h = 0; for (let i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) >>> 0; } return h; }
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { FeatureFlags } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const ff = new FeatureFlags({
    onEval: (k, e, reason) => rec.begin({ zh: \`\${k} → \${e ? 'on' : 'off'} (\${reason})\`, en: '' })
      .setAux([{ label: k, value: String(e), role: e ? 'final' : 'warn' as BarRole }]).commit(),
  });
  ff.setBoolean('new-ui', true);
  ff.setPercent('exp', 30);
  ff.isEnabled('new-ui');
  ff.isEnabled('exp', 'user-1');
  ff.isEnabled('exp', 'user-99');
  ff.isEnabled('missing');
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FeatureFlags } from '../../src/algorithms/design/design-feature-flag/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-feature-flag/trace.ts';

test('flag boolean 开关', () => {
  const ff = new FeatureFlags();
  ff.setBoolean('a', true);
  assert.equal(ff.isEnabled('a'), true);
  ff.setBoolean('a', false);
  assert.equal(ff.isEnabled('a'), false);
});
test('flag 缺省返回 false', () => {
  const ff = new FeatureFlags();
  assert.equal(ff.isEnabled('nope'), false);
});
test('flag 百分比确定性（同用户）', () => {
  const ff = new FeatureFlags();
  ff.setPercent('exp', 50);
  const a = ff.isEnabled('exp', 'user-1');
  const b = ff.isEnabled('exp', 'user-1');
  assert.equal(a, b);
});
test('flag trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 17. design-cache-aside
{
  id: 'design-cache-aside',
  titleZh: 'Cache-Aside', titleEn: 'Cache-Aside',
  summaryZh: 'Cache-Aside：读时回填缓存，写时失效。',
  summaryEn: 'Cache-aside: lazy-fill cache on read; invalidate on write.',
  descZh: 'Cache-Aside（旁路缓存）：读时先查缓存，未命中查 DB 并回填；写时更新 DB 并使缓存失效。最常用缓存策略。',
  descEn: 'Cache-Aside: on read, check cache first; on miss, query DB and fill cache; on write, update DB and invalidate cache. The most common caching strategy.',
  tags: ['design','cache','cache-aside','lazy-fill'],
  time: 'O(1)', space: 'O(n)',
  impl: `// Cache-Aside · 实现
export interface CacheAsideHooks { onHit?: (key: string) => void; onMiss?: (key: string) => void; onFill?: (key: string) => void; onInvalidate?: (key: string) => void; }
export class CacheAside<K, V> {
  private cache = new Map<K, V>();
  constructor(private loader: (key: K) => V, private hooks: CacheAsideHooks = {}) {}
  get(key: K): V {
    if (this.cache.has(key)) { this.hooks.onHit?.(String(key)); return this.cache.get(key)!; }
    this.hooks.onMiss?.(String(key));
    const v = this.loader(key);
    this.cache.set(key, v);
    this.hooks.onFill?.(String(key));
    return v;
  }
  invalidate(key: K): void { this.cache.delete(key); this.hooks.onInvalidate?.(String(key)); }
  size(): number { return this.cache.size; }
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { CacheAside } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const ca = new CacheAside<string, string>((k) => \`db(\${k})\`, {
    onHit: (k) => rec.begin({ zh: \`hit \${k}\`, en: \`hit \${k}\` })
      .setAux([{ label: 'hit', value: k, role: 'final' as BarRole }]).commit(),
    onMiss: (k) => rec.begin({ zh: \`miss \${k}\`, en: \`miss \${k}\` })
      .setAux([{ label: 'miss', value: k, role: 'warn' as BarRole }]).commit(),
    onFill: (k) => rec.begin({ zh: \`fill \${k}\`, en: \`fill \${k}\` })
      .setAux([{ label: 'fill', value: k, role: 'compare' as BarRole }]).commit(),
    onInvalidate: (k) => rec.begin({ zh: \`invalidate \${k}\`, en: '' })
      .setAux([{ label: 'inv', value: k, role: 'warn' as BarRole }]).commit(),
  });
  ca.get('a'); ca.get('a'); ca.invalidate('a'); ca.get('a');
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CacheAside } from '../../src/algorithms/design/design-cache-aside/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-cache-aside/trace.ts';

test('cache-aside 首次 miss 后 hit', () => {
  let loads = 0;
  const ca = new CacheAside<string, number>((k) => { loads++; return k.length; });
  assert.equal(ca.get('abc'), 3);
  assert.equal(ca.get('abc'), 3);
  assert.equal(loads, 1);
});
test('cache-aside invalidate 后重新加载', () => {
  let loads = 0;
  const ca = new CacheAside<string, number>((k) => { loads++; return k.length; });
  ca.get('hi'); ca.invalidate('hi'); ca.get('hi');
  assert.equal(loads, 2);
});
test('cache-aside trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 18. design-write-through
{
  id: 'design-write-through',
  titleZh: 'Write-Through', titleEn: 'Write-Through',
  summaryZh: 'Write-Through：写时同步更新缓存与 DB。',
  summaryEn: 'Write-through: synchronously update both cache and DB on write.',
  descZh: 'Write-Through：写入时同步更新缓存和 DB（强一致），读永远命中缓存。延迟高但数据一致性好。',
  descEn: 'Write-Through synchronously updates cache and DB on write (strong consistency); reads always hit the cache. Higher write latency but better consistency.',
  tags: ['design','cache','write-through','consistency'],
  time: 'O(1)', space: 'O(n)',
  impl: `// Write-Through · 实现
export interface WriteThroughHooks { onWrite?: (key: string) => void; onRead?: (key: string, hit: boolean) => void; }
export class WriteThroughCache<K, V> {
  private cache = new Map<K, V>();
  private store = new Map<K, V>();
  constructor(private hooks: WriteThroughHooks = {}) {}
  write(key: K, value: V): void { this.store.set(key, value); this.cache.set(key, value); this.hooks.onWrite?.(String(key)); }
  read(key: K): V | undefined {
    const hit = this.cache.has(key);
    this.hooks.onRead?.(String(key), hit);
    return this.cache.get(key);
  }
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { WriteThroughCache } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const c = new WriteThroughCache<string, number>({
    onWrite: (k) => rec.begin({ zh: \`write \${k} → cache+db\`, en: '' })
      .setAux([{ label: 'write', value: k, role: 'compare' as BarRole }]).commit(),
    onRead: (k, hit) => rec.begin({ zh: \`read \${k} \${hit ? 'hit' : 'miss'}\`, en: '' })
      .setAux([{ label: hit ? 'hit' : 'miss', value: k, role: hit ? 'final' : 'warn' as BarRole }]).commit(),
  });
  c.write('a', 1); c.read('a'); c.read('b');
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { WriteThroughCache } from '../../src/algorithms/design/design-write-through/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-write-through/trace.ts';

test('write-through 读必命中缓存', () => {
  const c = new WriteThroughCache<string, number>();
  c.write('x', 42);
  assert.equal(c.read('x'), 42);
});
test('write-through 未写返回 undefined', () => {
  const c = new WriteThroughCache<string, number>();
  assert.equal(c.read('x'), undefined);
});
test('write-through trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 19. design-write-behind
{
  id: 'design-write-behind',
  titleZh: 'Write-Behind', titleEn: 'Write-Behind',
  summaryZh: 'Write-Behind：先写缓存后异步刷 DB。',
  summaryEn: 'Write-behind: write cache first, flush to DB asynchronously.',
  descZh: 'Write-Behind（Write-Back）：写时只更新缓存并标记 dirty，后台批量异步刷入 DB。写延迟低但有短暂不一致风险。',
  descEn: 'Write-Behind (Write-Back) updates only the cache and marks dirty on write; a background task flushes to DB in batches. Low write latency but short-term inconsistency risk.',
  tags: ['design','cache','write-behind','async'],
  time: 'O(1)', space: 'O(n)',
  impl: `// Write-Behind · 实现
export interface WriteBehindHooks { onWriteCache?: (key: string) => void; onFlush?: (key: string) => void; }
export class WriteBehindCache<K, V> {
  private cache = new Map<K, V>();
  private dirty = new Set<K>();
  private store = new Map<K, V>();
  constructor(private hooks: WriteBehindHooks = {}) {}
  write(key: K, value: V): void { this.cache.set(key, value); this.dirty.add(key); this.hooks.onWriteCache?.(String(key)); }
  read(key: K): V | undefined { return this.cache.get(key); }
  async flush(flushFn: (key: K, value: V) => Promise<void>): Promise<number> {
    let n = 0;
    for (const k of this.dirty) {
      const v = this.cache.get(k);
      if (v !== undefined) { await flushFn(k, v); this.store.set(k, v); this.hooks.onFlush?.(String(k)); n++; }
    }
    this.dirty.clear();
    return n;
  }
  dirtyCount(): number { return this.dirty.size; }
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { WriteBehindCache } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const c = new WriteBehindCache<string, number>({
    onWriteCache: (k) => rec.begin({ zh: \`write cache \${k}\`, en: '' })
      .setAux([{ label: 'write', value: k, role: 'compare' as BarRole }]).commit(),
    onFlush: (k) => rec.begin({ zh: \`flush \${k} → db\`, en: '' })
      .setAux([{ label: 'flush', value: k, role: 'final' as BarRole }]).commit(),
  });
  c.write('a', 1); c.write('b', 2);
  void c.flush(async () => {});
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { WriteBehindCache } from '../../src/algorithms/design/design-write-behind/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-write-behind/trace.ts';

test('write-behind dirty 跟踪', () => {
  const c = new WriteBehindCache<string, number>();
  c.write('a', 1); c.write('b', 2);
  assert.equal(c.dirtyCount(), 2);
});
test('write-behind flush 后清空', async () => {
  const c = new WriteBehindCache<string, number>();
  c.write('a', 1);
  const flushed: [string, number][] = [];
  const n = await c.flush(async (k, v) => { flushed.push([k, v]); });
  assert.equal(n, 1);
  assert.deepEqual(flushed, [['a', 1]]);
  assert.equal(c.dirtyCount(), 0);
});
test('write-behind trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 20. design-saga
{
  id: 'design-saga',
  titleZh: 'Saga', titleEn: 'Saga',
  summaryZh: 'Saga：长事务拆成一系列带补偿的步骤。',
  summaryEn: 'Saga: split a long transaction into steps with compensations.',
  descZh: 'Saga 模式把分布式长事务拆成多个本地事务步骤，每步配一个补偿动作；任一步失败时反向执行已完成步骤的补偿。',
  descEn: 'Saga splits a distributed long transaction into local transaction steps, each with a compensating action; on any failure, completed steps are rolled back in reverse.',
  tags: ['design','saga','distributed-transaction','compensation'],
  time: 'O(n)', space: 'O(n)',
  impl: `// Saga · 实现
export interface SagaStep<T> { name: string; action: (ctx: T) => Promise<void>; compensate: (ctx: T) => Promise<void>; }
export interface SagaHooks { onStep?: (name: string) => void; onCompensate?: (name: string) => void; onDone?: (ok: boolean) => void; }
export interface SagaResult { ok: boolean; completed: string[]; compensated: string[]; error?: unknown; }
export async function runSaga<T>(steps: SagaStep<T>[], ctx: T, hooks: SagaHooks = {}): Promise<SagaResult> {
  const completed: string[] = [];
  const compensated: string[] = [];
  for (const s of steps) {
    hooks.onStep?.(s.name);
    try { await s.action(ctx); completed.push(s.name); }
    catch (e) {
      // 反向补偿
      for (let i = completed.length - 1; i >= 0; i--) {
        const name = completed[i]!;
        hooks.onCompensate?.(name);
        try { await steps.find((x) => x.name === name)!.compensate(ctx); compensated.push(name); }
        catch { /* 补偿失败忽略 */ }
      }
      hooks.onDone?.(false);
      return { ok: false, completed, compensated, error: e };
    }
  }
  hooks.onDone?.(true);
  return { ok: true, completed, compensated };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { runSaga } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  void runSaga([
    { name: 'book', action: async () => {}, compensate: async () => {} },
    { name: 'pay', action: async () => { throw new Error('x'); }, compensate: async () => {} },
    { name: 'ship', action: async () => {}, compensate: async () => {} },
  ], {}, {
    onStep: (n) => rec.begin({ zh: \`step \${n}\`, en: \`step \${n}\` })
      .setAux([{ label: 'step', value: n, role: 'compare' as BarRole }]).commit(),
    onCompensate: (n) => rec.begin({ zh: \`compensate \${n}\`, en: \`compensate \${n}\` })
      .setAux([{ label: 'compensate', value: n, role: 'warn' as BarRole }]).commit(),
    onDone: (ok) => rec.begin({ zh: ok ? '完成' : '已补偿', en: '' })
      .setAux([{ label: 'result', value: String(ok), role: ok ? 'final' : 'warn' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runSaga } from '../../src/algorithms/design/design-saga/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-saga/trace.ts';

test('saga 全部成功', async () => {
  const r = await runSaga([
    { name: 'a', action: async () => {}, compensate: async () => {} },
    { name: 'b', action: async () => {}, compensate: async () => {} },
  ], {});
  assert.equal(r.ok, true);
  assert.deepEqual(r.completed, ['a', 'b']);
});
test('saga 失败触发反向补偿', async () => {
  const comp: string[] = [];
  const r = await runSaga([
    { name: 'a', action: async () => {}, compensate: async () => { comp.push('a'); } },
    { name: 'b', action: async () => {}, compensate: async () => { comp.push('b'); } },
    { name: 'c', action: async () => { throw new Error('x'); }, compensate: async () => {} },
  ], {});
  assert.equal(r.ok, false);
  assert.deepEqual(comp, ['b', 'a']);
  assert.deepEqual(r.compensated, ['b', 'a']);
});
test('saga trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 21. design-cqrs
{
  id: 'design-cqrs',
  titleZh: 'CQRS', titleEn: 'CQRS',
  summaryZh: 'CQRS：命令（写）与查询（读）模型分离。',
  summaryEn: 'CQRS: separate Command (write) from Query (read) models.',
  descZh: 'CQRS（Command Query Responsibility Segregation）把写入侧（Command）与读取侧（Query）拆成独立模型，可分别优化（写用规范模型，读用反范式视图）。',
  descEn: 'CQRS separates the write side (Commands) from the read side (Queries) into independent models that can be optimized separately (normalized writes, denormalized read views).',
  tags: ['design','cqrs','separation','architecture'],
  time: 'O(1)', space: 'O(n)',
  impl: `// CQRS · 实现
export interface CqrsHooks { onCommand?: (type: string) => void; onQuery?: (type: string) => void; }
export class CqrsStore<T extends { id: string }> {
  private writeModel = new Map<string, T>();
  private readModel = new Map<string, T>();
  constructor(private hooks: CqrsHooks = {}) {}
  // Command：写
  executeCreate(item: T): void { this.hooks.onCommand?.('create'); this.writeModel.set(item.id, item); this.readModel.set(item.id, { ...item }); }
  executeUpdate(id: string, patch: Partial<T>): void { this.hooks.onCommand?.('update'); const cur = this.writeModel.get(id); if (cur) { const u = { ...cur, ...patch }; this.writeModel.set(id, u); this.readModel.set(id, { ...u }); } }
  executeDelete(id: string): void { this.hooks.onCommand?.('delete'); this.writeModel.delete(id); this.readModel.delete(id); }
  // Query：读（从读模型）
  queryById(id: string): T | undefined { this.hooks.onQuery?.('byId'); return this.readModel.get(id); }
  queryAll(): T[] { this.hooks.onQuery?.('all'); return [...this.readModel.values()]; }
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { CqrsStore } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const s = new CqrsStore<{ id: string; v: number }>({
    onCommand: (t) => rec.begin({ zh: \`cmd \${t}\`, en: \`cmd \${t}\` })
      .setAux([{ label: 'cmd', value: t, role: 'compare' as BarRole }]).commit(),
    onQuery: (t) => rec.begin({ zh: \`query \${t}\`, en: \`query \${t}\` })
      .setAux([{ label: 'query', value: t, role: 'final' as BarRole }]).commit(),
  });
  s.executeCreate({ id: '1', v: 10 });
  s.executeUpdate('1', { v: 20 });
  s.queryById('1');
  s.queryAll();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CqrsStore } from '../../src/algorithms/design/design-cqrs/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-cqrs/trace.ts';

test('cqrs create + query', () => {
  const s = new CqrsStore<{ id: string; v: number }>();
  s.executeCreate({ id: '1', v: 10 });
  assert.deepEqual(s.queryById('1'), { id: '1', v: 10 });
});
test('cqrs update 同步两个模型', () => {
  const s = new CqrsStore<{ id: string; v: number }>();
  s.executeCreate({ id: '1', v: 10 });
  s.executeUpdate('1', { v: 20 });
  assert.equal(s.queryById('1')!.v, 20);
});
test('cqrs delete 移除', () => {
  const s = new CqrsStore<{ id: string; v: number }>();
  s.executeCreate({ id: '1', v: 10 });
  s.executeDelete('1');
  assert.equal(s.queryById('1'), undefined);
});
test('cqrs trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 22. design-event-sourcing-2
{
  id: 'design-event-sourcing-2',
  titleZh: '事件溯源 v2', titleEn: 'Event Sourcing v2',
  summaryZh: '事件溯源：存事件序列，状态由重放得出。',
  summaryEn: 'Event sourcing: store an event log; state is derived by replay.',
  descZh: '事件溯源（Event Sourcing）不存当前状态，而是存所有事件；状态 = reduce(初始, events)。支持时间旅行与审计。',
  descEn: 'Event Sourcing stores all events rather than current state; state = reduce(initial, events). Enables time travel and full audit.',
  tags: ['design','event-sourcing','audit','fold'],
  time: 'O(e)', space: 'O(e)',
  impl: `// 事件溯源 v2 · 实现
export interface Event { type: string; payload: Record<string, unknown>; at: number; }
export type Reducer<S> = (state: S, event: Event) => S;
export interface EsHooks { onAppend?: (type: string, total: number) => void; onReplay?: (eventCount: number) => void; }
export class EventStore<S> {
  private events: Event[] = [];
  constructor(private initial: S, private reducer: Reducer<S>, private hooks: EsHooks = {}) {}
  append(type: string, payload: Record<string, unknown> = {}, at = Date.now()): void {
    this.events.push({ type, payload, at });
    this.hooks.onAppend?.(type, this.events.length);
  }
  // 重放全部事件得到当前状态
  currentState(): S { this.hooks.onReplay?.(this.events.length); return this.events.reduce(this.reducer, this.initial); }
  // 重放到某个时间点
  stateAt(timestamp: number): S {
    const upTo = this.events.filter((e) => e.at <= timestamp);
    return upTo.reduce(this.reducer, this.initial);
  }
  eventCount(): number { return this.events.length; }
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { EventStore } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const es = new EventStore<{ balance: number }>({ balance: 0 }, (s, e) => {
    if (e.type === 'deposit') return { balance: s.balance + (e.payload.amount as number) };
    if (e.type === 'withdraw') return { balance: s.balance - (e.payload.amount as number) };
    return s;
  }, {
    onAppend: (t, n) => rec.begin({ zh: \`append \${t} (#\${n})\`, en: \`append \${t} (#\${n})\` })
      .setAux([{ label: t, value: String(n), role: 'compare' as BarRole }]).commit(),
    onReplay: (c) => rec.begin({ zh: \`replay \${c} events\`, en: '' })
      .setAux([{ label: 'events', value: String(c), role: 'final' as BarRole }]).commit(),
  });
  es.append('deposit', { amount: 100 }, 1);
  es.append('withdraw', { amount: 30 }, 2);
  es.append('deposit', { amount: 50 }, 3);
  void es.currentState();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EventStore } from '../../src/algorithms/design/design-event-sourcing-2/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-event-sourcing-2/trace.ts';

test('event sourcing 重放求状态', () => {
  const es = new EventStore<{ n: number }>({ n: 0 }, (s, e) => e.type === 'add' ? { n: s.n + (e.payload.x as number) } : s);
  es.append('add', { x: 5 }); es.append('add', { x: 3 }); es.append('add', { x: 10 });
  assert.equal(es.currentState().n, 18);
});
test('event sourcing 时间旅行', () => {
  const es = new EventStore<{ n: number }>({ n: 0 }, (s, e) => e.type === 'add' ? { n: s.n + (e.payload.x as number) } : s);
  es.append('add', { x: 1 }, 100);
  es.append('add', { x: 2 }, 200);
  es.append('add', { x: 4 }, 300);
  assert.equal(es.stateAt(150).n, 1);
  assert.equal(es.stateAt(250).n, 3);
  assert.equal(es.currentState().n, 7);
});
test('event sourcing trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 23. design-bff
{
  id: 'design-bff',
  titleZh: 'BFF', titleEn: 'Backend For Frontend',
  summaryZh: 'BFF：为前端定制的聚合层。',
  summaryEn: 'BFF: an aggregation layer tailored for a specific frontend.',
  descZh: 'BFF（Backend For Frontend）为每个前端（Web/Mobile）定制一个后端，聚合多个微服务的数据并裁剪为前端所需形状，减少前端往返。',
  descEn: 'BFF (Backend For Frontend) provides a dedicated backend per frontend (Web/Mobile), aggregating multiple microservices and shaping data for that frontend, reducing client round-trips.',
  tags: ['design','bff','aggregation','gateway'],
  time: 'O(s)', space: 'O(1)',
  impl: `// BFF · 实现
export interface BffHooks { onFetch?: (service: string) => void; onAggregate?: (shape: string) => void; }
export type ServiceFetcher = (service: string, params: Record<string, unknown>) => Promise<unknown>;
export class Bff {
  constructor(private fetcher: ServiceFetcher, private hooks: BffHooks = {}) {}
  // Web 前端视图：聚合 user + orders + recommendations
  async webView(userId: string): Promise<Record<string, unknown>> {
    this.hooks.onFetch?.('user');
    const user = await this.fetcher('user', { id: userId });
    this.hooks.onFetch?.('orders');
    const orders = await this.fetcher('orders', { userId });
    this.hooks.onFetch?.('recs');
    const recs = await this.fetcher('recommendations', { userId });
    const shape = { user, orderCount: Array.isArray(orders) ? orders.length : 0, topRecs: Array.isArray(recs) ? recs.slice(0, 3) : [] };
    this.hooks.onAggregate?.('web');
    return shape;
  }
  // Mobile 前端视图：更精简
  async mobileView(userId: string): Promise<Record<string, unknown>> {
    this.hooks.onFetch?.('user');
    const user = await this.fetcher('user', { id: userId });
    const shape = { name: (user as { name?: string })?.name, hasData: !!user };
    this.hooks.onAggregate?.('mobile');
    return shape;
  }
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { Bff } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const bff = new Bff(async (svc) => {
    rec.begin({ zh: \`fetch \${svc}\`, en: \`fetch \${svc}\` })
      .setAux([{ label: 'svc', value: svc, role: 'compare' as BarRole }]).commit();
    if (svc === 'user') return { id: '1', name: 'alice' };
    if (svc === 'orders') return [{ id: 'o1' }, { id: 'o2' }];
    return [{ p: 1 }, { p: 2 }, { p: 3 }, { p: 4 }];
  }, {
    onAggregate: (shape) => rec.begin({ zh: \`aggregate → \${shape}\`, en: \`aggregate → \${shape}\` })
      .setAux([{ label: 'shape', value: shape, role: 'final' as BarRole }]).commit(),
  });
  void bff.webView('1');
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Bff } from '../../src/algorithms/design/design-bff/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-bff/trace.ts';

test('bff web 视图聚合', async () => {
  const bff = new Bff(async (svc) => {
    if (svc === 'user') return { id: '1', name: 'alice' };
    if (svc === 'orders') return [{ id: 'o1' }, { id: 'o2' }];
    return [{ p: 1 }, { p: 2 }, { p: 3 }, { p: 4 }];
  });
  const v = await bff.webView('1');
  assert.deepEqual(v.user, { id: '1', name: 'alice' });
  assert.equal(v.orderCount, 2);
  assert.equal((v.topRecs as unknown[]).length, 3);
});
test('bff mobile 视图更精简', async () => {
  const bff = new Bff(async () => ({ name: 'bob' }));
  const v = await bff.mobileView('1');
  assert.equal(v.name, 'bob');
  assert.equal(v.hasData, true);
});
test('bff trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

];
