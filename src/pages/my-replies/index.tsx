import React, { useState, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useApp } from '../../components/AppProvider';
import { Comment } from '../../types';
import styles from './index.module.scss';

const MyRepliesPage: React.FC = () => {
  const { myComments, getPost, blockedKeywords } = useApp();
  const [filteredComments, setFilteredComments] = useState<Comment[]>([]);

  useEffect(() => {
    filterComments();
  }, [myComments, blockedKeywords]);

  const filterComments = () => {
    if (blockedKeywords.length === 0) {
      setFilteredComments(myComments);
    } else {
      const filtered = myComments.filter(comment => {
        const post = getPost(comment.postId);
        if (!post) return false;
        const postContent = post.content.toLowerCase();
        const commentContent = comment.content.toLowerCase();
        const postBlocked = blockedKeywords.some(keyword => postContent.includes(keyword.toLowerCase()));
        const commentBlocked = blockedKeywords.some(keyword => commentContent.includes(keyword.toLowerCase()));
        return !postBlocked && !commentBlocked;
      });
      setFilteredComments(filtered);
    }
  };

  const isPostBlocked = (postId: string) => {
    const post = getPost(postId);
    if (!post) return true;
    if (blockedKeywords.length === 0) return false;
    const content = post.content.toLowerCase();
    return blockedKeywords.some(keyword => content.includes(keyword.toLowerCase()));
  };

  const isCommentBlocked = (comment: Comment) => {
    if (blockedKeywords.length === 0) return false;
    const content = comment.content.toLowerCase();
    return blockedKeywords.some(keyword => content.includes(keyword.toLowerCase()));
  };

  const maskContent = (content: string) => {
    if (blockedKeywords.length === 0) return content;
    let masked = content;
    blockedKeywords.forEach(keyword => {
      const regex = new RegExp(keyword, 'gi');
      masked = masked.replace(regex, '***');
    });
    return masked;
  };

  const handleGoToPost = (postId: string) => {
    if (!isPostBlocked(postId)) {
      Taro.navigateTo({ url: `/pages/post-detail/index?id=${postId}` });
    }
  };

  return (
    <View className={styles.container}>
      {filteredComments.length > 0 ? (
        filteredComments.map(comment => {
          const post = getPost(comment.postId);
          const postBlocked = isPostBlocked(comment.postId);
          const commentBlocked = isCommentBlocked(comment);
          const showBlocked = postBlocked || commentBlocked;
          
          return (
            <View 
              key={comment.id} 
              className={styles.replyCard}
              onClick={() => !showBlocked && handleGoToPost(comment.postId)}
            >
              {showBlocked && (
                <View className={styles.blockedBadge}>
                  <Text className={styles.blockedText}>
                    {postBlocked ? '原帖已被屏蔽' : '回复已被屏蔽'}
                  </Text>
                </View>
              )}
              <View className={styles.replyHeader}>
                <Text className={styles.replyUser}>我的回复</Text>
                <Text className={styles.replyTime}>{comment.createdAt}</Text>
              </View>
              <Text className={styles.replyContent}>
                {commentBlocked ? maskContent(comment.content) : comment.content}
              </Text>
              {post && (
                <View className={styles.postPreview}>
                  <Text numberOfLines={postBlocked ? 1 : 2}>
                    {postBlocked ? '原帖已被屏蔽' : `回复帖子：${postBlocked ? '' : post.content}`}
                  </Text>
                </View>
              )}
            </View>
          );
        })
      ) : (
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>💬</Text>
          <Text className={styles.emptyText}>
            {blockedKeywords.length > 0 ? '当前设置了屏蔽词，部分内容已被过滤' : '还没有评论过内容'}
          </Text>
        </View>
      )}
    </View>
  );
};

export default MyRepliesPage;
