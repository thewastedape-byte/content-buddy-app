'use client'
import Link from 'next/link'

export default function SuccessPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ textAlign: 'center', maxWidth: '480px' }}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>🎉</div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: 'bold', marginBottom: '12px', background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          You&apos;re in!
        </h1>
        <p style={{ color: 'rgba(240,240,240,0.65)', fontSize: '16px', marginBottom: '32px', lineHeight: '1.6' }}>
          Your ContentBuddy subscription is active. Start creating content that takes 30 seconds instead of 3 hours.
        </p>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <button className="btn-primary" style={{ fontSize: '16px', padding: '14px 36px' }}>
            Start Creating →
          </button>
        </Link>
      </div>
    </div>
  )
}
