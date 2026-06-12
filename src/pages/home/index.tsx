import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, PullToRefresh } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import PostCard from '../../components/PostCard';
import EmptyState from '../../components/EmptyState';
import { mockPosts } from '../../data/posts';
import { Post } from '../../types';
import styles from './index.module.scss';

type CategoryType = 'all' | 'complaint' | 'help' | 'happy' | 'daily';
type SortType = 'hot' | 'latest';

const HomePage: React.FC = () => {
  const [category, setCategory] = useState<CategoryType>('all');
  const [sortType, setSortType] = useState<SortType>('hot');
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPosts();
  }, [category, sortType]);

  const loadPosts = () => {
    let filtered = [...mockPosts];
    
    if (category !== 'all') {
      filtered = filtered.filter(p => p.category === category);
    }

    if (sortType === 'hot') {
      filtered.sort((a, b) => b.hugs - a.hugs);
    } else {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    setPosts(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadPosts();
      setRefreshing(false);
      Taro.showToast({ title: '刷新成功', icon: 'success' });
    }, 1000);
  };

  const handleHug = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          hugs: p.isHugged ? p.hugs - 1 : p.hugs + 1,
          isHugged: !p.isHugged
        };
      }
      return p;
    }));
  };

  const handleComment = (postId: string) => {
    Taro.navigateTo({ url: `/pages/comments/index?postId=${postId}` });
  };

  const handleCollect = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, isCollected: !p.isCollected };
      }
      return p;
    }));
    const post = posts.find(p => p.id === postId);
    Taro.showToast({
      title: post?.isCollected ? '已取消收藏' : '已收藏',
      icon: 'success'
    });
  };

  const handlePostClick = (postId: string) => {
    Taro.navigateTo({ url: `/pages/post-detail/index?id=${postId}` });
  };

  const categories = [
    { key: 'all', label: '全部' },
    { key: 'complaint', label: '吐槽' },
    { key: 'help', label: '求助' },
    { key: 'happy', label: '开心事' },
    { key: 'daily', label: '日常' }
  ];

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.title}>🌳 树洞</Text>
        
        <ScrollView 
          className={styles.filters} 
          scrollX 
          enableFlex
        >
          {categories.map(cat => (
            <View
              key={cat.key}
              className={classnames(
                styles.filterItem,
                category === cat.key && styles.filterActive
              )}
              onClick={() => setCategory(cat.key as CategoryType)}
            >
              {cat.label}
            </View>
          ))}
        </ScrollView>

        <View className={styles.tabs}>
          <View 
            className={classnames(styles.tab, sortType === 'hot' && styles.tabActive)}
            onClick={() => setSortType('hot')}
          >
            🔥 热门
          </View>
          <View 
            className={classnames(styles.tab, sortType === 'latest' && styles.tabActive)}
            onClick={() => setSortType('latest')}
          >
            ⏰ 最新
          </View>
        </View>
      </View>

      <ScrollView 
        className={styles.content}
        scrollY
        enableFlex
        refresherEnabled
        refresherTriggered={refreshing}
        onRefresherRefresh={onRefresh}
      >
        {posts.length > 0 ? (
          posts.map(post => (
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
          <EmptyState
            icon='🌿'
            title='暂无内容'
            description='还没有人发布内容，快来成为第一个分享者吧~'
          />
        )}
      </ScrollView>
    </View>
  );
};

export default HomePage;
