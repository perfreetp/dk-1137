import React, { useState } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useApp } from '../../components/AppProvider';
import { MoodEntry } from '../../types';
import styles from './index.module.scss';

type MoodType = 'happy' | 'calm' | 'anxious' | 'sad' | 'angry';

const moodOptions: { type: MoodType; emoji: string; label: string; color: string }[] = [
  { type: 'happy', emoji: '😊', label: '开心', color: '#52C41A' },
  { type: 'calm', emoji: '😌', label: '平静', color: '#1890FF' },
  { type: 'anxious', emoji: '😰', label: '焦虑', color: '#FFA940' },
  { type: 'sad', emoji: '😢', label: '难过', color: '#722ED1' },
  { type: 'angry', emoji: '😠', label: '生气', color: '#F53F3F' }
];

const MoodPage: React.FC = () => {
  const { moodHistory, addMoodEntry } = useApp();
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [note, setNote] = useState('');

  const handleSubmit = () => {
    if (!selectedMood) {
      Taro.showToast({ title: '请选择心情', icon: 'none' });
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const existingIndex = moodHistory.findIndex(m => m.createdAt === today);

    const newEntry: MoodEntry = {
      id: `m_${Date.now()}`,
      mood: selectedMood,
      note: note,
      createdAt: today
    };

    addMoodEntry(newEntry);
    Taro.showToast({ title: '打卡成功', icon: 'success' });
    setSelectedMood(null);
    setNote('');
  };

  const getMoodEmoji = (mood: string) => {
    const option = moodOptions.find(m => m.type === mood);
    return option?.emoji || '😶';
  };

  const getMoodLabel = (mood: string) => {
    const option = moodOptions.find(m => m.type === mood);
    return option?.label || '';
  };

  const getMoodColor = (mood: string) => {
    const option = moodOptions.find(m => m.type === mood);
    return option?.color || '#999';
  };

  const last7Days = moodHistory.slice(0, 7).reverse();
  
  const barHeights = [60, 75, 45, 80, 55, 70, 65];

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>📅 心情打卡</Text>
        <Text className={styles.headerSubtitle}>记录每一天的心情，让情绪可视化</Text>
      </View>

      <ScrollView scrollY>
        <View className={styles.content}>
          <View className={styles.moodCard}>
            <Text className={styles.moodTitle}>今天心情如何？</Text>
            <View className={styles.moodOptions}>
              {moodOptions.map(option => (
                <View
                  key={option.type}
                  className={classnames(
                    styles.moodOption,
                    selectedMood === option.type && styles.moodOptionActive
                  )}
                  onClick={() => setSelectedMood(option.type)}
                >
                  <Text className={styles.moodEmoji}>{option.emoji}</Text>
                  <Text className={styles.moodLabel}>{option.label}</Text>
                </View>
              ))}
            </View>
            <View className={styles.noteSection}>
              <Text className={styles.noteTitle}>写点什么（可选）</Text>
              <Input
                className={styles.noteInput}
                type='text'
                placeholder='记录此刻的心情...'
                value={note}
                onInput={(e) => setNote(e.detail.value)}
              />
            </View>
            <View className={styles.submitButton} onClick={handleSubmit}>
              打卡
            </View>
          </View>

          <View className={styles.trendSection}>
            <View className={styles.trendHeader}>
              <Text className={styles.trendTitle}>📈 近7天情绪趋势</Text>
            </View>
            <View className={styles.trendChart}>
              {last7Days.map((entry, index) => (
                <View
                  key={entry.id}
                  className={styles.chartBar}
                  style={{
                    height: `${barHeights[index] || 50}%`,
                    background: getMoodColor(entry.mood)
                  }}
                >
                  <Text className={styles.chartEmoji}>{getMoodEmoji(entry.mood)}</Text>
                  <Text className={styles.chartLabel}>
                    {entry.createdAt.split('-')[2]}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View className={styles.statsSection}>
            <Text className={styles.statsTitle}>📊 统计</Text>
            <View className={styles.statsGrid}>
              <View className={styles.statItem}>
                <Text className={styles.statValue}>{moodHistory.length}</Text>
                <Text className={styles.statLabel}>打卡天数</Text>
              </View>
              <View className={styles.statItem}>
                <Text className={styles.statValue}>
                  {moodHistory.filter(m => m.mood === 'happy').length}
                </Text>
                <Text className={styles.statLabel}>开心次数</Text>
              </View>
              <View className={styles.statItem}>
                <Text className={styles.statValue}>
                  {moodHistory.filter(m => m.mood === 'calm').length}
                </Text>
                <Text className={styles.statLabel}>平静次数</Text>
              </View>
              <View className={styles.statItem}>
                <Text className={styles.statValue}>
                  {moodHistory.filter(m => ['anxious', 'sad', 'angry'].includes(m.mood)).length}
                </Text>
                <Text className={styles.statLabel}>低落次数</Text>
              </View>
            </View>
          </View>

          <View className={styles.moodHistory}>
            <Text className={styles.historyTitle}>📝 打卡记录</Text>
            {moodHistory.slice(0, 10).map(entry => (
              <View key={entry.id} className={styles.historyItem}>
                <Text className={styles.historyEmoji}>{getMoodEmoji(entry.mood)}</Text>
                <View className={styles.historyInfo}>
                  <Text className={styles.historyMood}>{getMoodLabel(entry.mood)}</Text>
                  <Text className={styles.historyNote}>{entry.note || '无备注'}</Text>
                </View>
                <Text className={styles.historyDate}>{entry.createdAt}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default MoodPage;
