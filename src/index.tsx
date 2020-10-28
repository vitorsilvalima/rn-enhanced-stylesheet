import { useEffect, useState } from 'react';
import { ViewStyle, TextStyle, ImageStyle, useColorScheme } from 'react-native';

type BaseStyles = ViewStyle & TextStyle & ImageStyle;

type ExtendedBaseStyle = {
  [P in keyof BaseStyles]: BaseStyles[P] | DynamicValue<any>;
};

type StyleProperties = ExtendedBaseStyle; //| Record<string, any>;

type NamedStyles<T> = { [P in keyof T]: BaseStyles };
type ExtendedNamedStyles<T> = { [P in keyof T]: StyleProperties };

export class DynamicValue<T extends any> {
  private dark: T;
  private light: T;

  constructor(dark: T, light: T) {
    this.dark = dark;
    this.light = light;
  }

  public getValue(isDarkMode: boolean): T {
    return isDarkMode ? this.dark : this.light;
  }
}

export class StyleSheet {
  static create<T extends ExtendedNamedStyles<T> | ExtendedNamedStyles<any>>(
    styles: T | ExtendedNamedStyles<T>
  ): T {
    return styles as T;
  }

  static processStyleSheet<T extends ExtendedNamedStyles<T>>(
    styleSheet: T,
    isDarkMode: boolean
  ): ReturnStyle<T> {
    const processedStyles: Partial<NamedStyles<T>> = {};

    for (const styleName in styleSheet) {
      const style = styleSheet[styleName] as Partial<ExtendedBaseStyle>;
      const processed: Partial<T> = {};

      for (const styleKey in style) {
        const value =
          style[styleKey as Extract<keyof ExtendedBaseStyle, string>];

        processed[
          styleKey as Extract<keyof Partial<T>, string>
        ] = (value instanceof DynamicValue
          ? value.getValue(isDarkMode)
          : value) as any;
      }

      processedStyles[styleName] = processed;
    }

    return processedStyles as ReturnStyle<T>;
  }
}

type ReturnStyle<T> = {
  [P in keyof T]: any;
};

export function useStyleSheet<T extends ExtendedNamedStyles<T>>(
  stylesheet: T,
  // useColorScheme: () => ColorSchemeName,
  isDarkMode?: boolean
): ReturnStyle<T> {
  const colorScheme = useColorScheme();
  const isDarkModeEnabled = isDarkMode ?? colorScheme === 'dark';
  const [styles, setStyles] = useState(
    StyleSheet.processStyleSheet(stylesheet, isDarkModeEnabled)
  );

  console.log({
    colorScheme,
    isDarkModeEnabled,
  });

  useEffect(() => {
    const newStyles = StyleSheet.processStyleSheet(
      stylesheet,
      isDarkModeEnabled
    );
    setStyles(newStyles);
  }, [isDarkModeEnabled, stylesheet, setStyles]);

  return styles;
}
