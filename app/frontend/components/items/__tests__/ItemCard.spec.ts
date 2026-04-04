import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import ItemCard from '../ItemCard.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/:pathMatch(.*)*', component: { template: '<div/>' } }],
})

const item = {
  id: 1,
  title: 'テストタイトル',
  content: 'テストコンテンツ',
  tag_names: 'ruby',
  tags: [{ id: 1, name: 'ruby' }],
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
}

describe('ItemCard', () => {
  it('タイトルとコンテンツを表示する', async () => {
    const wrapper = mount(ItemCard, {
      props: { item },
      global: { plugins: [router] },
    })
    expect(wrapper.text()).toContain('テストタイトル')
    expect(wrapper.text()).toContain('テストコンテンツ')
  })

  it('タグを表示する', async () => {
    const wrapper = mount(ItemCard, {
      props: { item },
      global: { plugins: [router] },
    })
    expect(wrapper.text()).toContain('ruby')
  })

  it('詳細ページへのリンクを持つ', async () => {
    const wrapper = mount(ItemCard, {
      props: { item },
      global: { plugins: [router] },
    })
    expect(wrapper.find('a').attributes('href')).toBe('/items/1')
  })
})
