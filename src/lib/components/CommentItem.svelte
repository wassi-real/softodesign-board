<script>
  import { supabase } from '$lib/supabase.js';
  import { user } from '$lib/stores.js';
  import { createEventDispatcher } from 'svelte';

  let { comment, formatTimeAgo, postId, depth = 0 } = $props();

  const dispatch = createEventDispatcher();

  let hasUpvoted = false;
  let loading = false;
  let showReplyForm = false;
  let replyText = '';
  let submitting = false;

  $effect(() => {
    if ($user && comment) {
      checkUpvoteStatus();
    }
  });

  async function checkUpvoteStatus() {
    if (!$user) return;
    
    try {
      const { data } = await supabase
        .from('comment_upvotes')
        .select('id')
        .eq('comment_id', comment.id)
        .eq('user_id', $user.id)
        .single();
      
      hasUpvoted = !!data;
    } catch (error) {
      hasUpvoted = false;
    }
  }

  async function toggleUpvote() {
    if (!$user || loading) return;
    
    loading = true;
    try {
      if (hasUpvoted) {
        const { error } = await supabase
          .from('comment_upvotes')
          .delete()
          .eq('comment_id', comment.id)
          .eq('user_id', $user.id);
        
        if (error) throw error;
        hasUpvoted = false;
        comment.upvotes--;
      } else {
        const { error } = await supabase
          .from('comment_upvotes')
          .insert([{
            comment_id: comment.id,
            user_id: $user.id
          }]);
        
        if (error) throw error;
        hasUpvoted = true;
        comment.upvotes++;
      }
    } catch (error) {
      console.error('Error toggling upvote:', error);
    } finally {
      loading = false;
    }
  }

  async function submitReply() {
    if (!$user || !replyText.trim()) return;

    submitting = true;
    try {
      const { error } = await supabase
        .from('comments')
        .insert([{
          post_id: postId,
          parent_id: comment.id,
          content: replyText.trim(),
          author_id: $user.id,
        }]);

      if (error) throw error;

      replyText = '';
      showReplyForm = false;
      dispatch('commentAdded');
    } catch (error) {
      console.error('Error submitting reply:', error);
    } finally {
      submitting = false;
    }
  }
</script>

<div class="comment-item" style="margin-left: {depth * 30}px;">
  <div class="comment-header">
    <div class="comment-meta">
             <strong>{comment.profiles?.username || 'Unknown'}</strong>
      <span class="comment-time">{formatTimeAgo(comment.created_at)}</span>
      {#if $user}
        <button 
          class="upvote-btn small" 
          class:upvoted={hasUpvoted}
          onclick={toggleUpvote}
          disabled={loading}
          title={hasUpvoted ? 'Remove upvote' : 'Upvote'}
        >
          ▲ {comment.upvotes}
        </button>
      {:else}
        <span class="upvote-btn small">▲ {comment.upvotes}</span>
      {/if}
    </div>
  </div>

  <div class="comment-content">
    {comment.content}
  </div>

  <div class="comment-actions">
    {#if $user && depth < 5}
      <button 
        class="reply-btn" 
        onclick={() => showReplyForm = !showReplyForm}
      >
        reply
      </button>
    {/if}
  </div>

  {#if showReplyForm}
    <div class="reply-form">
      <textarea
        bind:value={replyText}
        placeholder="Write a reply..."
        disabled={submitting}
        rows="2"
      ></textarea>
      <div class="reply-actions">
        <button 
          class="btn small" 
          onclick={submitReply}
          disabled={submitting || !replyText.trim()}
        >
          {submitting ? 'Posting...' : 'Reply'}
        </button>
        <button 
          class="btn-secondary small" 
          onclick={() => { showReplyForm = false; replyText = ''; }}
        >
          Cancel
        </button>
      </div>
    </div>
  {/if}

  {#if comment.children && comment.children.length > 0}
    <div class="comment-children">
      {#each comment.children as childComment}
        <svelte:self 
          comment={childComment} 
          {formatTimeAgo} 
          {postId}
          depth={depth + 1}
          on:commentAdded
        />
      {/each}
    </div>
  {/if}
</div>

<style>
  .comment-item {
    border-left: 2px solid var(--border);
    padding: 15px 0 15px 15px;
    margin-bottom: 10px;
  }

  .comment-header {
    margin-bottom: 8px;
  }

  .comment-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 12pt;
  }

  .comment-time {
    color: var(--text-muted);
  }

  .upvote-btn.small {
    font-size: 12pt;
    padding: 4px 8px;
    margin: 0;
  }

  .comment-content {
    font-size: 14pt;
    color: var(--text-primary);
    line-height: 1.5;
    margin-bottom: 10px;
    white-space: pre-wrap;
  }

  .comment-actions {
    margin-bottom: 10px;
  }

  .reply-btn {
    background: none;
    border: none;
    color: var(--accent);
    cursor: pointer;
    font-size: 12pt;
    text-decoration: underline;
  }

  .reply-btn:hover {
    color: var(--accent-hover);
  }

  .reply-form {
    background: var(--bg-tertiary);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 15px;
    margin: 10px 0;
  }

  .reply-form textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid var(--border);
    border-radius: 4px;
    font-size: 13pt;
    background: var(--bg-secondary);
    color: var(--text-primary);
    resize: vertical;
  }

  .reply-form textarea:focus {
    outline: none;
    border-color: var(--accent);
  }

  .reply-actions {
    margin-top: 10px;
    display: flex;
    gap: 8px;
  }

  .btn.small, .btn-secondary.small {
    padding: 6px 12px;
    font-size: 12pt;
  }

  .comment-children {
    margin-top: 10px;
  }
</style>
