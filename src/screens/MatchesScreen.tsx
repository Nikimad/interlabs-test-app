import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { FilterTabs } from '../components/FilterTabs';
import { MatchCard } from '../components/MatchCard';
import { useMatches } from '../hooks/useMatches';
import { colors, contentMaxWidth, radius, spacing } from '../theme';
import type { Match } from '../types/match';
import { filterMatches, type MatchFilter } from '../utils/filterMatches';

export function MatchesScreen() {
  const { state, reload } = useMatches();
  const [filter, setFilter] = useState<MatchFilter>('all');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Матчи тура</Text>
      {state.kind === 'loading' && (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      )}
      {state.kind === 'error' && (
        <View style={styles.center}>
          <Text style={styles.message}>{state.message}</Text>
          <Pressable style={styles.button} onPress={reload} accessibilityRole="button">
            <Text style={styles.buttonText}>Повторить</Text>
          </Pressable>
        </View>
      )}
      {state.kind === 'ready' && (
        <MatchList matches={state.matches} filter={filter} onFilterChange={setFilter} />
      )}
    </View>
  );
}

type MatchListProps = {
  matches: Match[];
  filter: MatchFilter;
  onFilterChange: (filter: MatchFilter) => void;
};

function MatchList({ matches, filter, onFilterChange }: MatchListProps) {
  const visible = filterMatches(matches, filter);
  const emptyText =
    matches.length === 0 ? 'В этом туре пока нет матчей' : 'Нет матчей по выбранному фильтру';

  return (
    <>
      <FilterTabs value={filter} onChange={onFilterChange} />
      <FlatList
        data={visible}
        keyExtractor={(m) => m.id}
        renderItem={({ item }) => <MatchCard match={item} />}
        contentContainerStyle={visible.length === 0 && styles.center}
        ListEmptyComponent={<Text style={styles.message}>{emptyText}</Text>}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    maxWidth: contentMaxWidth,
    alignSelf: 'center',
    padding: 16,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing,
  },
  center: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing,
  },
  message: {
    color: colors.muted,
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: radius,
    backgroundColor: colors.accent,
  },
  buttonText: {
    color: colors.onAccent,
    fontWeight: '600',
  },
});
