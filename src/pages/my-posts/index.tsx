import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useApp } from '../../components/AppProvider';
import PostCard from '../../components/PostCard';
import styles from './index.module.scss';

const MyPostsPage: React.FC = () => {
  const { myPosts, blockedKeywords, updatePost } = useApp();
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);

  useEffect(() => {
    filterPosts();
  }, [myPosts, blockedKeywords]);

  const filterPosts = () => {
    if (blockedKeywords.length === 0) {
      setFilteredPosts(myPosts);
    } else {
      setFilteredPosts(myPosts.filter(post => {
        const content = post.content.toLowerCase();
        return !blockedKeywords.some(keyword => content.includes(keyword.toLowerCase()));
      }));
    }
  };

  const handleHug = (postId: string) => {
    const post = myPosts.find(p => p.id === postId);
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
    const post = myPosts.find(p => p.id === postId);
    if (post) {
      updatePost(postId, { isCollected: !post.isCollected });
    }
  };

  const handlePostClick = (postId: string) => {
    Taro.navigateTo({ url: `/pages/post-detail/index?id=${postId}` });
  };

  return (
    <View className={styles.container}>
      <ScrollView scrollY className={styles.list}>
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
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📝</Text>
            <Text className={styles.emptyText}>
              {blockedKeywords.length > 0 ? '当前设置了屏蔽词，部分内容已被过滤' : '还没有发布过内容'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default MyPostsPage;
