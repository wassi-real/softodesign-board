<script>
  import { supabase } from '$lib/supabase.js';
  import { user } from '$lib/stores.js';

  let { show = $bindable(false) } = $props();
  let loading = false;
  let error = '';
  let success = '';
  
  let username = '';
  let bio = '';

  // Initialize form with current user data when modal opens
  $effect(() => {
    if (show && $user?.profile) {
      username = $user.profile.username || '';
      bio = $user.profile.bio || '';
      error = '';
      success = '';
    }
  });

  function closeModal() {
    show = false;
    error = '';
    success = '';
  }

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
      setTimeout(() => {
        closeModal();
      }, 1500);

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

{#if show}
  <div 
    class="modal-overlay" 
    role="dialog" 
    tabindex="-1"
    onclick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
  >
    <div 
      class="modal" 
      role="dialog" 
      tabindex="0"
      onclick={(e) => e.stopPropagation()}
    >
      <h2>Edit Profile</h2>
      
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
            placeholder="Tell us about yourself..."
            maxlength="500"
            disabled={loading}
            rows="4"
          ></textarea>
        </div>

        {#if error}
          <div class="error">{error}</div>
        {/if}

        {#if success}
          <div class="success">{success}</div>
        {/if}

        <div style="display: flex; gap: 12px; margin-top: 20px;">
          <button 
            type="submit" 
            class="btn" 
            disabled={loading || !username.trim()}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
          <button 
            type="button" 
            class="btn btn-secondary" 
            onclick={closeModal}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
