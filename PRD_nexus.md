# Nexus Biblical Timeline

## Product Overview

**The Pitch:** A high-fidelity temporal visualization of biblical history that abandons skeuomorphic parchment tropes for rigorous data design. Nexus contextualizes scripture against world history through a powerful semantic zoom interface.

**For:** Theology students, pastors, and history enthusiasts who need to understand the *synchronicity* of biblical narratives within the broader ancient world.

**Device:** Desktop (optimized for wide viewports)

**Design Direction:** **Neo-Swiss International.** Objective, mathematical, and grid-based. Relies on stark contrast, massive typographic scale changes, and distinct color-coding to organize dense information.

**Inspired by:**
*   *Massimo Vignelli’s NYC Subway Map:* Abstraction for clarity over geographic precision.
*   *The Pudding (Data Journalism):* Interactive storytelling and scroll-driven data density.

---

## Screens

- **The Macro Canvas (Main View):** The primary timeline interface featuring infinite horizontal scroll and semantic zoom controls.
- **The Context Panel:** A slide-out right-hand drawer providing exegetical depth, scripture references, and maps for selected events.
- **The Search/Filter Matrix:** A full-screen overlay for querying specific figures, eras, or event types across the dataset.
- **The Era Detail View:** A focused, static dashboard summarizing a specific major epoch (e.g., "The Divided Kingdom") with statistical breakdowns.

---

## Key Flows

**Flow: Contextual Discovery**
1.  User is on **The Macro Canvas** viewing the "Judges" era -> sees parallel lanes (Israel vs. Philistia).
2.  User clicks **Event Marker (Battle of Jericho)** -> Timeline pauses, marker pulses.
3.  **Context Panel** slides in from right -> displays Joshua 6 text, archaeological notes, and a mini-map.

**Flow: Temporal Drill-down**
1.  User is on **The Macro Canvas** at "Era" zoom level (1000-year blocks).
2.  User scrolls mouse wheel or clicks **Zoom Control (Decade)**.
3.  The timeline expands horizontally; aggregate blocks break apart into individual year markers and specific event nodes.

---

<details>
<summary>Design System</summary>

## Color Palette

High contrast, accessible, editorial.

- **Canvas (Bg):** `#F4F4F0` - Off-white, "gallery wall" finish.
- **Ink (Text/UI):** `#111111` - Near-black for primary structure and text.
- **Grid Lines:** `#E0E0E0` - Subtle structural guides.
- **Prophetic Teal:** `#008080` - Prophets, spiritual events.
- **Imperial Crimson:** `#D72638` - Gospels, sacrifice, conflict.
- **Sovereign Gold:** `#D4AF37` - Kings, monarchy, wealth.
- **World Violet:** `#663399` - Gentile nations, world history context.

## Typography

Objective, grotesque sans-serifs with tight tracking.

- **Headings:** `Space Grotesk`, 700 weight. Sharp geometric edges.
    - H1: 64px (Era Labels)
    - H2: 32px (Section Headers)
- **Body:** `Inter Tight`, 400 weight. Highly legible at small sizes.
    - Body: 16px
    - Data/Captions: 12px (Uppercase, tracked wide)
- **Code/Date:** `JetBrains Mono`, 500 weight. For years and coordinates.

**Style notes:** 
- **The Grid is King:** Every element aligns to a visible or invisible 12-column grid.
- **No Borders, Just Space:** Separation created by whitespace and background color fills, not outlines.
- **Hard Shadows:** Buttons and floating panels use sharp, non-blurred shadows (`box-shadow: 4px 4px 0px #000`) for a tactile, print-like feel.

## Design Tokens

```css
:root {
  --color-canvas: #F4F4F0;
  --color-ink: #111111;
  --color-teal: #008080;
  --color-crimson: #D72638;
  --font-display: 'Space Grotesk', sans-serif;
  --font-body: 'Inter Tight', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --shadow-hard: 4px 4px 0px #111111;
  --grid-gap: 24px;
}
```

</details>

---

<details>
<summary>Screen Specifications</summary>

### The Macro Canvas (Main View)

**Purpose:** The single source of truth. An infinite horizontal scroll handling thousands of years of history.

