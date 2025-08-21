<script>
  import { supabase } from '$lib/supabase.js';
  import { user } from '$lib/stores.js';
  import { onMount } from 'svelte';
  import CommentItem from './CommentItem.svelte';

  let { postId } = $props();

  let comments = [];
  let newComment = '';
  let loading = false;
  let submitting = false;

  onMount(() => {
    loadComments();
  });

    async function loadComments() {
    loading = true;
    try {
      // Get comments
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (commentsError) throw commentsError;

      // Get profiles for comment authors
      if (commentsData && commentsData.length > 0) {
        const authorIds = [...new Set(commentsData.map(comment => comment.author_id))];
        
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username')
          .in('id', authorIds);

        if (profilesError) throw profilesError;

        // Combine comments with profile data
        const commentsWithProfiles = commentsData.map(comment => ({
          ...comment,
          profiles: profilesData?.find(profile => profile.id === comment.author_id)
        }));

        // Build comment tree
        comments = buildCommentTree(commentsWithProfiles);
      } else {
        comments = [];
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      loading = false;
    }
  }

  function buildCommentTree(flatComments) {
    const commentMap = new Map();
    const rootComments = [];

    // First pass: create all comment objects
    flatComments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, children: [] });
    });

    // Second pass: build the tree
    flatComments.forEach(comment => {
      const commentObj = commentMap.get(comment.id);
      if (comment.parent_id) {
        const parent = commentMap.get(comment.parent_id);
        if (parent) {
          parent.children.push(commentObj);
        }
      } else {
        rootComments.push(commentObj);
      }
    });

    return rootComments;
  }

  async function submitComment(parentId = null) {
    if (!$user || !newComment.trim()) return;

    submitting = true;
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([{
          post_id: postId,
          parent_id: parentId,
          content: newComment.trim(),
          author_id: $user.id,
        }])
        .select()
        .single();

      if (error) throw error;

      newComment = '';
      await loadComments();
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      submitting = false;
    }
  }

  function formatTimeAgo(dateString) {
    const now = new Date();
    const commentDate = new Date(dateString);
    const diffInMinutes = Math.floor((now - commentDate) / (1000 * 60));

    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  }
</script>

<div class="comments-section">
  <h3>Comments ({comments.length})</h3>

  {#if $user}
    <div class="comment-form">
      <textarea
        bind:value={newComment}
        placeholder="Add a comment..."
        disabled={submitting}
        rows="3"
      ></textarea>
      <div style="margin-top: 10px;">
        <button 
          class="btn" 
          onclick={() => submitComment()}
          disabled={submitting || !newComment.trim()}
        >
          {submitting ? 'Posting...' : 'Post Comment'}
        </button>
      </div>
    </div>
  {/if}

  {#if loading}
    <div style="text-align: center; padding: 20px; color: var(--text-muted);">
      Loading comments...
    </div>
  {:else if comments.length === 0}
    <div style="text-align: center; padding: 20px; color: var(--text-muted);">
      No comments yet. Be the first to comment!
    </div>
  {:else}
    <div class="comments-list">
      {#each comments as comment}
        <CommentItem 
          {comment} 
          {formatTimeAgo} 
          {postId}
          on:commentAdded={loadComments}
        />
      {/each}
    </div>
  {/if}
</div>

<style>
  .comments-section {
    margin-top: 30px;
    border-top: 2px solid var(--border);
    padding-top: 20px;
  }

  .comments-section h3 {
    font-size: 16pt;
    color: var(--text-primary);
    margin-bottom: 20px;
  }

  .comment-form {
    background: var(--bg-tertiary);
    border: 2px solid var(--border);
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 25px;
  }

  .comment-form textarea {
    width: 100%;
    padding: 12px;
    border: 2px solid var(--border);
    border-radius: 6px;
    font-size: 14pt;
    background: var(--bg-secondary);
    color: var(--text-primary);
    resize: vertical;
  }

  .comment-form textarea:focus {
    outline: none;
    border-color: var(--accent);
  }

  .comments-list {
    margin-top: 20px;
  }
</style>
