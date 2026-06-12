import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { mockCurrentUser } from '../../data/users';
import { mockPosts } from '../../data/posts';
import { mockMoodHistory } from '../../data/users';
import styles from './index.module.scss';

const ProfilePage: React.FC = () => {
  const user = mockCurrentUser;
  const myPosts = mockPosts.filter(p => p.userId === 'currentUser');
  const todayMood = mockMoodHistory[0];
  const followedTopicsCount = 3;

  const moodEmojis = {
    happy: '😊',
    calm: '😌',
    anxious: '😰',
    sad: '😢',
    angry: '😠'
  };

  const moodLabels = {
    happy: '开心',
    calm: '平静',
    anxious: '焦虑',
    sad: '难过',
    angry: '生气'
  };

  const handleMenuClick = (path: string) => {
    if (path) {
      Taro.navigateTo({ url: path });
    }
  };

  const handleCheckIn = () => {
    Taro.navigateTo({ url: '/pages/mood/index' });
  };

  const menuItems = [
    {
      icon: '📝',
      title: '我的发布',
      desc: `${myPosts.length}篇帖子`,
      path: '/pages/profile/index?tab=posts'
    },
    {
      icon: '💬',
      title: '我的回复',
      desc: '查看所有回复',
      path: '/pages/profile/index?tab=replies'
    },
    {
      icon: '⭐',
      title: '我的收藏',
      desc: '收藏的帖子',
      path: '/pages/profile/index?tab=collections'
    },
    {
      icon: '🏷️',
      title: '我的话题',
      desc: `关注了${followedTopicsCount}个话题`,
      path: '/pages/topics/index'
    },
    {
      icon: '🛡️',
      title: '关键词屏蔽',
      desc: '设置屏蔽词',
      path: '/pages/settings/index'
    },
    {
      icon: '🚩',
      title: '举报记录',
      desc: '查看举报历史',
      path: '/pages/settings/index'
    },
    {
      icon: '⚙️',
      title: '设置',
      desc: '昵称、安全等',
      path: '/pages/settings/index'
    }
  ];

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <View className={styles.profileCard}>
          <View className={styles.avatar}>
            <Text className={styles.avatarText}>
              {user.anonymousName.charAt(0)}
            </Text>
          </View>
          <View className={styles.profileInfo}>
            <Text className={styles.nickname}>{user.anonymousName}</Text>
            <Text className={styles.department}>{user.department} · 加入于{user.createdAt}</Text>
          </View>
        </View>

        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{myPosts.length}</Text>
            <Text className={styles.statLabel}>发布</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>156</Text>
            <Text className={styles.statLabel}>收到拥抱</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{followedTopicsCount}</Text>
            <Text className={styles.statLabel}>关注话题</Text>
          </View>
        </View>
      </View>

      <View className={styles.quickActions}>
        <View className={styles.actionGrid}>
          <View className={styles.actionItem} onClick={() => handleMenuClick('/pages/profile/index?tab=posts')}>
            <Text className={styles.actionIcon}>📝</Text>
            <Text className={styles.actionLabel}>我的发布</Text>
          </View>
          <View className={styles.actionItem} onClick={() => handleMenuClick('/pages/profile/index?tab=collections')}>
            <Text className={styles.actionIcon}>⭐</Text>
            <Text className={styles.actionLabel}>我的收藏</Text>
          </View>
          <View className={styles.actionItem} onClick={() => handleMenuClick('/pages/topics/index')}>
            <Text className={styles.actionIcon}>🏷️</Text>
            <Text className={styles.actionLabel}>我的话题</Text>
          </View>
          <View className={styles.actionItem} onClick={() => handleMenuClick('/pages/settings/index')}>
            <Text className={styles.actionIcon}>⚙️</Text>
            <Text className={styles.actionLabel}>设置</Text>
          </View>
        </View>

        <View className={styles.moodCard}>
          <View className={styles.cardHeader}>
            <Text className={styles.cardTitle}>今日心情</Text>
            <Text className={styles.cardMore} onClick={() => handleMenuClick('/pages/mood/index')}>
              查看趋势 →
            </Text>
          </View>
          <View className={styles.moodContent}>
            <Text className={styles.moodIcon}>
              {todayMood ? moodEmojis[todayMood.mood as keyof typeof moodEmojis] : '😶'}
            </Text>
            <View className={styles.moodInfo}>
              <Text className={styles.moodLabel}>
                {todayMood ? moodLabels[todayMood.mood as keyof typeof moodLabels] : '未打卡'}
              </Text>
              <Text className={styles.moodDesc}>
                {todayMood?.note || '点击打卡记录今日心情'}
              </Text>
            </View>
            <View className={styles.checkInButton} onClick={handleCheckIn}>
              {todayMood ? '修改' : '打卡'}
            </View>
          </View>
        </View>
      </View>

      <View className={styles.menuSection}>
        <View className={styles.menuList}>
          {menuItems.map((item, index) => (
            <View
              key={index}
              className={styles.menuItem}
              onClick={() => handleMenuClick(item.path)}
            >
              <Text className={styles.menuIcon}>{item.icon}</Text>
              <View className={styles.menuInfo}>
                <Text className={styles.menuTitle}>{item.title}</Text>
                <Text className={styles.menuDesc}>{item.desc}</Text>
              </View>
              <Text className={styles.menuArrow}>›</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default ProfilePage;
