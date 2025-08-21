<script>
  import { supabase } from '$lib/supabase.js';
  import { user } from '$lib/stores.js';
  import { onMount } from 'svelte';
  import PostItem from './PostItem.svelte';

  let { selectedGroup = 'all' } = $props();

  let posts = $state([]);
  let groups = ['general', 'tech', 'design', 'business', 'random'];
  let loading = $state(false);

  onMount(() => {
    console.log('🎯 onMount() called');
    loadPosts();
  });

  // Reload posts when group changes
  let prevSelectedGroup = selectedGroup;
  $effect(() => {
    console.log('🔄 Group change effect - selectedGroup:', selectedGroup, 'prevSelectedGroup:', prevSelectedGroup);
    if (selectedGroup !== prevSelectedGroup) {
      console.log('🔄 Group changed, reloading posts...');
      prevSelectedGroup = selectedGroup;
      loadPosts();
    }
  });

  // No navigation effect - we'll handle navigation differently

  async function loadPosts() {
    console.log('🔄 loadPosts() called');
    console.log('📊 Current state - loading:', loading, 'posts.length:', posts.length);
    
    // Don't reload if already loading
    if (loading) {
      console.log('⏸️ Already loading, skipping...');
      return;
    }
    
    console.log('🚀 Starting to load posts...');
    loading = true;
    
    try {
      // First get posts
      let postsQuery = supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (selectedGroup !== 'all') {
        postsQuery = postsQuery.eq('group_name', selectedGroup);
      }

      console.log('📡 Fetching posts from Supabase...');
      const { data: postsData, error: postsError } = await postsQuery;
      
      if (postsError) {
        console.error('❌ Posts query error:', postsError);
        throw postsError;
      }

      console.log('✅ Posts fetched:', postsData?.length || 0, 'posts');

      // Then get profiles for the authors
      if (postsData && postsData.length > 0) {
        const authorIds = [...new Set(postsData.map(post => post.author_id))];
        console.log('👥 Author IDs:', authorIds);
        
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username')
          .in('id', authorIds);

        if (profilesError) {
          console.error('❌ Profiles query error:', profilesError);
          throw profilesError;
        }

        console.log('✅ Profiles fetched:', profilesData?.length || 0, 'profiles');

        // Combine posts with profile data
        posts = postsData.map(post => ({
          ...post,
          profiles: profilesData?.find(profile => profile.id === post.author_id)
        }));
        
        console.log('🔗 Combined posts with profiles:', posts.length, 'posts');
      } else {
        posts = [];
        console.log('📭 No posts found');
      }
      
      console.log('✅ loadPosts() completed successfully');
    } catch (error) {
      console.error('❌ Error loading posts:', error);
    } finally {
      loading = false;
      console.log('🏁 Loading finished, loading = false');
    }
  }

  function handleGroupChange(event) {
    selectedGroup = event.target.value;
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

<div class="group-filter">
  <label for="group-select">Group:</label>
  <select id="group-select" value={selectedGroup} onchange={handleGroupChange}>
    <option value="all">All Groups</option>
    {#each groups as group}
      <option value={group}>{group}</option>
    {/each}
  </select>
</div>

{#if loading}
  <div style="text-align: center; padding: 20px; color: var(--text-muted);">
    Loading posts...
  </div>
{:else if posts.length === 0}
  <div style="text-align: center; padding: 20px; color: var(--text-muted);">
    No posts found. Be the first to post!
  </div>
{:else}
  <div class="post-list">
    {#each posts as post, index}
      <PostItem 
        {post} 
        {index} 
        {formatTimeAgo}
        onupvoteChanged={loadPosts}
      />
    {/each}
  </div>
{/if}
