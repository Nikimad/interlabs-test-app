import type { Match, Team } from '../types/match';

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function isTeam(v: unknown): v is Team {
  return (
    isRecord(v) &&
    typeof v.id === 'string' &&
    typeof v.name === 'string' &&
    typeof v.city === 'string'
  );
}

function isMatch(v: unknown): v is Match {
  if (!isRecord(v)) return false;
  const { id, startsAt, status, minute, home, away, score } = v;
  return (
    typeof id === 'string' &&
    (startsAt === null || typeof startsAt === 'string') &&
    typeof status === 'string' &&
    (minute === undefined || typeof minute === 'number') &&
    isTeam(home) &&
    isTeam(away) &&
    (score === null ||
      (isRecord(score) &&
        typeof score.home === 'number' &&
        typeof score.away === 'number'))
  );
}

export function parseMatches(data: unknown): Match[] {
  if (!isRecord(data) || !Array.isArray(data.matches) || !data.matches.every(isMatch)) {
    throw new Error('Некорректный формат данных');
  }
  return data.matches;
}
