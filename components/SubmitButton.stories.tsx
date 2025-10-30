/**
 * このストーリーは正常に動作します
 *
 * SubmitButtonはクライアントコンポーネントなので、
 * Storybookで問題なく表示できます
 */

import type { Meta, StoryObj } from '@storybook/react';
import { SubmitButton } from './SubmitButton';

const meta = {
  title: 'Working Examples/Submit Button (Client Component)',
  component: SubmitButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
### 正常に動作するクライアントコンポーネント

このコンポーネントは \`'use client'\` ディレクティブを使用した
クライアントコンポーネントです。

Storybookはクライアントコンポーネントを完全にサポートしているため、
このコンポーネントは問題なく表示・操作できます。

**注意:** useFormStatusを使用していますが、フォームコンテキスト外では
正しく動作しません（pendingは常にfalse）。
        `,
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <form>
        <Story />
      </form>
    ),
  ],
} satisfies Meta<typeof SubmitButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// このストーリーは正常に動作します
export const Default: Story = {};

export const WithinForm: Story = {
  decorators: [
    (Story) => (
      <form className="p-6 space-y-4 bg-white rounded-lg shadow">
        <input
          type="text"
          placeholder="Name"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        <Story />
      </form>
    ),
  ],
};
