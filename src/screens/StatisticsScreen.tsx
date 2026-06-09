import React, { useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTasks } from '../hooks/useTasks';
import { Colors, Typography, Shadows } from '../constants/colors';
import StatCard from '../components/StatCard';

export const StatisticsScreen: React.FC = () => {
  const { allTasks } = useTasks();

  // Compute stats using useMemo for optimal performance
  const stats = useMemo(() => {
    const total = allTasks.length;
    const completed = allTasks.filter(t => t.status === 'Completed').length;
    const pending = total - completed;
    const highPriority = allTasks.filter(t => t.priority === 'High').length;
    
    // Priority specific counts
    const highCompleted = allTasks.filter(t => t.priority === 'High' && t.status === 'Completed').length;
    const medium = allTasks.filter(t => t.priority === 'Medium').length;
    const mediumCompleted = allTasks.filter(t => t.priority === 'Medium' && t.status === 'Completed').length;
    const low = allTasks.filter(t => t.priority === 'Low').length;
    const lowCompleted = allTasks.filter(t => t.priority === 'Low' && t.status === 'Completed').length;

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const highCompletionRate = highPriority > 0 ? Math.round((highCompleted / highPriority) * 100) : 0;
    const mediumCompletionRate = medium > 0 ? Math.round((mediumCompleted / medium) * 100) : 0;
    const lowCompletionRate = low > 0 ? Math.round((lowCompleted / low) * 100) : 0;

    return {
      total,
      completed,
      pending,
      highPriority,
      completionRate,
      high: { total: highPriority, completed: highCompleted, rate: highCompletionRate },
      medium: { total: medium, completed: mediumCompleted, rate: mediumCompletionRate },
      low: { total: low, completed: lowCompleted, rate: lowCompletionRate },
    };
  }, [allTasks]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Task Statistics 📊</Text>
        <Text style={styles.headerSubtitle}>Insights and productivity metrics</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Grid of StatCards */}
        <View style={styles.gridContainer}>
          <StatCard
            label="Total Tasks"
            value={stats.total}
            iconName="copy-outline"
            iconColor={Colors.info}
            subtitle="All tasks logged"
          />
          <StatCard
            label="Completed"
            value={stats.completed}
            iconName="checkmark-circle-outline"
            iconColor={Colors.status.Completed}
            subtitle={`${stats.completionRate}% completion rate`}
          />
          <StatCard
            label="Pending Tasks"
            value={stats.pending}
            iconName="hourglass-outline"
            iconColor={Colors.status.Pending}
            subtitle="Awaiting action"
          />
          <StatCard
            label="High Priority"
            value={stats.highPriority}
            iconName="alert-circle-outline"
            iconColor={Colors.priority.High}
            subtitle="Crucial tasks"
          />
        </View>

        {/* Global Progress Bar Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Overall Progress</Text>
            <Text style={styles.progressPercentage}>{stats.completionRate}%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${stats.completionRate}%` }]} />
          </View>
          <Text style={styles.progressSubtitle}>
            {stats.completed} out of {stats.total} tasks completed
          </Text>
        </View>

        {/* Priority Breakdowns custom bar chart */}
        <View style={styles.breakdownCard}>
          <Text style={styles.breakdownTitle}>Priority Breakdown</Text>

          {/* High Priority bar */}
          <View style={styles.breakdownItem}>
            <View style={styles.breakdownLabelRow}>
              <Text style={styles.breakdownLabel}>High Priority</Text>
              <Text style={styles.breakdownValue}>
                {stats.high.completed}/{stats.high.total} ({stats.high.rate}%)
              </Text>
            </View>
            <View style={styles.breakdownBarBg}>
              <View
                style={[
                  styles.breakdownBarFill,
                  {
                    backgroundColor: Colors.priority.High,
                    width: `${stats.high.rate}%`
                  }
                ]}
              />
            </View>
          </View>

          {/* Medium Priority bar */}
          <View style={styles.breakdownItem}>
            <View style={styles.breakdownLabelRow}>
              <Text style={styles.breakdownLabel}>Medium Priority</Text>
              <Text style={styles.breakdownValue}>
                {stats.medium.completed}/{stats.medium.total} ({stats.medium.rate}%)
              </Text>
            </View>
            <View style={styles.breakdownBarBg}>
              <View
                style={[
                  styles.breakdownBarFill,
                  {
                    backgroundColor: Colors.priority.Medium,
                    width: `${stats.medium.rate}%`
                  }
                ]}
              />
            </View>
          </View>

          {/* Low Priority bar */}
          <View style={styles.breakdownItem}>
            <View style={styles.breakdownLabelRow}>
              <Text style={styles.breakdownLabel}>Low Priority</Text>
              <Text style={styles.breakdownValue}>
                {stats.low.completed}/{stats.low.total} ({stats.low.rate}%)
              </Text>
            </View>
            <View style={styles.breakdownBarBg}>
              <View
                style={[
                  styles.breakdownBarFill,
                  {
                    backgroundColor: Colors.priority.Low,
                    width: `${stats.low.rate}%`
                  }
                ]}
              />
            </View>
          </View>
        </View>

        <View style={styles.footerSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 12 : 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  scrollContainer: {
    padding: 16,
    flexGrow: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  progressCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 16,
    ...Shadows.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  progressPercentage: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
  progressBarBg: {
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.border,
    width: '100%',
    marginBottom: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  progressSubtitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
  },
  breakdownCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    ...Shadows.sm,
  },
  breakdownTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    marginBottom: 16,
  },
  breakdownItem: {
    marginBottom: 14,
  },
  breakdownLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  breakdownLabel: {
    fontSize: Typography.sizes.sm,
    color: Colors.text,
    fontWeight: Typography.weights.medium,
  },
  breakdownValue: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
  },
  breakdownBarBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
    width: '100%',
    overflow: 'hidden',
  },
  breakdownBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  footerSpacer: {
    height: 40,
  },
});

export default StatisticsScreen;
