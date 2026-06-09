import React from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Text } from 'react-native';
import { Colors, Typography } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  sortBy: 'DueDateAsc' | 'DueDateDesc';
  onSortChange: (sort: 'DueDateAsc' | 'DueDateDesc') => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onQueryChange,
  sortBy,
  onSortChange,
}) => {
  const isAsc = sortBy === 'DueDateAsc';

  const toggleSort = () => {
    onSortChange(isAsc ? 'DueDateDesc' : 'DueDateAsc');
  };

  return (
    <View style={styles.container}>
      {/* Search Input Container */}
      <View style={styles.inputContainer}>
        <Ionicons name="search-outline" size={20} color={Colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={onQueryChange}
          placeholder="Search tasks..."
          placeholderTextColor={Colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity
            onPress={() => onQueryChange('')}
            activeOpacity={0.7}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Sort Toggle Button */}
      <TouchableOpacity
        onPress={toggleSort}
        activeOpacity={0.8}
        style={styles.sortButton}
      >
        <Ionicons
          name={isAsc ? 'calendar-outline' : 'calendar'}
          size={18}
          color={Colors.primary}
        />
        <View style={styles.sortArrowContainer}>
          <Ionicons
            name={isAsc ? 'arrow-up' : 'arrow-down'}
            size={12}
            color={Colors.primary}
          />
        </View>
        <Text style={styles.sortText}>
          {isAsc ? 'Oldest' : 'Newest'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    backgroundColor: Colors.background,
    gap: 8,
  },
  inputContainer: {
    flex: 1,
    height: 44,
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    color: Colors.text,
    fontSize: Typography.sizes.sm,
  },
  clearButton: {
    padding: 4,
  },
  sortButton: {
    height: 44,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.cardBg,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  sortArrowContainer: {
    marginLeft: -2,
    marginRight: 2,
  },
  sortText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.textSecondary,
  },
});

export default SearchBar;
