import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  eliminateDeadCode,
  removeUnreachable,
  liveness,
  type DCEHooks,
  type Stmt,
} from '../../src/algorithms/parsing/parse-dead-code-elim/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/parsing/parse-dead-code-elim/trace.ts';

test('parse-dead-code-elim 删 return 后不可达', () => {
  const stmts: Stmt[] = [
    { kind: 'return', uses: [] },
    { kind: 'expr', uses: ['a'] },
  ];
  const r = removeUnreachable(stmts);
  assert.equal(r.stmts.length, 1);
  assert.equal(r.removed, 1);
});

test('parse-dead-code-elim 无 return 全可达', () => {
  const stmts: Stmt[] = [
    { kind: 'expr', uses: ['a'] },
    { kind: 'expr', uses: ['b'] },
  ];
  const r = removeUnreachable(stmts);
  assert.equal(r.stmts.length, 2);
  assert.equal(r.removed, 0);
});

test('parse-dead-code-elim liveness 标记 a 活跃', () => {
  const stmts: Stmt[] = [
    { kind: 'assign', target: 'x', uses: ['a'] },
    { kind: 'expr', uses: ['x'] },
  ];
  const lb = liveness(stmts);
  assert.ok(lb[0]!.has('a')); // 第一条前 a 活跃
});

test('parse-dead-code-elim 删死赋值', () => {
  // y = c 永不被使用
  const stmts: Stmt[] = [
    { kind: 'assign', target: 'y', uses: ['c'] },
    { kind: 'expr', uses: ['x'] },
  ];
  const r = eliminateDeadCode(stmts);
  assert.equal(r.removedDeadAssign, 1);
  assert.ok(r.stmts.every((s) => !(s.kind === 'assign' && s.target === 'y')));
});

test('parse-dead-code-elim 保留被使用赋值', () => {
  const stmts: Stmt[] = [
    { kind: 'assign', target: 'x', uses: ['a'] },
    { kind: 'expr', uses: ['x'] },
  ];
  const r = eliminateDeadCode(stmts);
  assert.equal(r.removedDeadAssign, 0);
  assert.equal(r.stmts.length, 2);
});

test('parse-dead-code-elim 完整：默认演示', () => {
  const r = eliminateDeadCode(DEFAULT_INPUT);
  // y、z 死赋值（2），w 不可达（1）
  assert.equal(r.removedDeadAssign, 2);
  assert.equal(r.removedUnreachable, 1);
});

test('parse-dead-code-elim 链式赋值传播', () => {
  // a=x；b=a；c=b；return c —— 都活
  const stmts: Stmt[] = [
    { kind: 'assign', target: 'a', uses: ['x'] },
    { kind: 'assign', target: 'b', uses: ['a'] },
    { kind: 'assign', target: 'c', uses: ['b'] },
    { kind: 'return', uses: ['c'] },
  ];
  const r = eliminateDeadCode(stmts);
  assert.equal(r.removedDeadAssign, 0);
});

test('parse-dead-code-elim 钩子', () => {
  let unreachable = 0;
  let dead = 0;
  let results = 0;
  const hooks: DCEHooks = {
    onUnreachable: () => unreachable++,
    onDeadAssign: () => dead++,
    onResult: () => results++,
  };
  eliminateDeadCode(DEFAULT_INPUT, hooks);
  assert.ok(unreachable >= 1);
  assert.ok(dead >= 1);
  assert.equal(results, 1);
});

test('buildTrace 生成 aux 帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
  for (const f of frames) assert.ok(f.aux);
  const last = frames[frames.length - 1]!;
  const cur = last.aux!.find((e) => e.label === '剩余语句');
  assert.ok(cur);
});
