// 简单 XML/SAX 解析 · 纯算法实现

export interface XmlStart {
  name: string;
  attrs: Record<string, string>;
  selfClosing: boolean;
}

/** 事件钩子（SAX 风格）。 */
export interface XmlHooks {
  onStart?: (tag: XmlStart) => void;
  onText?: (text: string) => void;
  onEnd?: (name: string) => void;
  onResult?: () => void;
}

/**
 * SAX 风格 XML 解析（子集）。
 *
 * @param xml XML 文本
 * @param hooks 可选事件钩子
 */
export function parseXml(xml: string, hooks: XmlHooks = {}): void {
  let i = 0;
  const n = xml.length;

  while (i < n) {
    // 跳过文本直到 <
    if (xml[i] !== '<') {
      let j = i;
      while (j < n && xml[j] !== '<') j++;
      const text = xml.slice(i, j).trim();
      if (text) hooks.onText?.(decodeEntities(text));
      i = j;
      continue;
    }
    // 处理 <...>
    // 注释 <!--
    if (xml.startsWith('<!--', i)) {
      const end = xml.indexOf('-->', i + 4);
      i = end >= 0 ? end + 3 : n;
      continue;
    }
    // 声明 <?xml ...?>
    if (xml.startsWith('<?', i)) {
      const end = xml.indexOf('?>', i + 2);
      i = end >= 0 ? end + 2 : n;
      continue;
    }
    // <![CDATA[ ... ]]>
    if (xml.startsWith('<![CDATA[', i)) {
      const end = xml.indexOf(']]>', i + 9);
      const text = xml.slice(i + 9, end >= 0 ? end : n);
      if (text) hooks.onText?.(text);
      i = end >= 0 ? end + 3 : n;
      continue;
    }
    // 结束标签 </name>
    if (xml.startsWith('</', i)) {
      const end = xml.indexOf('>', i + 2);
      const name = xml.slice(i + 2, end >= 0 ? end : n).trim();
      hooks.onEnd?.(name);
      i = end >= 0 ? end + 1 : n;
      continue;
    }
    // 开始标签 <name attr="v" ...> 或 <name/>
    const end = xml.indexOf('>', i + 1);
    if (end < 0) break;
    const inner = xml.slice(i + 1, end);
    const selfClosing = inner.endsWith('/');
    const body = selfClosing ? inner.slice(0, -1).trim() : inner.trim();
    const tag: XmlStart = parseStartTag(body);
    tag.selfClosing = selfClosing;
    hooks.onStart?.(tag);
    if (selfClosing) hooks.onEnd?.(tag.name);
    i = end + 1;
  }
  hooks.onResult?.();
}

function parseStartTag(body: string): XmlStart {
  // name 后跟若干 attr="value"
  const match = /^([^ s]+)(.*)$/.exec(body);
  const name = match ? match[1]! : body;
  const rest = match ? match[2]! : '';
  const attrs: Record<string, string> = {};
  const re = /([^ s=]+) s*= s*"([^"]*)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(rest)) !== null) {
    attrs[m[1]!] = decodeEntities(m[2]!);
  }
  return { name, attrs, selfClosing: false };
}

function decodeEntities(s: string): string {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

/** 把钩子事件折叠成嵌套对象（DOM 子集）。 */
export interface XmlNode {
  name: string;
  attrs: Record<string, string>;
  text: string;
  children: XmlNode[];
}

export function parseXmlToTree(xml: string): XmlNode {
  const root: XmlNode = { name: '#root', attrs: {}, text: '', children: [] };
  const stack: XmlNode[] = [root];
  parseXml(xml, {
    onStart: (tag) => {
      const node: XmlNode = { name: tag.name, attrs: tag.attrs, text: '', children: [] };
      stack[stack.length - 1]!.children.push(node);
      if (!tag.selfClosing) stack.push(node);
    },
    onText: (t) => {
      stack[stack.length - 1]!.text += t;
    },
    onEnd: () => {
      if (stack.length > 1) stack.pop();
    },
  });
  return root;
}
