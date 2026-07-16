import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  SimpleCoffee,
  MilkDecorator,
  SugarDecorator,
  CreamDecorator,
} from '../../src/algorithms/design/design-decorator/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/design/design-decorator/trace.ts';

test('decorator 基础咖啡', () => {
  const c = new SimpleCoffee();
  assert.equal(c.cost(), 10);
});
test('decorator 加牛奶', () => {
  const c = new MilkDecorator(new SimpleCoffee());
  assert.equal(c.cost(), 13);
  assert.ok(c.desc().includes('牛奶'));
});
test('decorator 多层', () => {
  const c = new CreamDecorator(new SugarDecorator(new MilkDecorator(new SimpleCoffee())));
  assert.equal(c.cost(), 10 + 3 + 1 + 5);
});
test('decorator 顺序无关总价', () => {
  const a = new SugarDecorator(new MilkDecorator(new SimpleCoffee())).cost();
  const b = new MilkDecorator(new SugarDecorator(new SimpleCoffee())).cost();
  assert.equal(a, b);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace(DEFAULT_INPUT).length >= 3);
});
