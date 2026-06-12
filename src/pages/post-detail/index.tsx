import React, { useState, useEffect } from 'react';
import { View, Text, Image, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useApp } from '../../components/AppProvider';
import { Post, Comment } from '../../types';
import styles from './index.module.scss';

const categoryLabels: Record<string, string> = {
  complaint: '吐槽',
  help: '求助',
  happy: '开心事',
  daily: '日常'
};

const categoryColors: Record<string, string> = {
  complaint: styles.tagComplaint,
  help: styles.tagHelp,
  happy: styles.tagHappy,
  daily: styles.tagDaily
};

const PostDetailPage: React.FC = () => {
  const { getPost, getComments, user, updatePost, comments: allComments, addComment } = useApp();
  const [post, setPost] = useState<Post | null>(null);
  const [commentList, setCommentList] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    const { id } = Taro.getCurrentInstance().router?.params || {};
    if (id) {
      const foundPost = getPost(id);
      if (foundPost) {
        setPost(foundPost);
        setCommentList(getComments(id));
      }
    }
  }, []);

  useEffect(() => {
    if (post) {
      const currentPost = getPost(post.id);
      if (currentPost) {
        setPost(currentPost);
      }
      setCommentList(getComments(post.id));
    }
  }, [allComments]);

  const handleHug = () => {
    if (post) {
      updatePost(post.id, {
        hugs: post.isHugged ? post.hugs - 1 : post.hugs + 1,
        isHugged: !post.isHugged
      });
      setPost({
        ...post,
        hugs: post.isHugged ? post.hugs - 1 : post.hugs + 1,
        isHugged: !post.isHugged
      });
      Taro.showToast({
        title: post.isHugged ? '收回拥抱' : '送出拥抱 🤗',
        icon: 'success'
      });
    }
  };

  const handleCollect = () => {
    if (post) {
      updatePost(post.id, { isCollected: !post.isCollected });
      setPost({ ...post, isCollected: !post.isCollected });
      Taro.showToast({
        title: post.isCollected ? '已取消收藏' : '已收藏',
        icon: 'success'
      });
    }
  };

  const handleReport = () => {
    Taro.showModal({
      title: '举报',
      content: '确定要举报这篇内容吗？',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '举报成功', icon: 'success' });
        }
      }
    });
  };

  const handleSendComment = () => {
    if (!commentText.trim()) {
      Taro.showToast({ title: '请输入评论', icon: 'none' });
      return;
    }

    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      postId: post?.id || '',
      userId: user.id,
      anonymousName: user.anonymousName,
      content: commentText.trim(),
      createdAt: new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(/\//g, '-')
    };

    addComment(post?.id || '', newComment);
    setCommentText('');
    Taro.showToast({ title: '评论成功', icon: 'success' });
  };

  if (!post) {
    return (
      <View style={{ padding: '100rpx', textAlign: 'center' }}>
        <Text style={{ color: '#999' }}>加载中...</Text>
      </View>
    );
  }

  return (
    <View className={styles.container}>
      <ScrollView scrollY>
        <View className={styles.postSection}>
          <View className={styles.postCard}>
            <View className={styles.postHeader}>
              <View className={styles.avatar}>
                <Text className={styles.avatarText}>
                  {post.anonymousName.charAt(0)}
                </Text>
              </View>
              <View className={styles.userInfo}>
                <Text className={styles.userName}>{post.anonymousName}</Text>
                <View className={styles.meta}>
                  <Text className={classnames(styles.tag, categoryColors[post.category])}>
                    {categoryLabels[post.category]}
                  </Text>
                  {post.visibility === 'department' && (
                    <Text className={styles.visibilityTag}>仅同部门外可见</Text>
                  )}
                </View>
              </View>
              <Text className={styles.postTime}>{post.createdAt}</Text>
            </View>

            {post.topicName && (
              <View style={{ marginBottom: '16rpx' }}>
                <Text className={styles.topicBadge}>#{post.topicName}</Text>
              </View>
            )}

            <Text className={styles.postContent}>{post.content}</Text>

            {post.images && post.images.length > 0 && (
              <View className={styles.postImages}>
                {post.images.map((img, index) => (
                  <Image
                    key={index}
                    src={img}
                    className={styles.postImage}
                    mode='aspectFill'
                  />
                ))}
              </View>
            )}

            <View className={styles.postActions}>
              <View 
                className={classnames(styles.actionItem, post.isHugged && styles.actionActive)}
                onClick={handleHug}
              >
                <Text className={styles.actionIcon}>🤗</Text>
                <Text className={styles.actionCount}>{post.hugs}</Text>
              </View>
              <View 
                className={classnames(styles.actionItem, post.isCollected && styles.actionActive)}
                onClick={handleCollect}
              >
                <Text className={styles.actionIcon}>⭐</Text>
                <Text className={styles.actionCount}>收藏</Text>
              </View>
              <View className={styles.reportButton} onClick={handleReport}>
                <Text className={styles.reportText}>🚩 举报</Text>
              </View>
            </View>
          </View>
        </View>

        <View className={styles.commentsSection}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>评论</Text>
            <Text className={styles.commentCount}>{commentList.length}条评论</Text>
          </View>

          {commentList.length > 0 ? (
            <View className={styles.commentList}>
              {commentList.map(comment => (
                <View key={comment.id} className={styles.commentItem}>
                  <View className={styles.commentHeader}>
                    <View className={styles.commentAvatar}>
                      <Text className={styles.commentAvatarText}>
                        {comment.anonymousName.charAt(0)}
                      </Text>
                    </View>
                    <Text className={styles.commentUserName}>{comment.anonymousName}</Text>
                    <Text className={styles.commentTime}>{comment.createdAt}</Text>
                  </View>
                  <Text className={styles.commentContent}>{comment.content}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View className={styles.emptyComments}>
              <Text className={styles.emptyIcon}>💬</Text>
              <Text className={styles.emptyText}>还没有评论，快来抢沙发~</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View className={styles.bottomBar}>
        <View className={styles.inputWrapper}>
          <Input
            className={styles.inputField}
            placeholder='说点什么...'
            value={commentText}
            onInput={(e) => setCommentText(e.detail.value)}
            onConfirm={handleSendComment}
          />
        </View>
        <View 
          className={styles.sendButton}
          onClick={handleSendComment}
        >
          发送
        </View>
      </View>
    </View>
  );
};

export default PostDetailPage;
