import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Projects } from './components/Projects'
import { MoreProjects } from './components/MoreProjects'
import { About } from './components/About'
import { Stack } from './components/Stack'
import { Background } from './components/Background'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { DeferredDrawer, DeferredPalette } from './components/Deferred'
import { Toast } from './components/Toast'

export default function App() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Projects />
        <MoreProjects />
        <About />
        <Stack />
        <Background />
        <Contact />
      </main>
      <Footer />
      <DeferredDrawer />
      <DeferredPalette />
      <Toast />
    </>
  )
}
