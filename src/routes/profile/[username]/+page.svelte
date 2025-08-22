<script>
  import { page } from '$app/stores';
  import { supabase } from '$lib/supabase.js';
  import { user } from '$lib/stores.js';
  import { onMount } from 'svelte';
  import PostItem from '$lib/components/PostItem.svelte';
  import { renderRichText } from '$lib/utils.js';

  let profile = null;
  let posts = [];
  let loading = true;
  let error = '';

  $: username = $page.params.username;

  onMount(() => {
    loadProfile();
  });

  $: if (username) {
    loadProfile();
  }

  async function loadProfile() {
    if (!username) return;
    
    loading = true;
    error = '';
    
    try {
      // Get profile by username
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (profileError) {
        if (profileError.code === 'PGRST116') {
          error = `User '@${username}' not found`;
        } else {
          error = 'Error loading profile';
        }
        return;
      }

      profile = profileData;

      // Get posts by this user
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .eq('author_id', profile.id)
        .order('created_at', { ascending: false });

      if (postsError) {
        console.error('Error loading posts:', postsError);
        posts = [];
      } else {
        // Get profiles for post authors (should be the same user)
        if (postsData && postsData.length > 0) {
          const { data: profilesData } = await supabase
            .from('profiles')
            .select('id, username')
            .eq('id', profile.id);

          posts = postsData.map(post => ({
            ...post,
            profiles: profilesData?.[0] || profile
          }));
        } else {
          posts = [];
        }
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      error = 'Failed to load profile';
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

  function isOwnProfile() {
    return $user && profile && $user.id === profile.id;
  }
</script>

<svelte:head>
  <title>{profile?.username || username} - Profile - SoftoDesign Board</title>
</svelte:head>

{#if loading}
  <div style="text-align: center; padding: 40px; color: var(--text-muted);">
    Loading profile...
  </div>
{:else if error}
  <div style="text-align: center; padding: 40px; color: var(--error);">
    {error}
  </div>
{:else if profile}
  <div class="profile-page">
    <div class="profile-header">
      <div class="profile-info">
        <h1 class="profile-username">@{profile.username}</h1>
        {#if profile.bio}
          <p class="profile-bio">{@html renderRichText(profile.bio)}</p>
        {/if}
        <div class="profile-meta">
          <span class="member-since">Member since {new Date(profile.created_at).toLocaleDateString()}</span>
          {#if isOwnProfile()}
            <a href="/profile" class="edit-profile-link">Edit Profile</a>
          {/if}
        </div>
      </div>
    </div>

    <div class="profile-content">
      <h2 class="section-title">Posts ({posts.length})</h2>
      
      {#if posts.length === 0}
        <div class="no-posts">
          <p>No posts yet.</p>
          {#if isOwnProfile()}
            <a href="/submit" class="btn">Create Your First Post</a>
          {/if}
        </div>
      {:else}
        <div class="posts-list">
          {#each posts as post, index}
            <PostItem 
              {post} 
              {index} 
              {formatTimeAgo}
              onupvoteChanged={loadProfile}
            />
          {/each}
        </div>
      {/if}
    </div>
  </div>

  <div class="back-link">
    <a href="/" class="btn btn-secondary">← Back to Board</a>
  </div>
{/if}

<style>
  .profile-page {
    max-width: 800px;
    margin: 0 auto;
  }

  .profile-header {
    background: var(--bg-tertiary);
    border: 2px solid var(--border);
    border-radius: 8px;
    padding: 30px;
    margin-bottom: 30px;
  }

  .profile-username {
    font-size: 28pt;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 15px 0;
  }

  .profile-bio {
    font-size: 16pt;
    color: var(--text-secondary);
    line-height: 1.6;
    margin: 0 0 20px 0;
    white-space: pre-wrap;
  }

  .profile-meta {
    display: flex;
    align-items: center;
    gap: 20px;
    font-size: 14pt;
    color: var(--text-muted);
  }

  .member-since {
    font-style: italic;
  }

  .edit-profile-link {
    color: var(--accent);
    text-decoration: underline;
    font-weight: 500;
  }

  .edit-profile-link:hover {
    color: var(--accent-hover);
  }

  .profile-content {
    margin-top: 30px;
  }

  .section-title {
    font-size: 20pt;
    color: var(--text-primary);
    margin-bottom: 20px;
    border-bottom: 2px solid var(--border);
    padding-bottom: 10px;
  }

  .no-posts {
    text-align: center;
    padding: 40px;
    color: var(--text-muted);
  }

  .no-posts p {
    font-size: 16pt;
    margin-bottom: 20px;
  }

  .posts-list {
    margin-top: 20px;
  }

  .back-link {
    text-align: center;
    margin-top: 30px;
  }

  /* Mobile responsive */
  @media (max-width: 768px) {
    .profile-header {
      padding: 20px;
    }

    .profile-username {
      font-size: 24pt;
    }

    .profile-bio {
      font-size: 14pt;
    }

    .profile-meta {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
    }

    .section-title {
      font-size: 18pt;
    }
  }

  @media (max-width: 480px) {
    .profile-header {
      padding: 15px;
    }

    .profile-username {
      font-size: 20pt;
    }

    .profile-bio {
      font-size: 13pt;
    }

    .section-title {
      font-size: 16pt;
    }
  }
</style>
