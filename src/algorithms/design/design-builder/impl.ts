// 建造者模式 · 实现
export interface BuilderHooks {
  onStep?: (step: string, value: string) => void;
  onBuild?: (html: string) => void;
}

export interface HtmlElement {
  readonly tag: string;
  readonly text: string;
  readonly attrs: Record<string, string>;
  readonly children: HtmlElement[];
  toHtml(): string;
}

class HtmlElementImpl implements HtmlElement {
  constructor(
    public readonly tag: string,
    public readonly text: string,
    public readonly attrs: Record<string, string>,
    public readonly children: HtmlElement[],
  ) {}
  toHtml(): string {
    const attrStr = Object.entries(this.attrs)
      .map(([k, v]) => ` ${k}="${v}"`)
      .join('');
    if (this.children.length === 0 && this.text === '') return `<${this.tag}${attrStr} />`;
    const inner = this.text + this.children.map((c) => c.toHtml()).join('');
    return `<${this.tag}${attrStr}>${inner}</${this.tag}>`;
  }
}

export class HtmlBuilder {
  private tag = 'div';
  private text = '';
  private attrs: Record<string, string> = {};
  private children: HtmlElement[] = [];
  private readonly hooks: BuilderHooks;
  constructor(hooks: BuilderHooks = {}) {
    this.hooks = hooks;
  }
  setTag(t: string): this {
    this.tag = t;
    this.hooks.onStep?.('tag', t);
    return this;
  }
  setText(t: string): this {
    this.text = t;
    this.hooks.onStep?.('text', t);
    return this;
  }
  setAttr(k: string, v: string): this {
    this.attrs[k] = v;
    this.hooks.onStep?.('attr', `${k}=${v}`);
    return this;
  }
  addChild(c: HtmlElement): this {
    this.children.push(c);
    this.hooks.onStep?.('child', c.toHtml());
    return this;
  }
  build(): HtmlElement {
    const e = new HtmlElementImpl(this.tag, this.text, this.attrs, this.children);
    const html = e.toHtml();
    this.hooks.onBuild?.(html);
    return e;
  }
}

// Director：构造一个标准页面骨架
export function buildPageDoc(hooks: BuilderHooks = {}): HtmlElement {
  const body = new HtmlBuilder(hooks).setTag('body').setText('hello').build();
  return new HtmlBuilder(hooks).setTag('html').addChild(body).build();
}
