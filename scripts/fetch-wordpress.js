import fs from 'node:fs'
import path from 'node:path'
import https from 'node:https'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

const WP_API_URL = process.env.VITE_WP_API_URL || 'https://api.theblacklanternclinic.com'
const ENDPOINT = `${WP_API_URL.replace(/\/$/, '')}/wp-json/bec/v1/site-data?_t=${Date.now()}`

console.log(`📡 Fetching latest content from WordPress: ${ENDPOINT}...`)

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'BEC-Sync-Script/1.0' } }, (res) => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error(`HTTP Status ${res.statusCode}: ${res.statusMessage}`))
      }
      let rawData = ''
      res.on('data', (chunk) => { rawData += chunk })
      res.on('end', () => {
        try {
          const parsed = JSON.parse(rawData)
          resolve(parsed)
        } catch (e) {
          reject(e)
        }
      })
    }).on('error', (err) => {
      reject(err)
    })
  })
}

function downloadImageIfMissing(imageUrl, targetDir) {
  return new Promise((resolve) => {
    if (!imageUrl || typeof imageUrl !== 'string' || !imageUrl.startsWith('http')) {
      return resolve(null)
    }

    const filename = path.basename(new URL(imageUrl).pathname)
    const destPath = path.join(targetDir, filename)

    if (fs.existsSync(destPath)) {
      return resolve(filename)
    }

    console.log(`⬇️ Downloading missing asset: ${filename}...`)
    const file = fs.createWriteStream(destPath)
    https.get(imageUrl, { headers: { 'User-Agent': 'BEC-Sync-Script/1.0' } }, (res) => {
      if (res.statusCode === 200) {
        res.pipe(file)
        file.on('finish', () => {
          file.close()
          console.log(`✅ Saved: ${filename}`)
          resolve(filename)
        })
      } else {
        file.close()
        fs.unlink(destPath, () => {})
        resolve(null)
      }
    }).on('error', () => {
      file.close()
      fs.unlink(destPath, () => {})
      resolve(null)
    })
  })
}

async function run() {
  try {
    const data = await fetchJson(ENDPOINT)
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid JSON payload received from WordPress API')
    }

    const dataDir = path.join(rootDir, 'src', 'data')
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    const jsonPath = path.join(dataDir, 'siteContent.json')
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf-8')
    console.log(`💾 Saved latest WordPress content to: src/data/siteContent.json`)

    // Extract all image URLs from data to download locally if missing
    const publicDir = path.join(rootDir, 'public')
    const jsonStr = JSON.stringify(data)
    const matches = jsonStr.match(/https?:\/\/[^"\s]+\.(png|jpe?g|webp|svg)/gi) || []
    const uniqueUrls = Array.from(new Set(matches))

    console.log(`🔍 Checking ${uniqueUrls.length} media URLs found in site-data...`)
    for (const url of uniqueUrls) {
      await downloadImageIfMissing(url, publicDir)
    }

    // Sync index.html SEO tags with WordPress data
    updateIndexHtmlSeo(data)

    // Sync sitemap.xml lastmod dates
    updateSitemapLastmod()

    console.log(`✨ WordPress content synchronization complete!`)
  } catch (err) {
    console.error('❌ Failed to fetch content from WordPress:', err.message)
    process.exit(1)
  }
}

function updateIndexHtmlSeo(data) {
  const indexPath = path.join(rootDir, 'index.html')
  if (!fs.existsSync(indexPath)) return

  let html = fs.readFileSync(indexPath, 'utf-8')
  const title = (data.seo && data.seo.home_title) || (data.homepage && data.homepage.hero_title)
  const desc = (data.seo && data.seo.home_desc) || (data.homepage && data.homepage.hero_subtitle)

  if (title) {
    html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    html = html.replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/, `$1${title}$2`)
    html = html.replace(/(<meta\s+name="twitter:title"\s+content=")[^"]*(")/, `$1${title}$2`)
  }

  if (desc) {
    html = html.replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${desc}$2`)
    html = html.replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${desc}$2`)
    html = html.replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/, `$1${desc}$2`)
  }

  fs.writeFileSync(indexPath, html, 'utf-8')
  console.log(`📄 Synced index.html SEO meta tags with WordPress data`)
}

function updateSitemapLastmod() {
  const sitemapPath = path.join(rootDir, 'public', 'sitemap.xml')
  if (!fs.existsSync(sitemapPath)) return

  const today = new Date().toISOString().split('T')[0]
  let xml = fs.readFileSync(sitemapPath, 'utf-8')
  xml = xml.replace(/<lastmod>.*?<\/lastmod>/g, `<lastmod>${today}</lastmod>`)
  fs.writeFileSync(sitemapPath, xml, 'utf-8')
  console.log(`🗺️ Updated sitemap.xml <lastmod> to ${today}`)
}

run()
