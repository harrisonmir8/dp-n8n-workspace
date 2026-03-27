import { useState, useEffect } from 'react'
import {
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Eye,
  Layers,
  Search,
  BarChart3,
  MousePointerClick,
  Share2,
  Megaphone,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react'
import './App.css'

function App() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Navigation */}
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner">
          <a href="#" className="nav-logo">
            <div className="logo-mark">DP</div>
            Digital Position
          </a>
          <div className="nav-links">
            <a href="#problem">The Problem</a>
            <a href="#solution">Our Approach</a>
            <a href="#services">Services</a>
            <a href="#cta" className="nav-cta">Get Started</a>
          </div>
          <button
            className="mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero" id="hero">
        <div className="hero-bg">
          <div className="hero-bg-gradient" />
          <div className="hero-bg-grid" />
        </div>
        <div className="hero-content">
          <div className="section-label">Full-Stack Performance Marketing</div>
          <h1>
            We unleash your business's
            <br />
            ability to <span className="accent-word">scale.</span>
          </h1>
          <p className="hero-subtitle">
            Digital Position is a full-stack performance marketing agency that exists to
            solve one core problem we see with nearly every business we work with.
          </p>
          <div className="hero-ctas">
            <a href="#cta" className="btn-primary">
              Let's Talk <ArrowRight size={18} />
            </a>
            <a href="#problem" className="btn-secondary">
              See the Problem <ChevronRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="problem-section" id="problem">
        <div className="problem-inner">
          <div className="problem-header">
            <div className="section-label">The Core Problem</div>
            <h2>
              Your business has<br />
              <span className="highlight-red">Phantom Progress.</span>
            </h2>
            <p>
              When a brand has a marketing department, multiple contractors, or even
              multiple agencies spending time and money on marketing — but they aren't
              seeing an impact on growth or profitability.
            </p>
          </div>

          <div className="problem-card">
            <div className="problem-card-content">
              <div className="problem-text">
                <h3>Activity ≠ Progress</h3>
                <p>
                  They're stagnant despite all the time and effort put in. This defines
                  a big misunderstanding between activity and progress. Irrelevant
                  messaging and fragmented marketing efforts that seem proactive, but
                  actually just waste time, money, and energy.
                </p>
              </div>
              <div className="problem-visual">
                <div className="phantom-metric">
                  <div className="phantom-metric-icon activity">
                    <Activity size={20} />
                  </div>
                  <div className="phantom-metric-info">
                    <div className="label">Marketing Activity</div>
                    <div className="value">Very High</div>
                  </div>
                  <span className="status up">
                    <TrendingUp size={14} /> Active
                  </span>
                </div>
                <div className="phantom-metric">
                  <div className="phantom-metric-icon progress">
                    <Target size={20} />
                  </div>
                  <div className="phantom-metric-info">
                    <div className="label">Revenue Growth</div>
                    <div className="value">Flat</div>
                  </div>
                  <span className="status flat">
                    <TrendingDown size={14} /> Stagnant
                  </span>
                </div>
                <div className="phantom-metric">
                  <div className="phantom-metric-icon progress">
                    <BarChart3 size={20} />
                  </div>
                  <div className="phantom-metric-info">
                    <div className="label">Profitability Impact</div>
                    <div className="value">None</div>
                  </div>
                  <span className="status flat">
                    <TrendingDown size={14} /> No Impact
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="problem-result">
            <p>
              Most agencies look at isolated tactics or operate in <span className="emphasis">siloed channels</span> —
              Google, Meta, SEO, organic social, CRO — but none of them look at the whole picture.
              That's why progress stalls.
            </p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="solution-section" id="solution">
        <div className="solution-inner">
          <div className="solution-header">
            <div className="section-label">Our Approach</div>
            <h2>
              We take the{' '}
              <span className="highlight-blue">holistic view.</span>
            </h2>
            <p>
              We look at your whole ecosystem and how every piece works together to
              drive real, measurable progress — not just activity.
            </p>
          </div>

          <div className="solution-grid">
            <div className="solution-card">
              <div className="solution-card-icon">
                <Eye size={24} />
              </div>
              <h3>Full-Ecosystem Visibility</h3>
              <p>
                We don't silo channels. We analyze how every marketing touchpoint
                interacts and compounds to move the needle on growth.
              </p>
            </div>
            <div className="solution-card">
              <div className="solution-card-icon">
                <Layers size={24} />
              </div>
              <h3>Unified Strategy</h3>
              <p>
                One cohesive plan across paid, organic, creative, and CRO — so every
                dollar and hour drives toward the same goal.
              </p>
            </div>
            <div className="solution-card">
              <div className="solution-card-icon">
                <Target size={24} />
              </div>
              <h3>Growth-Focused Execution</h3>
              <p>
                We measure what matters: revenue, profitability, and real business
                outcomes — not vanity metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section" id="services">
        <div className="services-inner">
          <div className="services-header">
            <div className="section-label">What We Do</div>
            <h2>Full-Stack Capabilities</h2>
            <p>
              Every channel, every touchpoint — working together under one roof.
            </p>
          </div>

          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                <Search size={20} />
              </div>
              <div className="service-info">
                <h3>SEO</h3>
                <p>
                  Technical, on-page, and content strategy that builds sustainable
                  organic growth.
                </p>
              </div>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <MousePointerClick size={20} />
              </div>
              <div className="service-info">
                <h3>Paid Search & Shopping</h3>
                <p>
                  Google Ads management that maximizes ROAS with precision targeting.
                </p>
              </div>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <Megaphone size={20} />
              </div>
              <div className="service-info">
                <h3>Paid Social</h3>
                <p>
                  Meta, TikTok, and beyond — creative-driven campaigns that convert.
                </p>
              </div>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <BarChart3 size={20} />
              </div>
              <div className="service-info">
                <h3>CRO & Analytics</h3>
                <p>
                  Conversion optimization and measurement that turns traffic into revenue.
                </p>
              </div>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <Share2 size={20} />
              </div>
              <div className="service-info">
                <h3>Organic Social</h3>
                <p>
                  Content strategy and community building that amplifies your brand.
                </p>
              </div>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <Layers size={20} />
              </div>
              <div className="service-info">
                <h3>Creative & Strategy</h3>
                <p>
                  End-to-end creative production tied directly to performance data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" id="cta">
        <div className="cta-inner">
          <div className="section-label">Ready to Scale?</div>
          <h2>Stop the phantom progress.</h2>
          <p>
            Let's look at your entire marketing ecosystem and build a plan
            that actually moves the needle.
          </p>
          <a href="#" className="btn-primary">
            Get Your Free Audit <ArrowRight size={18} />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-logo">© 2026 Digital Position</div>
          <div className="footer-links">
            <a href="#">Services</a>
            <a href="#">About</a>
            <a href="#">Case Studies</a>
            <a href="#">Blog</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </>
  )
}

export default App
