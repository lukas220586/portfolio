import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Stats from './components/Stats'
import Services from './components/Services'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Skills from './components/Skills'
import MotherboardExplosion from './components/MotherboardExplosion'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Particles from './components/Particles'
import ScrollProgress from './components/ScrollProgress'
import CircuitBoard from './components/CircuitBoard'

export default function App() {
  return (
    <>
      <ScrollProgress />
      <Particles />
      <CircuitBoard />
      <Header />
      <main className="content" aria-label="Content">
        <Hero />
        <About />
        <Stats />
        <Services />
        <Experience />
        <Projects />
        <Skills />
        <MotherboardExplosion />
        <Contact />
      </main>
      <Footer />
      <div className="top" title="Top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
      </div>
    </>
  )
}
