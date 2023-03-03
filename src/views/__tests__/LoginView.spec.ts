import { describe, it, expect, beforeEach } from 'vitest'

import { mount } from '@vue/test-utils'
import LoginView from '@/views/LoginView.vue'
import { createPinia, setActivePinia } from 'pinia'

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('Login', () => {
  it('renders properly', () => {
    const wrapper = mount(LoginView)
    expect(wrapper.text()).toContain('Login')
  })
})
