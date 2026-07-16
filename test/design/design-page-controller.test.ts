import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  HomePage,
  AboutPage,
  render,
} from '../../src/algorithms/design/design-page-controller/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-page-controller/trace.ts';
test('page-controller 渲染', () => {
  assert.equal(render(new HomePage(), 'home', ''), 'home render');
  assert.equal(render(new AboutPage(), 'about', 'me'), 'about me');
});
test('page-controller trace 非空', () => assert.ok(buildTrace().length > 0));
