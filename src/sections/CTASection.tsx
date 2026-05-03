import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'

gsap.registerPlugin(ScrollTrigger)

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 })
  const rotationRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      const contentEls = sectionRef.current?.querySelectorAll('.cta-anim')
      if (contentEls) {
        gsap.from(contentEls, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Three.js Icosahedron
  useEffect(() => {
    if (!canvasRef.current || !particlesRef.current) return

    const width = canvasRef.current.offsetWidth || 800
    const height = canvasRef.current.offsetHeight || 500

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 2000)
    camera.position.set(0, 0, 600)

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height)

    // Icosahedron wireframe
    const geometry = new THREE.IcosahedronGeometry(120, 1)
    const wireframe = new THREE.WireframeGeometry(geometry)
    const material = new THREE.LineBasicMaterial({
      color: 0xF26522,
      transparent: true,
      opacity: 0.5,
    })
    const lines = new THREE.LineSegments(wireframe, material)
    scene.add(lines)

    // Text particles
    const phrase = 'TRUEVALUE LOGISTICS'
    const chars = phrase.split('')
    const particleCount = 40
    const particleElements: HTMLSpanElement[] = []

    for (let i = 0; i < particleCount; i++) {
      const span = document.createElement('span')
      span.className = 'text-particle'
      span.textContent = chars[i % chars.length]
      span.style.color = '#F26522'
      span.style.position = 'absolute'
      particlesRef.current.appendChild(span)
      particleElements.push(span)

      const phi = Math.acos(-1 + (2 * i) / particleCount)
      const theta = Math.sqrt(particleCount * Math.PI) * phi
      const radius = 160 + Math.random() * 40

      const x = radius * Math.cos(theta) * Math.sin(phi)
      const y = radius * Math.sin(theta) * Math.sin(phi)
      const z = radius * Math.cos(phi)

      span.dataset.x = String(x)
      span.dataset.y = String(y)
      span.dataset.z = String(z)
    }

    // Mouse handler
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.targetX = (event.clientY / window.innerHeight - 0.5) * Math.PI
      mouseRef.current.targetY = (event.clientX / window.innerWidth - 0.5) * Math.PI
    }
    document.addEventListener('mousemove', handleMouseMove)

    // Render loop
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate)

      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05

      rotationRef.current.x = mouseRef.current.x
      rotationRef.current.y = mouseRef.current.y

      lines.rotation.x = rotationRef.current.x * 0.5
      lines.rotation.y = rotationRef.current.y * 0.5 + 0.003

      // Update text particles
      particleElements.forEach((el) => {
        const x = parseFloat(el.dataset.x || '0')
        const y = parseFloat(el.dataset.y || '0')
        const z = parseFloat(el.dataset.z || '0')

        const rotX = rotationRef.current.x * 0.5
        const rotY = rotationRef.current.y * 0.5 + 0.003

        const cosY = Math.cos(rotY)
        const sinY = Math.sin(rotY)
        const cosX = Math.cos(rotX)
        const sinX = Math.sin(rotX)

        const rx = x * cosY - z * sinY
        const rz = x * sinY + z * cosY
        const ry = y * cosX - rz * sinX
        const rz2 = y * sinX + rz * cosX

        const scale = 600 / (600 + rz2)
        const screenX = rx * scale + width / 2
        const screenY = ry * scale + height / 2

        el.style.transform = `translate(${screenX}px, ${screenY}px) scale(${scale})`
        el.style.opacity = String(Math.max(0.1, scale * 0.6))
      })

      renderer.render(scene, camera)
    }

    animate()

    // Resize handler
    const handleResize = () => {
      const w = canvasRef.current?.offsetWidth || 800
      const h = canvasRef.current?.offsetHeight || 500
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(rafRef.current)
      document.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      geometry.dispose()
      wireframe.dispose()
      material.dispose()
      particleElements.forEach((el) => el.remove())
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="carriers"
      className="relative w-full min-h-[500px] overflow-hidden bg-brand-dark py-20 md:py-[120px]"
    >
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
        />
        <div
          ref={particlesRef}
          className="absolute inset-0 pointer-events-none"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-12 flex flex-col items-center text-center">
        <h2 className="cta-anim font-display font-bold text-[40px] md:text-[56px] text-white leading-[0.95] tracking-[-0.02em]">
          Ready to Ship Smarter?
        </h2>
        <p className="cta-anim mt-4 font-body text-lg text-white/70 max-w-[520px]">
          Get a free quote in minutes. No obligations, no hidden fees — just competitive rates and reliable service.
        </p>
        <div className="cta-anim mt-10 flex flex-col sm:flex-row gap-4">
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }) }}
            className="inline-block font-body font-semibold text-sm uppercase tracking-[0.06em] text-white bg-brand-orange hover:bg-[#FF7A3D] px-9 py-4 rounded-full transition-colors"
          >
            GET A FREE QUOTE
          </a>
          <a
            href="tel:917-803-3898"
            className="inline-block font-body font-semibold text-sm uppercase tracking-[0.06em] text-white border border-white/30 hover:border-white/60 px-9 py-4 rounded-full transition-colors"
          >
            CALL US NOW
          </a>
        </div>
      </div>
    </section>
  )
}
