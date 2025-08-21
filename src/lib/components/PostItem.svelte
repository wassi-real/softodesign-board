<script>
  import { supabase } from '$lib/supabase.js';
  import { user } from '$lib/stores.js';
  import { createEventDispatcher } from 'svelte';

  let { post, index, formatTimeAgo, onupvoteChanged = () => {} } = $props();

  const dispatch = createEventDispatcher();

  let hasUpvoted = false;
  let loading = false;

  // Check upvote status when user or post changes
  let lastUserId = null;
  let lastPostId = null;
  
  $effect(() => {
    const userId = $user?.id;
    const postId = post?.id;
    
    if (userId && postId && (userId !== lastUserId || postId !== lastPostId)) {
      lastUserId = userId;
      lastPostId = postId;
      checkUpvoteStatus();
    }
  });

  async function checkUpvoteStatus() {
    if (!$user) return;
    
    try {
      const { data } = await supabase
        .from('upvotes')
        .select('id')
        .eq('post_id', post.id)
        .eq('user_id', $user.id)
        .single();
      
      hasUpvoted = !!data;
    } catch (error) {
      // User hasn't upvoted this post
      hasUpvoted = false;
    }
  }

  async function toggleUpvote() {
    if (!$user || loading) return;
    
    loading = true;
    try {
      if (hasUpvoted) {
        // Remove upvote
        const { error } = await supabase
          .from('upvotes')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', $user.id);
        
        if (error) throw error;
        hasUpvoted = false;
      } else {
        // Add upvote
        const { error } = await supabase
          .from('upvotes')
          .insert([{
            post_id: post.id,
            user_id: $user.id
          }]);
        
        if (error) throw error;
        hasUpvoted = true;
      }
      
      onupvoteChanged();
    } catch (error) {
      console.error('Error toggling upvote:', error);
    } finally {
      loading = false;
    }
  }
</script>

<div class="post-item">
  <div style="display: flex; align-items: flex-start;">
    <div style="margin-right: 8px; display: flex; flex-direction: column; align-items: center; min-width: 20px;">
      <span style="color: var(--text-muted); font-size: 8pt; margin-bottom: 2px;">
        {index + 1}.
      </span>
      {#if $user}
        <button 
          class="upvote-btn" 
          class:upvoted={hasUpvoted}
          onclick={toggleUpvote}
          disabled={loading}
          title={hasUpvoted ? 'Remove upvote' : 'Upvote'}
        >
          ▲
        </button>
      {:else}
        <span class="upvote-btn" style="cursor: default;">▲</span>
      {/if}
    </div>
    
    <div style="flex: 1;">
      <div class="post-title">
        <a href="/post/{post.id}" class="post-link">{post.title}</a>
      </div>
      
      <div class="post-meta">
        {post.upvotes} points by {post.profiles?.username || 'Unknown'} 
        {formatTimeAgo(post.created_at)} | 
        <span style="color: var(--accent);">{post.group_name}</span> |
        <a href="/post/{post.id}" style="color: var(--text-muted);">comments</a>
      </div>
      
      {#if post.description}
        <div class="post-description">
          {post.description}
        </div>
      {/if}
    </div>
  </div>
</div>
