import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Projects } from './components/Projects'
import { MoreProjects } from './components/MoreProjects'
import { About } from './components/About'
import { Stack } from './components/Stack'
import { Background } from './components/Background'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { ProjectDrawer } from './components/ProjectDrawer'
import { CommandPalette } from './components/CommandPalette'
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
      <ProjectDrawer />
      <CommandPalette />
      <Toast />
    </>
  )
}
