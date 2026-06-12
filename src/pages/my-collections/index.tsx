import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useApp } from '../../components/AppProvider';
import PostCard from '../../components/PostCard';
import EmptyState from '../../components/EmptyState';
import styles from './index.module.scss';

const MyCollectionsPage: React.FC = () => {
  const { myCollections, updatePost } = useApp();

  const handleHug = (postId: string) => {
    const post = myCollections.find(p => p.id === postId);
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
    const post = myCollections.find(p => p.id === postId);
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
        {myCollections.length > 0 ? (
          myCollections.map(post => (
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
            <Text className={styles.emptyIcon}>⭐</Text>
            <Text className={styles.emptyText}>还没有收藏的内容</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default MyCollectionsPage;
