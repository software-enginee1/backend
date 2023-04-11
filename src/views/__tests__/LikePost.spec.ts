import {nextTick} from 'vue'
import UserPost from '@/components/UserPost.vue'
import {likePost} from '@/plugins/firebaseDB'
import {shallowMount} from '@vue/test-utils';
import {describe, it, expect} from 'vitest'

describe('UserPost.vue', () => {
    it('calls likePost when like button is clicked', async () => {
        const wrapper = shallowMount(UserPost, {
            propsData: {
                author: 'Test Author',
                date: '04/05/2023',
                content: 'Test Content',
                likes: 0,
                postId: 'postId',
                userId: 'userId',
            },
        });

        // Find the like button and click it
        const likeButton = wrapper.find('[data-testid="like-button"]');
        await likeButton.trigger('click');

        // Wait for next DOM update
        await nextTick();

        // Expect that the likePost function has been called
        expect(likePost).toHaveBeenCalled();
    });
});
