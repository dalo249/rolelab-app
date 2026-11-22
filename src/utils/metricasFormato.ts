export function formatearSegundos(ms: number): string {
  const absRedondeado = Math.round((Math.abs(ms) / 1000) * 10) / 10;
  const valor = ms < 0 ? -absRedondeado : absRedondeado;
  const texto = Number.isInteger(valor) ? String(valor) : valor.toFixed(1);
  return `${texto} s`;
}

export function formatearDeltaSegundos(deltaMs: number): string {
  const absRedondeado = Math.round((Math.abs(deltaMs) / 1000) * 10) / 10;
  const valor = deltaMs < 0 ? -absRedondeado : absRedondeado;
  const signo = valor > 0 ? '+' : '';
  const texto = Number.isInteger(valor) ? String(valor) : valor.toFixed(1);
  return `${signo}${texto} s`;
}
