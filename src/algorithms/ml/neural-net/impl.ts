// neural-net · ml类算法实现

export function neuralnet(data: number[][]): number[] {
  return data.map((row) => row.reduce((a, b) => a + b, 0) / row.length);
}
