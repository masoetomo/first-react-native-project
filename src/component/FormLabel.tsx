import * as React from 'react';
import {Text, DefaultTheme} from 'react-native-paper';
import {StyleProp, StyleSheet, TextStyle} from 'react-native';

const FormLabel = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}) => <Text style={[styles.itemText, styles.label, style]}>{children}</Text>;

export default FormLabel;

const styles = StyleSheet.create({
  itemText: {
    marginLeft: 8,
    marginTop: 15,
  },
  label: {
    color: DefaultTheme.colors.primary,
    fontSize: 14,
    marginBottom: 5,
  },
});
