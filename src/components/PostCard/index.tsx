import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { Post } from '../../types';
import styles from './index.module.scss';

interface PostCardProps {
  post: Post;
  onHug?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onCollect?: (postId: string) => void;
  onClick?: (postId: string) => void;
}

const categoryLabels = {
  complaint: '吐槽',
  help: '求助',
  happy: '开心事',
  daily: '日常'
};

const categoryColors = {
  complaint: styles.tagComplaint,
  help: styles.tagHelp,
  happy: styles.tagHappy,
  daily: styles.tagDaily
};

const PostCard: React.FC<PostCardProps> = ({
  post,
  onHug,
  onComment,
  onCollect,
  onClick
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(post.id);
    }
  };

  const handleHug = (e: any) => {
    e.stopPropagation();
    if (onHug) {
      onHug(post.id);
    }
  };

  const handleComment = (e: any) => {
    e.stopPropagation();
    if (onComment) {
      onComment(post.id);
    }
  };

  const handleCollect = (e: any) => {
    e.stopPropagation();
    if (onCollect) {
      onCollect(post.id);
    }
  };

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.header}>
        <View className={styles.avatar}>
          <Text className={styles.avatarText}>
            {post.anonymousName.slice(0, 1)}
          </Text>
        </View>
        <View className={styles.userInfo}>
          <Text className={styles.userName}>{post.anonymousName}</Text>
          <View className={styles.meta}>
            <Text className={classnames(styles.tag, categoryColors[post.category])}>
              {categoryLabels[post.category]}
            </Text>
            {post.visibility === 'department' && (
              <Text className={styles.visibilityTag}>仅同部门可见</Text>
            )}
          </View>
        </View>
        {post.topicName && (
          <View className={styles.topicBadge}>
            <Text className={styles.topicText}>#{post.topicName}</Text>
          </View>
        )}
      </View>

      <View className={styles.content}>
        <Text className={styles.text} numberOfLines={3}>
          {post.content}
        </Text>
      </View>

      {post.images && post.images.length > 0 && (
        <View className={styles.images}>
          {post.images.slice(0, 3).map((img, index) => (
            <Image
              key={index}
              src={img}
              className={styles.image}
              mode='aspectFill'
            />
          ))}
        </View>
      )}

      <View className={styles.actions}>
        <View
          className={classnames(styles.actionItem, post.isHugged && styles.actionActive)}
          onClick={handleHug}
        >
          <Text className={styles.actionIcon}>🤗</Text>
          <Text className={styles.actionCount}>{post.hugs}</Text>
        </View>
        <View className={styles.actionItem} onClick={handleComment}>
          <Text className={styles.actionIcon}>💬</Text>
          <Text className={styles.actionCount}>{post.comments}</Text>
        </View>
        <View
          className={classnames(styles.actionItem, post.isCollected && styles.actionActive)}
          onClick={handleCollect}
        >
          <Text className={styles.actionIcon}>⭐</Text>
          <Text className={styles.actionCount}>收藏</Text>
        </View>
        <View className={styles.time}>
          <Text className={styles.timeText}>{post.createdAt}</Text>
        </View>
      </View>
    </View>
  );
};

export default PostCard;
