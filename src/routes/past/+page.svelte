<script>
  import PostList from '$lib/components/PostList.svelte';
  import { supabase } from '$lib/supabase.js';
  import { onMount } from 'svelte';

  let posts = [];
  let loading = true;
  let selectedGroup = 'all';

  onMount(() => {
    loadPastPosts();
  });

  $: if (selectedGroup) {
    loadPastPosts();
  }

    async function loadPastPosts() {
    loading = true;
    try {
      // Get posts older than 1 day
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      let postsQuery = supabase
        .from('posts')
        .select('*')
        .lt('created_at', oneDayAgo.toISOString())
        .order('created_at', { ascending: false });

      if (selectedGroup !== 'all') {
        postsQuery = postsQuery.eq('group_name', selectedGroup);
      }

      const { data: postsData, error: postsError } = await postsQuery;
      if (postsError) throw postsError;

      // Get profiles for the authors
      if (postsData && postsData.length > 0) {
        const authorIds = [...new Set(postsData.map(post => post.author_id))];
        
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username')
          .in('id', authorIds);

        if (profilesError) throw profilesError;

        // Combine posts with profile data
        posts = postsData.map(post => ({
          ...post,
          profiles: profilesData?.find(profile => profile.id === post.author_id)
        }));
      } else {
        posts = [];
      }
    } catch (error) {
      console.error('Error loading past posts:', error);
    } finally {
      loading = false;
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
  <title>Past Posts - SoftoDesign Board</title>
</svelte:head>

<h1 style="color: var(--text-primary); font-size: 14pt; margin-bottom: 20px;">Past Posts</h1>
<p style="color: var(--text-secondary); font-size: 9pt; margin-bottom: 20px;">
  Posts older than 24 hours
</p>

<div class="group-filter">
  <label for="group-select">Group:</label>
  <select id="group-select" bind:value={selectedGroup} onchange={loadPastPosts}>
    <option value="all">All Groups</option>
    <option value="general">general</option>
    <option value="tech">tech</option>
    <option value="design">design</option>
    <option value="business">business</option>
    <option value="random">random</option>
  </select>
</div>

{#if loading}
  <div style="text-align: center; padding: 20px; color: var(--text-muted);">
    Loading past posts...
  </div>
{:else if posts.length === 0}
  <div style="text-align: center; padding: 20px; color: var(--text-muted);">
    No past posts found.
  </div>
{:else}
  <div class="post-list">
    {#each posts as post, index}
      <div class="post-item">
        <div style="display: flex; align-items: flex-start;">
          <div style="margin-right: 8px; display: flex; flex-direction: column; align-items: center; min-width: 20px;">
            <span style="color: var(--text-muted); font-size: 8pt; margin-bottom: 2px;">
              {index + 1}.
            </span>
            <span class="upvote-btn" style="cursor: default;">▲</span>
          </div>
          
          <div style="flex: 1;">
            <div class="post-title">
              <a href="/post/{post.id}" class="post-link">{post.title}</a>
            </div>
            
            <div class="post-meta">
                             {post.upvotes} points by {post.profiles?.username || 'Unknown'}  
              {formatTimeAgo(post.created_at)} | 
              <span style="color: var(--accent);">{post.group_name}</span>
            </div>
            
            {#if post.description}
              <div class="post-description">
                {post.description}
              </div>
            {/if}
          </div>
        </div>
      </div>
    {/each}
  </div>
{/if}
