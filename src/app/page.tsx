'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getAuth, logout, incrementUsage, getUsageCount, hasReachedFreeLimit, getSubscription } from '@/lib/auth'

const CONTENT_TYPES = [
  { id: 'youtube_script', label: 'YouTube Script', icon: '🎬' },
  { id: 'blog_post', label: 'Blog Post', icon: '📝' },
  { id: 'youtube_titles', label: 'YouTube Title Options', icon: '✨' },
  { id: 'youtube_description', label: 'YouTube Description', icon: '📋' },
  { id: 'instagram_caption', label: 'Instagram Caption', icon: '📸' },
  { id: 'tiktok_script', label: 'TikTok Script', icon: '🎵' },
  { id: 'twitter_thread', label: 'Twitter Thread', icon: '🐦' },
  { id: 'linkedin_post', label: 'LinkedIn Post', icon: '💼' },
  { id: 'email_newsletter', label: 'Email Newsletter', icon: '📧' },
]

const CONTENT_LABELS: Record<string, string> = {
  youtube_script: 'YouTube Script',
  blog_post: 'Blog Post',
  youtube_titles: 'YouTube Title Options',
  youtube_description: 'YouTube Description',
  instagram_caption: 'Instagram Caption',
  tiktok_script: 'TikTok Script',
  twitter_thread: 'Twitter Thread',
  linkedin_post: 'LinkedIn Post',
  email_newsletter: 'Email Newsletter',
}

