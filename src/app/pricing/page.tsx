'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { isLoggedIn } from '@/lib/auth'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    color: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(255,255,255,0.15)',
    features: [
      '3 generations total',
      'All 9 content types',
      'No credit card required',
      'Perfect to try it out',
    ],
    cta: 'Get Started Free',
    ctaHref: '/signup',
    highlight: false,
  },
  {
    name: 'Creator',
    price: '$17',
    period: '/month',
    color: 'rgba(124,58,237,0.12)',
    borderColor: 'rgba(124,58,237,0.4)',
    features: [
      'Unlimited generations',
      'All 9 content types',
      'Priority processing',
      'Email support',
    ],
    cta: 'Start Creating',
    ctaHref: '/signup',
    highlight: true,
    badge: '⭐ Most Popular',
  },
  {
    name: 'Studio',
    price: '$47',
    period: '/month',
    color: 'rgba(6,182,212,0.08)',
    borderColor: 'rgba(6,182,212,0.3)',
    features: [
      'Unlimited generations',
      'All 9 content types',
      'Priority processing',
      'API access',
      'Dedicated support',
      'Team collaboration',
    ],
    cta: 'Go Studio',
    ctaHref: '/signup',
    highlight: false,
  },
]

export default function PricingPage() {
  const router = useRouter()

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f' }}>
      {/* Header */}
      <header style={{
        borderBottom: '1px solid rgba(124,58,237,0.2)',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: 'bold' }}>
              <span className="gradient-text">ContentBuddy</span>
            </h1>
            <p style={{ fontSize: '11px', color: 'rgba(240,240,240,0.4)', marginTop: '2px' }}>by WastedApe</p>
          </div>
        </Link>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/login">
            <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }}>Sign In</button>
          </Link>
          <Link href="/signup">
            <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>Get Started</button>
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '64px 24px' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(28px, 5vw, 42px)',
            fontWeight: 'bold',
            marginBottom: '16px',
          }}>
            Simple, <span className="gradient-text">creator-friendly</span> pricing
          </h2>
          <p style={{ color: 'rgba(240,240,240,0.55)', fontSize: '17px' }}>
            Start free. Upgrade when you&apos;re ready to go all-in.
          </p>
        </div>

        {/* Plans grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          alignItems: 'start',
        }}>
          {plans.map(plan => (
            <div
              key={plan.name}
              style={{
                background: plan.color,
                border: `1px solid ${plan.borderColor}`,
                borderRadius: '20px',
                padding: '32px',
                position: 'relative',
                transform: plan.highlight ? 'scale(1.03)' : 'scale(1)',
                boxShadow: plan.highlight ? '0 0 50px rgba(124,58,237,0.2)' : 'none',
              }}
            >
              {plan.badge && (
                <div style={{
                  position: 'absolute',
                  top: '-14px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                  padding: '4px 16px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}>
                  {plan.badge}
                </div>
              )}

              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>{plan.name}</h3>
              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontSize: '42px', fontWeight: 'bold', fontFamily: 'Georgia, serif' }}>{plan.price}</span>
                <span style={{ color: 'rgba(240,240,240,0.5)', fontSize: '14px', marginLeft: '4px' }}>{plan.period}</span>
              </div>

              <ul style={{ listStyle: 'none', marginBottom: '32px' }}>
                {plan.features.map(f => (
                  <li key={f} style={{
                    padding: '8px 0',
                    fontSize: '14px',
                    color: 'rgba(240,240,240,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                  }}>
                    <span style={{ color: '#a78bfa', fontSize: '16px' }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link href={plan.ctaHref} style={{ textDecoration: 'none', display: 'block' }}>
                <button
                  className={plan.highlight ? 'btn-primary' : 'btn-outline'}
                  style={{ width: '100%', justifyContent: 'center', fontSize: '15px', padding: '13px' }}
                >
                  {plan.cta}
                </button>
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div style={{ marginTop: '80px', textAlign: 'center' }}>
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 'bold', marginBottom: '40px' }}>
            Common Questions
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', textAlign: 'left' }}>
            {[
              {
                q: 'What counts as a "generation"?',
                a: 'One generation = one click of "Generate Content". You can select multiple content types and they all generate in one click.',
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Yes, cancel anytime. No contracts, no hidden fees. Your account stays active until the end of the billing period.',
              },
              {
                q: 'What AI model powers ContentBuddy?',
                a: 'We use GPT-4o for all generations — the most capable model available, giving you top-quality output every time.',
              },
              {
                q: 'What content types are included?',
                a: 'YouTube scripts, blog posts, title options, descriptions, Instagram captions, TikTok scripts, Twitter threads, LinkedIn posts, and email newsletters.',
              },
            ].map(item => (
              <div key={item.q} className="panel" style={{ padding: '20px' }}>
                <p style={{ fontWeight: 700, marginBottom: '8px', fontSize: '14px' }}>{item.q}</p>
                <p style={{ color: 'rgba(240,240,240,0.6)', fontSize: '14px', lineHeight: 1.6 }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer style={{
        textAlign: 'center',
        padding: '32px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        color: 'rgba(240,240,240,0.25)',
        fontSize: '13px',
      }}>
        © 2025 WastedApe · ContentBuddy
      </footer>
    </div>
  )
}
