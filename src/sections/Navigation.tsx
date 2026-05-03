import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const navLinks = [
  { label: 'SHIPPERS', href: '#shippers' },
  { label: 'CARRIERS', href: '#carriers' },
  { label: 'SERVICES', href: '#services' },
  { label: 'ABOUT', href: '#about' },
  { label: 'CONTACT', href: '#contact' },
]

const letterPaths: Record<string, string> = {
  T: 'M0,0 L80,0 M40,0 L40,100',
  R: 'M0,0 L0,100 M0,0 L60,0 Q80,0 80,25 Q80,50 60,50 L0,50 M40,50 L80,100',
  U: 'M0,0 L0,75 Q0,100 25,100 L55,100 Q80,100 80,75 L80,0',
  E: 'M80,0 L0,0 L0,100 L80,100 M0,50 L70,50',
  V: 'M0,0 L40,100 L80,0',
  A: 'M0,100 L40,0 L80,100 M20,60 L60,60',
  L: 'M0,0 L0,100 L80,100',
}

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null)
  const logoRef = useRef<SVGSVGElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.8)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!logoRef.current) return
    const letters = logoRef.current.querySelectorAll('.logo-letter')
    gsap.from(letters, {
      scale: 0,
      duration: 1.5,
      ease: 'elastic.out(1, 0.5)',
      stagger: 0.08,
      delay: 0.3,
    })
  }, [])

  useEffect(() => {
    if (!navRef.current) return
    gsap.from(navRef.current, {
      opacity: 0,
      duration: 0.6,
      delay: 0.1,
    })
  }, [])

  const scrollTo = (href: string) => {
    setMobileOpen(false)
    const el = document.querySelector(href)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center transition-all duration-500 ${
        scrolled
          ? 'bg-[rgba(10,10,10,0.95)] backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <div className="w-full max-w-[1280px] mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className="flex flex-col items-start">
          <svg
            ref={logoRef}
            viewBox="0 0 900 100"
            className="w-[140px] md:w-[180px] h-auto overflow-visible"
          >
            <g className="logo-letters">
              {['T', 'R', 'U', 'E', 'V', 'A', 'L', 'U', 'E'].map((letter, index) => (
                <g
                  key={index}
                  className="logo-letter"
                  data-letter={letter}
                  transform={`translate(${index * 100}, 0)`}
                >
                  <path
                    d={letterPaths[letter]}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                  />
                </g>
              ))}
            </g>
          </svg>
          <span
            className="text-[9px] md:text-[10px] font-body font-medium uppercase tracking-[0.2em] text-white/60 mt-0.5"
          >
            LOGISTICS
          </span>
          <span className="mt-1.5 inline-block font-body font-semibold text-[10px] md:text-[11px] uppercase tracking-[0.15em] text-brand-orange bg-brand-orange/10 px-2.5 py-0.5 rounded">
            Powered by Loadvest
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => { e.preventDefault(); scrollTo(link.href) }}
              className="group relative font-body font-medium text-xs uppercase tracking-[0.08em] text-white/80 hover:text-white transition-colors"
            >
              {link.label}
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-brand-orange scale-0 group-hover:scale-100 transition-transform" />
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); scrollTo('#contact') }}
            className="font-body font-semibold text-xs uppercase tracking-[0.06em] text-white bg-brand-orange hover:bg-brand-blue px-6 py-2.5 rounded-full transition-colors"
          >
            GET A QUOTE
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-white transition-transform ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-transform ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="absolute top-16 left-0 right-0 bg-[rgba(10,10,10,0.98)] backdrop-blur-xl md:hidden flex flex-col p-6 gap-4 border-t border-white/10">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => { e.preventDefault(); scrollTo(link.href) }}
              className="font-body font-medium text-sm uppercase tracking-[0.08em] text-white/80 hover:text-white py-2"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); scrollTo('#contact') }}
            className="font-body font-semibold text-sm uppercase tracking-[0.06em] text-white bg-brand-orange text-center px-6 py-3 rounded-full mt-2"
          >
            GET A QUOTE
          </a>
        </div>
      )}
    </nav>
  )
}
