// tests/unit/components/SearchView.spec.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import SearchView from '@/views/SearchView.vue'

describe('SearchView.vue', () => {
    it('renders search input', () => {
        const wrapper = mount(SearchView)
        const input = wrapper.find('input')
        expect(input.exists()).toBe(true)
    })
    it('displays "No results found." when searchResults is empty', () => {
        const wrapper = mount(SearchView)
        const noResults = wrapper.find('span')
        expect(noResults.text()).toBe('No results found.')
    })

    it('displays "Loading..." when search is in progress', async () => {
        const wrapper = mount(SearchView)
        wrapper.vm.searchInProgress = true
        await nextTick()

        const loading = wrapper.find('span')
        expect(loading.text()).toBe('Loading...')
    })

    it('displays search results when searchResults has items', async () => {
        const wrapper = mount(SearchView)

        wrapper.vm.searchResults = [
            {
                id: '1',
                name: 'John Doe',

            },
            {
                id: '2',
                name: 'Jane Doe',

            }
        ]
        await nextTick()

        const searchResults = wrapper.findAll('.custom-card')
        expect(searchResults.length).toBe(2)
    })
    it('updates search results when searchQuery is changed', async () => {
        const wrapper = mount(SearchView)

        // You'll need to mock the API response here with the actual data
        const mockedSearchResults = [
            { id: '1', name: 'User One', email: 'user.one@example.com' },
            { id: '2', name: 'User Two', email: 'user.two@example.com' }
        ]

        // Mock the searchUsers method
        wrapper.vm.searchUsers = async () => {
            wrapper.vm.searchResults = mockedSearchResults
            await nextTick()
        }

        const input = wrapper.find('input')
        await input.setValue('User')
        await wrapper.vm.searchUsers()

        expect(wrapper.vm.searchResults.length).toBe(2)
    })


    // Add more tests as needed
})
