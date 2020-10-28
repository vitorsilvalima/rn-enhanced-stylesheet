import * as React from 'react';
import { View, Text, useColorScheme } from 'react-native';
import {
  StyleSheet,
  useStyleSheet,
  DynamicValue,
} from 'rn-enhanced-stylesheet';

export default function App() {
  const styles = useStyleSheet(stylesheet);
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isDarkMode ? 'Dark mode' : 'Light mode'}
      </Text>
    </View>
  );
}

const stylesheet = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: new DynamicValue('black', 'white'),
  },
  title: {
    color: new DynamicValue('white', 'black'),
  },
});
