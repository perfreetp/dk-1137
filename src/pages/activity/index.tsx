import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useApp } from '../../components/AppProvider';
import styles from './index.module.scss';

type ActivityType = 'all' | 'comment' | 'hug' | 'collect';

interface ActivityItem {
  id: string;
  type: 'comment' | 'hug' | 'collect' | 'private';
  postId?: string;
  postContent?: string;
  content: string;
  time: string;
}

const ActivityPage: React.FC = () => {
  const { myComments, myCollections, privateMessages, blockedKeywords, getPost, user } = useApp();
  const [activeTab, setActiveTab] = useState<ActivityType>('all');
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    const items: ActivityItem[] = [];

    myComments.forEach(comment => {
      const post = getPost(comment.postId);
      if (post) {
        const postBlocked = blockedKeywords.length > 0 && 
          blockedKeywords.some(k => post.content.toLowerCase().includes(k.toLowerCase()));
        const commentBlocked = blockedKeywords.length > 0 && 
          blockedKeywords.some(k => comment.content.toLowerCase().includes(k.toLowerCase()));
        if (!postBlocked && !commentBlocked) {
          items.push({
            id: `comment_${comment.id}`,
            type: 'comment',
            postId: comment.postId,
            postContent: post.content,
            content: comment.content,
            time: comment.createdAt
          });
        }
      }
    });

    myCollections.forEach(post => {
      if (!post.isCollected) return;
      const postBlocked = blockedKeywords.length > 0 && 
        blockedKeywords.some(k => post.content.toLowerCase().includes(k.toLowerCase()));
      if (!postBlocked) {
        items.push({
          id: `collect_${post.id}`,
          type: 'collect',
          postId: post.id,
          postContent: post.content,
          content: `收藏了帖子`,
          time: post.createdAt
        });
      }
    });

    privateMessages.forEach(pm => {
      items.push({
        id: `private_${pm.id}`,
        type: 'private',
        content: pm.content,
        time: pm.createdAt
      });
    });

    items.sort((a, b) => {
      const dateA = new Date(a.time.replace(/\//g, '-')).getTime();
      const dateB = new Date(b.time.replace(/\//g, '-')).getTime();
      return dateB - dateA;
    });

    setActivities(items);
  }, [myComments, myCollections, privateMessages, blockedKeywords]);

  const filteredActivities = activeTab === 'all' 
    ? activities 
    : activities.filter(a => a.type === activeTab);

  const handleActivityClick = (activity: ActivityItem) => {
    if (activity.type === 'private') {
      const pm = privateMessages.find(m => m.id === activity.id.replace('private_', ''));
      if (pm) {
        Taro.navigateTo({ 
          url: `/pages/chat/index?fromId=${pm.fromUserId}&fromName=${encodeURIComponent(pm.fromAnonymousName || '')}` 
        });
      }
    } else if (activity.postId) {
      const postBlocked = blockedKeywords.length > 0 && 
        blockedKeywords.some(k => activity.postContent?.toLowerCase().includes(k.toLowerCase()));
      if (!postBlocked) {
        Taro.navigateTo({ url: `/pages/post-detail/index?id=${activity.postId}` });
      }
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'comment': return '💬 评论';
      case 'hug': return '🤗 拥抱';
      case 'collect': return '⭐ 收藏';
      case 'private': return '✉️ 私信';
      default: return '';
    }
  };

  const getTypeClass = (type: string) => {
    switch (type) {
      case 'comment': return styles.typeComment;
      case 'hug': return styles.typeHug;
      case 'collect': return styles.typeCollect;
      case 'private': return styles.typePrivate;
      default: return '';
    }
  };

  const tabs: { key: ActivityType; label: string }[] = [
    { key: 'all', label: '全部' },
    { key: 'comment', label: '评论' },
    { key: 'collect', label: '收藏' },
    { key: 'private', label: '私信' }
  ];

  return (
    <View className={styles.container}>
      <View className={styles.tabs}>
        {tabs.map(tab => (
          <View
            key={tab.key}
            className={classnames(styles.tab, activeTab === tab.key && styles.tabActive)}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </View>
        ))}
      </View>

      <ScrollView scrollY className={styles.list}>
        {filteredActivities.length > 0 ? (
          filteredActivities.map(activity => (
            <View 
              key={activity.id} 
              className={styles.activityCard}
              onClick={() => handleActivityClick(activity)}
            >
              <View className={styles.activityHeader}>
                <Text className={classnames(styles.activityType, getTypeClass(activity.type))}>
                  {getTypeLabel(activity.type)}
                </Text>
                <Text className={styles.activityTime}>{activity.time}</Text>
              </View>
              <Text className={styles.activityContent}>{activity.content}</Text>
              {activity.postPreview && (
                <View className={styles.postPreview}>
                  <Text numberOfLines={2}>{activity.postPreview}</Text>
                </View>
              )}
              {activity.type !== 'private' && activity.postContent && (
                <View className={styles.postPreview}>
                  <Text numberOfLines={2}>原帖：{activity.postContent}</Text>
                </View>
              )}
            </View>
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>👣</Text>
            <Text className={styles.emptyText}>还没有互动足迹</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ActivityPage;
