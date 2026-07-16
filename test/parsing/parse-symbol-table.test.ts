import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  SymbolTable,
  SymbolTableError,
  buildSymbolTable,
  type BuildHooks,
  type SymbolInfo,
} from '../../src/algorithms/parsing/parse-symbol-table/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/parsing/parse-symbol-table/trace.ts';

test('parse-symbol-table 插入与查找', () => {
  const t = new SymbolTable();
  t.enter({ name: 'x', kind: 'var', type: 'int' });
  assert.equal(t.has('x'), true);
  assert.equal(t.has('y'), false);
  assert.equal(t.lookup('x')?.type, 'int');
});

test('parse-symbol-table 重复定义报错', () => {
  const t = new SymbolTable();
  t.enter({ name: 'x', kind: 'var', type: 'int' });
  assert.throws(
    () => t.enter({ name: 'x', kind: 'var', type: 'int' }),
    (e: unknown) => e instanceof SymbolTableError,
  );
});

test('parse-symbol-table 按声明顺序 entries', () => {
  const t = new SymbolTable();
  t.enter({ name: 'a', kind: 'var', type: 'int' });
  t.enter({ name: 'b', kind: 'var', type: 'int' });
  t.enter({ name: 'c', kind: 'var', type: 'int' });
  assert.deepEqual(
    t.entries().map((s) => s.name),
    ['a', 'b', 'c'],
  );
});

test('parse-symbol-table size', () => {
  const t = new SymbolTable();
  assert.equal(t.size, 0);
  t.enter({ name: 'x', kind: 'var', type: 'int' });
  assert.equal(t.size, 1);
});

test('parse-symbol-table buildSymbolTable 正常登记', () => {
  const { table, errors } = buildSymbolTable([
    { kind: 'declare', info: { name: 'x', kind: 'var', type: 'int' } },
    { kind: 'declare', info: { name: 'y', kind: 'var', type: 'int' } },
  ]);
  assert.equal(table.size, 2);
  assert.equal(errors.length, 0);
});

test('parse-symbol-table buildSymbolTable 检测重复', () => {
  const { errors } = buildSymbolTable([
    { kind: 'declare', info: { name: 'x', kind: 'var', type: 'int' } },
    { kind: 'declare', info: { name: 'x', kind: 'var', type: 'int' } },
  ]);
  assert.ok(errors.length >= 1);
  assert.ok(errors[0]!.includes('重复定义'));
});

test('parse-symbol-table buildSymbolTable 检测未定义引用', () => {
  const { errors } = buildSymbolTable([{ kind: 'use', name: 'z' }]);
  assert.ok(errors.length >= 1);
  assert.ok(errors[0]!.includes('未定义引用'));
});

test('parse-symbol-table 钩子', () => {
  let enters = 0;
  let lookups = 0;
  let results = 0;
  const hooks: BuildHooks = {
    onEnter: () => enters++,
    onLookup: () => lookups++,
    onResult: () => results++,
  };
  buildSymbolTable(
    [
      { kind: 'declare', info: { name: 'x', kind: 'var', type: 'int' } as SymbolInfo },
      { kind: 'use', name: 'x' },
    ],
    'g',
    hooks,
  );
  assert.equal(enters, 1);
  assert.equal(lookups, 1);
  assert.equal(results, 1);
});

test('parse-symbol-table 默认演示', () => {
  const frames = buildTrace();
  // 演示里 declare x 两次 → 1 个重复错误；use z → 1 个未定义错误
  const last = frames[frames.length - 1]!;
  const errs = last.aux!.find((e) => e.label === '错误数');
  assert.ok(errs);
  assert.ok(Number(errs!.value) >= 2);
});

test('buildTrace 生成 aux 帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
  for (const f of frames) assert.ok(f.aux);
});
