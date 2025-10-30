/**
 * ケースA の対策版ストーリー
 *
 * 変更点:
 * 1. async Server Component の代わりに Client Component を使用
 * 2. データを args として渡す
 * 3. Storybook で問題なく表示される
 */

import type { Meta, StoryObj } from '@storybook/react';
import { AsyncServerComponentClient } from './AsyncServerComponent.client';

const meta = {
  title: 'Workarounds/Case A: Async Component (Fixed)',
  component: AsyncServerComponentClient,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
### 対策: Client Component + Props

元の Async Server Component は Storybook で表示できませんが、
データを props として受け取る Client Component を作成することで解決できます。

#### 変更点

**Before (動かない):**
\`\`\`tsx
// AsyncServerComponent.tsx
export default async function AsyncServerComponent() {
  const user = await fetchUser(); // ❌ Storybookで動かない
  return <div>{user.name}</div>;
}
\`\`\`

**After (動く):**
\`\`\`tsx
// AsyncServerComponent.client.tsx
'use client';

interface Props {
  user: User;
}

export function AsyncServerComponentClient({ user }: Props) {
  return <div>{user.name}</div>; // ✅ Storybookで動く
}
\`\`\`

#### Next.jsでの使用方法

Server Component から Client Component を呼び出します：

\`\`\`tsx
// app/page.tsx (Server Component)
import { AsyncServerComponentClient } from './AsyncServerComponent.client';

export default async function Page() {
  const user = await fetchUser(); // サーバーでデータ取得
  return <AsyncServerComponentClient user={user} />; // Clientに渡す
}
\`\`\`

✅ Storybook でもモックデータを使って表示できます！
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AsyncServerComponentClient>;

export default meta;
type Story = StoryObj<typeof meta>;

// デフォルトのストーリー
export const Default: Story = {
  args: {
    user: {
      id: 1,
      name: 'Leanne Graham',
      email: 'leanne@example.com',
    },
  },
};

// 別のユーザーデータ
export const AnotherUser: Story = {
  args: {
    user: {
      id: 2,
      name: 'Ervin Howell',
      email: 'ervin@example.com',
    },
  },
};

// 長い名前のケース
export const LongName: Story = {
  args: {
    user: {
      id: 3,
      name: 'Clementine Bauch-Anderson III',
      email: 'clementine.bauch.anderson@very-long-domain-name.com',
    },
  },
};
