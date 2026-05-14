'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signup, login, isLoggedIn, getAuth } from '@/lib/auth'
import { useEffect } from 'react'

function SignupContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tier = searchParams.get('tier') || 'creator'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isLoggedIn()) router.push('/')
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password || !confirmPassword) { setError('Please fill in all fields.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return }

    setLoading(true)
    const result = signup(email.trim().toLowerCase(), password)
    if (!result.success) { setError(result.error || 'Signup failed.'); setLoading(false); return }

    login(email.trim().toLowerCase(), password)

    // Immediately go to Stripe checkout for chosen tier
    try {
      const auth = getAuth()
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, email: auth?.email }),
      })
      const data = await res.json()
      if (data.url) { window.location.href = data.url; return }
    } catch {}

    router.push('/pricing')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="WastedApe" style={{ width: 48, height: 48, borderRadius: '50%', marginBottom: 12, border: '2px solid rgba(124,58,237,0.4)' }} />
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: 'bold', background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          ContentBuddy
        </h1>
        <p style={{ fontSize: '12px', color: 'rgba(240,240,240,0.4)', marginTop: 4 }}>by WastedApe</p>
      </div>

      <div className="panel" style={{ padding: '36px', width: '100%', maxWidth: '400px' }}>

        {/* Plan banner */}
        <div style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 24, textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: 'rgba(240,240,240,0.5)', marginBottom: 2 }}>Selected plan</p>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#a78bfa' }}>$9.99 every 6 months</p>
          <p style={{ fontSize: 12, color: 'rgba(240,240,240,0.4)' }}>20 generations/week · resets Sunday</p>
          <a href="/pricing" style={{ fontSize: 12, color: 'rgba(240,240,240,0.4)', textDecoration: 'underline' }}>Change plan</a>
        </div>

        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#f0f0f0' }}>Create your account</h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'rgba(240,240,240,0.7)' }}>Email</label>
            <input type="email" className="input-field" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'rgba(240,240,240,0.7)' }}>Password</label>
            <input type="password" className="input-field" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" required />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'rgba(240,240,240,0.7)' }}>Confirm Password</label>
            <input type="password" className="input-field" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} autoComplete="new-password" required />
          </div>

          {error && <p style={{ color: '#f87171', fontSize: 13 }}>{error}</p>}

          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', fontSize: 15, padding: 13, marginTop: 4 }}>
            {loading ? 'Setting up account...' : 'Create Account & Pay →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'rgba(240,240,240,0.5)' }}>
          Already have an account? <a href="/login" style={{ color: '#a78bfa', textDecoration: 'none', fontWeight: 600 }}>Sign in</a>
        </p>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0a0a0f' }} />}><SignupContent /></Suspense>
}
