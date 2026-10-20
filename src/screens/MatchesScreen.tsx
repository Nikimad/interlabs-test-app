import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { FilterTabs } from '../components/FilterTabs';
import { MatchCard } from '../components/MatchCard';
import { UpdatedAgo } from '../components/UpdatedAgo';
import { useFavorites } from '../hooks/useFavorites';
import { useMatches } from '../hooks/useMatches';
import { colors, contentMaxWidth, radius, spacing } from '../theme';
import type { Match } from '../types/match';
import { filterMatches, searchMatches, type MatchFilter } from '../utils/filterMatches';

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
        <>
          <View style={styles.toolbar}>
            <UpdatedAgo since={state.updatedAt} />
            <Pressable
              style={[styles.button, state.refreshing && styles.buttonDisabled]}
              onPress={reload}
              disabled={state.refreshing}
              accessibilityRole="button"
              accessibilityState={{ busy: state.refreshing, disabled: state.refreshing }}
            >
              <Text style={styles.buttonText}>{state.refreshing ? 'Обновление…' : 'Обновить'}</Text>
            </Pressable>
          </View>
          {state.refreshError !== null && (
            <Text style={styles.refreshError} accessibilityRole="alert">
              Не удалось обновить: {state.refreshError}
            </Text>
          )}
          <MatchList matches={state.matches} filter={filter} onFilterChange={setFilter} />
        </>
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
  const { favorites, isFavorite, toggle } = useFavorites();
  const [query, setQuery] = useState('');
  const visible = searchMatches(filterMatches(matches, filter), query);
  const emptyText =
    matches.length === 0
      ? 'В этом туре пока нет матчей'
      : query.trim() !== ''
        ? `Ничего не найдено по запросу «${query.trim()}»`
        : 'Нет матчей по выбранному фильтру';

  return (
    <>
      <FilterTabs value={filter} onChange={onFilterChange} />
      <TextInput
        style={styles.search}
        value={query}
        onChangeText={setQuery}
        placeholder="Поиск по команде"
        placeholderTextColor={colors.muted}
        accessibilityLabel="Поиск по команде"
        autoCorrect={false}
        clearButtonMode="while-editing"
      />
      <FlatList
        data={visible}
        keyExtractor={(m) => m.id}
        extraData={favorites}
        renderItem={({ item }) => (
          <MatchCard
            match={item}
            favorite={isFavorite(item.id)}
            onToggleFavorite={() => toggle(item.id)}
          />
        )}
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
    padding: spacing,
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
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing,
  },
  search: {
    paddingHorizontal: spacing,
    paddingVertical: 8,
    marginBottom: spacing,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: 16,
  },
  refreshError: {
    color: colors.live,
    textAlign: 'center',
    marginBottom: spacing,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.accent,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.onAccent,
    fontSize: 13,
    fontWeight: '600',
  },
});
