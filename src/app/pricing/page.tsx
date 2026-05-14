'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { isLoggedIn, getAuth } from '@/lib/auth'

export default function PricingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    if (!isLoggedIn()) { router.push('/signup?tier=creator'); return }
    setLoading(true)
    try {
      const auth = getAuth()
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: 'creator', email: auth?.email }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else alert('Checkout error. Please try again.')
    } catch {
      alert('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="WastedApe" style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid rgba(124,58,237,0.5)' }} />
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 'bold', background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ContentBuddy
          </h1>
          <p style={{ fontSize: '11px', color: 'rgba(240,240,240,0.4)' }}>by WastedApe</p>
        </div>
      </div>

      {/* Pricing card */}
      <div style={{ maxWidth: '420px', width: '100%', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.35)', borderRadius: '24px', padding: '40px', textAlign: 'center' }}>

        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✨</div>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: 'bold', marginBottom: '8px', color: '#f0f0f0' }}>
          Get Full Access
        </h2>
        <p style={{ color: 'rgba(240,240,240,0.55)', fontSize: '15px', marginBottom: '28px', lineHeight: '1.6' }}>
          Unlimited AI content generation. One topic → full YouTube script, blog post, captions, threads, and more — in 30 seconds.
        </p>

        <div style={{ marginBottom: '8px' }}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '52px', fontWeight: 'bold', color: '#f0f0f0' }}>$9.99</span>
          <span style={{ color: 'rgba(240,240,240,0.45)', fontSize: '16px', marginLeft: '6px' }}>every 6 months</span>
        </div>
        <p style={{ color: 'rgba(124,58,237,0.9)', fontSize: '13px', marginBottom: '20px', fontWeight: 'bold' }}>Less than $1.67/month — 20 generations/week — resets every Sunday</p>

        <ul style={{ listStyle: 'none', marginBottom: '32px', textAlign: 'left' }}>
          {[
            '🎬 Full YouTube script from any topic',
            '✨ 10 YouTube title options',
            '📋 YouTube description + chapters',
            '📝 Full SEO blog post',
            '📸 Instagram caption + hashtags',
            '🎵 TikTok/Reels short script',
            '🐦 Twitter/X thread',
            '💼 LinkedIn post',
            '📧 Email newsletter version',
            '⚡ All 9 content types — one click',
          ].map(f => (
            <li key={f} style={{ padding: '8px 0', fontSize: '14px', color: 'rgba(240,240,240,0.8)', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              {f}
            </li>
          ))}
        </ul>

        <button
          onClick={handleCheckout}
          disabled={loading}
          style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '17px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'Georgia, serif' }}
        >
          {loading ? 'Loading...' : 'Get Access Now →'}
        </button>

        <p style={{ fontSize: '12px', color: 'rgba(240,240,240,0.3)', marginTop: '16px' }}>
          Billed every 6 months · Cancel anytime · Secure payment via Stripe
        </p>
      </div>

      <p style={{ marginTop: '24px', fontSize: '13px', color: 'rgba(240,240,240,0.3)' }}>
        Already have access?{' '}
        <Link href="/login" style={{ color: '#a78bfa', textDecoration: 'none' }}>Sign in</Link>
      </p>
    </div>
  )
}
