<script>
  import { page } from '$app/stores';
  import { supabase } from '$lib/supabase.js';
  import { user } from '$lib/stores.js';
  import { onMount } from 'svelte';
  import Comments from '$lib/components/Comments.svelte';

  let post = null;
  let loading = true;
  let hasUpvoted = false;
  let upvoteLoading = false;

  $: postId = $page.params.id;

  onMount(() => {
    loadPost();
  });

  $: if ($user && post) {
    checkUpvoteStatus();
  }

      async function loadPost() {
      loading = true;
      try {
        // Get the post
        const { data: postData, error: postError } = await supabase
          .from('posts')
          .select('*')
          .eq('id', postId)
          .single();

        if (postError) {
          if (postError.code === 'PGRST116') {
            console.error('Post not found:', postId);
            post = null;
            return;
          }
          throw postError;
        }

        if (!postData) {
          console.error('No post data returned');
          post = null;
          return;
        }

        // Get the author profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, username')
          .eq('id', postData.author_id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error loading profile:', profileError);
        }

        // Combine post with profile (even if profile is null)
        post = {
          ...postData,
          profiles: profileData || { username: 'Unknown User' }
        };
      } catch (error) {
        console.error('Error loading post:', error);
        post = null;
      } finally {
        loading = false;
      }
    }

  async function checkUpvoteStatus() {
    if (!$user || !post) return;
    
    try {
      const { data } = await supabase
        .from('upvotes')
        .select('id')
        .eq('post_id', post.id)
        .eq('user_id', $user.id)
        .single();
      
      hasUpvoted = !!data;
    } catch (error) {
      hasUpvoted = false;
    }
  }

  async function toggleUpvote() {
    if (!$user || upvoteLoading) return;
    
    upvoteLoading = true;
    try {
      if (hasUpvoted) {
        const { error } = await supabase
          .from('upvotes')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', $user.id);
        
        if (error) throw error;
        hasUpvoted = false;
        post.upvotes--;
      } else {
        const { error } = await supabase
          .from('upvotes')
          .insert([{
            post_id: post.id,
            user_id: $user.id
          }]);
        
        if (error) throw error;
        hasUpvoted = true;
        post.upvotes++;
      }
    } catch (error) {
      console.error('Error toggling upvote:', error);
    } finally {
      upvoteLoading = false;
    }
  }

  function formatTimeAgo(dateString) {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInMinutes = Math.floor((now - postDate) / (1000 * 60));

    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} days ago`;
    
    return postDate.toLocaleDateString();
  }
</script>

<svelte:head>
  <title>{post?.title || 'Post'} - SoftoDesign Board</title>
</svelte:head>

{#if loading}
  <div style="text-align: center; padding: 40px; color: var(--text-muted);">
    Loading post...
  </div>
{:else if !post}
  <div style="text-align: center; padding: 40px; color: var(--text-muted);">
    Post not found.
  </div>
{:else}
  <div class="post-detail">
    <div class="post-header">
      <div style="display: flex; align-items: flex-start; gap: 15px;">
        <div class="upvote-section">
          {#if $user}
            <button 
              class="upvote-btn" 
              class:upvoted={hasUpvoted}
              onclick={toggleUpvote}
              disabled={upvoteLoading}
              title={hasUpvoted ? 'Remove upvote' : 'Upvote'}
            >
              ▲
            </button>
          {:else}
            <span class="upvote-btn">▲</span>
          {/if}
          <div class="upvote-count">{post.upvotes}</div>
        </div>
        
        <div class="post-content">
          <h1 class="post-title">{post.title}</h1>
          <div class="post-meta">
                         by <strong>{post.profiles?.username || 'Unknown'}</strong>  
            {formatTimeAgo(post.created_at)} | 
            <span class="group-tag">{post.group_name}</span>
          </div>
          
          {#if post.description}
            <div class="post-description">
              {post.description}
            </div>
          {/if}
        </div>
      </div>
    </div>

    <Comments postId={post.id} />
  </div>
{/if}

<style>
  .post-detail {
    max-width: 800px;
  }

  .post-header {
    background: var(--bg-tertiary);
    border: 2px solid var(--border);
    border-radius: 8px;
    padding: 25px;
    margin-bottom: 30px;
  }

  .upvote-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 50px;
  }

  .upvote-count {
    font-size: 14pt;
    font-weight: 600;
    color: var(--text-primary);
    margin-top: 5px;
  }

  .post-content {
    flex: 1;
  }

  .post-title {
    font-size: 24pt;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 15px 0;
    line-height: 1.3;
  }

  .post-meta {
    font-size: 14pt;
    color: var(--text-muted);
    margin-bottom: 20px;
  }

  .group-tag {
    background: var(--accent);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12pt;
    font-weight: 500;
  }

  .post-description {
    font-size: 16pt;
    color: var(--text-primary);
    line-height: 1.6;
    white-space: pre-wrap;
  }
</style>
