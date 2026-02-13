export function startOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function normalizeSeries(series: any[]) {
  if (!Array.isArray(series)) return [];

  const map = new Map();

  for (const p of series) {
    if (!p?.d || !Number.isFinite(p.r)) continue;
    const day = new Date(p.d);
    day.setHours(0, 0, 0, 0);
    map.set(day.getTime(), { d: day, r: p.r });
  }

  return Array.from(map.values()).sort((a, b) => a.d.getTime() - b.d.getTime());
}

export function getBase(series: any[], fromDate: Date) {
  if (!series?.length) return null;

  const from = startOfDay(fromDate).getTime();

  for (let i = series.length - 1; i >= 0; i--) {
    const d = startOfDay(new Date(series[i].d)).getTime();
    if (d <= from) return series[i].r;
  }

  return series[0].r;
}
