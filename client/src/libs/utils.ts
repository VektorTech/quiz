export function* range(start: number, end: number) {
  const dir = Math.sign(end - start);
  for (let i = start; i < end; i += dir) yield i;
}
