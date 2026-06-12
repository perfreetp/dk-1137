import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useApp } from '../../components/AppProvider';
import { Comment } from '../../types';
import styles from './index.module.scss';

const MyRepliesPage: React.FC = () => {
  const { myComments, getPost } = useApp();

  const handleGoToPost = (postId: string) => {
    Taro.navigateTo({ url: `/pages/post-detail/index?id=${postId}` });
  };

  return (
    <View className={styles.container}>
      <ScrollView scrollY className={styles.list}>
        {myComments.length > 0 ? (
          myComments.map(comment => {
            const post = getPost(comment.postId);
            return (
              <View 
                key={comment.id} 
                className={styles.replyCard}
                onClick={() => handleGoToPost(comment.postId)}
              >
                <View className={styles.replyHeader}>
                  <Text className={styles.replyUser}>我的回复</Text>
                  <Text className={styles.replyTime}>{comment.createdAt}</Text>
                </View>
                <Text className={styles.replyContent}>{comment.content}</Text>
                {post && (
                  <View className={styles.postPreview}>
                    <Text numberOfLines={1}>回复帖子：{post.content}</Text>
                  </View>
                )}
              </View>
            );
          })
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>💬</Text>
            <Text className={styles.emptyText}>还没有评论过内容</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default MyRepliesPage;
