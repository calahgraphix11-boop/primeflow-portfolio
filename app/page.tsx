'use client';

import { useEffect, useState } from 'react';
import PortfolioGrid from '@/components/PortfolioGrid';

const PORTFOLIO_TABS = [
  { key: 'websites',  label: 'Websites'  },
  { key: 'branding',  label: 'Branding'  },
  { key: 'flyers',    label: 'Flyers'    },
] as const

type PortfolioSection = typeof PORTFOLIO_TABS[number]['key']

export default function Home() {
  const [activeSection, setActiveSection] = useState<PortfolioSection>('websites')

  useEffect(() => {
    // ── Scroll progress bar
    const progressBar = document.getElementById('progress-bar') as HTMLElement;
    if (progressBar) {
      window.addEventListener('scroll', () => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        if (total > 0) progressBar.style.width = (window.scrollY / total * 100) + '%';
      }, { passive: true });
    }

    // ── Animated counters
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        const target = +(el.dataset.target || 0);
        const suffix = el.dataset.suffix || '';
        const steps = 60;
        const interval = 1600 / steps;
        let step = 0;
        const timer = setInterval(() => {
          step++;
          const value = step >= steps ? target : Math.floor((step / steps) * target);
          el.textContent = value + suffix;
          if (step >= steps) clearInterval(timer);
        }, interval);
        counterObserver.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));

    // ── Testimonials carousel
    const track = document.getElementById('testimonials-track') as HTMLElement;
    const dotsContainer = document.getElementById('testimonials-dots');
    if (track && dotsContainer) {
      const slides = Array.from(track.children);
      let current = 0;
      let autoTimer: ReturnType<typeof setInterval>;
      const inactiveDot = () => document.documentElement.classList.contains('dark') ? 'rgba(255,255,255,0.18)' : '#e4e4e0';
      const dots = slides.map((_, i) => {
        const dot = document.createElement('button');
        dot.style.cssText = `width:8px;height:8px;border-radius:50%;border:none;cursor:pointer;transition:background 0.3s;background:${i === 0 ? '#F5B800' : inactiveDot()};`;
        dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        dot.addEventListener('click', () => { goTo(i); resetAuto(); });
        dotsContainer.appendChild(dot);
        return dot;
      });
      function goTo(index: number) {
        current = (index + slides.length) % slides.length;
        track.style.transform = `translateX(-${current * 100}%)`;
        dots.forEach((d, i) => { d.style.background = i === current ? '#F5B800' : inactiveDot(); });
      }
      function startAuto() { autoTimer = setInterval(() => goTo(current + 1), 4000); }
      function resetAuto() { clearInterval(autoTimer); startAuto(); }
      startAuto();
      const wrapper = document.getElementById('testimonials-wrapper');
      if (wrapper) {
        wrapper.addEventListener('mouseenter', () => clearInterval(autoTimer));
        wrapper.addEventListener('mouseleave', () => startAuto());
      }
    }

    // ── Before/After slider
    const baSlider = document.getElementById('ba-slider');
    const baBefore = document.getElementById('ba-before') as HTMLElement;
    const baHandle = document.getElementById('ba-handle') as HTMLElement;
    if (baSlider && baBefore && baHandle) {
      let dragging = false;
      function setPos(clientX: number) {
        const r = baSlider!.getBoundingClientRect();
        const pct = Math.min(Math.max((clientX - r.left) / r.width * 100, 0), 100);
        baHandle.style.left = pct + '%';
        baBefore.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
      }
      baHandle.addEventListener('mousedown', e => { dragging = true; e.preventDefault(); });
      window.addEventListener('mousemove', e => { if (dragging) setPos(e.clientX); });
      window.addEventListener('mouseup', () => { dragging = false; });
      baHandle.addEventListener('touchstart', () => { dragging = true; }, { passive: true });
      window.addEventListener('touchmove', e => { if (dragging) setPos(e.touches[0].clientX); }, { passive: true });
      window.addEventListener('touchend', () => { dragging = false; });
    }

    // ── Pricing cards
    type Plan = { name: string; desc: string; price: string; popular: boolean; features: string[] };
    const pricingPlans: Record<string, Plan[]> = {
      websites: [
        { name: 'Starter', desc: 'Portfolio page + booking button', price: '250', popular: false,
          features: ['1-page portfolio site', 'Booking button setup', 'Mobile-optimised', 'Delivered in 1–3 days'] },
        { name: 'Core', desc: 'Full portfolio + booking integration', price: '400', popular: false,
          features: ['Multi-page portfolio', 'Booking system integration', 'Payment setup', 'Mobile-optimised', 'Delivered in 1–3 days'] },
        { name: 'Full System', desc: 'Complete business system', price: '800', popular: true,
          features: ['Full portfolio site', 'Booking + payment system', 'Client dashboard', 'Custom domain setup', 'Priority delivery'] },
      ],
      menu: [
        { name: 'Starter', desc: 'Digital menu + QR code', price: '300', popular: false,
          features: ['Digital menu page', 'Custom QR code', 'Mobile-optimised', 'Delivered in 1–3 days'] },
        { name: 'Core', desc: 'Menu + QR + order flow', price: '500', popular: false,
          features: ['Digital menu', 'Custom QR system', 'Order flow setup', 'Mobile-optimised', 'Delivered in 1–3 days'] },
        { name: 'Full Package', desc: 'Complete restaurant system', price: '900', popular: true,
          features: ['Full digital menu', 'QR code system', 'Online ordering', 'Booking integration', 'Priority delivery'] },
      ],
    };

    function renderPricingCards(tabKey: string) {
      const wrap = document.getElementById('pricing-cards');
      if (!wrap) return;
      const dark = document.documentElement.classList.contains('dark');
      const txtPrimary = dark ? '#f0f0ee' : '#1a1a18';
      const txtMuted   = dark ? '#9b9b98' : '#6b6b68';
      const cardBg     = (plan: Plan) => dark ? (plan.popular ? 'rgba(26,26,24,0.92)' : 'rgba(26,26,24,0.75)')
                                              : (plan.popular ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.72)');
      const borderCol  = (plan: Plan) => dark ? (plan.popular ? 'rgba(245,184,0,0.5)' : 'rgba(255,255,255,0.08)')
                                              : (plan.popular ? 'rgba(245,184,0,0.5)' : 'rgba(0,0,0,0.08)');
      const dividerCol = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)';
      const btnBgAlt   = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)';
      const btnBorderAlt = dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
      const btnColorAlt  = dark ? '#9b9b98' : '#3a3a38';
      wrap.innerHTML = pricingPlans[tabKey].map(plan => {
        const msg = encodeURIComponent("Hi PrimeFlow! I'm interested in the " + plan.name + " plan.");
        const waUrl = 'https://wa.me/237678683534?text=' + msg;
        const feats = plan.features.map(f =>
          `<li style="display:flex;align-items:center;gap:9px;font-size:0.8rem;color:${txtMuted};">` +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C99600" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>' +
          f + '</li>'
        ).join('');
        return `<div style="backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);background:${cardBg(plan)};border:1px solid ${borderCol(plan)};border-radius:20px;padding:32px 26px;flex:1;min-width:220px;max-width:270px;display:flex;flex-direction:column;position:relative;transform:${plan.popular ? 'scale(1.05)' : 'scale(1)'};box-shadow:${plan.popular ? '0 20px 60px rgba(245,184,0,0.18),0 4px 20px rgba(0,0,0,0.08)' : '0 4px 16px rgba(0,0,0,0.06)'};">
          ${plan.popular ? `<div style="position:absolute;top:-13px;right:16px;background:#F5B800;color:#1a1a18;font-size:0.68rem;font-weight:700;padding:4px 12px;border-radius:999px;letter-spacing:0.04em;">Most Popular</div>` : ''}
          <h3 style="font-size:2rem;font-weight:300;letter-spacing:-0.03em;color:${txtPrimary};margin:0 0 4px;">${plan.name}</h3>
          <p style="font-size:0.8rem;color:${txtMuted};margin:0 0 20px;">${plan.desc}</p>
          <div style="display:flex;align-items:baseline;gap:6px;margin-bottom:20px;">
            <span style="font-size:2.4rem;font-weight:300;color:${txtPrimary};">$${plan.price}</span>
            <span style="font-size:0.75rem;color:#9b9b98;">one-time</span>
          </div>
          <div style="height:1px;background:linear-gradient(90deg,transparent,${dividerCol},transparent);margin-bottom:18px;"></div>
          <ul style="list-style:none;padding:0;margin:0 0 24px;display:flex;flex-direction:column;gap:9px;flex:1;">${feats}</ul>
          <button class="pricing-btn" data-url="${waUrl}" style="width:100%;padding:11px 0;border-radius:12px;background:${plan.popular ? '#F5B800' : btnBgAlt};color:${plan.popular ? '#1a1a18' : btnColorAlt};border:1px solid ${plan.popular ? 'transparent' : btnBorderAlt};font-family:inherit;font-weight:700;font-size:0.82rem;cursor:pointer;position:relative;overflow:hidden;transition:opacity 0.2s;">Get Started</button>
        </div>`;
      }).join('');

      wrap.querySelectorAll('.pricing-btn').forEach(btn => {
        const b = btn as HTMLButtonElement;
        b.addEventListener('mouseenter', () => { b.style.opacity = '0.82'; });
        b.addEventListener('mouseleave', () => { b.style.opacity = '1'; });
        b.addEventListener('click', function(e) {
          const rect = b.getBoundingClientRect();
          const size = Math.max(rect.width, rect.height) * 2;
          const ripple = document.createElement('span');
          ripple.style.cssText = 'position:absolute;border-radius:50%;background:rgba(0,0,0,0.12);animation:pricing-ripple 0.55s ease-out forwards;pointer-events:none;'
            + 'width:' + size + 'px;height:' + size + 'px;'
            + 'left:' + ((e as MouseEvent).clientX - rect.left - size / 2) + 'px;'
            + 'top:' + ((e as MouseEvent).clientY - rect.top - size / 2) + 'px;';
          b.appendChild(ripple);
          setTimeout(() => ripple.remove(), 600);
          window.open(b.dataset.url, '_blank');
        });
      });
    }

    const pricingTabsEl = document.getElementById('pricing-tabs');
    if (pricingTabsEl) {
      pricingTabsEl.addEventListener('click', function(e) {
        const btn = (e.target as Element).closest('button[data-tab]') as HTMLButtonElement;
        if (!btn) return;
        const dark = document.documentElement.classList.contains('dark');
        this.querySelectorAll('button').forEach(b => {
          (b as HTMLButtonElement).style.background = 'transparent';
          (b as HTMLButtonElement).style.color = dark ? '#9b9b98' : '#6b6b68';
          (b as HTMLButtonElement).style.border = '1px solid ' + (dark ? '#2e2e2b' : '#e4e4e0');
        });
        btn.style.background = '#F5B800';
        btn.style.color = '#1a1a18';
        btn.style.border = 'none';
        renderPricingCards(btn.dataset.tab || 'websites');
      });
    }
    renderPricingCards('websites');

    // ── Pricing WebGL background
    (function() {
      const canvas = document.getElementById('pricing-bg') as HTMLCanvasElement;
      if (!canvas) return;
      const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false }) as WebGLRenderingContext;
      if (!gl) return;
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      const vs = `attribute vec2 p; void main(){gl_Position=vec4(p,0.,1.);}`;
      const fs = `precision highp float;uniform float t;uniform vec2 res;mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}float va(vec2 a,vec2 b,float st,float sp){return sin(dot(normalize(a),normalize(b))*st+t*sp)/100.;}float ring(vec2 uv,vec2 c,float r,float w){vec2 d=c-uv;float l=length(d);l+=va(d,vec2(0,1),5.,2.);l-=va(d,vec2(1,0),5.,2.);return smoothstep(r-w,r,l)-smoothstep(r,r+w,l);}void main(){vec2 uv=gl_FragCoord.xy/res;uv.x*=1.5;uv.x-=0.25;vec2 c=vec2(.5);float r=.35;float m=ring(uv,c,r,.035)+ring(uv,c,r-.018,.01)+ring(uv,c,r+.018,.005);float bright=ring(uv,c,r,.003);float alpha=clamp(m*3.5+bright*2.,0.,1.);vec2 v=rot(t)*uv;float blend=clamp(v.x*1.4+0.5,0.,1.);vec3 deepGold=vec3(0.788,0.588,0.0);vec3 brandGold=vec3(0.961,0.722,0.0);vec3 lightYellow=vec3(0.992,0.851,0.416);vec3 col=mix(deepGold,mix(brandGold,lightYellow,blend),blend);col=mix(col,vec3(1.),bright/max(alpha,0.001));gl_FragColor=vec4(col,alpha);}`;
      const mk = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
      const prog = gl.createProgram()!;
      gl.attachShader(prog, mk(gl.VERTEX_SHADER, vs));
      gl.attachShader(prog, mk(gl.FRAGMENT_SHADER, fs));
      gl.linkProgram(prog); gl.useProgram(prog);
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
      const ap = gl.getAttribLocation(prog, 'p');
      gl.enableVertexAttribArray(ap); gl.vertexAttribPointer(ap, 2, gl.FLOAT, false, 0, 0);
      const tL = gl.getUniformLocation(prog, 't'), rL = gl.getUniformLocation(prog, 'res');
      const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; gl.viewport(0, 0, canvas.width, canvas.height); };
      resize();
      new ResizeObserver(resize).observe(canvas.parentElement!);
      const draw = (ts: number) => { gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT); gl.uniform1f(tL, ts * .001); gl.uniform2f(rL, canvas.width, canvas.height); gl.drawArrays(gl.TRIANGLES, 0, 6); requestAnimationFrame(draw); };
      requestAnimationFrame(draw);
    })();

    // ── Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', function() {
        const html = document.documentElement;
        html.classList.toggle('dark');
        localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
        const activePricingTab = document.querySelector('#pricing-tabs button[style*="#F5B800"]') as HTMLButtonElement;
        renderPricingCards(activePricingTab ? (activePricingTab.dataset.tab || 'websites') : 'websites');
      });
    }

    // ── FAQ accordion
    document.querySelectorAll('.faq-item').forEach(item => {
      const btn = item.querySelector('.faq-btn');
      const body = item.querySelector('.faq-body') as HTMLElement;
      const icon = item.querySelector('.faq-icon') as HTMLElement;
      btn?.addEventListener('click', () => {
        const isOpen = item.classList.contains('faq-open');
        document.querySelectorAll('.faq-item.faq-open').forEach(open => {
          open.classList.remove('faq-open');
          (open.querySelector('.faq-body') as HTMLElement).style.maxHeight = '0';
          (open.querySelector('.faq-icon') as HTMLElement).textContent = '+';
        });
        if (!isOpen) {
          item.classList.add('faq-open');
          body.style.maxHeight = body.scrollHeight + 'px';
          if (icon) icon.textContent = '−';
        }
      });
    });
  }, []);

  return (
    <>
      <div id="progress-bar" />

      {/* Navigation */}
      <header className="site-header">
        <div className="max-w-screen-xl mx-auto px-8 py-5 flex items-center justify-between">
          <a href="#" className="flex flex-col leading-none gap-0.5">
            <span className="font-extrabold text-xl tracking-tight leading-none text-txt-primary">PRIME<span className="text-brand-gold">FLOW</span></span>
            <span className="text-txt-muted text-[9px] tracking-[0.22em] font-medium uppercase">SOLUTIONS</span>
          </a>
          <nav className="flex items-center gap-7">
            <a href="#services" className="text-txt-muted text-sm hover:text-txt-primary transition-colors">Services</a>
            <a href="#portfolio" className="text-txt-muted text-sm hover:text-txt-primary transition-colors">Portfolio</a>
            <a href="#about" className="text-txt-muted text-sm hover:text-txt-primary transition-colors">About</a>
            <a href="#pricing" className="text-txt-muted text-sm hover:text-txt-primary transition-colors">Pricing</a>
            <a href="#faq" className="text-txt-muted text-sm hover:text-txt-primary transition-colors">FAQ</a>
            <button id="theme-toggle" aria-label="Toggle dark mode">
              <svg id="icon-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              <svg id="icon-moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            </button>
            <a href="https://www.instagram.com/primeflow_1?igsh=MWtsdWoyZGw0bDhsYw==" target="_blank" rel="noopener noreferrer"
               className="ml-2 bg-brand-gold hover:bg-brand-gold-dk text-txt-primary text-sm font-bold px-5 py-2.5 rounded-full transition-colors">
              Book a free call
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Geometric */}
      <section style={{position:'relative',zIndex:2,width:'100%',minHeight:'92vh',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',background:'#0d0d0b'}}>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 18% 60%, rgba(245,184,0,0.07) 0%, transparent 55%), radial-gradient(ellipse at 82% 38%, rgba(201,150,0,0.05) 0%, transparent 55%)',pointerEvents:'none'}}></div>
        <div style={{position:'absolute',left:'-5%',top:'20%',transform:'rotate(12deg)'}}>
          <div className="hero-shape" style={{width:'600px',height:'140px',animation:'heroShapeEntry 2.4s cubic-bezier(0.23,0.86,0.39,0.96) 0.3s forwards, heroShapeFloat 12s ease-in-out 2.7s infinite'}}>
            <div style={{position:'absolute',inset:0,borderRadius:'9999px',background:'linear-gradient(to right,rgba(245,184,0,0.14),transparent)',border:'2px solid rgba(245,184,0,0.18)',boxShadow:'0 8px 32px 0 rgba(245,184,0,0.08)'}}></div>
          </div>
        </div>
        <div style={{position:'absolute',right:'0%',top:'72%',transform:'rotate(-15deg)'}}>
          <div className="hero-shape" style={{width:'500px',height:'120px',animation:'heroShapeEntry 2.4s cubic-bezier(0.23,0.86,0.39,0.96) 0.5s forwards, heroShapeFloat 12s ease-in-out 2.9s infinite'}}>
            <div style={{position:'absolute',inset:0,borderRadius:'9999px',background:'linear-gradient(to right,rgba(201,150,0,0.14),transparent)',border:'2px solid rgba(201,150,0,0.18)',boxShadow:'0 8px 32px 0 rgba(201,150,0,0.08)'}}></div>
          </div>
        </div>
        <div style={{position:'absolute',left:'10%',bottom:'10%',transform:'rotate(-8deg)'}}>
          <div className="hero-shape" style={{width:'300px',height:'80px',animation:'heroShapeEntry 2.4s cubic-bezier(0.23,0.86,0.39,0.96) 0.4s forwards, heroShapeFloat 12s ease-in-out 2.8s infinite'}}>
            <div style={{position:'absolute',inset:0,borderRadius:'9999px',background:'linear-gradient(to right,rgba(245,184,0,0.10),transparent)',border:'2px solid rgba(245,184,0,0.13)',boxShadow:'0 8px 32px 0 rgba(245,184,0,0.05)'}}></div>
          </div>
        </div>
        <div style={{position:'absolute',right:'20%',top:'14%',transform:'rotate(20deg)'}}>
          <div className="hero-shape" style={{width:'200px',height:'60px',animation:'heroShapeEntry 2.4s cubic-bezier(0.23,0.86,0.39,0.96) 0.6s forwards, heroShapeFloat 12s ease-in-out 3.0s infinite'}}>
            <div style={{position:'absolute',inset:0,borderRadius:'9999px',background:'linear-gradient(to right,rgba(253,217,106,0.14),transparent)',border:'2px solid rgba(253,217,106,0.17)',boxShadow:'0 8px 32px 0 rgba(253,217,106,0.07)'}}></div>
          </div>
        </div>
        <div style={{position:'absolute',left:'26%',top:'9%',transform:'rotate(-25deg)'}}>
          <div className="hero-shape" style={{width:'150px',height:'40px',animation:'heroShapeEntry 2.4s cubic-bezier(0.23,0.86,0.39,0.96) 0.7s forwards, heroShapeFloat 12s ease-in-out 3.1s infinite'}}>
            <div style={{position:'absolute',inset:0,borderRadius:'9999px',background:'linear-gradient(to right,rgba(245,184,0,0.10),transparent)',border:'2px solid rgba(245,184,0,0.12)'}}></div>
          </div>
        </div>
        <div style={{position:'relative',zIndex:10,textAlign:'center',maxWidth:'780px',padding:'0 1.5rem'}}>
          <div className="hero-anim-0" style={{display:'inline-flex',alignItems:'center',gap:'8px',padding:'6px 16px',borderRadius:'9999px',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(245,184,0,0.22)',marginBottom:'2.5rem'}}>
            <span style={{width:'8px',height:'8px',borderRadius:'50%',background:'#F5B800',flexShrink:0,display:'inline-block'}}></span>
            <span style={{fontSize:'0.78rem',color:'rgba(255,255,255,0.55)',letterSpacing:'0.07em',fontFamily:"'Host Grotesk',sans-serif"}}>PrimeFlow Solutions</span>
          </div>
          <h1 className="hero-anim-1" style={{fontFamily:"'Host Grotesk',sans-serif",fontWeight:800,letterSpacing:'-0.02em',lineHeight:1.08,margin:'0 0 1.5rem',fontSize:'clamp(2.6rem,7.5vw,5.2rem)'}}>
            <span style={{display:'block',background:'linear-gradient(to bottom,#ffffff,rgba(255,255,255,0.78))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Look premium. Get trusted.</span>
            <span style={{display:'block',background:'linear-gradient(to right,#FDD96A,#F5B800,#C99600)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Get customers.</span>
          </h1>
          <p className="hero-anim-2" style={{fontFamily:"'Host Grotesk',sans-serif",fontSize:'1rem',color:'rgba(255,255,255,0.42)',maxWidth:'480px',margin:'0 auto 2.5rem',lineHeight:1.8,fontWeight:300,letterSpacing:'0.02em'}}>
            Primeflow is a digital solutions studio helping small businesses improve how they look, communicate and grow online. Branding · Online Presence · Visibility Systems.
          </p>
          <div className="hero-anim-3">
            <a href="https://wa.me/237678683534?text=Hi%20PrimeFlow!%20I%27d%20like%20to%20book%20a%20free%20consultation."
               target="_blank" rel="noopener noreferrer" className="hero-cta"
               style={{display:'inline-flex',alignItems:'center',gap:'10px',background:'#F5B800',color:'#1a1a18',fontFamily:"'Host Grotesk',sans-serif",fontWeight:700,fontSize:'0.9rem',padding:'14px 28px',borderRadius:'14px',textDecoration:'none',transition:'background 0.2s',boxShadow:'0 4px 24px rgba(245,184,0,0.25)'}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{flexShrink:0}}>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Let&apos;s talk on WhatsApp
            </a>
          </div>
        </div>
        <div style={{position:'absolute',left:0,right:0,top:0,height:'80px',background:'linear-gradient(to bottom,rgba(13,13,11,0.9),transparent)',pointerEvents:'none',zIndex:5}}></div>
        <div style={{position:'absolute',left:0,right:0,bottom:0,height:'110px',background:'linear-gradient(to bottom,transparent,var(--page-bg))',pointerEvents:'none',zIndex:5}}></div>
      </section>

      {/* Portfolio mockup */}
      <section className="max-w-5xl mx-auto px-6 mb-24">
        <div className="rounded-3xl overflow-hidden border border-surf-border bg-surf-card shadow-xl">
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-surf-border bg-surf-inset">
            <span className="w-3 h-3 rounded-full bg-red-400/80"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-400/80"></span>
            <span className="w-3 h-3 rounded-full bg-green-400/80"></span>
            <div className="ml-3 flex-1 bg-surf-card rounded-md h-6 max-w-xs border border-surf-border"></div>
          </div>
          <div className="grid grid-cols-12 min-h-96">
            <aside className="col-span-3 border-r border-surf-border p-4 flex flex-col gap-3 bg-surf-inset">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded bg-brand-gold flex items-center justify-center text-xs font-extrabold text-txt-primary">P</div>
                <div className="h-3 w-20 bg-surf-border rounded"></div>
              </div>
              <div className="space-y-2 mt-1">
                <div className="h-6 w-full bg-surf-card rounded border border-surf-border"></div>
                <div className="h-6 w-4/5 bg-surf-card rounded border border-surf-border"></div>
                <div className="h-6 w-3/5 bg-surf-card rounded border border-surf-border"></div>
                <div className="h-6 w-full bg-surf-card rounded border border-surf-border"></div>
              </div>
              <div className="mt-3 space-y-1.5">
                <div className="h-5 w-full bg-brand-gold/20 rounded flex items-center px-2"><div className="h-2 w-16 bg-brand-gold/60 rounded"></div></div>
                <div className="h-5 w-4/5 bg-surf-card rounded border border-surf-border flex items-center px-2"><div className="h-2 w-12 bg-surf-inset rounded"></div></div>
                <div className="h-5 w-full bg-surf-card rounded border border-surf-border flex items-center px-2"><div className="h-2 w-14 bg-surf-inset rounded"></div></div>
              </div>
            </aside>
            <main className="col-span-9 p-6 relative bg-surf-card">
              <div className="flex gap-2 mb-6">
                <span className="bg-brand-gold/15 text-brand-gold-dk text-xs px-3 py-1 rounded-full font-semibold">Websites</span>
                <span className="bg-surf-inset text-txt-muted text-xs px-3 py-1 rounded-full">Branding</span>
                <span className="bg-surf-inset text-txt-muted text-xs px-3 py-1 rounded-full">Flyers</span>
              </div>
              <div className="bg-surf-inset rounded-2xl p-5 mb-4 border border-surf-border">
                <div className="h-5 w-48 bg-brand-gold/30 rounded mb-3"></div>
                <div className="space-y-2">
                  <div className="h-3 w-full bg-surf-card rounded border border-surf-border"></div>
                  <div className="h-3 w-5/6 bg-surf-card rounded border border-surf-border"></div>
                  <div className="h-3 w-4/6 bg-surf-card rounded border border-surf-border"></div>
                </div>
                <div className="mt-4 flex gap-2">
                  <div className="h-7 w-24 bg-brand-gold rounded-lg"></div>
                  <div className="h-7 w-20 bg-surf-border rounded-lg"></div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[0,1,2].map(i => (
                  <div key={i} className="bg-surf-inset rounded-xl p-3 border border-surf-border text-center">
                    <div className="h-4 w-12 bg-brand-gold/40 rounded mx-auto mb-1"></div>
                    <div className="h-2 w-16 bg-surf-border rounded mx-auto"></div>
                  </div>
                ))}
              </div>
            </main>
          </div>
        </div>
      </section>

      {/* Three pillars */}
      <section id="services" className="max-w-3xl mx-auto px-6 mb-24 grid grid-cols-3 gap-10 text-center">
        <div>
          <div className="flex justify-center mb-3">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M14 3l11 4v7c0 5-4.5 9.5-11 11C7.5 23.5 3 19 3 14V7l11-4z" stroke="#9b9b98" strokeWidth="1.4" strokeLinejoin="round"/>
              <path d="M9 14l3 3 7-7" stroke="#9b9b98" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="text-txt-primary text-sm font-semibold mb-1.5">Brand Identity</h3>
          <p className="text-txt-muted text-xs leading-relaxed">Logos, colour systems and visual assets that make you look professional and memorable from day one.</p>
        </div>
        <div>
          <div className="flex justify-center mb-3">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect x="2" y="5" width="24" height="18" rx="3" stroke="#9b9b98" strokeWidth="1.4"/>
              <path d="M2 10h24" stroke="#9b9b98" strokeWidth="1.4"/>
              <circle cx="6" cy="7.5" r="1" fill="#9b9b98"/>
              <circle cx="10" cy="7.5" r="1" fill="#9b9b98"/>
            </svg>
          </div>
          <h3 className="text-txt-primary text-sm font-semibold mb-1.5">Online Presence</h3>
          <p className="text-txt-muted text-xs leading-relaxed">Portfolio websites, booking systems and digital menus that attract clients and convert visits into sales.</p>
        </div>
        <div>
          <div className="flex justify-center mb-3">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M14 3L25 9v10L14 25 3 19V9L14 3z" stroke="#9b9b98" strokeWidth="1.4" strokeLinejoin="round"/>
              <path d="M14 3v22M3 9l11 6 11-6" stroke="#9b9b98" strokeWidth="1.4" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="text-txt-primary text-sm font-semibold mb-1.5">Visibility Systems</h3>
          <p className="text-txt-muted text-xs leading-relaxed">Flyer campaigns, thumbnail systems and profile optimisation that keep you in front of the right audience.</p>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section id="portfolio" className="max-w-5xl mx-auto px-6 mb-24">
        <div className="text-center mb-10">
          <p className="text-brand-gold text-sm font-semibold mb-1">Our Work</p>
          <h2 className="text-3xl font-extrabold text-txt-primary mb-2">What we&apos;ve built</h2>
          <p className="text-txt-muted text-sm">Real projects. Real results.</p>
        </div>
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {PORTFOLIO_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveSection(tab.key)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                activeSection === tab.key ? 'active-tab' : ''
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <PortfolioGrid section={activeSection} />
      </section>

      {/* Animated Counters */}
      <section id="stats" className="border-y border-surf-border bg-surf-card py-16 mb-24">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 gap-y-10 gap-x-8 md:grid-cols-4 text-center">
          <div><p className="text-5xl font-extrabold text-brand-gold counter" data-target="50" data-suffix="+">0+</p><p className="text-txt-muted text-sm mt-2 font-medium">Clients Served</p></div>
          <div><p className="text-5xl font-extrabold text-brand-gold counter" data-target="120" data-suffix="+">0+</p><p className="text-txt-muted text-sm mt-2 font-medium">Projects Delivered</p></div>
          <div><p className="text-5xl font-extrabold text-brand-gold counter" data-target="2" data-suffix=" days">0 days</p><p className="text-txt-muted text-sm mt-2 font-medium">Avg. Delivery Time</p></div>
          <div><p className="text-5xl font-extrabold text-brand-gold counter" data-target="98" data-suffix="%">0%</p><p className="text-txt-muted text-sm mt-2 font-medium">Client Satisfaction</p></div>
        </div>
      </section>

      {/* Everything you need heading */}
      <section id="about" className="max-w-5xl mx-auto px-6 mb-10">
        <p className="text-brand-gold text-sm font-semibold mb-1">Everything you need to grow</p>
        <h2 className="text-4xl font-extrabold leading-tight mb-4 text-txt-primary">nothing you don&apos;t</h2>
        <p className="text-txt-muted text-sm leading-relaxed max-w-xs">Primeflow removes the complexity of building a professional brand, while giving you full control over how you show up online.</p>
      </section>

      {/* Made for small businesses card */}
      <section className="max-w-5xl mx-auto px-6 mb-5">
        <div className="bg-surf-card border border-surf-border rounded-3xl p-10 grid grid-cols-2 gap-10 items-center shadow-sm">
          <div>
            <h3 className="text-2xl font-bold leading-snug mb-3 text-txt-primary">Made for small businesses,<br />not just big brands.</h3>
            <p className="text-txt-muted text-sm leading-relaxed">We focus on creating modern brand identities, strong online presence systems and high-impact visual experiences that attract customers and build trust.</p>
          </div>
          <div className="relative flex items-center justify-center" style={{perspective:'800px'}}>
            <div className="absolute inset-0 rounded-2xl blur-2xl opacity-30" style={{background:'radial-gradient(ellipse at 60% 50%, #f5c842 0%, transparent 70%)',transform:'translateZ(-20px)'}}></div>
            <div className="absolute rounded-2xl border border-brand-gold/10 bg-surf-card" style={{width:'95%',height:'95%',top:'8px',left:'8px',transform:'rotateY(-4deg) rotateX(2deg)',filter:'blur(1px)',opacity:0.4}}></div>
            <div className="relative rounded-2xl overflow-hidden border border-brand-gold/30"
                 style={{transform:'rotateY(-5deg) rotateX(2deg)',boxShadow:'0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(245,200,66,0.15), 4px 4px 24px rgba(245,200,66,0.08)',transition:'transform 0.4s ease, box-shadow 0.4s ease'}}
                 onMouseOver={e => { const el = e.currentTarget as HTMLElement; el.style.transform='rotateY(-2deg) rotateX(1deg) translateY(-4px)'; el.style.boxShadow='0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(245,200,66,0.25), 6px 6px 32px rgba(245,200,66,0.12)'; }}
                 onMouseOut={e => { const el = e.currentTarget as HTMLElement; el.style.transform='rotateY(-5deg) rotateX(2deg)'; el.style.boxShadow='0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(245,200,66,0.15), 4px 4px 24px rgba(245,200,66,0.08)'; }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/instagram-profile.png" alt="PrimeFlow Instagram profile" className="w-full block" style={{maxHeight:'320px',objectFit:'cover',objectPosition:'top'}} />
              <div className="absolute bottom-0 left-0 right-0 h-16" style={{background:'linear-gradient(to top, rgba(245,200,66,0.08), transparent)'}}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-5xl mx-auto px-6 mb-5">
        <div className="text-center mb-10 pt-10">
          <p className="text-brand-gold text-sm font-semibold mb-1">Client Stories</p>
          <h2 className="text-3xl font-extrabold text-txt-primary">What clients say</h2>
        </div>
        <div id="testimonials-wrapper" className="relative overflow-hidden">
          <div id="testimonials-track" className="flex" style={{transition:'transform 0.5s cubic-bezier(0.4,0,0.2,1)'}}>
            {[
              { init:'A', name:'Amara K.', role:'Beauty Salon Owner · Lagos', text:'"PrimeFlow completely transformed how my salon looks online. Within a week of launching my new website, I had 3 new bookings from clients who found me through search. The quality is premium and the turnaround was unbelievably fast."' },
              { init:'M', name:'Marcus T.', role:'Restaurant Owner · Douala', text:'"Our digital menu and QR system changed everything. Customers love it and we\'ve cut ordering errors to almost zero. The whole setup was done in 2 days and looks more professional than restaurants 10× our size."' },
              { init:'S', name:'Sofia R.', role:'Freelance Photographer · Yaoundé', text:'"I was skeptical — I\'d been burned by designers before. PrimeFlow was different. They took time to understand my brand and delivered something that truly represents me. My bookings went up 40% in the first month."' },
            ].map((t, i) => (
              <div key={i} className="w-full flex-shrink-0">
                <div className="bg-surf-card border border-surf-border rounded-3xl p-8 shadow-sm">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-surf-inset border border-surf-border flex items-center justify-center flex-shrink-0">
                      <span className="text-txt-faint text-lg font-bold">{t.init}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-txt-primary text-sm">{t.name}</p>
                      <p className="text-txt-muted text-xs">{t.role}</p>
                    </div>
                    <span className="ml-auto text-brand-gold text-sm leading-none">★★★★★</span>
                  </div>
                  <p className="text-txt-primary text-sm leading-relaxed">{t.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div id="testimonials-dots" className="flex justify-center gap-2 mt-6"></div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{position:'relative',overflow:'hidden',padding:'96px 24px 112px'}}>
        <canvas id="pricing-bg" style={{position:'absolute',inset:0,width:'100%',height:'100%',display:'block',pointerEvents:'none',zIndex:0}}></canvas>
        <div style={{position:'relative',zIndex:1,maxWidth:'960px',margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'52px'}}>
            <span style={{display:'inline-block',fontSize:'0.68rem',fontWeight:700,letterSpacing:'0.14em',textTransform:'uppercase',color:'#C99600',border:'1px solid rgba(201,150,0,0.35)',padding:'5px 14px',borderRadius:'999px',marginBottom:'18px'}}>Pricing</span>
            <h2 className="pricing-heading" style={{fontSize:'clamp(2rem,5vw,3.2rem)',fontWeight:300,letterSpacing:'-0.03em',lineHeight:1.15,color:'#1a1a18',margin:'0 0 12px'}}>
              Clear pricing,<br /><span style={{background:'linear-gradient(90deg,#C99600,#F5B800)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>real results.</span>
            </h2>
            <p className="pricing-subhead" style={{color:'#6b6b68',fontSize:'0.95rem',maxWidth:'420px',margin:'0 auto',lineHeight:1.65}}>No hidden fees. No surprises. Pick the package that fits your business.</p>
          </div>
          <div id="pricing-tabs" style={{display:'flex',gap:'8px',justifyContent:'center',marginBottom:'48px'}}>
            <button data-tab="websites" style={{padding:'9px 22px',borderRadius:'999px',border:'none',background:'#F5B800',color:'#1a1a18',fontFamily:'inherit',fontWeight:700,fontSize:'0.78rem',cursor:'pointer',transition:'all 0.22s'}}>Portfolio &amp; Booking</button>
            <button data-tab="menu" style={{padding:'9px 22px',borderRadius:'999px',border:'1px solid #e4e4e0',background:'transparent',color:'#6b6b68',fontFamily:'inherit',fontWeight:600,fontSize:'0.78rem',cursor:'pointer',transition:'all 0.22s'}}>Digital Menu &amp; QR</button>
          </div>
          <div id="pricing-cards" style={{display:'flex',gap:'20px',justifyContent:'center',alignItems:'center',flexWrap:'wrap'}}></div>
        </div>
      </section>

      {/* More services card */}
      <section className="max-w-5xl mx-auto px-6 mb-36">
        <div className="bg-surf-card border border-surf-border rounded-3xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-8 py-4 border-b border-surf-border bg-surf-inset">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-brand-gold flex items-center justify-center text-xs font-extrabold text-txt-primary">P</div>
                <span className="text-xs font-bold text-txt-primary">PrimeFlow</span>
              </div>
              <nav className="flex gap-5 text-xs text-txt-muted">
                <a href="#" className="hover:text-txt-primary">Services</a>
                <a href="#" className="hover:text-txt-primary">Portfolio</a>
                <a href="#" className="hover:text-txt-primary">Pricing</a>
              </nav>
            </div>
            <a href="https://www.instagram.com/primeflow_1?igsh=MWtsdWoyZGw0bDhsYw==" target="_blank" rel="noopener noreferrer" className="bg-brand-gold text-txt-primary text-xs font-bold px-4 py-2 rounded-full">Book a free call</a>
          </div>
          <div className="p-8 grid grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="text-xl font-bold mb-2 text-txt-primary">All services, one studio</h3>
              <p className="text-txt-muted text-sm leading-relaxed">Beyond websites — Primeflow also handles event flyer campaigns, YouTube thumbnail systems, brand identity packages and profile optimisation. Everything under one roof.</p>
            </div>
            <div className="bg-surf-inset rounded-2xl p-5 border border-surf-border">
              <p className="text-xs font-semibold text-txt-muted mb-3 uppercase tracking-wide">Our services</p>
              <div className="space-y-2.5 text-sm font-mono">
                {[
                  { filled: true,  dashed: false, label: 'Portfolio Website Creation' },
                  { filled: true,  dashed: false, label: 'Booking Website Creation' },
                  { filled: false, dashed: false, label: 'Digital Menu & QR Setup' },
                  { filled: false, dashed: true,  label: 'Event Flyer Campaigns' },
                  { filled: false, dashed: true,  label: 'Brand Identity & Logo' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="6" stroke={s.filled ? '#F5B800' : '#9b9b98'} strokeWidth="1.4" strokeDasharray={s.dashed ? '4 2' : undefined}/>
                      {s.filled && <circle cx="7" cy="7" r="3" fill="#F5B800"/>}
                    </svg>
                    <span className={s.filled ? 'text-txt-primary text-xs' : 'text-txt-muted text-xs'}>{s.label}</span>
                  </div>
                ))}
                <p className="text-txt-faint text-xs pl-5">Profile Optimisation + more...</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How we work */}
      <section className="max-w-5xl mx-auto px-6 mb-36 grid grid-cols-2 gap-20 items-center">
        <div className="flex items-center justify-center">
          <svg width="420" height="420" viewBox="0 0 420 420" fill="none" aria-hidden="true">
            <circle cx="210" cy="210" r="200" stroke="#C99600" strokeWidth="0.7" opacity="0.12"/>
            <circle cx="210" cy="210" r="170" stroke="#C99600" strokeWidth="0.8" opacity="0.18"/>
            <circle cx="210" cy="210" r="140" stroke="#C99600" strokeWidth="0.9" opacity="0.26"/>
            <circle cx="210" cy="210" r="110" stroke="#C99600" strokeWidth="1"   opacity="0.38"/>
            <circle cx="210" cy="210" r="80"  stroke="#C99600" strokeWidth="1.1" opacity="0.52"/>
            <circle cx="210" cy="210" r="50"  stroke="#C99600" strokeWidth="1.3" opacity="0.68"/>
            <circle cx="210" cy="210" r="22"  stroke="#C99600" strokeWidth="1.5" opacity="0.85"/>
            <circle cx="210" cy="210" r="7"   fill="#F5B800"/>
          </svg>
        </div>
        <div>
          <p className="text-brand-gold text-sm font-semibold mb-1">From idea to income</p>
          <h2 className="text-3xl font-extrabold leading-tight mb-3 text-txt-primary">in four simple steps</h2>
          <p className="text-txt-muted text-sm leading-relaxed mb-10">No back-and-forth confusion. No tech headaches. We handle the whole build so you can focus on running your business.</p>
          <div className="space-y-8">
            {[
              { n:'01', t:'Book a free consultation', d:"Tell us about your business and goals. We'll figure out exactly what you need — no pressure, no hard sell." },
              { n:'02', t:'We build your system', d:"Our team designs and builds your website, branding or digital system. You get updates along the way so nothing is a surprise." },
              { n:'03', t:'You review and approve', d:"We revise until you're completely happy. Your package includes multiple rounds of revisions built in." },
              { n:'04', t:'Launch and get clients', d:"Go live looking premium. Start attracting clients, getting bookings and building the trust your business deserves." },
            ].map(s => (
              <div key={s.n}>
                <p className="text-txt-faint text-xs mb-1 font-mono">{s.n}</p>
                <h3 className="text-xl font-bold mb-1 text-txt-primary">{s.t}</h3>
                <p className="text-txt-muted text-sm leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before / After Slider */}
      <section className="max-w-3xl mx-auto px-6 mb-36">
        <div className="text-center mb-10">
          <p className="text-brand-gold text-sm font-semibold mb-1">Transformation</p>
          <h2 className="text-3xl font-extrabold text-txt-primary mb-2">Before &amp; After</h2>
          <p className="text-txt-muted text-sm">Drag the handle to reveal the transformation</p>
        </div>
        <div id="ba-slider" className="relative rounded-3xl overflow-hidden border border-surf-border shadow-sm select-none" style={{aspectRatio:'16/9'}}>
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://placehold.co/800x450/F5B800/1a1a18?text=After+%E2%80%94+Premium+Brand" alt="After brand redesign showing a premium professional look" className="w-full h-full object-cover" />
            <span className="absolute bottom-4 right-4 bg-brand-gold text-txt-primary text-xs font-bold px-3 py-1.5 rounded-full shadow">After</span>
          </div>
          <div className="absolute inset-0" id="ba-before" style={{clipPath:'inset(0 50% 0 0)'}}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://placehold.co/800x450/e4e4e0/6b6b68?text=Before+%E2%80%94+Outdated+Look" alt="Before brand redesign showing an outdated look" className="w-full h-full object-cover" />
            <span className="absolute bottom-4 left-4 bg-surf-card border border-surf-border text-txt-primary text-xs font-bold px-3 py-1.5 rounded-full shadow">Before</span>
          </div>
          <div id="ba-handle" className="absolute top-0 bottom-0 cursor-ew-resize" style={{left:'50%',transform:'translateX(-50%)',width:'2px'}}>
            <div className="absolute inset-y-0 left-0 w-0.5 bg-white"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg border border-surf-border flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M5 9H1M13 9h4M5 6L1 9l4 3M13 6l4 3-4 3" stroke="#1a1a18" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-3xl mx-auto px-6 mb-36">
        <p className="text-brand-gold text-sm font-semibold mb-1">FAQ</p>
        <h2 className="text-3xl font-extrabold mb-10 text-txt-primary">Every question has an answer</h2>
        <div className="divide-y divide-surf-border">
          {[
            { q: 'What exactly does PrimeFlow do?', a: "We're a digital solutions studio that helps small businesses look professional online. We build websites, booking systems, logos, digital menus, flyers and more — everything you need to attract customers and build trust." },
            { q: 'How long does a project take?', a: "Most projects are delivered within 1–3 days. Complex full-system builds may take slightly longer, but we'll always give you a clear timeline upfront." },
            { q: 'What kind of businesses do you work with?', a: "We work with all types of small businesses — beauty professionals, restaurants, event organisers, freelancers and more. If you want to look premium and get more customers, we're built for you." },
            { q: 'How do I get started?', a: null },
            { q: 'Do you offer revisions?', a: "Yes — every package includes revision rounds. Starter packages include 2 revisions, Core includes 4, and Full System includes 6 revisions so you're always happy with the result." },
          ].map((item, i) => (
            <div key={i} className="faq-item py-5">
              <button className="faq-btn w-full flex items-center justify-between gap-4 text-sm font-semibold text-txt-primary text-left">
                {item.q}
                <span className="faq-icon text-brand-gold text-2xl leading-none select-none flex-shrink-0 font-light">+</span>
              </button>
              <div className="faq-body">
                {i === 3 ? (
                  <p className="text-txt-muted text-sm leading-relaxed pt-3 pb-1">
                    Book a free consultation via{' '}
                    <a href="https://www.instagram.com/primeflow_1?igsh=MWtsdWoyZGw0bDhsYw==" target="_blank" rel="noopener noreferrer" className="text-brand-gold-dk font-semibold hover:underline">Instagram DM @primeflow_1</a>
                    {' '}or{' '}
                    <a href="https://wa.me/237678683534" target="_blank" rel="noopener noreferrer" className="text-brand-gold-dk font-semibold hover:underline">WhatsApp +237 678 683 534</a>
                    . We&apos;ll discuss your needs and find the right package for you — no commitment required.
                  </p>
                ) : (
                  <p className="text-txt-muted text-sm leading-relaxed pt-3 pb-1">{item.a}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dot grid decorative */}
      <section className="relative overflow-hidden h-64 mb-24" aria-hidden="true">
        <div className="absolute inset-0 dot-grid opacity-60"></div>
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Bottom CTA */}
      <section className="text-center max-w-2xl mx-auto px-6 mb-36">
        <h2 className="text-4xl font-extrabold leading-tight mb-3 text-txt-primary">Stand out &amp; get<br />more customers</h2>
        <p className="text-txt-muted text-sm leading-relaxed mb-8">Stop blending in. Start attracting clients.<br />Book your free consultation today.</p>
        <a href="https://wa.me/237678683534?text=Hi%20PrimeFlow!%20I%27d%20like%20to%20book%20a%20free%20consultation." target="_blank" rel="noopener noreferrer"
           className="inline-flex items-center gap-3 bg-[#F5B800] hover:bg-[#C99600] text-[#1a1a18] text-sm font-bold px-7 py-3.5 rounded-xl transition-colors shadow-sm">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Let&apos;s talk on WhatsApp
        </a>
      </section>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 pb-10">
        <div className="flex items-start justify-between">
          <div className="flex flex-col leading-none gap-0.5">
            <span className="font-extrabold text-lg tracking-tight leading-none text-txt-primary">PRIME<span className="text-brand-gold">FLOW</span></span>
            <span className="text-txt-muted text-[9px] tracking-[0.22em] font-medium uppercase">SOLUTIONS</span>
          </div>
          <div className="flex gap-16">
            <div>
              <p className="text-txt-muted text-xs font-semibold mb-3">Connect</p>
              <div className="space-y-2.5">
                <a href="https://www.instagram.com/primeflow_1?igsh=MWtsdWoyZGw0bDhsYw==" target="_blank" rel="noopener noreferrer" className="block text-txt-muted text-xs hover:text-txt-primary transition-colors">Instagram</a>
                <a href="https://wa.me/237678683534" target="_blank" rel="noopener noreferrer" className="block text-txt-muted text-xs hover:text-txt-primary transition-colors">WhatsApp</a>
              </div>
            </div>
            <div>
              <p className="text-txt-muted text-xs font-semibold mb-3">Services</p>
              <div className="space-y-2.5">
                <a href="#" className="block text-txt-muted text-xs hover:text-txt-primary transition-colors">Websites</a>
                <a href="#" className="block text-txt-muted text-xs hover:text-txt-primary transition-colors">Branding</a>
                <a href="#" className="block text-txt-muted text-xs hover:text-txt-primary transition-colors">Digital Menus</a>
                <a href="#" className="block text-txt-muted text-xs hover:text-txt-primary transition-colors">Flyers</a>
              </div>
            </div>
            <div>
              <p className="text-txt-muted text-xs font-semibold mb-3">Company</p>
              <div className="space-y-2.5">
                <a href="#about" className="block text-txt-muted text-xs hover:text-txt-primary transition-colors">About</a>
                <a href="#pricing" className="block text-txt-muted text-xs hover:text-txt-primary transition-colors">Pricing</a>
                <a href="#faq" className="block text-txt-muted text-xs hover:text-txt-primary transition-colors">FAQ</a>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-surf-border">
          <p className="text-txt-faint text-xs">© 2025 PrimeFlow Solutions · @primeflow_1 · +237 678 683 534. All rights reserved.</p>
        </div>
      </footer>

      {/* Floating contact bar */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        <a href="https://wa.me/237678683534" target="_blank" rel="noopener noreferrer"
           title="Chat on WhatsApp"
           className="group flex items-center gap-3 bg-[#F5B800] hover:bg-[#C99600] text-[#1a1a18] rounded-full shadow-lg transition-all duration-300 overflow-hidden"
           style={{height:'52px',padding:'0 18px 0 14px'}}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style={{flexShrink:0}}>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <span className="text-sm font-bold whitespace-nowrap">WhatsApp</span>
        </a>
        <a href="https://www.instagram.com/primeflow_1?igsh=MWtsdWoyZGw0bDhsYw==" target="_blank" rel="noopener noreferrer"
           title="Follow on Instagram"
           className="group flex items-center gap-3 text-[#1a1a18] rounded-full shadow-lg transition-all duration-300 overflow-hidden"
           style={{height:'52px',padding:'0 18px 0 14px',background:'#F5B800'}}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style={{flexShrink:0}}>
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          <span className="text-sm font-bold whitespace-nowrap">@primeflow_1</span>
        </a>
      </div>
    </>
  );
}
