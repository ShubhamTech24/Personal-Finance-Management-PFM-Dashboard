# Personal Finance Management Dashboard - Design Guidelines

## Design Approach

**Selected Framework:** Modern Financial Dashboard Design System
Drawing inspiration from Stripe's clarity, Plaid's trust-building aesthetics, and Material Design's structured data presentation. This approach prioritizes data legibility, financial trust, and efficient task completion.

**Core Principles:**
- Data transparency: Clear hierarchy makes financial information instantly scannable
- Trust through restraint: Professional, uncluttered interfaces build user confidence
- Action-oriented: Primary financial actions are always within reach
- Responsive precision: Layouts adapt fluidly across devices without compromising data density

---

## Typography System

**Font Stack:** Inter (already implemented via Google Fonts)

**Hierarchy:**
- Page Titles: 28px (2xl), semibold (600), tracking tight
- Section Headers: 20px (xl), medium (500)
- Card Titles: 16px (base), medium (500)
- Body Text: 14px (sm), regular (400)
- Data Labels: 13px (xs), medium (500), uppercase with letter spacing
- Large Numbers (balances): 32px (3xl), bold (700)
- Transaction Amounts: 16px (base), semibold (600)

**Color Mapping:**
- Page titles: neutral-900
- Section headers: neutral-800
- Body text: neutral-600
- Data labels: neutral-500
- Success numbers (income/positive): emerald-600
- Alert numbers (expense/negative): red-600

---

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, and 8 consistently
- Component internal padding: p-4 or p-6
- Section spacing: space-y-6 or space-y-8
- Card gaps in grids: gap-4 or gap-6
- Container max-width: max-w-7xl for main content areas

**Sidebar Navigation:**
- Fixed width: 256px (w-64)
- Full height with white background
- Logo area: mb-8 with brand name in 24px bold
- Navigation items: py-2 px-4 with 8px gap between icon and text
- Active state: light blue background (blue-50) with blue-600 text
- Bottom actions (Link Bank, Logout): mt-auto with gap-2

**Main Content Area:**
- Sticky header: white background, shadow-sm, px-8 py-4
- Content padding: p-8
- Responsive: reduce to p-4 on mobile

---

## Component Library

### Cards (Financial Data Containers)
- Background: white with subtle shadow (shadow-sm)
- Border radius: rounded-xl (12px)
- Padding: p-6 for standard cards
- Hover state for interactive cards: shadow-md transition
- Header inside card: text-lg font-medium mb-4

### Account Cards
- Flex layout with icon, account details (flex-1), and balance (right-aligned)
- Icon: 20px, blue-600 color
- Account name: font-medium, neutral-800
- Account metadata (type, mask): text-sm, neutral-500
- Balance: text-lg, semibold, blue-700
- Available balance: text-sm, neutral-500

### Transaction List Items
- Border-top dividers between items (divide-y divide-gray-200)
- Padding: py-3
- Flex layout: icon + date/name on left, amount on right
- Amount color: green-600 for income (negative), red-600 for expense
- Include directional icons (arrows) inline with amounts

### Budget Management Forms
- Input fields: border border-gray-300, rounded-lg, px-3 py-2
- Labels: text-sm, neutral-600, above inputs
- Form container: white background, p-4, rounded-xl, shadow-sm
- Buttons aligned with form fields using items-end

### Buttons
**Primary (Actions):** 
- Blue-600 background, white text
- Hover: blue-700
- Padding: px-4 py-2
- Rounded-lg with shadow-sm
- Icons: 16px with gap-2

**Secondary (Utility):**
- Gray-200 background, neutral-700 text
- Hover: gray-300
- Same dimensions as primary

**Success (Link Bank):**
- Green-600 background, white text
- Hover: green-700

**Destructive (Delete):**
- Red-500 text only (icon button)
- Hover: red-700

**Disabled State:**
- Gray-300 background, neutral-600 text
- Cursor-not-allowed

### Data Visualization Components

**Chart Containers:**
- White card background with p-6
- Title above chart: text-lg, font-medium, mb-4
- Chart height: h-80 (320px) for consistency
- Use ResponsiveContainer for all charts

**Color Palette for Charts:**
- Expenses/Spending: red-500 (#EF4444)
- Income: emerald-500 (#10B981)
- Category colors (pie): blue-500, emerald-500, amber-500, red-500, violet-500, teal-500
- Bars: rounded corners on top (radius={[6, 6, 0, 0]})

**Table Styling:**
- Border-top on header and rows
- Header: neutral-600, text-left
- Row padding: py-2
- Amounts: right-aligned
- Empty state: centered, neutral-500, py-3

---

## Authentication Interface

**Login/Register Card:**
- Max-width: max-w-sm, centered with mx-auto
- White background, shadow-md, rounded-lg, p-6
- Title: 24px, semibold, centered
- Subtitle: text-sm, neutral-500, centered
- Input spacing: space-y-4
- Button layout: flex justify-between for side-by-side actions
- Helper text: text-center, neutral-500, small font

---

## Page-Specific Layouts

### Dashboard Page
1. **Header Section:** Title with "Load Transactions" button (flex justify-between)
2. **Recent Transactions Card:** Full-width, list with dividers
3. **Analytics Grid:** Two-column grid (md:grid-cols-2) with gap-6
   - Left: Spending Pie Chart card
   - Right: Monthly Bar Chart card

### Accounts Page
- Grid layout: grid gap-4
- Page title: text-xl, semibold, mb-2
- Each account as interactive card with hover shadow

### Budgets Page
1. **Input Form Card:** Horizontal layout with category input, limit input, and save button
2. **Budget Table Card:** Full-width table with category, limit, and delete action columns
3. Empty state message when no budgets exist

### Welcome/Landing (Root Path)
- Centered text with simple welcome message after login
- Encourages user to link bank and navigate to Dashboard

---

## Responsive Behavior

**Mobile (< 768px):**
- Hide sidebar, implement mobile menu (future enhancement)
- Single column layouts for all grids
- Reduce padding: p-4 instead of p-8
- Stack form elements vertically

**Tablet (768px - 1024px):**
- Maintain sidebar
- Charts remain in single column
- Reduce container max-width

**Desktop (> 1024px):**
- Full two-column chart layouts
- Optimal spacing and typography scales

---

## Accessibility & States

- All interactive elements have clear hover states (defined above)
- Focus rings: default Tailwind focus styles (blue ring)
- Loading states: "Preparing..." text with disabled button appearance
- Error states: red-600 text for error messages
- Empty states: neutral-500 centered text with helpful messaging
- Icon sizes: consistent 16-18px for navigation, 20px for feature icons
- Minimum touch targets: 44px height for all buttons

---

## Visual Enhancements

- Consistent shadow hierarchy: shadow-sm for cards, shadow-md for hover/elevated states
- Smooth transitions: transition class on interactive elements
- Icon integration: Always pair icons with labels for clarity
- Whitespace: Generous spacing between sections (space-y-6 or space-y-8)
- Status indicators: Use color-coded text for financial statuses (green/red)
- Micro-interactions: Subtle transitions on hover (0.15s duration)

---

## Images

**Not applicable** - This is a data-focused financial dashboard without marketing elements. All visual interest comes from:
- Data visualization (charts)
- Clean typography
- Well-organized cards
- Icon usage for navigation and context

No hero images or decorative photography needed. Focus remains on financial data clarity and actionable insights.