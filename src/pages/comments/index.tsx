import React, { useState, useEffect } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useApp } from '../../components/AppProvider';
import { Comment } from '../../types';
import styles from './index.module.scss';

const CommentsPage: React.FC = () => {
  const { getPost, getComments, addComment, user, comments: allComments } = useApp();
  const [postId, setPostId] = useState<string>('');
  const [post, setPost] = useState<any>(null);
  const [commentList, setCommentList] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    const { postId: pid } = Taro.getCurrentInstance().router?.params || {};
    if (pid) {
      setPostId(pid);
      const foundPost = getPost(pid);
      if (foundPost) {
        setPost(foundPost);
        setCommentList(getComments(pid));
      }
    }
  }, []);

  useEffect(() => {
    if (postId) {
      setCommentList(getComments(postId));
    }
  }, [allComments, postId]);

  const handleSend = () => {
    if (!commentText.trim()) {
      Taro.showToast({ title: '请输入评论内容', icon: 'none' });
      return;
    }

    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      postId,
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

    addComment(postId, newComment);
    setCommentText('');
    Taro.showToast({ title: '评论成功', icon: 'success' });
    
    setTimeout(() => {
      Taro.navigateBack();
    }, 1000);
  };

  return (
    <View className={styles.container}>
      {post && (
        <View className={styles.postPreview}>
          <Text className={styles.previewLabel}>评论帖子</Text>
          <Text className={styles.previewContent} numberOfLines={2}>
            {post.content}
          </Text>
        </View>
      )}

      <ScrollView className={styles.commentsList} scrollY>
        <Text className={styles.commentsTitle}>全部评论 ({commentList.length})</Text>
        {commentList.length > 0 ? (
          commentList.map(comment => (
            <View key={comment.id} className={styles.commentItem}>
              <View className={styles.commentHeader}>
                <View className={styles.avatar}>
                  <Text className={styles.avatarText}>
                    {comment.anonymousName.charAt(0)}
                  </Text>
                </View>
                <View className={styles.commentInfo}>
                  <Text className={styles.userName}>{comment.anonymousName}</Text>
                  <Text className={styles.commentTime}>{comment.createdAt}</Text>
                </View>
              </View>
              <Text className={styles.commentContent}>{comment.content}</Text>
            </View>
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>💬</Text>
            <Text className={styles.emptyText}>还没有评论，快来抢沙发~</Text>
          </View>
        )}
      </ScrollView>

      <View className={styles.inputBar}>
        <Input
          className={styles.input}
          placeholder='写下你的评论...'
          value={commentText}
          onInput={(e) => setCommentText(e.detail.value)}
          onConfirm={handleSend}
        />
        <View className={styles.sendButton} onClick={handleSend}>
          <Text className={styles.sendText}>发送</Text>
        </View>
      </View>
    </View>
  );
};

export default CommentsPage;
