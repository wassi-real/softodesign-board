<script>
  import { supabase } from '$lib/supabase.js';
  import { user, showAuthModal, authMode } from '$lib/stores.js';
  import { goto } from '$app/navigation';

  let title = '';
  let description = '';
  let groupName = 'general';
  let loading = false;
  let error = '';
  let success = '';

  const groups = ['general', 'tech', 'design', 'business', 'random'];

  async function handleSubmit() {
    if (!$user) {
      authMode.set('login');
      showAuthModal.set(true);
      return;
    }

    if (!title.trim()) {
      error = 'Title is required';
      return;
    }

    loading = true;
    error = '';
    success = '';

    try {
      const { data, error: submitError } = await supabase
        .from('posts')
        .insert([{
          title: title.trim(),
          description: description.trim() || null,
          group_name: groupName,
          author_id: $user.id,
        }])
        .select()
        .single();

      if (submitError) throw submitError;

      success = 'Post submitted successfully!';
      
      // Reset form
      title = '';
      description = '';
      groupName = 'general';

      // Redirect to home after a short delay
      setTimeout(() => {
        goto('/');
      }, 1500);

    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Submit - SoftoDesign Board</title>
</svelte:head>

<div style="max-width: 600px;">
  <h1 style="color: var(--text-primary); font-size: 14pt; margin-bottom: 20px;">Submit a New Post</h1>

  {#if !$user}
    <div style="background: var(--bg-tertiary); padding: 15px; border-radius: 3px; margin-bottom: 20px;">
      <p style="margin: 0; color: var(--text-secondary);">
        You need to be logged in to submit a post.
        <button class="link-btn" onclick={() => { authMode.set('login'); showAuthModal.set(true); }}>
          Login here
        </button>
      </p>
    </div>
  {:else}
          <form class="post-form" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      <h3>Create Post</h3>

      <div class="form-group">
        <label for="title">Title *</label>
        <input
          id="title"
          type="text"
          bind:value={title}
          required
          disabled={loading}
          maxlength="200"
          placeholder="Enter a descriptive title for your post"
        />
      </div>

      <div class="form-group">
        <label for="group">Group</label>
        <select id="group" bind:value={groupName} disabled={loading}>
          {#each groups as group}
            <option value={group}>{group}</option>
          {/each}
        </select>
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea
          id="description"
          bind:value={description}
          disabled={loading}
          maxlength="2000"
          placeholder="Add additional details about your post (optional)"
          rows="6"
        ></textarea>
      </div>

      {#if error}
        <div class="error">{error}</div>
      {/if}

      {#if success}
        <div class="success">{success}</div>
      {/if}

      <div style="margin-top: 20px;">
        <button type="submit" class="btn" disabled={loading || !title.trim()}>
          {loading ? 'Submitting...' : 'Submit Post'}
        </button>
        <button type="button" class="btn btn-secondary" onclick={() => goto('/')}>
          Cancel
        </button>
      </div>
    </form>
  {/if}
</div>

<style>
  .link-btn {
    background: none;
    border: none;
    color: var(--accent);
    cursor: pointer;
    text-decoration: underline;
    font-size: 10pt;
  }

  .link-btn:hover {
    color: var(--accent-hover);
  }
</style>
