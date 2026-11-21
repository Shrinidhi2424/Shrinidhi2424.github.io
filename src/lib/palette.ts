/** The command palette (Phase 4) listens for this event; the nav's command field and the keyboard shortcut send it. */
export const openPalette = () => window.dispatchEvent(new CustomEvent('palette:open'))
