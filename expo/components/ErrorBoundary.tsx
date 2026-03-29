import React, { Component, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>
            An unexpected error occurred. Your data is safe.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={this.handleReset}
            accessibilityLabel="Try again"
            accessibilityRole="button"
          >
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 32,
  },
  title: {
    ...Typography.displayMedium,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  message: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: Colors.accent,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
    minWidth: 160,
    alignItems: 'center',
  },
  buttonText: {
    ...Typography.titleMedium,
    color: '#FFFFFF',
  },
});
