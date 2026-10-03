# TODO

- [ ] Promote the Cloudflare Pages backup to serve brajeshwar.com, so the GitHub certificate renewal stops being a risk. See below. Not doing it now (decided 2026-10-02).

## Promote Cloudflare Pages to serve brajeshwar.com

**Why.** Since 2026-10-02 brajeshwar.com is GitHub Pages behind Cloudflare's proxy with SSL **Full (strict)**: DNS is `CNAME @ → brajeshwar.github.io` and `CNAME www → brajeshwar.com`, both Proxied. GitHub renews its Let's Encrypt certificate itself (current one expires **2026-12-31**), and behind the proxy a renewal can fail. Cloudflare then shows a **526** until the records go DNS only for a day so GitHub can renew. If the Cloudflare Pages project serves the domain instead, Cloudflare issues the certificate at its own edge and there is no origin certificate to expire.

**Two ways to stop worrying** (the same choice is written up for oinam.com in `~/_/Oinam/3-Resources/oinam.com/oinam.com.md`):

- **A. Grey (DNS only):** set `@` and `www` to DNS only. GitHub serves directly and renews its certificate itself; nothing to watch. You lose Cloudflare Rules, WAF, and zone analytics on the site; Cloudflare Web Analytics still works with its JS snippet. A few toggles.
- **B. Cloudflare Pages serves (preferred direction, 2026-10-02):** GitHub stays the source, Cloudflare deploys and issues the certificate at the edge. Keeps every Cloudflare feature. The rest of this file is option B.

**This is the "deliberate DNS move"** that `_docs/hosting.md` › *Cloudflare Pages: the backup build* says promoting the backup must be. Read that section first; it still stands.

**State on 2026-10-02.** The backup `brajeshwar.pages.dev` (project `brajeshwar`, repo `brajeshwar/brajeshwar.github.io`) answers 200 with the same title and feed as production. It fits Pages limits: about 2,660 files, the largest 17 MB, against 25 MiB per file and 20,000 files.

**Before promoting, close the parity gaps** that `_docs/hosting.md` records:

- [ ] The backup's build command skips the esbuild minify step. Add `&& npx --yes esbuild _site/assets/scripts/*.js --minify --outdir=_site/assets/scripts --allow-overwrite` before the Pagefind step, or accept unminified JavaScript.
- [ ] Check the Ruby version in the Cloudflare Pages build log (it very probably follows `.ruby-version`, 3.3.5, not v3's 3.4.4).
- [ ] On `brajeshwar.pages.dev`, check that Pagefind search works and the agent Markdown twins exist.
- [ ] Decide what happens to the GitHub Actions deploy afterwards: keep it as the standby (swap the roles in `_docs/hosting.md`), or stop it.

**The move:**

1. Cloudflare → Workers & Pages → `brajeshwar` → **Custom domains** → add `brajeshwar.com`, then `www.brajeshwar.com`. Cloudflare repoints the two DNS records and issues the certificate.
2. GitHub → `brajeshwar/brajeshwar.github.io` → Settings → Pages → remove the custom domain, so GitHub stops serving brajeshwar.com. (The `CNAME` file is a GitHub Pages mechanism; Cloudflare Pages ignores it.)
3. Check: home, a deep post, `/feed.xml`, search, a Markdown twin, `www` → root, and `http://` → `https://`.
4. Update `_docs/hosting.md`: which host is primary, and which is the standby.

**Stopgap if the certificate fails before the move:** set the two records to DNS only for a day so GitHub can renew, then back to Proxied. Or add a Cloudflare Configuration Rule setting SSL to **Full** (not strict) for brajeshwar.com, which keeps the site up with an expired origin certificate, at the cost of Cloudflare no longer checking it.

Note from `_docs/hosting.md`: Cloudflare now steers new projects to Workers static assets rather than Pages. Pages is in maintenance but supported, and this project already exists, so promoting it is fine.
