<script>
  import { supabase } from '$lib/supabase.js';
  import { user } from '$lib/stores.js';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { renderRichText } from '$lib/utils.js';

  let loading = false;
  let error = '';
  let success = '';
  
  let username = '';
  let bio = '';

  onMount(() => {
    // Redirect if not logged in
    if (!$user) {
      goto('/');
      return;
    }

    // Initialize form with current user data
    if ($user?.profile) {
      username = $user.profile.username || '';
      bio = $user.profile.bio || '';
    }
  });

  async function updateProfile() {
    if (!$user || !username.trim()) {
      error = 'Username is required';
      return;
    }

    loading = true;
    error = '';
    success = '';

    try {
      // Update profile in database
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({
          username: username.trim(),
          bio: bio.trim()
        })
        .eq('id', $user.id)
        .select()
        .single();

      if (updateError) {
        if (updateError.code === '23505') { // Unique constraint violation
          error = 'Username already taken. Please choose another.';
        } else {
          error = updateError.message;
        }
        return;
      }

      // Update user store with new profile data
      user.set({
        ...$user,
        profile: data
      });

      success = 'Profile updated successfully!';
      
      // Redirect back to home after a delay
      setTimeout(() => {
        goto('/');
      }, 2000);

    } catch (err) {
      console.error('Error updating profile:', err);
      error = 'Failed to update profile. Please try again.';
    } finally {
      loading = false;
    }
  }

  function handleSubmit() {
    updateProfile();
  }
</script>

<svelte:head>
  <title>Edit Profile - SoftoDesign Board</title>
</svelte:head>

<div class="page-content">
  <h1>Edit Profile</h1>
  
  {#if !$user}
    <div class="error">You must be logged in to edit your profile.</div>
  {:else}
    <div class="profile-form">
      <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <div class="form-group">
          <label for="username">Username:</label>
          <input
            id="username"
            type="text"
            bind:value={username}
            placeholder="Enter your username"
            required
            maxlength="50"
            disabled={loading}
          />
        </div>

        <div class="form-group">
          <label for="bio">Bio:</label>
          <textarea
            id="bio"
            bind:value={bio}
            placeholder="Tell us about yourself... URLs will automatically become clickable links."
            maxlength="500"
            disabled={loading}
            rows="6"
          ></textarea>
          {#if bio}
            <div class="bio-preview-form">
              <strong>Preview:</strong>
              <div class="preview-content">{@html renderRichText(bio)}</div>
            </div>
          {/if}
        </div>

        {#if error}
          <div class="error">{error}</div>
        {/if}

        {#if success}
          <div class="success">{success}</div>
        {/if}

        <div class="button-group">
          <button 
            type="submit" 
            class="btn" 
            disabled={loading || !username.trim()}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
          <a href="/" class="btn btn-secondary">Cancel</a>
        </div>
      </form>
    </div>

    <div class="profile-info">
      <h2>Current Profile</h2>
      <div class="info-item">
        <strong>Username:</strong> {$user.profile?.username || 'Not set'}
      </div>
      <div class="info-item">
        <strong>Email:</strong> {$user.email}
      </div>
      <div class="info-item">
        <strong>Bio:</strong> 
        {#if $user.profile?.bio}
          <div class="bio-preview">{@html renderRichText($user.profile.bio)}</div>
        {:else}
          No bio set
        {/if}
      </div>
      <div class="info-item">
        <strong>Member since:</strong> {new Date($user.profile?.created_at || $user.created_at).toLocaleDateString()}
      </div>
      {#if $user.profile?.username}
        <div class="info-item">
          <strong>Public Profile:</strong> <a href="/profile/{$user.profile.username}" class="username-link">View Public Profile</a>
        </div>
      {/if}
    </div>
  {/if}

  <div class="back-link">
    <a href="/" class="btn btn-secondary">← Back to Board</a>
  </div>
</div>

<style>
  .page-content {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    line-height: 1.6;
  }

  .profile-form {
    background: var(--bg-tertiary);
    border: 2px solid var(--border);
    padding: 30px;
    border-radius: 8px;
    margin-bottom: 30px;
  }

  .profile-info {
    background: var(--bg-secondary);
    border: 2px solid var(--border);
    padding: 25px;
    border-radius: 8px;
    margin-bottom: 30px;
  }

  .profile-info h2 {
    color: var(--accent);
    margin-bottom: 15px;
    font-size: 18pt;
  }

  .info-item {
    margin-bottom: 12px;
    font-size: 14pt;
  }

  .info-item strong {
    color: var(--text-primary);
  }

  .bio-preview {
    margin-top: 8px;
    padding: 10px;
    background: var(--bg-tertiary);
    border-radius: 4px;
    font-size: 13pt;
    line-height: 1.5;
  }

  .bio-preview-form {
    margin-top: 15px;
    padding: 15px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border);
    border-radius: 6px;
  }

  .bio-preview-form strong {
    color: var(--text-secondary);
    font-size: 12pt;
    display: block;
    margin-bottom: 8px;
  }

  .preview-content {
    font-size: 14pt;
    line-height: 1.5;
    color: var(--text-primary);
  }

  .button-group {
    display: flex;
    gap: 12px;
    margin-top: 20px;
  }

  .back-link {
    text-align: center;
  }

  h1 {
    color: var(--text-primary);
    margin-bottom: 30px;
    text-align: center;
    font-size: 24pt;
  }
</style>
