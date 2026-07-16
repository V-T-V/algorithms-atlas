import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  Goblin,
  Dragon,
  MonsterProtoRegistry,
} from '../../src/algorithms/design/design-prototype/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/design/design-prototype/trace.ts';

test('prototype 浅克隆基本字段', () => {
  const g = new Goblin(1, 'goblin', 30, { x: 1, y: 2 });
  const c = g.clone();
  assert.equal(c.hp, 30);
  assert.equal(c.id, 1); // id 不会自动重置（registry 才递增）
  assert.notEqual(c, g);
});
test('prototype 深克隆位置对象独立', () => {
  const g = new Goblin(1, 'goblin', 30, { x: 1, y: 2 });
  const c = g.clone() as Goblin;
  c.pos.x = 99;
  assert.equal(g.pos.x, 1); // 原型不受影响
});
test('prototype dragon 深克隆 loot 数组', () => {
  const d = new Dragon(1, 'dragon', 200, { x: 0, y: 0 }, ['gold']);
  const c = d.clone() as Dragon;
  c.loot.push('gem');
  assert.equal(d.loot.length, 1);
  assert.equal(c.loot.length, 2);
});
test('prototype registry 注册与创建', () => {
  MonsterProtoRegistry.reset();
  MonsterProtoRegistry.register('goblin', new Goblin(0, 'goblin', 30, { x: 0, y: 0 }));
  const m = MonsterProtoRegistry.create('goblin');
  assert.ok(m);
  assert.equal(m!.type, 'goblin');
  assert.equal(MonsterProtoRegistry.size(), 1);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace(DEFAULT_INPUT).length >= 3);
});
