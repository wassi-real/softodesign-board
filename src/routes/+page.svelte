<script>
  import PostList from '$lib/components/PostList.svelte';
</script>
<svelte:head>
		<!-- Global SEO Meta Tags -->
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<meta name="theme-color" content="#7c3aed" />
		<title>SoftoDesign Board</title>
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
<PostList />
