<script setup lang="ts">
import { onContentUpdated, useRoute } from 'vitepress'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useData } from 'vitepress'

type NavLink = {
  text: string
  link: string
}

const { frontmatter, theme } = useData()
const route = useRoute()

const open = ref(false)
const query = ref('')
const pageLinks = ref<NavLink[]>([])
const root = ref<HTMLElement>()
const defaultApiPageTitles = [
  '获取当前用户信息和余额',
  '重置 API Key（旧 Key 立即失效）',
  '获取当前令牌数量（GP 余额）',
  '请求解析画廊的归档下载链接',
]
const apiPageTitles = ref<Set<string>>(new Set(defaultApiPageTitles))
let observer: MutationObserver | undefined

const isHome = computed(() => frontmatter.value.layout === 'home')

const siteLinks = computed(() => {
  const links: NavLink[] = []
  const seen = new Set<string>()

  function add(text: unknown, link: unknown) {
    if (typeof text !== 'string' || typeof link !== 'string' || seen.has(link)) return
    seen.add(link)
    links.push({ text, link })
  }

  function walk(items: any[]) {
    for (const item of items) {
      add(item.text, item.link)
      if (Array.isArray(item.items)) walk(item.items)
    }
  }

  if (Array.isArray(theme.value.nav)) walk(theme.value.nav)
  if (Array.isArray(theme.value.sidebar)) walk(theme.value.sidebar)

  return links
})

const filteredPageLinks = computed(() => filterLinks(pageLinks.value))
const filteredSiteLinks = computed(() => filterLinks(siteLinks.value))
const hasPageLinks = computed(() => filteredPageLinks.value.length > 0)

function filterLinks(links: NavLink[]) {
  const keyword = query.value.trim().toLowerCase()
  if (!keyword) return links

  return links.filter((item) => item.text.toLowerCase().includes(keyword))
}

function normalizeText(value: string) {
  return value.replace(/\s+/g, ' ').trim()
}

function addPageLink(links: NavLink[], seen: Set<string>, text: string, link: string) {
  const normalized = normalizeText(text)
  if (!normalized || normalized.length > 80 || seen.has(link)) return
  seen.add(link)
  links.push({ text: normalized, link })
}

function isApiPage() {
  return route.path.includes('/docs/api/server')
}

function collectPageLinks() {
  if (typeof document === 'undefined') return

  const links: NavLink[] = []
  const seen = new Set<string>()

  if (isApiPage()) {
    for (const title of apiPageTitles.value) {
      links.push({ text: title, link: `api-title:${encodeURIComponent(title)}` })
    }

    pageLinks.value = links
    return
  }

  document.querySelectorAll<HTMLElement>('.vp-doc h2[id]').forEach((heading) => {
    addPageLink(links, seen, heading.textContent || '', `#${heading.id}`)
  })

  pageLinks.value = links
}

async function loadApiPageTitles() {
  if (!isApiPage()) {
    apiPageTitles.value = new Set(defaultApiPageTitles)
    return
  }

  let yaml = ''

  try {
    const response = await fetch('/openapi/server.yaml')
    yaml = await response.text()
  } catch {
    apiPageTitles.value = new Set(defaultApiPageTitles)
    collectPageLinks()
    return
  }

  const titles = new Set<string>()
  let inPaths = false

  for (const line of yaml.split('\n')) {
    if (line.startsWith('paths:')) {
      inPaths = true
      continue
    }

    const summary = line.match(/^      summary:\s*(.+)$/)
    if (inPaths && summary) titles.add(normalizeText(summary[1]))
  }

  apiPageTitles.value = titles.size > 0 ? titles : new Set(defaultApiPageTitles)
  collectPageLinks()
}

function linkHref(item: NavLink) {
  return item.link.startsWith('api-title:') ? '#' : item.link
}

function activatePageLink(item: NavLink) {
  close()

  if (item.link === '#') {
    scrollToTop()
    return
  }

  if (item.link.startsWith('api-title:')) {
    const title = decodeURIComponent(item.link.slice('api-title:'.length))
    const target = Array.from(
      document.querySelectorAll<HTMLElement>('.scalar-app h1, .scalar-app h2, .scalar-app h3, .scalar-app h4')
    ).find((heading) => normalizeText(heading.textContent || '').includes(title))

    if (target) {
      scrollToElement(target)
      return
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    return
  }

  const targetId = decodeURIComponent(item.link.slice(1))
  const target = document.getElementById(targetId)
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  else window.location.hash = item.link
}

function scrollToElement(target: HTMLElement) {
  const navHeight = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--vp-nav-height')
  ) || 0
  const localNavHeight = window.innerWidth < 960 ? (root.value?.getBoundingClientRect().height || 0) : 0
  const offset = (window.innerWidth >= 960 ? navHeight : localNavHeight) + 16
  const top = target.getBoundingClientRect().top + window.scrollY - offset

  window.scrollTo({ top: Math.max(0, top), left: 0, behavior: 'auto' })
}

function scrollToTop() {
  close()
  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
}

function toggle() {
  open.value = !open.value
  if (open.value) void nextTick(collectPageLinks)
}

function close() {
  open.value = false
}

function closeOnEscape(event: KeyboardEvent) {
  if (event.key === 'Escape') close()
}

function closeOnClickOutside(event: MouseEvent) {
  if (open.value && root.value && !root.value.contains(event.target as Node)) close()
}

