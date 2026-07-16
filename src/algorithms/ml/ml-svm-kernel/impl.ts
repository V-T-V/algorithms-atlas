// 多项式核 SVM（核感知器）· 实现
export interface KernelPerceptronModel {
  sv: number[][];
  alpha: number[];
  degree: number;
  c: number;
}
function polyKernel(a: number[], b: number[], degree: number, c: number): number {
  let dot = 0;
  for (let i = 0; i < a.length; i++) dot += a[i]! * b[i]!;
  return Math.pow(dot + c, degree);
}
export function kernelPerceptron(
  X: number[][],
  y: number[],
  degree = 2,
  c = 1,
  epochs = 10,
): KernelPerceptronModel {
  const sv: number[][] = [];
  const alpha: number[] = [];
  for (let e = 0; e < epochs; e++) {
    for (let i = 0; i < X.length; i++) {
      let s = 0;
      for (let j = 0; j < sv.length; j++) s += alpha[j]! * polyKernel(sv[j]!, X[i]!, degree, c);
      if (y[i]! * s <= 0) {
        sv.push(X[i]!.slice());
        alpha.push(y[i]!);
      }
    }
  }
  return { sv, alpha, degree, c };
}
export function kernelPredict(model: KernelPerceptronModel, x: number[]): number {
  let s = 0;
  for (let j = 0; j < model.sv.length; j++)
    s += model.alpha[j]! * polyKernel(model.sv[j]!, x, model.degree, model.c);
  return s >= 0 ? 1 : -1;
}
