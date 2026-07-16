import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ScopeStack,
  runScopes,
  type ScopeEvent,
  type ScopeHooks,
} from '../../src/algorithms/parsing/parse-scope-resolution/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/parsing/parse-scope-resolution/trace.ts';

test('parse-scope-resolution 基本查找', () => {
  const s = new ScopeStack();
  s.declare('x', 'int');
  assert.ok(s.resolve('x'));
  assert.equal(s.resolve('x')?.info.type, 'int');
});

test('parse-scope-resolution 内层屏蔽外层', () => {
  const s = new ScopeStack();
  s.declare('x', 'int');
  s.push('block');
  s.declare('x', 'string');
  const r = s.resolve('x');
  assert.equal(r?.info.type, 'string');
  assert.equal(r?.scope.depth, 1);
});

test('parse-scope-resolution 子作用域访问父作用域', () => {
  const s = new ScopeStack();
  s.declare('g', 'int');
  s.push('block');
  s.declare('y', 'int');
  assert.ok(s.resolve('g')); // 从内层找到外层
});

test('parse-scope-resolution pop 后回到外层', () => {
  const s = new ScopeStack();
  s.declare('x', 'int');
  s.push('block');
  s.declare('x', 'string');
  s.pop();
  assert.equal(s.resolve('x')?.info.type, 'int');
});

test('parse-scope-resolution depth 正确', () => {
  const s = new ScopeStack();
  assert.equal(s.top().depth, 0);
  s.push('a');
  assert.equal(s.top().depth, 1);
  s.push('b');
  assert.equal(s.top().depth, 2);
  s.pop();
  assert.equal(s.top().depth, 1);
});

test('parse-scope-resolution 未定义返回 undefined', () => {
  const s = new ScopeStack();
  assert.equal(s.resolve('nope'), undefined);
});

test('parse-scope-resolution runScopes 检测屏蔽', () => {
  const events: ScopeEvent[] = [
    { kind: 'declare', name: 'x', type: 'int' },
    { kind: 'push', name: 'b' },
    { kind: 'declare', name: 'x', type: 'string' },
  ];
  const { shadows } = runScopes(events);
  assert.equal(shadows.length, 1);
  assert.equal(shadows[0]!.name, 'x');
});

test('parse-scope-resolution runScopes 检测未定义引用', () => {
  const events: ScopeEvent[] = [{ kind: 'use', name: 'z' }];
  const { errors } = runScopes(events);
  assert.equal(errors.length, 1);
});

test('parse-scope-resolution runScopes 默认演示', () => {
  const { errors, shadows } = runScopes(DEFAULT_INPUT);
  assert.ok(errors.length >= 1); // use w 未定义
  assert.ok(shadows.length >= 1); // x 屏蔽
});

test('parse-scope-resolution 钩子', () => {
  let pushes = 0;
  let declares = 0;
  let resolves = 0;
  const hooks: ScopeHooks = {
    onPush: () => pushes++,
    onDeclare: () => declares++,
    onResolve: () => resolves++,
  };
  runScopes(
    [
      { kind: 'push', name: 'b' },
      { kind: 'declare', name: 'x', type: 'int' },
      { kind: 'use', name: 'x' },
    ],
    hooks,
  );
  assert.equal(pushes, 1);
  assert.equal(declares, 1);
  assert.equal(resolves, 1);
});

test('buildTrace 生成 aux 帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
  for (const f of frames) assert.ok(f.aux);
});
