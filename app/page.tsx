export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed]">
      {/* Header */}
      <header className="border-b border-[#1a1a1a] bg-[#0f0f0f]/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#00ff88] rounded-full animate-pulse"></div>
              <h1 className="text-xl font-bold font-mono">Mail Service</h1>
            </div>
            <div className="flex items-center gap-6">
              <a
                href="https://github.com/daniil-aleksieiev/mail-api"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#888] hover:text-[#00ff88] transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/dan-aleksieiev/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#888] hover:text-[#00ff88] transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="mb-12">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#00ff88] to-[#00ccff] bg-clip-text text-transparent">
              Mail Service
            </h2>
            <p className="text-xl text-[#888] leading-relaxed mb-6">
              A simple email forwarding service built with Next.js that sends emails via Gmail API. Supports plain text,
              HTML templates, and automatic object formatting.
            </p>
            <a
              href="https://github.com/daniil-aleksieiev/mail-api"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-lg text-[#00ff88] hover:bg-[#00ff88]/20 hover:border-[#00ff88]/50 transition-all duration-200 font-semibold"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span>View Full Documentation on GitHub</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>

          {/* Features */}
          <section className="mb-16">
            <h3 className="text-2xl font-bold mb-6 text-[#00ff88]">Features</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { icon: '📧', title: 'Gmail API Integration', desc: 'Send emails via Gmail API' },
                {
                  icon: '🎨',
                  title: 'Multiple Formats',
                  desc: 'Support for plain text, HTML, and object-based emails',
                },
                {
                  icon: '📎',
                  title: 'File Attachments',
                  desc: 'Support for email attachments (base64 or URL-based, up to 25MB)',
                },
                {
                  icon: '🔄',
                  title: 'Auto Formatting',
                  desc: 'Automatic field name formatting (e.g., full_name → "Full Name")',
                },
                { icon: '📝', title: 'Templates', desc: 'Template support with data substitution' },
                {
                  icon: '🔐',
                  title: 'OAuth 2.0',
                  desc: 'Authentication with refresh tokens',
                },
                {
                  icon: '🔒',
                  title: 'API Key Auth',
                  desc: 'Secure access with API key authentication',
                },
                {
                  icon: '⚡',
                  title: 'Rate Limiting',
                  desc: 'Prevents abuse with configurable rate limits',
                },
                {
                  icon: '🌐',
                  title: 'CORS Enabled',
                  desc: 'Cross-origin requests support',
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg border border-[#1a1a1a] bg-[#0f0f0f] hover:border-[#00ff88]/30 transition-all duration-200"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{feature.icon}</span>
                    <div>
                      <h4 className="font-semibold mb-1">{feature.title}</h4>
                      <p className="text-sm text-[#888]">{feature.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* API Endpoint */}
          <section className="mb-16">
            <h3 className="text-2xl font-bold mb-6 text-[#00ff88]">API Endpoint</h3>
            <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg p-6 font-mono">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 bg-[#00ff88]/20 text-[#00ff88] rounded text-xs font-semibold">POST</span>
                <code className="text-[#00ccff]">/api/sendmail</code>
              </div>
              <p className="text-[#888] text-sm mb-4">Sends an email via Gmail API</p>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-[#666] mb-2">Request Headers:</p>
                  <div className="bg-[#0a0a0a] p-3 rounded border border-[#1a1a1a]">
                    <code className="text-sm">
                      Content-Type: application/json
                      <br />
                      X-API-Key: your-api-key
                    </code>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-[#666] mb-2">Content Types:</p>
                  <div className="grid md:grid-cols-3 gap-3 mb-3">
                    <div className="bg-[#0a0a0a] p-3 rounded border border-[#1a1a1a]">
                      <p className="text-xs text-[#00ff88] mb-1 font-semibold">Plain Text</p>
                      <pre className="text-xs text-[#888] overflow-x-auto">
                        {`{
  "text": "Hello"
}`}
                      </pre>
                    </div>
                    <div className="bg-[#0a0a0a] p-3 rounded border border-[#1a1a1a]">
                      <p className="text-xs text-[#00ff88] mb-1 font-semibold">HTML</p>
                      <pre className="text-xs text-[#888] overflow-x-auto">
                        {`{
  "html": "<h1>Hello</h1>"
}`}
                      </pre>
                    </div>
                    <div className="bg-[#0a0a0a] p-3 rounded border border-[#1a1a1a]">
                      <p className="text-xs text-[#00ff88] mb-1 font-semibold">Fields Object</p>
                      <pre className="text-xs text-[#888] overflow-x-auto">
                        {`{
  "fields": {
    "name": "John"
  }
}`}
                      </pre>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-[#666] mb-2">Attachments Example:</p>
                  <div className="bg-[#0a0a0a] p-3 rounded border border-[#1a1a1a]">
                    <pre className="text-xs text-[#888] overflow-x-auto whitespace-pre-wrap">
                      {`{
  "to": "user@example.com",
  "subject": "Document",
  "text": "Please find attached",
  "attachments": [
    {
      "filename": "doc.pdf",
      "content": "base64...",
      "contentType": "application/pdf"
    }
  ]
}`}
                    </pre>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-[#666] mb-2">Example Request Body:</p>
                  <div className="bg-[#0a0a0a] p-3 rounded border border-[#1a1a1a]">
                    <pre className="text-sm text-[#888] overflow-x-auto">
                      {`{
  "to": "recipient@example.com",
  "subject": "Hello",
  "text": "This is a test email."
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Security */}
          <section className="mb-16">
            <h3 className="text-2xl font-bold mb-6 text-[#00ff88]">Security</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-[#1a1a1a] bg-[#0f0f0f]">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-[#00ff88]">🔒</span> API Key Protection
                </h4>
                <p className="text-sm text-[#888]">
                  Optional API key authentication. If <code className="text-[#00ccff]">API_KEY</code> is set in
                  environment variables, all requests must include a valid API key.
                </p>
              </div>
              <div className="p-4 rounded-lg border border-[#1a1a1a] bg-[#0f0f0f]">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-[#00ff88]">⚡</span> Rate Limiting
                </h4>
                <p className="text-sm text-[#888]">
                  With API key: 10 requests/minute. Without API key: 5 requests/minute. Rate limit info is included in
                  response headers.
                </p>
              </div>
            </div>
          </section>

          {/* Quick Start */}
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-[#00ff88]">Quick Start</h3>
              <a
                href="https://github.com/daniil-aleksieiev/mail-api"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#888] hover:text-[#00ff88] transition-colors duration-200 flex items-center gap-1"
              >
                <span>Full guide</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
            <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg p-6 font-mono">
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-[#666] mb-2">1. Install dependencies</p>
                  <div className="bg-[#0a0a0a] p-3 rounded border border-[#1a1a1a]">
                    <code className="text-sm text-[#00ff88]">pnpm install</code>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-[#666] mb-2">2. Set up environment variables</p>
                  <div className="bg-[#0a0a0a] p-3 rounded border border-[#1a1a1a]">
                    <pre className="text-sm text-[#888] overflow-x-auto">
                      {`GMAIL_API_KEY=your-client-id
GMAIL_SECRET=your-client-secret
GMAIL_REFRESH_TOKEN=your-refresh-token
GMAIL_SENDER_EMAIL=your-email@gmail.com
API_KEY=your-api-key`}
                    </pre>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-[#666] mb-2">3. Get refresh token</p>
                  <div className="bg-[#0a0a0a] p-3 rounded border border-[#1a1a1a] overflow-x-auto">
                    <code className="text-sm text-[#00ff88] whitespace-nowrap">
                      GET http://localhost:3000/api/auth/google
                    </code>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-[#1a1a1a]">
                <p className="text-xs text-[#666]">
                  For detailed setup instructions, examples, and troubleshooting, see the{' '}
                  <a
                    href="https://github.com/daniil-aleksieiev/mail-api"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00ff88] hover:underline"
                  >
                    full documentation on GitHub
                  </a>
                  .
                </p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-20 pt-8 border-t border-[#1a1a1a]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <p className="text-sm text-[#666]">Built with</p>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-[#1a1a1a] rounded text-xs font-mono text-[#888]">Next.js</span>
                  <span className="px-2 py-1 bg-[#1a1a1a] rounded text-xs font-mono text-[#888]">TypeScript</span>
                  <span className="px-2 py-1 bg-[#1a1a1a] rounded text-xs font-mono text-[#888]">Gmail API</span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <a
                  href="https://github.com/daniil-aleksieiev/mail-api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#888] hover:text-[#00ff88] transition-colors duration-200 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  <span className="text-sm">GitHub</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/dan-aleksieiev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#888] hover:text-[#00ff88] transition-colors duration-200 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <span className="text-sm">LinkedIn</span>
                </a>
              </div>
            </div>
            <p className="text-center text-xs text-[#666] mt-6">
              © {new Date().getFullYear()} Dan Aleksieiev. All rights reserved.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
