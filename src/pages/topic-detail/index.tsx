import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useApp } from '../../components/AppProvider';
import { mockTopics } from '../../data/topics';
import PostCard from '../../components/PostCard';
import styles from './index.module.scss';

const TopicDetailPage: React.FC = () => {
  const { posts, blockedKeywords, updatePost } = useApp();
  const [topic, setTopic] = useState<any>(null);
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);

  useEffect(() => {
    const { id } = Taro.getCurrentInstance().router?.params || {};
    if (id) {
      const foundTopic = mockTopics.find(t => t.id === id);
      if (foundTopic) {
        setTopic(foundTopic);
      }
    }
  }, []);

  useEffect(() => {
    if (topic) {
      let result = posts.filter(p => p.topicId === topic.id);
      
      if (blockedKeywords.length > 0) {
        result = result.filter(post => {
          const content = post.content.toLowerCase();
          return !blockedKeywords.some(keyword => content.includes(keyword.toLowerCase()));
        });
      }
      
      setFilteredPosts(result);
    }
  }, [posts, topic, blockedKeywords]);

  const handleHug = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      updatePost(postId, {
        hugs: post.isHugged ? post.hugs - 1 : post.hugs + 1,
        isHugged: !post.isHugged
      });
    }
  };

  const handleComment = (postId: string) => {
    Taro.navigateTo({ url: `/pages/comments/index?postId=${postId}` });
  };

  const handleCollect = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      updatePost(postId, { isCollected: !post.isCollected });
    }
  };

  const handlePostClick = (postId: string) => {
    Taro.navigateTo({ url: `/pages/post-detail/index?id=${postId}` });
  };

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
          <Text className={styles.stat}>{filteredPosts.length}篇帖子</Text>
          <Text className={styles.stat}>{topic.isFollowed ? '已关注' : '未关注'}</Text>
        </View>
      </View>

      <ScrollView className={styles.content} scrollY>
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onHug={handleHug}
              onComment={handleComment}
              onCollect={handleCollect}
              onClick={handlePostClick}
            />
          ))
        ) : (
          <View className={styles.placeholder}>
            <Text className={styles.icon}>📭</Text>
            <Text className={styles.title}>暂无帖子</Text>
            <Text className={styles.desc}>
              {blockedKeywords.length > 0 
                ? '当前设置了屏蔽词，部分内容已被过滤'
                : '该话题下还没有帖子，快来发布第一篇吧~'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default TopicDetailPage;
