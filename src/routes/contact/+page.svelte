<script>
  // No JavaScript needed for simple contact page
</script>

<svelte:head>
  <title>Contact Us - SoftoDesign Board</title>
  <meta name="description" content="Get in touch with SoftoDesign Board. Contact us for support, feedback, or any inquiries at support@softodesign.com" />
  <meta name="keywords" content="contact, support, feedback, SoftoDesign Board, help, inquiry" />
  <meta name="author" content="SoftoDesign Board" />
  <meta name="robots" content="index, follow" />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://softodesign-board.vercel.app/contact" />
  <meta property="og:title" content="Contact Us - SoftoDesign Board" />
  <meta property="og:description" content="Get in touch with SoftoDesign Board. Contact us for support, feedback, or any inquiries." />
  <meta property="og:image" content="/logo.png" />
  <meta property="og:image:alt" content="SoftoDesign Board Logo" />
  
  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="https://softodesign-board.vercel.app/contact" />
  <meta property="twitter:title" content="Contact Us - SoftoDesign Board" />
  <meta property="twitter:description" content="Get in touch with SoftoDesign Board. Contact us for support, feedback, or any inquiries." />
  <meta property="twitter:image" content="/logo.png" />
  <meta property="twitter:image:alt" content="SoftoDesign Board Logo" />
  
  <!-- Favicon and Icons -->
  <link rel="icon" type="image/png" href="/logo.png" />
  <link rel="apple-touch-icon" href="/logo.png" />
  
  <!-- Canonical URL -->
  <link rel="canonical" href="https://softodesign-board.vercel.app/contact" />
</svelte:head>

<div class="page-content">
  <h1>Contact Us</h1>
  
  <div class="content-section">
    <p>
      Have questions, feedback, or need support? We'd love to hear from you! 
      Send us an email and we'll get back to you as soon as possible.
    </p>
  </div>

  <div class="contact-info">
    <div class="email-section">
      <h2>Email Support</h2>
      <p class="email-address">
        <a href="mailto:support@softodesign.com">support@softodesign.com</a>
      </p>
      <p class="email-description">
        For all inquiries, technical support, and general questions.
      </p>
    </div>
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

  .content-section p {
    margin-bottom: 15px;
    font-size: 14pt;
  }

  .contact-info {
    background: var(--bg-tertiary);
    border: 2px solid var(--border);
    padding: 30px;
    border-radius: 8px;
    margin-bottom: 30px;
    text-align: center;
  }

  .email-section h2 {
    color: var(--accent);
    margin-bottom: 20px;
    font-size: 18pt;
  }

  .email-address {
    margin-bottom: 15px;
  }

  .email-address a {
    color: var(--accent);
    font-size: 18pt;
    font-weight: bold;
    text-decoration: none;
    padding: 10px 20px;
    border: 2px solid var(--accent);
    border-radius: 6px;
    display: inline-block;
    transition: all 0.2s;
  }

  .email-address a:hover {
    background: var(--accent);
    color: white;
  }

  .email-description {
    font-size: 14pt;
    color: var(--text-secondary);
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
