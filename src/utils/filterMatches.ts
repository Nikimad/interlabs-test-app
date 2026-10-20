import type { Match } from '../types/match';

export type MatchFilter = 'all' | 'upcoming' | 'finished';

export const MATCH_FILTERS: { value: MatchFilter; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'upcoming', label: 'Предстоящие' },
  { value: 'finished', label: 'Завершённые' },
];

// live и неизвестные статусы попадают только во «Все».
const STATUSES_BY_FILTER: Record<Exclude<MatchFilter, 'all'>, string[]> = {
  upcoming: ['scheduled', 'postponed'],
  finished: ['finished'],
};

export function filterMatches(matches: Match[], filter: MatchFilter): Match[] {
  if (filter === 'all') return liveFirst(matches);
  const statuses = STATUSES_BY_FILTER[filter];
  return matches.filter((m) => statuses.includes(m.status));
}

// sort стабилен — остальной порядок сохраняется.
function liveFirst(matches: Match[]): Match[] {
  const isLive = (m: Match) => Number(m.status === 'live');
  return [...matches].sort((a, b) => isLive(b) - isLive(a));
}
