import { StyleSheet, Text, View } from 'react-native';
import { FavoriteButton } from './FavoriteButton';
import { colors, radius, spacing } from '../theme';
import type { Match } from '../types/match';
import { formatLive, formatStartsAt, formatStatus } from '../utils/formatMatch';

type Props = {
  match: Match;
  favorite: boolean;
  onToggleFavorite: () => void;
};

export function MatchCard({ match, favorite, onToggleFavorite }: Props) {
  const live = formatLive(match);

  return (
    <View style={styles.card}>
      <View style={styles.favorite}>
        <FavoriteButton active={favorite} onPress={onToggleFavorite} />
      </View>
      {live !== null && <Text style={styles.live}>{live}</Text>}
      <Text style={styles.teams}>
        {match.home.name} — {match.away.name}
      </Text>
      {match.score !== null && (
        <Text style={styles.score}>
          {match.score.home} : {match.score.away}
        </Text>
      )}
      <Text style={styles.meta}>{formatStartsAt(match.startsAt)}</Text>
      <Text style={styles.meta}>{formatStatus(match.status)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    padding: spacing,
    // место под звёздочку в правом верхнем углу
    paddingHorizontal: spacing + 32,
    marginBottom: spacing,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: 4,
  },
  favorite: {
    position: 'absolute',
    top: spacing,
    right: spacing,
    zIndex: 1,
  },
  live: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius,
    backgroundColor: colors.live,
    color: colors.onAccent,
    fontSize: 12,
    fontWeight: '700',
    overflow: 'hidden',
  },
  teams: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  score: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  meta: {
    color: colors.muted,
    textAlign: 'center',
  },
});
