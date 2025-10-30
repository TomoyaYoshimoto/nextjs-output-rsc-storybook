/**
 * UserProfile Stories - Storybook
 *
 * ✅ components2/UserProfile.tsx と全く同じファイルを使用
 * ✅ 本番コードとの差分はゼロ
 * ✅ モックデータだけをStory側で用意
 */

import type { Meta, StoryObj } from '@storybook/react';
import { UserProfile } from './UserProfile';

const meta = {
  title: 'Production Pattern/UserProfile',
  component: UserProfile,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# 本番環境でのパターン

このコンポーネントは **本番でもStorybookでも全く同じファイル** を使用しています。

## 使い方

### 本番環境 (Next.js)
\`\`\`tsx
// app/users/[id]/page.tsx (Server Component)
async function UserPage({ params }: { params: { id: string } }) {
  const user = await fetchUser(params.id); // サーバー側でデータ取得
  return <UserProfile user={user} />;      // Client Componentに渡す
}
\`\`\`

### Storybook
\`\`\`tsx
// UserProfile.stories.tsx
export const Default: Story = {
  args: {
    user: { id: 1, name: 'Test User', ... } // モックデータを渡す
  }
};
\`\`\`

## 重要なポイント

- ✅ UserProfile.tsx は本番とStorybookで **同じファイル**
- ✅ データはpropsで受け取るだけ（データ取得の責務はない）
- ✅ UIロジックとインタラクションに集中
- ✅ コードの差分は生まれない
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    user: {
      description: '表示するユーザー情報',
    },
    onEdit: {
      description: '編集ボタンがクリックされた時のコールバック',
      action: 'onEdit',
    },
  },
} satisfies Meta<typeof UserProfile>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルトの表示
 *
 * 本番では: Server Componentでfetchしたデータを渡す
 * Storybookでは: このモックデータを渡す
 */
export const Default: Story = {
  args: {
    user: {
      id: 1,
      name: 'Leanne Graham',
      email: 'leanne@example.com',
      username: 'bret',
    },
  },
};

/**
 * 長い名前のユーザー
 */
export const LongName: Story = {
  args: {
    user: {
      id: 2,
      name: 'Ervin Howell with a Very Long Name That Might Cause Layout Issues',
      email: 'ervin.howell@example.com',
      username: 'antonette',
    },
  },
};

/**
 * 編集ボタンなし
 */
export const WithoutEditButton: Story = {
  args: {
    user: {
      id: 3,
      name: 'Clementine Bauch',
      email: 'clementine@example.com',
      username: 'samantha',
    },
    // onEdit を渡さない = 編集ボタンが表示されない
  },
};

/**
 * 編集ボタンあり（アクションをテスト）
 */
export const WithEditButton: Story = {
  args: {
    user: {
      id: 4,
      name: 'Patricia Lebsack',
      email: 'patricia@example.com',
      username: 'karianne',
    },
    onEdit: () => {
      alert('編集モードに切り替え（本番ではルーティングやモーダル表示など）');
    },
  },
};

/**
 * 複数のバリエーションを並べて表示
 */
export const AllVariations: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
      <UserProfile
        user={{
          id: 1,
          name: 'User 1',
          email: 'user1@example.com',
          username: 'user1',
        }}
      />
      <UserProfile
        user={{
          id: 2,
          name: 'User 2',
          email: 'user2@example.com',
          username: 'user2',
        }}
        onEdit={() => console.log('Edit User 2')}
      />
      <UserProfile
        user={{
          id: 3,
          name: 'User 3',
          email: 'user3@example.com',
          username: 'user3',
        }}
        onEdit={() => console.log('Edit User 3')}
      />
    </div>
  ),
};
