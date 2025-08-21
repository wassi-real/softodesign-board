<script>
  import { supabase } from '$lib/supabase.js';
  import { user, showAuthModal, authMode } from '$lib/stores.js';
  import { onMount } from 'svelte';

  let email = '';
  let password = '';
  let username = '';
  let bio = '';
  let loading = false;
  let error = '';
  let success = '';

  let isSignup = $derived($authMode === 'signup');

  onMount(() => {
    // Reset form when modal opens
    if ($showAuthModal) {
      email = '';
      password = '';
      username = '';
      bio = '';
      error = '';
      success = '';
    }
  });

  async function handleSubmit() {
    loading = true;
    error = '';
    success = '';

    try {
      if (isSignup) {
        // Sign up
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username,
              bio: bio || null
            }
          }
        });

        if (authError) throw authError;

              if (data.user) {
        success = 'Account created! Please check your email to verify your account.';
        setTimeout(() => {
          showAuthModal.set(false);
        }, 2000);
      }
      } else {
        // Sign in
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) throw authError;

        if (data.user) {
          // Get user profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          user.set({ ...data.user, profile });
          showAuthModal.set(false);
        }
      }
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  function closeModal() {
    showAuthModal.set(false);
  }

  function switchMode() {
    authMode.set(isSignup ? 'login' : 'signup');
    error = '';
    success = '';
  }
</script>

{#if $showAuthModal}
  <div class="modal-overlay" role="dialog" tabindex="-1" onclick={closeModal} onkeydown={(e) => e.key === 'Escape' && closeModal()}>
    <div class="modal" role="dialog" tabindex="0" onclick={(e) => e.stopPropagation()} onkeydown={() => {}}>
      <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
      
      <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <div class="form-group">
          <label for="email">Email:</label>
          <input
            id="email"
            type="email"
            bind:value={email}
            required
            disabled={loading}
          />
        </div>

        <div class="form-group">
          <label for="password">Password:</label>
          <input
            id="password"
            type="password"
            bind:value={password}
            required
            disabled={loading}
            minlength="6"
          />
        </div>

        {#if isSignup}
          <div class="form-group">
            <label for="username">Username:</label>
            <input
              id="username"
              type="text"
              bind:value={username}
              required
              disabled={loading}
              pattern="^[a-zA-Z0-9_-]+$"
              title="Username can only contain letters, numbers, underscores and hyphens"
            />
          </div>

          <div class="form-group">
            <label for="bio">Bio (optional):</label>
            <textarea
              id="bio"
              bind:value={bio}
              disabled={loading}
              maxlength="500"
            ></textarea>
          </div>
        {/if}

        {#if error}
          <div class="error">{error}</div>
        {/if}

        {#if success}
          <div class="success">{success}</div>
        {/if}

        <div style="margin-top: 20px;">
          <button type="submit" class="btn" disabled={loading}>
            {loading ? 'Loading...' : (isSignup ? 'Sign Up' : 'Login')}
          </button>
          <button type="button" class="btn btn-secondary" onclick={closeModal}>
            Cancel
          </button>
        </div>

        <div style="margin-top: 15px; text-align: center;">
          <button type="button" class="link-btn" onclick={switchMode}>
            {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign up"}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<style>
  .link-btn {
    background: none;
    border: none;
    color: var(--accent);
    cursor: pointer;
    text-decoration: underline;
    font-size: 9pt;
  }

  .link-btn:hover {
    color: var(--accent-hover);
  }
</style>
