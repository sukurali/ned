import Navbar from '@/components/Navbar';
import Preloader from '@/components/Preloader';
import SceneCanvas from '@/components/3d/SceneCanvas';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Features from '@/components/Features';
import Showcase from '@/components/Showcase';
import Technology from '@/components/Technology';
import Stats from '@/components/Stats';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Preloader />
      <SceneCanvas />
      <Navbar />

      {/* filmic grain — sits above everything, never intercepts input */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[90] opacity-[0.05]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* keyboard: skip straight to content */}
      <a
        href="#experience"
        className="fixed left-4 top-4 z-[110] -translate-y-24 rounded-full bg-solar px-5 py-2.5 font-mono text-[11px] tracking-[0.2em] text-ink transition-transform focus:translate-y-0"
      >
        SKIP TO CONTENT
      </a>

      <main id="home" className="relative z-10">
        <Hero />
        <About />
        <Features />
        <Showcase />
        <Technology />
        <Stats />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
