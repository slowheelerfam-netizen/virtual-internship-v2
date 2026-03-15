# Summarist

A full-stack book summary application built as a virtual internship project. Users can browse, read, and listen to book summaries, manage a personal library, and subscribe to premium content via Stripe.

Live reference: [summarist.vercel.app](https://summarist.vercel.app)

---

## Tech Stack

- **Next.js 16** — App Router, dynamic routes, route groups
- **TypeScript** — Full type safety throughout
- **Firebase** — Firestore (database) + Authentication
- **Stripe** — Subscription payments via Firebase extension
- **Redux Toolkit** — Global state (auth modal)
- **React Icons** — Icon library
- **Tailwind CSS v4** — Structural layout utilities
- **Vercel** — Deployment

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Home / landing page
│   ├── home.module.css           # Scoped styles for home page only
│   ├── globals.css               # Global styles, Tailwind, CSS variables
│   └── (app)/                    # Route group — all authenticated app pages
│       ├── layout.tsx            # Shared layout: Sidebar + SearchBar topbar
│       ├── for-you/page.tsx      # For You page
│       ├── book/[id]/page.tsx    # Individual book page
│       ├── player/[id]/page.tsx  # Audio/text player page
│       ├── library/page.tsx      # User library (saved + finished books)
│       ├── settings/page.tsx     # User settings + subscription status
│       └── choose-plan/page.tsx  # Stripe subscription / sales page
├── components/
│   ├── AuthModal.tsx             # Login / Register / Guest modal
│   ├── BookCard.tsx              # Reusable book card component
│   ├── SearchBar.tsx             # Debounced search with dropdown results
│   ├── Sidebar.tsx               # Navigation sidebar
│   ├── Skeleton.tsx              # Skeleton loading component
│   ├── ForYouSkeleton.tsx        # Skeleton for For You page
│   ├── LoginButton.tsx           # Home page login button
│   ├── Providers.tsx             # Redux Provider wrapper
│   └── StatisticsSection.tsx     # Home page statistics section
├── store/
│   ├── index.ts                  # Redux store configuration
│   ├── hooks.ts                  # Typed Redux hooks
│   └── modalSlice.ts             # Auth modal state slice
├── hooks/
│   └── useDebounce.ts            # Debounce hook for search
├── lib/
│   └── firebase.ts               # Firebase app initialization
└── types/
    └── book.ts                   # Book type definition
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Firebase project with Firestore and Authentication enabled
- Stripe account with Firebase extension installed

### Installation

```bash
git clone <your-repo-url>
cd summarist
npm install
```

### Environment Variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Features

### Authentication
- Email/password login and registration
- Guest login (hardcoded credentials for demo/recruiters)
- Google login
- Forgot password via Firebase email reset
- Auth modal persists user context — stays on current page after login

### For You Page
- Selected, Recommended, and Suggested book sections
- Horizontally scrollable book rows
- Premium pill badge on subscription-required books

### Book Detail Page (`/book/:id`)
- Displays title, author, subtitle, cover image
- Real audio duration loaded from `audioLink` and formatted as `MM:SS`
- Stats grid: rating, duration, type, key ideas
- Read and Listen buttons with auth + subscription gating
- Add to Library functionality
- Premium pill shown above title when `subscriptionRequired: true`

### Player Page (`/player/:id`)
- Audio player with play/pause, skip, scrubber
- Book summary text with `white-space: pre-line` formatting
- Marks book as finished in Firestore on completion

### Library Page (`/library`)
- Saved Books and Finished Books sections
- Item count display
- Placeholder card when no saved books
- Horizontally scrollable book rows
- Login prompt with image when not authenticated

### Settings Page (`/settings`)
- Displays subscription status (Basic / Premium / Premium Plus)
- Displays user email
- Upgrade button for Basic users
- Login prompt with image when not authenticated

### Search
- Debounced search (300ms) by title or author
- Dropdown results with book cover, title, and author
- API: `getBooksByAuthorOrTitle`

### Payments
- Monthly and annual subscription plans
- 7-day free trial on annual plan
- Stripe Checkout integration
- Subscription status reflected in Settings page

---

## API Endpoints

All endpoints are Firebase Cloud Functions:

```
# Books by status
GET https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected
GET https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended
GET https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested

# Single book by ID
GET https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}

# Search
GET https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle?search=${query}
```

---

## CSS Architecture

This project uses a hybrid styling approach:

- **`home.module.css`** — CSS Module scoped exclusively to the home/landing page. This prevents home page styles (especially the `.btn` class with its green background) from leaking globally and conflicting with Tailwind utilities on other pages.
- **`globals.css`** — Global styles including Tailwind v4 directives, CSS variables (`@theme`), modal styles, skeleton animations, and reusable utility classes (`.btn-primary`, `.app-page`, `.book-tag`, etc.).
- **Tailwind CSS** — Used for structural layout only (`flex`, `grid`, `gap`, `overflow`). Arbitrary value classes like `bg-[#032b41]` are avoided in favor of inline styles due to Tailwind v4 limitations with arbitrary values.
- **Inline styles** — Used for all color and spacing values throughout app pages to ensure predictable rendering and avoid cascade conflicts.

---

## Design Notes

### "Add title to My Library" — Green Instead of Blue

The `btn-library` class in `globals.css` uses `color: #2bd97c` (green) rather than a traditional blue link color. This is an intentional design decision to maintain visual consistency with the brand's primary action color (`#2bd97c`). The control/reference site uses blue (`#2567ef`) for this link, but green was chosen here to keep all interactive actions within the same color language — green for positive actions (save, subscribe, read), dark blue (`#032b41`) for primary buttons.

---

## Completed Sections

- [x] Section 1 — Project Setup & Home Page
- [x] Section 2 — Authentication Modal
- [x] Section 3 — For You Page
- [x] Section 4 — Inside Book Page (/book/:id)
- [x] Section 5 — Player Page (/player/:id)
- [x] Section 6 — Sales / Choose Plan Page (/choose-plan)
- [x] Section 7 — Settings Page (/settings)
- [x] Section 8 — Search Bar
- [x] Section 9 — Sidebar
- [x] Section 10 — Skeleton Loading State
- [x] Section 11 — Library Page (Optional)

---

## Deployment

Deployed on Vercel. Connect your GitHub repository to Vercel and add the environment variables in the Vercel dashboard.
