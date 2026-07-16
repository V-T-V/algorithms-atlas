import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseXml, parseXmlToTree } from '../../src/algorithms/parsing/xml-parser/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/xml-parser/trace.ts';

test('parseXml 基本事件', () => {
  const events: string[] = [];
  parseXml('<a><b>x</b></a>', {
    onStart: (t) => events.push(`<${t.name}>`),
    onText: (t) => events.push(`T:${t}`),
    onEnd: (n) => events.push(`</${n}>`),
  });
  assert.deepEqual(events, ['<a>', '<b>', 'T:x', '</b>', '</a>']);
});

test('parseXml 属性解析', () => {
  let attrs: Record<string, string> = {};
  parseXml('<img src="a.png" alt="pic"/>', {
    onStart: (t) => {
      attrs = t.attrs;
    },
  });
  assert.equal(attrs['src'], 'a.png');
  assert.equal(attrs['alt'], 'pic');
});

test('parseXml 自闭合标签触发 end', () => {
  let ends = 0;
  parseXml('<br/>', { onEnd: () => ends++ });
  assert.equal(ends, 1);
});

test('parseXml 跳过声明与注释', () => {
  const texts: string[] = [];
  parseXml('<?xml version="1.0"?><!-- hi --><a>x</a>', {
    onText: (t) => texts.push(t),
  });
  assert.deepEqual(texts, ['x']);
});

test('parseXml 实体解码', () => {
  const texts: string[] = [];
  parseXml('<a>1 &lt; 2 &amp; 3 &gt; 0</a>', {
    onText: (t) => texts.push(t),
  });
  assert.equal(texts.join(''), '1 < 2 & 3 > 0');
});

test('parseXml CDATA', () => {
  const texts: string[] = [];
  parseXml('<a><![CDATA[<bold>raw</bold>]]></a>', {
    onText: (t) => texts.push(t),
  });
  assert.equal(texts.join(''), '<bold>raw</bold>');
});

test('parseXmlToTree 嵌套结构', () => {
  const root = parseXmlToTree('<a><b>x</b><c>y</c></a>');
  assert.equal(root.children[0]!.name, 'a');
  const a = root.children[0]!;
  assert.equal(a.children.length, 2);
  assert.equal(a.children[0]!.name, 'b');
  assert.equal(a.children[0]!.text, 'x');
  assert.equal(a.children[1]!.name, 'c');
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
});
