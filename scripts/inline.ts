/**
 * Fold dist/ into one self-contained page for publishing as an Artifact.
 *
 * Artifacts are wrapped in <!doctype html><head>…</head><body> at publish time
 * and a strict CSP blocks every external host except Google Fonts, so the
 * output is page content only, with the JS and CSS inlined.
 */
const html = await Deno.readTextFile('dist/index.html')

const cssHref = html.match(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+\.css)"/)?.[1]
const jsSrc = html.match(/<script[^>]+src="([^"]+\.js)"/)?.[1]
if (!cssHref || !jsSrc) throw new Error('could not find built assets in dist/index.html')

const read = (p: string) => Deno.readTextFile(`dist/${p.replace(/^\//, '')}`)
const css = await read(cssHref)
const js = await read(jsSrc)

// index.html carries the long SEO title; the Artifact gallery wants a name.
const title = 'KAWAI Music School'
const fonts = html.match(/<link rel="stylesheet"\s+href="https:\/\/fonts\.googleapis\.com[^>]*>/)?.[0] ?? ''

const out = [
  '<meta charset="utf-8">',
  `<title>${title}</title>`,
  '<link rel="preconnect" href="https://fonts.googleapis.com">',
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
  fonts,
  '<style>',
  css,
  '</style>',
  '',
  '<div id="app"></div>',
  '',
  '<script type="module">',
  js,
  '</script>',
  '',
].join('\n')

await Deno.writeTextFile('dist/artifact.html', out)
const kb = (n: number) => `${(n / 1024).toFixed(1)}KB`
console.log(`dist/artifact.html ${kb(out.length)} (css ${kb(css.length)}, js ${kb(js.length)})`)
