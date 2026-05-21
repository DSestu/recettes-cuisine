import { useEffect } from 'react'

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')
const SITE_TITLE = 'DSestu - Recettes de cuisine'
const SITE_DESC = 'Recettes de cuisine maison'
const SITE_IMAGE = `${BASE}/assets/social.png`

interface MetaOptions {
  title?: string
  description?: string
  image?: string
  url?: string
}

function setMeta(selector: string, attr: string, value: string) {
  let el = document.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    const [attrName, attrVal] = selector.replace('[', '').replace(']', '').replace('"', '').replace('"', '').split('=')
    el.setAttribute(attrName.trim(), attrVal.trim().replace(/"/g, ''))
    document.head.appendChild(el)
  }
  el.setAttribute(attr, value)
}

export function useDocumentMeta({ title, description, image, url }: MetaOptions) {
  useEffect(() => {
    const fullTitle = title ? `${title} – Recettes` : SITE_TITLE
    const desc = description || SITE_DESC
    const img = image || SITE_IMAGE
    const pageUrl = url || window.location.href

    document.title = fullTitle

    setMeta('meta[property="og:title"]', 'content', fullTitle)
    setMeta('meta[property="og:description"]', 'content', desc)
    setMeta('meta[property="og:image"]', 'content', img)
    setMeta('meta[property="og:url"]', 'content', pageUrl)
    setMeta('meta[name="twitter:title"]', 'content', fullTitle)
    setMeta('meta[name="twitter:description"]', 'content', desc)
    setMeta('meta[name="twitter:image"]', 'content', img)
    setMeta('meta[property="twitter:url"]', 'content', pageUrl)

    return () => {
      document.title = SITE_TITLE
    }
  }, [title, description, image, url])
}
