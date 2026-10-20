import { useCallback, useEffect, useRef, useState } from 'react';
import { parseMatches } from '../api/parseMatches';
import { MATCHES_URL } from '../config';
import type { Match } from '../types/match';

export type MatchesState =
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | {
      kind: 'ready';
      matches: Match[];
      updatedAt: Date;
      refreshing: boolean;
      refreshError: string | null;
    };

// Загрузка матчей с MATCHES_URL. Ответы устаревших запросов игнорируются.
// Повторная загрузка при готовом списке не скрывает его, а ошибка не затирает.
export function useMatches() {
  const [state, setState] = useState<MatchesState>({ kind: 'loading' });
  const requestId = useRef(0);

  const load = useCallback(async () => {
    const id = ++requestId.current;
    setState((prev) =>
      prev.kind === 'ready' ? { ...prev, refreshing: true, refreshError: null } : { kind: 'loading' },
    );
    try {
      const res = await fetch(MATCHES_URL);
      if (!res.ok) throw new Error(`Ошибка сервера: ${res.status}`);
      const matches = parseMatches(await res.json());
      if (id === requestId.current) {
        setState({
          kind: 'ready',
          matches,
          updatedAt: new Date(),
          refreshing: false,
          refreshError: null,
        });
      }
    } catch (e) {
      if (id !== requestId.current) return;
      const message =
        e instanceof SyntaxError
          ? 'Сервер вернул некорректный JSON'
          : e instanceof TypeError
            ? 'Нет соединения с сервером'
            : e instanceof Error
              ? e.message
              : 'Не удалось загрузить матчи';
      setState((prev) =>
        prev.kind === 'ready'
          ? { ...prev, refreshing: false, refreshError: message }
          : { kind: 'error', message },
      );
    }
  }, []);

  useEffect(() => {
    load();
    return () => {
      // Invalidate in-flight request so it can't set state after unmount.
      requestId.current++;
    };
  }, [load]);

  return { state, reload: load };
}
