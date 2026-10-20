import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../theme';
import { MATCH_FILTERS, type MatchFilter } from '../utils/filterMatches';

type Props = {
  value: MatchFilter;
  onChange: (value: MatchFilter) => void;
};

export function FilterTabs({ value, onChange }: Props) {
  return (
    <View style={styles.row}>
      {MATCH_FILTERS.map((f) => {
        const selected = f.value === value;
        return (
          <Pressable
            key={f.value}
            style={[styles.tab, selected && styles.tabSelected]}
            onPress={() => onChange(f.value)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
          >
            <Text style={[styles.text, selected && styles.textSelected]}>{f.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: spacing,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  tabSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accent,
  },
  text: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  textSelected: {
    color: colors.onAccent,
  },
});
