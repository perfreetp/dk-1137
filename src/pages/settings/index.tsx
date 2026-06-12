import React, { useState } from 'react';
import { View, Text, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { mockBlockedKeywords, mockCurrentUser } from '../../data/users';
import styles from './index.module.scss';

const SettingsPage: React.FC = () => {
  const [nickname, setNickname] = useState(mockCurrentUser.anonymousName);
  const [blockedKeywords, setBlockedKeywords] = useState(mockBlockedKeywords);
  const [newKeyword, setNewKeyword] = useState('');

  const handleNicknameSave = () => {
    if (nickname.trim()) {
      Taro.showToast({ title: '保存成功', icon: 'success' });
    }
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      setBlockedKeywords([...blockedKeywords, newKeyword.trim()]);
      setNewKeyword('');
      Taro.showToast({ title: '添加成功', icon: 'success' });
    }
  };

  const handleRemoveKeyword = (index: number) => {
    const newList = [...blockedKeywords];
    newList.splice(index, 1);
    setBlockedKeywords(newList);
    Taro.showToast({ title: '已移除', icon: 'success' });
  };

  const handleClearCache = () => {
    Taro.showModal({
      title: '清除缓存',
      content: '确定要清除所有缓存吗？',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '缓存已清除', icon: 'success' });
        }
      }
    });
  };

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.title}>⚙️ 设置</Text>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>基本信息</Text>
        <View className={styles.inputItem}>
          <Text className={styles.inputLabel}>匿名昵称</Text>
          <Input
            className={styles.inputField}
            value={nickname}
            onInput={(e) => setNickname(e.detail.value)}
            placeholder='设置你的匿名昵称'
          />
        </View>
        <View 
          style={{ padding: '24rpx', background: '#F8F4FF' }}
          onClick={handleNicknameSave}
        >
          <Text style={{ color: '#7B68EE', textAlign: 'center', fontSize: '28rpx' }}>
            保存昵称
          </Text>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>关键词屏蔽</Text>
        <View className={styles.blockedList}>
          {blockedKeywords.map((keyword, index) => (
            <View key={index} className={styles.blockedItem}>
              <Text className={styles.blockedWord}>{keyword}</Text>
              <Text 
                className={styles.removeButton}
                onClick={() => handleRemoveKeyword(index)}
              >
                删除
              </Text>
            </View>
          ))}
          <View style={{ display: 'flex', gap: '12rpx', marginTop: '16rpx' }}>
            <Input
              style={{
                flex: 1,
                height: '80rpx',
                background: '#F8F4FF',
                borderRadius: '8rpx',
                padding: '0 24rpx',
                fontSize: '28rpx'
              }}
              value={newKeyword}
              onInput={(e) => setNewKeyword(e.detail.value)}
              placeholder='添加屏蔽词'
            />
            <View 
              style={{
                padding: '0 32rpx',
                background: '#7B68EE',
                borderRadius: '8rpx',
                display: 'flex',
                alignItems: 'center'
              }}
              onClick={handleAddKeyword}
            >
              <Text style={{ color: '#fff', fontSize: '28rpx' }}>添加</Text>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>其他设置</Text>
        <View className={styles.settingItem}>
          <Text className={styles.settingLabel}>清除缓存</Text>
          <View onClick={handleClearCache}>
            <Text className={styles.settingValue}>点击清除</Text>
            <Text className={styles.settingArrow}> ›</Text>
          </View>
        </View>
        <View className={styles.settingItem}>
          <Text className={styles.settingLabel}>关于树洞</Text>
          <View>
            <Text className={styles.settingValue}>v1.0.0</Text>
            <Text className={styles.settingArrow}> ›</Text>
          </View>
        </View>
      </View>

      <View className={styles.dangerZone}>
        <View className={styles.dangerItem}>
          <Text className={styles.dangerText}>退出登录</Text>
        </View>
        <View className={styles.dangerItem}>
          <Text className={styles.dangerText}>注销账号</Text>
        </View>
      </View>
    </View>
  );
};

export default SettingsPage;
