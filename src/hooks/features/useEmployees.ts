import { useEffect, useMemo, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { Employee } from '../../types/employee/employee';
import { employeeService } from '../../services/employees/employee.service';

type SortMode = 'newest' | 'alpha' | 'dept';

const normalize = (s: string) =>
  (s ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim();

export function useEmployees() {
  const [sortMode, setSortMode] = useState<SortMode>('newest');

  // ✅ data từ API
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Load employees failed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // search
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 250);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    // Có gõ => show loading 1 nhịp (giống hình 2)
    if (debouncedQuery.trim().length === 0) {
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const t = setTimeout(() => setIsSearching(false), 450);
    return () => clearTimeout(t);
  }, [debouncedQuery]);

  const baseSorted = useMemo(() => {
    // ✅ dùng employees từ API thay vì MOCK
    const arr = [...employees];

    if (sortMode === 'newest') {
      arr.sort((a, b) => b.createdAt - a.createdAt);
      return arr;
    }

    if (sortMode === 'alpha') {
      arr.sort((a, b) => normalize(a.name).localeCompare(normalize(b.name)));
      return arr;
    }

    // dept
    arr.sort((a, b) => {
      const d = normalize(a.department).localeCompare(normalize(b.department));
      if (d !== 0) return d;
      return normalize(a.name).localeCompare(normalize(b.name));
    });
    return arr;
  }, [sortMode, employees]);

  const filtered = useMemo(() => {
    const q = normalize(debouncedQuery);
    if (!q) return baseSorted;

    return baseSorted.filter(e => {
      const hay = normalize(`${e.name} ${e.email} ${e.title} ${e.department}`);
      return hay.includes(q);
    });
  }, [baseSorted, debouncedQuery]);

  const hasQuery = debouncedQuery.trim().length > 0;
  const isEmptyResult = hasQuery && !isSearching && filtered.length === 0;

  const sections = useMemo(() => {
    // Default & Search result (newest): list bình thường
    if (sortMode === 'newest' || hasQuery) {
      return [{ title: '', data: filtered }];
    }

    if (sortMode === 'alpha') {
      const map = new Map<string, Employee[]>();
      filtered.forEach(e => {
        const key = (e.name.trim()[0] ?? '#').toUpperCase();
        map.set(key, [...(map.get(key) ?? []), e]);
      });

      return Array.from(map.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([title, data]) => ({ title, data }));
    }

    // dept
    const map = new Map<string, Employee[]>();
    filtered.forEach(e => {
      const key = e.department;
      map.set(key, [...(map.get(key) ?? []), e]);
    });

    return Array.from(map.entries())
      .sort((a, b) => normalize(a[0]).localeCompare(normalize(b[0])))
      .map(([title, data]) => ({ title, data }));
  }, [filtered, sortMode, hasQuery]);

  const resetScreen = () => {
    setQuery('');
    setDebouncedQuery('');
    setIsSearching(false);
    setSortMode('newest');
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        resetScreen();
      };
    }, []),
  );

  return {
    // ✅ thêm state mới cho Screen
    loading,
    error,
    refetch: load,

    // giữ nguyên cái cũ
    sortMode,
    setSortMode,
    query,
    setQuery,
    isSearching,
    isEmptyResult,
    sections,
  };
}
