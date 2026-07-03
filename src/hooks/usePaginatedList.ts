import { useMemo, useState } from 'react';
import { searchByFields, sortByName } from '../utils/search';
import { paginate, totalPages } from '../utils/pagination';
import type { SortDirection } from '../types/common';

const PAGE_SIZE = 10;

export function usePaginatedList<T extends { name: string }>(items: T[], searchFields: (keyof T)[]) {
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const filtered = useMemo(
    () => searchByFields(items, keyword, searchFields),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, keyword],
  );

  const sorted = useMemo(() => sortByName(filtered, sortDirection), [filtered, sortDirection]);

  const total = sorted.length;
  const pages = totalPages(total, PAGE_SIZE);
  const currentPage = Math.min(page, pages);

  const pageItems = useMemo(() => paginate(sorted, currentPage, PAGE_SIZE), [sorted, currentPage]);

  function handleSetKeyword(value: string) {
    setKeyword(value);
    setPage(1);
  }

  function toggleSort() {
    setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
  }

  return {
    keyword,
    setKeyword: handleSetKeyword,
    page: currentPage,
    setPage,
    totalPages: pages,
    total,
    pageSize: PAGE_SIZE,
    sortDirection,
    toggleSort,
    pageItems,
  };
}
