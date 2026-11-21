import { describe, expect, it } from 'vitest'
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import App from '../src/App'
import { featuredProjects, moreProjects } from '../src/content/projects'
import { profile } from '../src/content/profile'

const drawer = () => document.querySelector<HTMLDialogElement>('dialog[aria-labelledby="drawer-title"]')!
const palette = () => document.querySelector<HTMLDialogElement>('dialog[data-palette]')!

describe('the page', () => {
  it('renders every section with its anchor', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1, name: profile.headline })).toBeTruthy()
    for (const id of ['top', 'projects', 'more-projects', 'about', 'stack', 'experience', 'education', 'contact']) {
      expect(document.getElementById(id), `#${id}`).not.toBeNull()
    }
    for (const p of featuredProjects) expect(screen.getAllByText(p.name).length).toBeGreaterThan(0)
    for (const p of moreProjects) expect(screen.getAllByText(p.name).length).toBeGreaterThan(0)
  })

  it('never shows a phone number', () => {
    render(<App />)
    expect(document.body.textContent).not.toMatch(/\+?\d[\d\s-]{8,}\d/)
  })
})

describe('the case drawer', () => {
  it('opens from a #project-<slug> link, moves on and closes back to #projects', () => {
    history.replaceState(null, '', '/#project-pulseboard')
    render(<App />)
    expect(drawer().open).toBe(true)
    expect(within(drawer()).getByRole('heading', { level: 2 }).textContent).toBe('PulseBoard')

    fireEvent.click(within(drawer()).getByRole('button', { name: /^next project:/i }))
    expect(within(drawer()).getByRole('heading', { level: 2 }).textContent).toBe('EvidenceTrace')
    expect(location.hash).toBe('#project-evidencetrace')

    fireEvent.click(within(drawer()).getByRole('button', { name: /close project/i }))
    expect(drawer().open).toBe(false)
    expect(location.hash).toBe('#projects')
  })

  it('shows the private-code note and the team role for SafeXplore', () => {
    history.replaceState(null, '', '/#project-safexplore')
    render(<App />)
    expect(within(drawer()).getByText('Code private (team project)')).toBeTruthy()
    expect(within(drawer()).queryByRole('link', { name: /code on github/i })).toBeNull()
    expect(within(drawer()).getByText('Team of 4. I built React Native screens and Spring Boot endpoints.')).toBeTruthy()
  })
})

describe('the command palette', () => {
  it('opens on Ctrl K, filters as you type, and runs an action', async () => {
    render(<App />)
    act(() => {
      fireEvent.keyDown(window, { key: 'k', ctrlKey: true })
    })
    expect(palette().open).toBe(true)

    const input = within(palette()).getByPlaceholderText(/projects, résumé, email/i)
    fireEvent.change(input, { target: { value: 'linkedin' } })
    expect(await within(palette()).findByText('Open LinkedIn')).toBeTruthy()
    expect(within(palette()).queryByText('Experience')).toBeNull()

    fireEvent.change(input, { target: { value: 'mode' } })
    const item = await within(palette()).findByText(/switch to dark mode/i)
    await act(async () => {
      fireEvent.click(item)
      await new Promise((r) => requestAnimationFrame(() => r(null)))
    })
    expect(palette().open).toBe(false)
    expect(document.documentElement.dataset.theme).toBe('dark')
  })
})
