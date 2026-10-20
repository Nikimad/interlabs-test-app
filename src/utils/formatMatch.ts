import type { Match } from '../types/match';

const STATUS_LABELS: Record<string, string> = {
  scheduled: 'Запланирован',
  live: 'Идёт',
  finished: 'Завершён',
  postponed: 'Перенесён',
};

const UNKNOWN_STATUS_LABEL = 'Статус неизвестен';

// Без timeZone — Intl берёт часовой пояс устройства.
export function formatStartsAt(startsAt: string | null): string {
  if (startsAt === null) return 'Дата уточняется';
  const date = new Date(startsAt);
  if (Number.isNaN(date.getTime())) return 'Дата уточняется';
  return date.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatStatus(status: string): string {
  return STATUS_LABELS[status] ?? UNKNOWN_STATUS_LABEL;
}

export function formatLive(match: Match): string | null {
  if (match.status !== 'live') return null;
  return match.minute !== undefined ? `LIVE ${match.minute}'` : 'LIVE';
}
