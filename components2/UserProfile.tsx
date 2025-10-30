/**
 * UserProfile - Client Component
 *
 * ✅ 本番でもStorybookでも同じファイルを使う
 * ✅ データはpropsで受け取るだけ（データ取得の責務はない）
 * ✅ UIロジックとインタラクションに集中
 */
'use client';

import { useState } from 'react';

export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}

interface UserProfileProps {
  user: User;
  onEdit?: () => void;
}

export function UserProfile({ user, onEdit }: UserProfileProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '20px',
      maxWidth: '400px',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: '0 0 10px 0', fontSize: '20px' }}>{user.name}</h2>
        {onEdit && (
          <button
            onClick={onEdit}
            style={{
              padding: '6px 12px',
              background: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            編集
          </button>
        )}
      </div>

      <p style={{ margin: '5px 0', color: '#666' }}>@{user.username}</p>
      <p style={{ margin: '5px 0', color: '#666' }}>{user.email}</p>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          marginTop: '15px',
          padding: '8px 16px',
          background: 'transparent',
          border: '1px solid #0070f3',
          color: '#0070f3',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        {isExpanded ? '詳細を閉じる' : '詳細を見る'}
      </button>

      {isExpanded && (
        <div style={{
          marginTop: '15px',
          padding: '15px',
          background: '#f5f5f5',
          borderRadius: '4px',
        }}>
          <p style={{ margin: '5px 0' }}><strong>ID:</strong> {user.id}</p>
          <p style={{ margin: '5px 0' }}><strong>Full Name:</strong> {user.name}</p>
          <p style={{ margin: '5px 0' }}><strong>Username:</strong> {user.username}</p>
          <p style={{ margin: '5px 0' }}><strong>Email:</strong> {user.email}</p>
        </div>
      )}
    </div>
  );
}
