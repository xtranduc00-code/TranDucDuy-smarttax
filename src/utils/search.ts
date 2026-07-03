export function matchesKeyword(value: string, keyword: string): boolean {
  return value.toLowerCase().includes(keyword.trim().toLowerCase());
}

export function searchByFields<T>(items: T[], keyword: string, fields: (keyof T)[]): T[] {
  const trimmed = keyword.trim();
  if (!trimmed) return items;
  return items.filter((item) =>
    fields.some((field) => {
      const value = item[field];
      return typeof value === 'string' && matchesKeyword(value, trimmed);
    }),
  );
}

export function sortByName<T extends { name: string }>(items: T[], direction: 'asc' | 'desc'): T[] {
  const sorted = [...items].sort((a, b) => a.name.localeCompare(b.name));
  return direction === 'asc' ? sorted : sorted.reverse();
}
