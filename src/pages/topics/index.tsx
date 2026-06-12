import React, { useState } from 'react';
import { View, Text, Image, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { mockTopics } from '../../data/topics';
import { Topic } from '../../types';
import styles from './index.module.scss';

const TopicsPage: React.FC = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [topics, setTopics] = useState<Topic[]>(mockTopics);

  const followedTopics = topics.filter(t => t.isFollowed);
  const otherTopics = topics.filter(t => !t.isFollowed);

  const handleTopicClick = (topicId: string) => {
    Taro.navigateTo({ url: `/pages/topic-detail/index?id=${topicId}` });
  };

  const handleFollow = (topicId: string, e: any) => {
    e.stopPropagation();
    setTopics(prev => prev.map(t => {
      if (t.id === topicId) {
        return { ...t, isFollowed: !t.isFollowed };
      }
      return t;
    }));
    const topic = topics.find(t => t.id === topicId);
    Taro.showToast({
      title: topic?.isFollowed ? '已取消关注' : '已关注',
      icon: 'success'
    });
  };

  const filteredTopics = searchKeyword
    ? topics.filter(t => t.name.includes(searchKeyword))
    : otherTopics;

  const topicEmojis = ['💼', '🎯', '🎉', '🏢', '📚', '🐟', '🌿', '🏠'];

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.title}>🏠 话题广场</Text>
        <Text className={styles.subtitle}>发现感兴趣的话题，找到志同道合的伙伴</Text>
      </View>

      <View className={styles.searchSection}>
        <Input
          className={styles.searchInput}
          placeholder='搜索话题...'
          value={searchKeyword}
          onInput={(e) => setSearchKeyword(e.detail.value)}
        />
      </View>

      {followedTopics.length > 0 && !searchKeyword && (
        <View className={styles.followedSection}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>我的关注</Text>
            <Text className={styles.moreLink}>共{followedTopics.length}个</Text>
          </View>
          <View className={styles.topicGrid}>
            {followedTopics.map(topic => (
              <View
                key={topic.id}
                className={styles.topicCard}
                onClick={() => handleTopicClick(topic.id)}
              >
                <View 
                  className={styles.topicCover}
                  style={{ background: 'linear-gradient(135deg, #7B68EE 0%, #87CEEB 100%)' }}
                >
                  <Text style={{ fontSize: '48rpx' }}>
                    {topicEmojis[topics.indexOf(topic) % topicEmojis.length]}
                  </Text>
                </View>
                <Text className={styles.topicName}>{topic.name}</Text>
                <View className={styles.topicMeta}>
                  <Text className={styles.topicCount}>{topic.postCount}篇帖子</Text>
                  <View 
                    className={`${styles.followButton} ${styles.followed}`}
                    onClick={(e) => handleFollow(topic.id, e)}
                  >
                    已关注
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      <View className={styles.allTopicsSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            {searchKeyword ? '搜索结果' : '全部话题'}
          </Text>
          <Text className={styles.moreLink}>
            {searchKeyword ? `${filteredTopics.length}个结果` : '共' + otherTopics.length + '个'}
          </Text>
        </View>

        {filteredTopics.length > 0 ? (
          <View className={styles.topicList}>
            {filteredTopics.map((topic, index) => (
              <View
                key={topic.id}
                className={styles.topicItem}
                onClick={() => handleTopicClick(topic.id)}
              >
                <View 
                  className={styles.topicIcon}
                  style={{ background: 'linear-gradient(135deg, #7B68EE 0%, #87CEEB 100%)' }}
                >
                  <Text style={{ fontSize: '32rpx' }}>
                    {topicEmojis[index % topicEmojis.length]}
                  </Text>
                </View>
                <View className={styles.topicInfo}>
                  <Text className={styles.topicItemName}>#{topic.name}</Text>
                  <Text className={styles.topicDesc}>{topic.description}</Text>
                </View>
                <View className={styles.topicStats}>
                  <Text className={styles.topicPostCount}>{topic.postCount}</Text>
                  <Text className={styles.topicLabel}>篇帖子</Text>
                </View>
                {!topic.isFollowed && (
                  <View
                    className={styles.followButton}
                    style={{ marginLeft: '16rpx' }}
                    onClick={(e) => handleFollow(topic.id, e)}
                  >
                    + 关注
                  </View>
                )}
              </View>
            ))}
          </View>
        ) : (
          <View style={{ textAlign: 'center', padding: '60rpx' }}>
            <Text style={{ fontSize: '80rpx' }}>🔍</Text>
            <Text style={{ color: '#999', fontSize: '28rpx', display: 'block', marginTop: '16rpx' }}>
              未找到相关话题
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default TopicsPage;
