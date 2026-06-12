import React, { useState } from 'react';
import { View, Text, Textarea, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useApp } from '../../store/AppContext';
import { mockTopics } from '../../data/topics';
import { Topic, Post } from '../../types';
import styles from './index.module.scss';

type CategoryType = 'complaint' | 'help' | 'happy' | 'daily';
type VisibilityType = 'department' | 'park';

const categoryLabels: Record<CategoryType, string> = {
  complaint: '吐槽',
  help: '求助',
  happy: '开心事',
  daily: '日常'
};

const visibilityLabels: Record<VisibilityType, string> = {
  department: '仅同部门外可见',
  park: '全园区可见'
};

const PublishPage: React.FC = () => {
  const { user, addPost } = useApp();
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [category, setCategory] = useState<CategoryType>('daily');
  const [visibility, setVisibility] = useState<VisibilityType>('park');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [showTopicPicker, setShowTopicPicker] = useState(false);

  const handleAddImage = () => {
    if (images.length >= 9) {
      Taro.showToast({ title: '最多上传9张图片', icon: 'none' });
      return;
    }
    Taro.chooseImage({
      count: 9 - images.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        setImages([...images, ...res.tempFilePaths]);
      }
    });
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSubmit = () => {
    if (!content.trim()) {
      Taro.showToast({ title: '请输入内容', icon: 'none' });
      return;
    }
    
    Taro.showLoading({ title: '发布中...' });
    
    const newPost: Post = {
      id: `post_${Date.now()}`,
      userId: user.id,
      anonymousName: user.anonymousName,
      content: content.trim(),
      images: images.length > 0 ? images : undefined,
      category,
      visibility,
      topicId: selectedTopic?.id,
      topicName: selectedTopic?.name,
      hugs: 0,
      comments: 0,
      isHugged: false,
      isCollected: false,
      createdAt: new Date().toLocaleString('zh-CN', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(/\//g, '-')
    };

    setTimeout(() => {
      addPost(newPost);
      Taro.hideLoading();
      Taro.showToast({ title: '发布成功', icon: 'success' });
      setTimeout(() => {
        Taro.switchTab({ url: '/pages/home/index' });
      }, 1500);
    }, 800);
  };

  const categories: CategoryType[] = ['complaint', 'help', 'happy', 'daily'];
  const visibilities: { key: VisibilityType; label: string }[] = [
    { key: 'department', label: '仅同部门可见' },
    { key: 'park', label: '全园区可见' }
  ];

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.title}>✨ 发布树洞</Text>
      </View>

      <View className={styles.content}>
        <View className={styles.inputArea}>
          <Textarea
            className={styles.textarea}
            placeholder='今天想说什么？在这里倾诉，不需要顾虑太多...'
            maxlength={2000}
            value={content}
            onInput={(e) => setContent(e.detail.value)}
          />
        </View>

        <View className={styles.imageSection}>
          <Text className={styles.sectionTitle}>上传图片</Text>
          <View className={styles.imageList}>
            {images.map((img, index) => (
              <View key={index} className={styles.imageItem}>
                <Image src={img} className={styles.image} mode='aspectFill' />
                <View 
                  className={styles.removeImage}
                  onClick={() => handleRemoveImage(index)}
                >
                  ×
                </View>
              </View>
            ))}
            {images.length < 9 && (
              <View className={styles.addImage} onClick={handleAddImage}>
                <Text className={styles.addImageIcon}>+</Text>
                <Text className={styles.addImageText}>添加图片</Text>
              </View>
            )}
          </View>
        </View>

        <View className={styles.optionsSection}>
          <View className={styles.optionRow}>
            <Text className={styles.optionLabel}>选择分类</Text>
            <View className={styles.categoryOptions}>
              {categories.map(cat => (
                <View
                  key={cat}
                  className={classnames(
                    styles.categoryItem,
                    category === cat && styles.categoryItemActive
                  )}
                  onClick={() => setCategory(cat)}
                >
                  {categoryLabels[cat]}
                </View>
              ))}
            </View>
          </View>

          <View className={styles.optionRow}>
            <Text className={styles.optionLabel}>可见范围</Text>
            <View className={styles.visibilityOptions}>
              {visibilities.map(vis => (
                <View
                  key={vis.key}
                  className={classnames(
                    styles.visibilityItem,
                    visibility === vis.key && styles.visibilityItemActive
                  )}
                  onClick={() => setVisibility(vis.key)}
                >
                  {vis.label}
                </View>
              ))}
            </View>
          </View>
        </View>

        <View className={styles.topicSection}>
          <Text className={styles.sectionTitle}>关联话题（可选）</Text>
          <View 
            className={styles.topicInput}
            onClick={() => setShowTopicPicker(!showTopicPicker)}
          >
            {selectedTopic ? `#${selectedTopic.name}` : '选择一个话题'}
          </View>
          {showTopicPicker && (
            <View style={{ marginTop: '16rpx' }}>
              {mockTopics.slice(0, 4).map(topic => (
                <View
                  key={topic.id}
                  style={{
                    padding: '16rpx',
                    background: selectedTopic?.id === topic.id ? '#F0EBFF' : '#F8F4FF',
                    borderRadius: '8rpx',
                    marginBottom: '8rpx'
                  }}
                  onClick={() => {
                    setSelectedTopic(topic);
                    setShowTopicPicker(false);
                  }}
                >
                  <Text style={{ color: '#7B68EE' }}>#{topic.name}</Text>
                  <Text style={{ color: '#999', fontSize: '22rpx', marginLeft: '12rpx' }}>
                    {topic.postCount}篇帖子
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>

      <View className={styles.submitSection}>
        <button
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={!content.trim()}
        >
          发布树洞
        </button>
      </View>
    </View>
  );
};

export default PublishPage;