export default function HomePage() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState('')
  const [topic, setTopic] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['youtube_script', 'blog_post', 'instagram_caption'])
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Record<string, string>>({})
  const [error, setError] = useState('')
  const [copiedKey, setCopiedKey] = useState('')
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [usageCount, setUsageCount] = useState(0)
  const [subscription, setSubscription] = useState('free')

  useEffect(() => {
    const auth = getAuth()
    if (!auth) {
      router.push('/login')
      return
    }
    setUserEmail(auth.email)
    setUsageCount(getUsageCount())
    setSubscription(getSubscription())
  }, [router])

  const toggleType = (id: string) => {
    setSelectedTypes(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    )
  }

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic or idea.')
      return
    }
    if (selectedTypes.length === 0) {
      setError('Please select at least one content type.')
      return
    }

    if (hasReachedFreeLimit()) {
      setShowUpgradeModal(true)
      return
    }

    setError('')
    setLoading(true)
    setResults({})

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim(), contentTypes: selectedTypes }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `Server error: ${res.status}`)
      }

      const data = await res.json()
      setResults(data.results || {})
      incrementUsage()
      setUsageCount(getUsageCount())
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(''), 2000)
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const freeRemaining = Math.max(0, 3 - usageCount)
  const isPaid = subscription === 'creator' || subscription === 'studio'

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f' }}>
      {/* Header */}
      <header style={{
        borderBottom: '1px solid rgba(124,58,237,0.2)',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(10,10,15,0.95)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: 'bold' }}>
            <span className="gradient-text">ContentBuddy</span>
          </h1>
          <p style={{ fontSize: '11px', color: 'rgba(240,240,240,0.4)', marginTop: '2px' }}>by WastedApe</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {!isPaid && (
            <span style={{ fontSize: '13px', color: 'rgba(240,240,240,0.5)' }}>
              {freeRemaining} free {freeRemaining === 1 ? 'generation' : 'generations'} left
            </span>
          )}
          {isPaid && (
            <span style={{
              fontSize: '12px',
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              padding: '3px 10px',
              borderRadius: '20px',
              fontWeight: 600,
            }}>
              {subscription === 'studio' ? '⚡ Studio' : '🌟 Creator'}
            </span>
          )}
          <span style={{ fontSize: '13px', color: 'rgba(240,240,240,0.5)' }}>{userEmail}</span>
          <button className="btn-secondary" onClick={handleLogout} style={{ padding: '7px 14px', fontSize: '13px' }}>
            Logout
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(28px, 5vw, 46px)',
            fontWeight: 'bold',
            lineHeight: 1.2,
            marginBottom: '16px',
          }}>
            Turn any topic into a{' '}
            <span className="gradient-text">week of content</span>
            <br />— in 30 seconds
          </h2>
          <p style={{ color: 'rgba(240,240,240,0.55)', fontSize: '17px', maxWidth: '500px', margin: '0 auto' }}>
            One idea. Nine content formats. Ready to post.
          </p>
        </div>

        {/* Main generator panel */}
        <div className="panel glow-purple" style={{ padding: '32px' }}>
          {/* Topic input */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '10px', color: 'rgba(240,240,240,0.8)' }}>
              Your Topic or Idea
            </label>
            <textarea
              className="input-field"
              rows={4}
              placeholder="Enter your topic, idea, or paste your script... e.g. 'How to grow tomatoes in small spaces' or 'My morning productivity routine'"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              style={{ resize: 'vertical', lineHeight: 1.6 }}
            />
          </div>

          {/* Content type selector */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: 'rgba(240,240,240,0.8)' }}>
              Content Types to Generate
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '10px',
            }}>
              {CONTENT_TYPES.map(ct => (
                <label
                  key={ct.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: `1px solid ${selectedTypes.includes(ct.id) ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.08)'}`,
                    background: selectedTypes.includes(ct.id) ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.03)',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    userSelect: 'none',
                  }}
                >
                  <input
                    type="checkbox"
                    className="cb-checkbox"
                    checked={selectedTypes.includes(ct.id)}
                    onChange={() => toggleType(ct.id)}
                  />
                  <span style={{ fontSize: '14px' }}>{ct.icon} {ct.label}</span>
                </label>
              ))}
            </div>
          </div>

          {error && (
            <p style={{ color: '#f87171', fontSize: '14px', marginBottom: '16px' }}>{error}</p>
          )}

          {/* Generate button */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              className="btn-primary"
              onClick={handleGenerate}
              disabled={loading}
              style={{ fontSize: '16px', padding: '14px 36px', minWidth: '220px', justifyContent: 'center' }}
            >
              {loading ? (
                <>
                  <div className="spinner" />
                  Generating...
                </>
              ) : (
                <>✨ Generate Content</>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        {Object.keys(results).length > 0 && (
          <div style={{ marginTop: '40px' }}>
            <h3 style={{
              fontFamily: 'Georgia, serif',
              fontSize: '22px',
              fontWeight: 'bold',
              marginBottom: '24px',
              textAlign: 'center',
            }}>
              Your Content <span className="gradient-text">is Ready</span> 🎉
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {selectedTypes.filter(t => results[t]).map((type, i) => (
                <div key={type} className="panel fade-in-up" style={{ padding: '24px', animationDelay: `${i * 0.06}s` }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#a78bfa' }}>
                      {CONTENT_TYPES.find(c => c.id === type)?.icon} {CONTENT_LABELS[type]}
                    </h4>
                    <button
                      className="copy-btn"
                      onClick={() => handleCopy(type, results[type])}
                    >
                      {copiedKey === type ? '✅ Copied!' : '📋 Copy'}
                    </button>
                  </div>
                  <pre style={{
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: '14px',
                    lineHeight: 1.7,
                    color: 'rgba(240,240,240,0.85)',
                    margin: 0,
                  }}>
                    {results[type]}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="modal-overlay" onClick={() => setShowUpgradeModal(false)}>
          <div
            className="panel"
            style={{ padding: '40px', maxWidth: '460px', width: '90%', textAlign: 'center' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚀</div>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 'bold', marginBottom: '12px' }}>
              Free Limit Reached
            </h3>
            <p style={{ color: 'rgba(240,240,240,0.6)', marginBottom: '28px', lineHeight: 1.6 }}>
              You&apos;ve used your 3 free generations. Upgrade to keep creating unlimited content.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/pricing">
                <button className="btn-primary" style={{ fontSize: '15px' }}>
                  View Plans →
                </button>
              </a>
              <button className="btn-secondary" onClick={() => setShowUpgradeModal(false)}>
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
