import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  DarkFactory,
  LightFactory,
  renderUI,
  type UIFactory,
} from '../../src/algorithms/design/design-abstract-factory/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/design/design-abstract-factory/trace.ts';

test('abstractFactory dark 族', () => {
  const f: UIFactory = new DarkFactory();
  assert.equal(f.createButton().render(), '[Dark Button]');
  assert.equal(f.createInput().render(), '<Dark Input />');
});
test('abstractFactory light 族', () => {
  const f: UIFactory = new LightFactory();
  assert.ok(f.createButton().render().includes('Light'));
  assert.ok(f.createInput().render().includes('Light'));
});
test('abstractFactory 同族产品一致', () => {
  const dark = renderUI(new DarkFactory());
  assert.ok(dark.includes('Dark Button'));
  assert.ok(dark.includes('Dark Input'));
});
test('abstractFactory 不同族不同输出', () => {
  const d = renderUI(new DarkFactory());
  const l = renderUI(new LightFactory());
  assert.notEqual(d, l);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace(DEFAULT_INPUT).length >= 3);
});
