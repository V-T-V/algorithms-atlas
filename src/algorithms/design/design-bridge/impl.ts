// 桥接模式 · 实现
export interface BridgeHooks {
  onRender?: (shape: string, renderer: string, output: string) => void;
  onResult?: (outputs: string) => void;
}

export interface Renderer {
  readonly name: string;
  renderCircle(x: number, y: number, r: number): string;
  renderRect(x: number, y: number, w: number, h: number): string;
}

export class VectorRenderer implements Renderer {
  readonly name = 'vector';
  renderCircle(x: number, y: number, r: number): string {
    return `vector circle @(${x},${y}) r=${r}`;
  }
  renderRect(x: number, y: number, w: number, h: number): string {
    return `vector rect @(${x},${y}) ${w}x${h}`;
  }
}

export class RasterRenderer implements Renderer {
  readonly name = 'raster';
  renderCircle(x: number, y: number, r: number): string {
    return `raster circle @(${x},${y}) r=${r}`;
  }
  renderRect(x: number, y: number, w: number, h: number): string {
    return `raster rect @(${x},${y}) ${w}x${h}`;
  }
}

export abstract class Shape {
  constructor(
    protected readonly renderer: Renderer,
    protected readonly hooks: BridgeHooks = {},
  ) {}
  abstract draw(): string;
}

export class CircleShape extends Shape {
  constructor(
    renderer: Renderer,
    private readonly x: number,
    private readonly y: number,
    private readonly r: number,
    hooks: BridgeHooks = {},
  ) {
    super(renderer, hooks);
  }
  draw(): string {
    const o = this.renderer.renderCircle(this.x, this.y, this.r);
    this.hooks.onRender?.('circle', this.renderer.name, o);
    return o;
  }
}

export class RectangleShape extends Shape {
  constructor(
    renderer: Renderer,
    private readonly x: number,
    private readonly y: number,
    private readonly w: number,
    private readonly h: number,
    hooks: BridgeHooks = {},
  ) {
    super(renderer, hooks);
  }
  draw(): string {
    const o = this.renderer.renderRect(this.x, this.y, this.w, this.h);
    this.hooks.onRender?.('rect', this.renderer.name, o);
    return o;
  }
}
