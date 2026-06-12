import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { mockTopics } from '../../data/topics';
import { mockPosts } from '../../data/posts';
import PostCard from '../../components/PostCard';
import styles from './index.module.scss';

const TopicDetailPage: React.FC = () => {
  const [topic, setTopic] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const { id } = Taro.getCurrentInstance().router?.params || {};
    if (id) {
      const foundTopic = mockTopics.find(t => t.id === id);
      if (foundTopic) {
        setTopic(foundTopic);
        setPosts(mockPosts.filter(p => p.topicId === id));
      }
    }
  }, []);

  if (!topic) {
    return (
      <View style={{ padding: '100rpx', textAlign: 'center' }}>
        <Text style={{ color: '#999' }}>加载中...</Text>
      </View>
    );
  }

  const topicEmojis = ['💼', '🎯', '🎉', '🏢', '📚', '🐟', '🌿', '🏠'];

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <View className={styles.topicInfo}>
          <View className={styles.topicIcon}>
            {topicEmojis[0]}
          </View>
          <View>
            <Text className={styles.topicName}>#{topic.name}</Text>
            <Text className={styles.topicDesc}>{topic.description}</Text>
          </View>
        </View>
        <View className={styles.stats}>
          <Text className={styles.stat}>{topic.postCount}篇帖子</Text>
          <Text className={styles.stat}>{topic.isFollowed ? '已关注' : '未关注'}</Text>
        </View>
      </View>

      <ScrollView className={styles.content} scrollY>
        {posts.length > 0 ? (
          posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <View className={styles.placeholder}>
            <Text className={styles.icon}>📭</Text>
            <Text className={styles.title}>暂无帖子</Text>
            <Text className={styles.desc}>该话题下还没有帖子，快来发布第一篇吧~</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default TopicDetailPage;
