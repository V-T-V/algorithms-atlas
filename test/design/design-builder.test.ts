import { test } from 'node:test';
import assert from 'node:assert/strict';
import { HtmlBuilder, buildPageDoc } from '../../src/algorithms/design/design-builder/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/design/design-builder/trace.ts';

test('builder 简单元素', () => {
  const e = new HtmlBuilder().setTag('br').build();
  assert.equal(e.toHtml(), '<br />');
});
test('builder 带属性和文本', () => {
  const e = new HtmlBuilder().setTag('a').setAttr('href', '#').setText('x').build();
  assert.equal(e.toHtml(), '<a href="#">x</a>');
});
test('builder 嵌套子元素', () => {
  const child = new HtmlBuilder().setTag('b').setText('bold').build();
  const e = new HtmlBuilder().setTag('p').addChild(child).build();
  assert.equal(e.toHtml(), '<p><b>bold</b></p>');
});
test('builder 链式调用返回 this', () => {
  const b = new HtmlBuilder();
  assert.equal(b.setTag('div'), b);
  assert.equal(b.setText('hi'), b);
});
test('builder director 构造页面', () => {
  const e = buildPageDoc();
  const html = e.toHtml();
  assert.ok(html.startsWith('<html>'));
  assert.ok(html.includes('<body>'));
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace(DEFAULT_INPUT).length >= 3);
});
