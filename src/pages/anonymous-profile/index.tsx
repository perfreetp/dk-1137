import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useApp } from '../../components/AppProvider';
import PostCard from '../../components/PostCard';
import styles from './index.module.scss';

const AnonymousProfilePage: React.FC = () => {
  const { posts, blockedKeywords, updatePost, user } = useApp();
  const [authorId, setAuthorId] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorPosts, setAuthorPosts] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [isMyProfile, setIsMyProfile] = useState(false);

  useEffect(() => {
    const { userId, name } = Taro.getCurrentInstance().router?.params || {};
    if (userId) {
      setAuthorId(userId);
      setAuthorName(decodeURIComponent(name || ''));
      setIsMyProfile(userId === user.id);
    }
  }, []);

  useEffect(() => {
    if (authorId) {
      const userPosts = posts.filter(p => p.userId === authorId);
      
      if (blockedKeywords.length > 0) {
        setAuthorPosts(userPosts.filter(post => {
          const content = post.content.toLowerCase();
          return !blockedKeywords.some(keyword => content.includes(keyword.toLowerCase()));
        }));
      } else {
        setAuthorPosts(userPosts);
      }
      
      const topicMap = new Map();
      userPosts.forEach(post => {
        if (post.topicName && !topicMap.has(post.topicId)) {
          topicMap.set(post.topicId, { id: post.topicId, name: post.topicName });
        }
      });
      setTopics(Array.from(topicMap.values()));
    }
  }, [posts, authorId, blockedKeywords]);

  const handlePrivate = () => {
    if (!isMyProfile) {
      Taro.navigateTo({ 
        url: `/pages/chat/index?fromId=${authorId}&fromName=${encodeURIComponent(authorName)}` 
      });
    }
  };

  const handleHug = (postId: string) => {
    const post = authorPosts.find(p => p.id === postId);
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
    const post = authorPosts.find(p => p.id === postId);
    if (post) {
      updatePost(postId, { isCollected: !post.isCollected });
    }
  };

  const handlePostClick = (postId: string) => {
    Taro.navigateTo({ url: `/pages/post-detail/index?id=${postId}` });
  };

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <View className={styles.profileCard}>
          <View className={styles.avatar}>
            <Text className={styles.avatarText}>
              {authorName.charAt(0)}
            </Text>
          </View>
          <View className={styles.profileInfo}>
            <Text className={styles.nickname}>{authorName}</Text>
            <View>
              <Text className={styles.badge}>
                {isMyProfile ? '我的主页' : '匿名用户'}
              </Text>
            </View>
          </View>
        </View>

        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{authorPosts.length}</Text>
            <Text className={styles.statLabel}>发布</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>
              {authorPosts.reduce((sum, p) => sum + p.hugs, 0)}
            </Text>
            <Text className={styles.statLabel}>收到拥抱</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{topics.length}</Text>
            <Text className={styles.statLabel}>参与话题</Text>
          </View>
        </View>

        {!isMyProfile && (
          <View className={styles.actionSection}>
            <View className={styles.actionButton} onClick={handlePrivate}>
              💬 发私信
            </View>
          </View>
        )}
      </View>

      <ScrollView className={styles.content} scrollY>
        {topics.length > 0 && (
          <View className={styles.section}>
            <Text className={styles.sectionTitle}>共同话题</Text>
            <View className={styles.topicList}>
              {topics.map(topic => (
                <View key={topic.id} className={styles.topicItem}>
                  #{topic.name}
                </View>
              ))}
            </View>
          </View>
        )}

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            {isMyProfile ? '我的树洞' : 'Ta的树洞'}
          </Text>
          {authorPosts.length > 0 ? (
            authorPosts.map(post => (
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
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>🌿</Text>
              <Text className={styles.emptyText}>
                {blockedKeywords.length > 0 
                  ? '暂无可见内容' 
                  : isMyProfile 
                    ? '还没有发布过树洞' 
                    : '暂无公开树洞'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default AnonymousProfilePage;
