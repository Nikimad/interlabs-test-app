import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { colors } from '../theme';

type Props = {
  // Момент последней успешной загрузки данных.
  since: Date;
};

// Подпись «Обновлено N сек назад».
export function UpdatedAgo({ since }: Props) {
  const sinceMs = since.getTime();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [sinceMs]);

  // now отстаёт от нового since до первого тика — не уходим в минус.
  const seconds = Math.max(0, Math.floor((now - sinceMs) / 1000));

  return <Text style={styles.text}>Обновлено {seconds} сек назад</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontSize: 13,
    color: colors.muted,
  },
});
