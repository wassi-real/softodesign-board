<script>
	import '../app.css';
	import { supabase } from '$lib/supabase.js';
	import { user, showAuthModal, authMode } from '$lib/stores.js';
	import { onMount } from 'svelte';
	import AuthModal from '$lib/components/AuthModal.svelte';

	let { children } = $props();

	onMount(async () => {
		try {
			// Get initial session
			const { data: { session }, error } = await supabase.auth.getSession();
			
			if (error) {
				console.error('Error getting session:', error);
				user.set(null);
				return;
			}

			if (session?.user) {
				try {
					// Get user profile
					const { data: profile, error: profileError } = await supabase
						.from('profiles')
						.select('*')
						.eq('id', session.user.id)
						.single();

					if (profileError) {
						console.error('Error getting profile:', profileError);
						user.set(session.user); // Set user without profile
					} else {
						user.set({ ...session.user, profile });
					}
				} catch (profileError) {
					console.error('Profile fetch error:', profileError);
					user.set(session.user); // Set user without profile
				}
			} else {
				user.set(null);
			}

			// Listen for auth changes
			const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
				
				if (session?.user) {
					try {
						// Get user profile
						const { data: profile, error: profileError } = await supabase
							.from('profiles')
							.select('*')
							.eq('id', session.user.id)
							.single();

						if (profileError) {
							console.error('Error getting profile:', profileError);
							user.set(session.user); // Set user without profile
						} else {
							user.set({ ...session.user, profile });
						}
					} catch (profileError) {
						console.error('Profile fetch error:', profileError);
						user.set(session.user); // Set user without profile
					}
				} else {
					user.set(null);
				}
			});

			return () => subscription.unsubscribe();
		} catch (error) {
			console.error('Auth setup error:', error);
			user.set(null);
		}
	});

	function openLogin() {
		authMode.set('login');
		showAuthModal.set(true);
	}

	function openSignup() {
		authMode.set('signup');
		showAuthModal.set(true);
	}



	async function logout() {
		try {
			await supabase.auth.signOut();
			user.set(null);
			// Reload page to clear any cached data
			window.location.href = '/';
		} catch (error) {
			console.error('Logout error:', error);
			// Force logout even if there's an error
			user.set(null);
			window.location.href = '/';
		}
	}
</script>

	<svelte:head>
		<!-- Global SEO Meta Tags -->
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<meta name="theme-color" content="#7c3aed" />
		
		<!-- Default Meta Tags -->
		<meta name="description" content="SoftoDesign Board - A modern, clean alternative to Hacker News and Reddit for founders, designers, and creators to share ideas and engage in meaningful discussions." />
		<meta name="keywords" content="SoftoDesign Board, discussion platform, founders, designers, developers, tech community, alternative to Hacker News, Reddit alternative" />
		<meta name="author" content="SoftoDesign Board" />
		<meta name="robots" content="index, follow" />
		
		<!-- Open Graph / Facebook -->
		<meta property="og:type" content="website" />
		<meta property="og:url" content="https://softodesign-board.vercel.app" />
		<meta property="og:title" content="SoftoDesign Board" />
		<meta property="og:description" content="A modern, clean alternative to Hacker News and Reddit for founders, designers, and creators." />
		<meta property="og:image" content="/logo.png" />
		<meta property="og:image:alt" content="SoftoDesign Board Logo" />
		<meta property="og:site_name" content="SoftoDesign Board" />
		
		<!-- Twitter -->
		<meta property="twitter:card" content="summary_large_image" />
		<meta property="twitter:url" content="https://softodesign-board.vercel.app" />
		<meta property="twitter:title" content="SoftoDesign Board" />
		<meta property="twitter:description" content="A modern, clean alternative to Hacker News and Reddit for founders, designers, and creators." />
		<meta property="twitter:image" content="/logo.png" />
		<meta property="twitter:image:alt" content="SoftoDesign Board Logo" />
		
		<!-- Favicon and Icons -->
		<link rel="icon" type="image/png" href="/logo.png" />
		<link rel="apple-touch-icon" href="/logo.png" />
		<link rel="shortcut icon" href="/logo.png" />
		
		<!-- Canonical URL -->
		<link rel="canonical" href="https://softodesign-board.vercel.app" />
	</svelte:head>

<div class="container">
	<header class="header">
		<div class="header-content">
			<div class="logo">
				<a href="/" style="color: white; text-decoration: none;">SoftoDesign Board</a>
			</div>
			<nav class="nav-links">
				<a href="/">new</a>
				<a href="/past">past</a>
				<a href="/submit">submit</a>
				{#if $user}
					<span style="color: white;">Welcome, <a href="/profile" class="username-link">{$user.profile?.username || 'User'}</a>!</span>
					<button onclick={logout}>logout</button>
				{:else}
					<button onclick={openLogin}>login</button>
					<button onclick={openSignup}>signup</button>
				{/if}
			</nav>
		</div>
	</header>

	<main class="main-content">
		{@render children?.()}
	</main>

	<footer class="footer">
		<div class="footer-content">
			<div class="footer-links">
				<a href="/about">About</a>
				<a href="/privacy">Privacy</a>
				<a href="/terms">Terms</a>
				<a href="/contact">Contact</a>
			</div>
			<div class="footer-text">
				© 2024 SoftoDesign Board. All rights reserved.
			</div>
		</div>
	</footer>
</div>

<AuthModal />


