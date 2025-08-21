<script>
  // About page
</script>

<svelte:head>
  <title>About - SoftoDesign Board</title>
  <meta name="description" content="Learn about SoftoDesign Board - a modern, clean alternative to Hacker News and Reddit for founders, designers, and creators to share ideas and engage in meaningful discussions." />
  <meta name="keywords" content="SoftoDesign Board, discussion platform, founders, designers, developers, tech community, alternative to Hacker News, Reddit alternative" />
  <meta name="author" content="SoftoDesign Board" />
  <meta name="robots" content="index, follow" />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://softodesign-board.vercel.app/about" />
  <meta property="og:title" content="About - SoftoDesign Board" />
  <meta property="og:description" content="Learn about SoftoDesign Board - a modern, clean alternative to Hacker News and Reddit for founders, designers, and creators." />
  <meta property="og:image" content="/logo.png" />
  <meta property="og:image:alt" content="SoftoDesign Board Logo" />
  
  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="https://softodesign-board.vercel.app/about" />
  <meta property="twitter:title" content="About - SoftoDesign Board" />
  <meta property="twitter:description" content="Learn about SoftoDesign Board - a modern, clean alternative to Hacker News and Reddit for founders, designers, and creators." />
  <meta property="twitter:image" content="/logo.png" />
  <meta property="twitter:image:alt" content="SoftoDesign Board Logo" />
  
  <!-- Favicon and Icons -->
  <link rel="icon" type="image/png" href="/logo.png" />
  <link rel="apple-touch-icon" href="/logo.png" />
  
  <!-- Canonical URL -->
  <link rel="canonical" href="https://softodesign-board.vercel.app/about" />
</svelte:head>

<div class="page-content">
  <h1>About SoftoDesign Board</h1>
  
  <div class="content-section">
    <h2>Welcome to the Alternative</h2>
    <p>
      SoftoDesign Board is a modern, clean alternative to traditional discussion platforms like Hacker News and Reddit. 
      We believe in simple, focused discussions without the noise and complexity that has crept into other platforms.
    </p>
  </div>

  <div class="content-section">
    <h2>Our Mission</h2>
    <p>
      To provide a clean, distraction-free platform where founders, designers, developers, and creators can share 
      ideas, get feedback, and engage in meaningful discussions about technology, business, and innovation.
    </p>
  </div>

  <div class="content-section">
    <h2>Key Features</h2>
    <ul>
      <li><strong>Simple Posting:</strong> Just title and description - no images, no fluff</li>
      <li><strong>Group Organization:</strong> Posts organized by categories like tech, design, business</li>
      <li><strong>Community Driven:</strong> Upvote the best content, no follower counts</li>
      <li><strong>Threaded Comments:</strong> Engage in meaningful discussions</li>
      <li><strong>Clean Design:</strong> Focus on content, not distractions</li>
    </ul>
  </div>

  <div class="content-section">
    <h2>Built For Creators</h2>
    <p>
      Whether you're a founder looking for feedback, a designer sharing your latest work, or a developer 
      discussing new technologies, SoftoDesign Board provides the perfect platform for authentic, 
      meaningful conversations.
    </p>
  </div>

  <div class="back-link">
    <a href="/" class="btn btn-secondary">← Back to Board</a>
  </div>
</div>

<style>
  .page-content {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    line-height: 1.6;
  }

  .content-section {
    margin-bottom: 30px;
  }

  .content-section h2 {
    color: var(--accent);
    margin-bottom: 15px;
    font-size: 18pt;
  }

  .content-section p {
    margin-bottom: 15px;
    font-size: 14pt;
  }

  .content-section ul {
    margin-left: 20px;
  }

  .content-section li {
    margin-bottom: 8px;
    font-size: 14pt;
  }

  .back-link {
    margin-top: 40px;
    text-align: center;
  }

  h1 {
    color: var(--text-primary);
    margin-bottom: 30px;
    text-align: center;
    font-size: 24pt;
  }
</style>
