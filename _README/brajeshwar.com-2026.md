# brajeshwar.com-2026

- General
	- Default to text as the main content. Media (images, videos, audio) when when needed and it should be ornamental where if it is not there, it should still work most of the times.
- Styles
	- Start thinking as a simple, common, but decoupled style so I can embed them anywhere with specific styles. For instance, if I finally move to Pandoc + Make for the build. I can Pandoc build individual articles and leave the other files. Now, Jekyll practically build everything.
	- Media (Audio, Pictures, Video) have a common style for easy treatment.
	- Captions can be left (default), center, or right aligned. Should this be more from a utility class that aligns object (mostly text) to their desired alignments.
- Articles. I like the simplicity, the well-done design of the single articles of [YaleEnvironment360](https://e360.yale.edu).
	- I like the clean blockquote without any background but enough separation from the rest and the highlight of its presence.
	- The FIGURE and the image content are well placed. The caption is there as part of the picture content without much special treatment.
	- I like their multi-image splits view.
	- Some of their articles;
		- [Why U.S. Geothermal May Advance, Despite Political Headwinds](https://e360.yale.edu/features/united-states-geothermal-republican-spending-bill)
		- [In War Zones, a Race to Save Key Seeds Needed to Feed the World](https://e360.yale.edu/features/seed-banks-war-palestine-ukraine-sudan-syria)
		- [Cambodian Forest Defenders at Risk for Exposing Illegal Logging](https://e360.yale.edu/features/preah-roka-prey-lang-logging)
		- [How Restored Wetlands Can Protect Europe from Russian Invasion](https://e360.yale.edu/features/europe-wetland-defense)
		- [The ‘Green’ Aviation Fuel That Would Increase Carbon Emissions](https://e360.yale.edu/features/corn-soy-biofuel-aviation-congress)
- [BBC](https://www.bbc.com)
	- I like their single articles too.
		- [The Salvadoran beach town that became a Bitcoin testbed](https://www.bbc.com/travel/article/20250625-the-beach-town-that-became-a-bitcoin-testbed)
		- [How hygienic are public swimming pools really?](https://www.bbc.com/future/article/20250630-how-hygienic-are-public-swimming-pools-really)
		- [Ten things to know about veganism in childhood](https://www.bbc.com/future/article/20250627-10-things-to-know-about-veganism-in-childhood)
		- ['Notable' rise in dads over 60 in England and Wales](https://www.bbc.com/news/articles/cd0vvr9j1dxo)
		- [Head bans smartphones in favour of 'brick' phones](https://www.bbc.com/news/articles/cn7ddy8mpl1o)
	- The Walrus
		- Look at the typographic spacings that plays brilliantly without needing anything supplemental.
		- [How I Solved the Century-Old Mystery of a Miraculous Shipwreck Survivor](https://thewalrus.ca/empress-of-ireland-survivor-mystery/)
		- [Greenland Has Been Fighting Off Americans for Over a Century](https://thewalrus.ca/greenland-has-been-fighting-off-americans-for-over-a-century/)

## Todo

- [ ] Yearly Archives `/2001/`, `/2002/`, etc. https://simonwillison.net/ has a nice way of doing it.
- [ ] Link to the downloadable Markdown source file for every pages and posts.
- [ ] Modern Font Stacks. https://modernfontstacks.com
- [ ] Do we really need to remember the preference and hence JavaScript for the Light/Dark theme. Here is a solution with just CSS - https://codepen.io/ditheringidiot/pen/JjbzNMz
- [ ] Only text on home. Books, convert them to a list of the top rereads.
- [ ] Move `/search/` to a dedicated page to reduce the load on others.
- [ ] Search moved from Google to Algolia in `2025-JUN`. Should try [PageFind](https://pagefind.app). I'm hitting Algolia’s monthly limits pretty easily.
- [ ] Page Template (Full Width) - Pages, Photos, Wear, Devices, Books, Films.
- [ ] Page Template (Ideal Width) - posts, articles, ideal for reading.
- [ ] Page template (Timeline) `cv.brajeshwar.com` as part of `/about`. This should also replace my LinkedIn profile eventually.
- [ ] A style component for photos, which highlights some key photos. This will likely come after https://pictures.oinam.com is up.
- [ ] Re-direct `docs.brajeshwar.com` > `https://archive.oinam.com` via Cloudflare Workers.
- [ ] Move all Jekyll Redirects to Cloudflare or plain HTML or just ignore them! Give a good explanation and possible next-step in the 404 page.
- [ ] Move `cdn.oinam.com` items to `brajeshwar.com`.
- [ ] Move YouTube videos to `brajeshwar.com`.

## PageFind Search

- Pagefind working in production via GitHub Actions
- Search interface created (`_includes/search-pagefind.html`)
- Navigation updated (Search link in navbar)
- Local development setup not implemented yet

## Option 1: Manual Build Process (Simplest)

### Installation
```bash
# Global installation
npm install -g pagefind

# Or local to project
npm install pagefind --save-dev
```

### Development Workflow
```bash
# 1. Build Jekyll site
bundle exec jekyll build

# 2. Generate Pagefind index
npx pagefind --site _site

# 3. Serve the site
bundle exec jekyll serve
```

### Pros/Cons
- Simple, no complexity
- Works immediately
- Manual steps each time content changes
- Need to rebuild search index manually

## Option 2: Jekyll Plugin/Hook (More Automated)

### Steps
1. Create Jekyll plugin in `_plugins/pagefind.rb`
2. Hook into Jekyll's build process
3. Auto-run Pagefind after site generation
4. Configure to only run in development mode

### Development Workflow
```bash
# Single command - plugin handles Pagefind automatically
bundle exec jekyll serve
```

### Pros/Cons
- Automatic during `jekyll serve`
- No manual steps
- More complex setup
- Plugin development required

## Option 3: Watch Script (Most Convenient)

### Setup
1. Create watch script using `nodemon` or similar
2. Monitor Jekyll source files for changes
3. Auto-rebuild Jekyll + Pagefind on changes
4. Restart Jekyll server automatically

### Example Implementation
```bash
# Install file watcher
npm install -g nodemon

# Create watch script
nodemon --watch _posts --watch _pages --exec "bundle exec jekyll build && npx pagefind --site _site"
```

### Pros/Cons
- Best developer experience
- Automatic rebuilds on file changes
- No manual intervention needed
- Additional dependencies
- More complex setup

## Option 4: Docker/Make Setup

### Setup
1. Create `Dockerfile` with Jekyll + Node + Pagefind
2. Create `Makefile` with development commands
3. Single command to start full environment

### Example Commands
```bash
# Start development environment
make dev

# Build and test
make build
```

### Pros/Cons
- Consistent environment across machines
- All dependencies contained
- Easy onboarding for new developers
- Docker overhead for simple sites
- More complex initial setup

## Recommendation

### For Immediate Testing
Start with **Option 1 (Manual)** - simple and works right away.

### For Regular Development
Move to **Option 3 (Watch Script)** - best developer experience with automatic rebuilds.

### For Team Development
Consider **Option 4 (Docker)** - consistent environment for all developers.

## Implementation Priority

1. **Phase 1**: Manual process for testing
2. **Phase 2**: Watch script for regular development
3. **Phase 3**: Consider Jekyll plugin if watch script isn't sufficient

## Notes

- Pagefind only needs to run when content changes (posts, pages)
- CSS/JS changes don't require Pagefind rebuild
- Search index is relatively fast to generate for most sites
- Local development doesn't need the same optimization as production builds

## Current Files

- `_includes/search-pagefind.html` - Search interface
- `search-pagefind.html` - Test page
- `.github/workflows/jekyll-pagefind-deploy.yml` - Production workflow
- `_data/nav.yaml` - Updated with Search link