**Layout:**
- **Top Bar (64px fixed):** Search trigger, Filter toggles, Zoom Level indicator (Era / Century / Decade / Year).
- **Timeline Body (Flex, scrollable):** Divided horizontally into two primary lanes: "Biblical Narrative" (top 60%) and "World Context" (bottom 40%). A thick `2px` black line separates them.
- **Bottom Bar (48px fixed):** Time scrubber and playback controls.

**Key Elements:**
- **Era Blocks (Background):** Large, subtle colored backgrounds denoting the current era (e.g., Patriarchal Age). Label spans full width.
- **Event Nodes:** Circles on the timeline track.
    - Size varies by importance (Major: 24px, Minor: 12px).
    - Color indicates category (Teal/Prophecy, Crimson/War).
    - **Hover:** Reveals tooltip with date and title.
- **Parallel Connectors:** Vertical dashed lines connecting a Biblical event (e.g., Solomon's Temple) to a World event (e.g., Phoenician trade deals) to show causality.

**States:**
- **Zoom Level 1 (Era):** Shows only massive blocks (Old Testament, New Testament).
- **Zoom Level 4 (Day):** Shows individual days (Passion Week).
- **Loading:** Skeleton pulses on the timeline track.

**Interactions:**
- **Scroll Wheel:** Pan horizontally.
- **Cmd + Scroll:** Zoom in/out focused on cursor position.
- **Click Event Node:** Activates **Context Panel**.

**Responsive:**
- **Desktop:** Full dual-lane view.
- **Tablet:** Lanes stack vertically (Biblical top, World bottom).

---

### The Context Panel

**Purpose:** Detailed consumption of specific data points without losing timeline context.

**Layout:** Right-aligned drawer, `480px` width, `100vh` height. Slides in over the canvas.

**Key Elements:**
- **Header:** Sticky top. Large Serif Title (e.g., "The Fall of Jericho"). Date in Mono font. Close 'X' button.
- **Scripture Block:** The relevant Bible passage (ESV). `18px` serif font for readability, distinct from UI font.
- **Fact Accordions:**
    - "Archaeological Evidence"
    - "Theological Significance"
    - "Related Figures"
- **Mini-Map:** A static SVG map showing the location of the event.

**States:**
- **Locked:** Panel remains open while user scrolls timeline behind it to find related events.

**Components:**
- **Citation Chip:** Small pill button linking to external Bible Gateway reference.

---

### The Search/Filter Matrix

**Purpose:** Quick navigation through the massive dataset.

**Layout:** Full-screen modal overlay. `95%` opacity white background.

**Key Elements:**
- **Input Field:** Massive `64px` text input, no border, centered.
- **Filter Pills:** Row of toggleable tags: `Battles`, `Miracles`, `Kings`, `Prophets`.
- **Results Grid:** 3-column grid below input.
    - Column 1: Eras (matches)
    - Column 2: People (matches)
    - Column 3: Events (matches)

**Interactions:**
- **Type:** Live filtering of Results Grid.
- **Enter:** Zooms timeline immediately to the top result's date.
- **Esc:** Close modal.

---

### The Era Detail View

**Purpose:** A "Pause" screen to understand the statistics of a specific time period.

**Layout:** Dashboard grid. 3 rows, 4 columns.

**Key Elements:**
- **Hero Stat:** "40 Years" (Duration) in massive typography.
- **Ruler List:** Vertical list of active Kings/Judges during this era.
- **Events Histogram:** Bar chart showing density of recorded biblical events per decade.
- **World Powers Card:** List of dominant empires (Egypt, Assyria, Babylon) with their status (Rising/Peak/Collapsing).

**Interactions:**
- **Click "Enter Timeline":** Transitions back to Macro Canvas, zoomed to this specific era.

</details>

---

<details>
<summary>Build Guide</summary>

**Stack:** React (Next.js), Tailwind CSS v3, D3.js (for visualization logic), Framer Motion (for smooth zoom transitions).

**Build Order:**
1.  **The Macro Canvas:** Implement the horizontal scrolling engine and semantic zoom logic (D3 integration). This is the hardest technical hurdle.
2.  **Context Panel:** Build the drawer and content rendering to make the timeline useful.
3.  **Search Matrix:** Implement indexing and quick navigation.
4.  **Era Detail View:** Add the statistical dashboards last.

</details>