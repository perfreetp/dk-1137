import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useApp } from '../../components/AppProvider';
import PostCard from '../../components/PostCard';
import EmptyState from '../../components/EmptyState';
import { Post } from '../../types';
import styles from './index.module.scss';

type CategoryType = 'all' | 'complaint' | 'help' | 'happy' | 'daily';
type SortType = 'hot' | 'latest';

const HomePage: React.FC = () => {
  const { posts, blockedKeywords, updatePost } = useApp();
  const [category, setCategory] = useState<CategoryType>('all');
  const [sortType, setSortType] = useState<SortType>('latest');
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    filterAndSortPosts();
  }, [posts, category, sortType, blockedKeywords]);

  const filterAndSortPosts = () => {
    let result = [...posts];
    
    if (blockedKeywords.length > 0) {
      result = result.filter(post => {
        const content = post.content.toLowerCase();
        return !blockedKeywords.some(keyword => content.includes(keyword.toLowerCase()));
      });
    }
    
    if (category !== 'all') {
      result = result.filter(p => p.category === category);
    }

    if (sortType === 'hot') {
      result.sort((a, b) => b.hugs - a.hugs);
    } else {
      result.sort((a, b) => {
        const dateA = new Date(a.createdAt.replace(/\//g, '-')).getTime();
        const dateB = new Date(b.createdAt.replace(/\//g, '-')).getTime();
        return dateB - dateA;
      });
    }

    setFilteredPosts(result);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      filterAndSortPosts();
      setRefreshing(false);
      Taro.showToast({ title: '刷新成功', icon: 'success' });
    }, 1000);
  };

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
      Taro.showToast({
        title: post.isCollected ? '已取消收藏' : '已收藏',
        icon: 'success'
      });
    }
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
          <EmptyState
            icon='🌿'
            title='暂无内容'
            description={blockedKeywords.length > 0 
              ? '当前设置了屏蔽词，部分内容已被过滤' 
              : '还没有人发布内容，快来成为第一个分享者吧~'}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default HomePage;