onMounted(() => {
  collectPageLinks()
  void loadApiPageTitles()
  document.addEventListener('keydown', closeOnEscape)
  document.addEventListener('click', closeOnClickOutside)

  const content = document.querySelector('#VPContent')
  if (content && !isApiPage()) {
    observer = new MutationObserver(collectPageLinks)
    observer.observe(content, { childList: true, subtree: true })
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', closeOnEscape)
  document.removeEventListener('click', closeOnClickOutside)
  observer?.disconnect()
})

onContentUpdated(() => {
  if (!isApiPage()) collectPageLinks()
})
watch(() => route.path, () => {
  close()
  query.value = ''
  void nextTick(async () => {
    await loadApiPageTitles()
    collectPageLinks()
  })
})
</script>

<template>
  <div v-if="!isHome" ref="root" class="UnifiedLocalNav">
    <div class="container">
      <button type="button" class="trigger" :aria-expanded="open" @click="toggle">
        <span class="vpi-align-left icon" />
        <span>目录 / 搜索</span>
      </button>
    </div>

    <div class="panel" :class="{ open }">
      <label class="search-box">
        <span class="vpi-search" />
        <input v-model="query" type="search" placeholder="搜索当前页面或文档" />
      </label>

      <div class="groups">
        <section v-if="hasPageLinks" class="group">
          <div class="group-header">
            <p class="group-title">当前页面</p>
          </div>
          <a v-for="item in filteredPageLinks" :key="item.link" :href="linkHref(item)" @click.prevent="activatePageLink(item)">
            {{ item.text }}
          </a>
        </section>

        <section v-if="filteredSiteLinks.length" class="group">
          <p class="group-title">文档跳转</p>
          <a v-for="item in filteredSiteLinks" :key="item.link" :href="item.link" @click="close">
            {{ item.text }}
          </a>
        </section>
      </div>
    </div>

  </div>

  <Teleport to="body">
    <button v-if="!isHome" type="button" class="floating-top-button" aria-label="返回顶部" @click="scrollToTop">
      <span class="vpi-arrow-up" />
      <span>顶部</span>
    </button>
  </Teleport>
</template>

<style scoped>
.UnifiedLocalNav {
  position: sticky;
  top: 0;
  left: 0;
  z-index: var(--vp-z-index-local-nav);
  width: 100vw;
  margin: 0 calc(50% - 50vw) 24px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.14);
  background: rgba(2, 6, 23, 0.82);
  backdrop-filter: blur(18px);
}

:global(.VPDoc) > .UnifiedLocalNav {
  margin-top: -32px;
}

.container {
  display: flex;
  justify-content: stretch;
  align-items: center;
  height: 48px;
  min-height: 48px;
}

.trigger {
  display: inline-flex;
  align-items: center;
  align-self: stretch;
  flex: 1;
  gap: 8px;
  height: 48px;
  min-height: 0;
  padding: 0 24px;
  color: var(--vp-c-text-2);
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
}

.trigger:hover,
.trigger[aria-expanded="true"] {
  color: var(--vp-c-text-1);
}

.icon {
  font-size: 14px;
}

.panel {
  position: absolute;
  top: 56px;
  right: 16px;
  left: 16px;
  display: none;
  max-height: min(72vh, 560px);
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.96);
  box-shadow: 0 24px 70px rgba(2, 6, 23, 0.42);
  overscroll-behavior: contain;
  touch-action: pan-y;
}

.panel.open {
  display: block;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.14);
  color: var(--vp-c-text-3);
}

.search-box input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--vp-c-text-1);
  font-size: 14px;
}

.search-box input::placeholder {
  color: var(--vp-c-text-3);
}

.groups {
  max-height: calc(min(72vh, 560px) - 49px);
  overflow: auto;
  padding: 8px;
  overscroll-behavior: contain;
}

.group + .group {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(148, 163, 184, 0.12);
}

.group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 6px 6px 8px;
}

.group-title {
  margin: 0;
  color: var(--vp-c-text-3);
  font-size: 12px;
  font-weight: 800;
}

.group a {
  display: block;
  overflow: hidden;
  padding: 9px 10px;
  border-radius: 8px;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.floating-top-button {
  position: fixed;
  right: 18px;
  bottom: max(10px, env(safe-area-inset-bottom));
  z-index: calc(var(--vp-z-index-local-nav) + 1);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 38px;
  padding: 0 12px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 8px;
  background: #020617;
  color: var(--vp-c-text-2);
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 14px 34px rgba(2, 6, 23, 0.32);
}

.floating-top-button:hover {
  border-color: rgba(129, 140, 248, 0.34);
  background: rgba(15, 23, 42, 0.98);
  color: var(--vp-c-text-1);
}

.group a:hover {
  background: rgba(99, 102, 241, 0.14);
  color: var(--vp-c-text-1);
}

@media (min-width: 768px) {
  :global(.VPDoc) > .UnifiedLocalNav {
    margin-top: -48px;
  }

  .trigger {
    padding: 0 32px;
  }
}

@media (min-width: 960px) {
  .UnifiedLocalNav {
    position: fixed;
    top: var(--vp-nav-height);
    bottom: 0;
    width: 288px;
    margin: 0;
    border-right: 1px solid rgba(148, 163, 184, 0.14);
    border-bottom: 0;
    background: #020617;
    backdrop-filter: none;
  }

  .container {
    display: none;
  }

  .panel {
    position: static;
    display: block;
    width: auto;
    max-height: none;
    height: 100%;
    border: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
  }

  .groups {
    max-height: calc(100vh - var(--vp-nav-height) - 49px);
  }

  .floating-top-button {
    right: 24px;
    bottom: 24px;
  }
}

@media (min-width: 1280px) {
  .UnifiedLocalNav {
    display: block;
  }
}
</style>
