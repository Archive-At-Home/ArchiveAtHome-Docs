<script setup lang="ts">
import { ApiReference } from '@scalar/api-reference'
import '@scalar/api-reference/style.css'

const configuration = {
  url: '/openapi/server.yaml',
  documentDownloadType: 'none',
  searchHotKey: 'k',
  theme: 'none',
  forceDarkModeState: 'dark',
  hideDarkModeToggle: true,
  withDefaultFonts: false,
  agent: {
    disabled: true,
  },
}
</script>

<template>
  <div class="api-reference-standalone">
    <div class="api-reference-frame">
      <ClientOnly>
        <ApiReference :configuration="configuration" />
      </ClientOnly>
    </div>
  </div>
</template>

<style scoped>
.api-reference-standalone {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background:
    linear-gradient(180deg, rgba(15, 23, 42, 0.92), rgba(2, 6, 23, 0.98) 520px),
    radial-gradient(circle at 22% 8%, rgba(99, 102, 241, 0.28), transparent 34%),
    radial-gradient(circle at 82% 12%, rgba(16, 185, 129, 0.16), transparent 32%),
    #020617;
  color: #f8fafc;
}

.api-reference-standalone::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(148, 163, 184, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(148, 163, 184, 0.04) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: linear-gradient(to bottom, black, transparent 62%);
}

.api-reference-frame {
  position: relative;
  z-index: 1;
}

.api-reference-frame :deep(.scalar-app) {
  --scalar-background-1: #020617;
  --scalar-background-2: rgba(15, 23, 42, 0.92);
  --scalar-background-3: rgba(30, 41, 59, 0.9);
  --scalar-background-accent: rgba(99, 102, 241, 0.16);
  --scalar-color-1: #f8fafc;
  --scalar-color-2: #cbd5e1;
  --scalar-color-3: #94a3b8;
  --scalar-color-accent: #818cf8;
  --scalar-border-color: rgba(148, 163, 184, 0.18);
  --scalar-radius: 8px;
  --scalar-radius-lg: 10px;
  --scalar-radius-xl: 12px;
  --scalar-font: var(--vp-font-family-base);
  --scalar-font-code: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  --scalar-sidebar-background-1: rgba(2, 6, 23, 0.88);
  --scalar-sidebar-color-1: #f8fafc;
  --scalar-sidebar-color-2: #cbd5e1;
  --scalar-sidebar-border-color: rgba(148, 163, 184, 0.16);
  --scalar-sidebar-item-hover-background: rgba(99, 102, 241, 0.12);
  --scalar-sidebar-item-hover-color: #f8fafc;
  --scalar-sidebar-item-active-background: rgba(99, 102, 241, 0.18);
  --scalar-sidebar-color-active: #ffffff;
  --scalar-sidebar-search-background: rgba(15, 23, 42, 0.9);
  --scalar-sidebar-search-color: #94a3b8;
  --scalar-sidebar-search-border-color: rgba(148, 163, 184, 0.18);
  --scalar-header-background-1: rgba(2, 6, 23, 0.9);
  --scalar-header-background-2: rgba(15, 23, 42, 0.88);
  --scalar-header-color-1: #f8fafc;
  --scalar-header-color-2: #cbd5e1;
  --scalar-header-border-color: rgba(148, 163, 184, 0.16);
  min-height: 100vh;
  background: transparent;
}

.api-reference-frame :deep(.scalar-api-reference) {
  --scalar-header-height: 0px;
  --scalar-sidebar-width: 0px;
}

.api-reference-frame :deep(.scalar-api-references-standalone-mobile) {
  --scalar-header-height: 0px;
}

.api-reference-frame :deep(.dark-mode),
.api-reference-frame :deep(.light-mode) {
  color-scheme: dark;
}

.api-reference-frame :deep(.scalar-app .references-layout),
.api-reference-frame :deep(.scalar-app .reference-layout),
.api-reference-frame :deep(.scalar-app .api-reference) {
  background: transparent;
}

.api-reference-frame :deep(.scalar-app .references-layout) {
  grid-template-columns: 1fr;
  grid-template-rows: 0 auto auto;
  grid-template-areas:
    "header"
    "rendered"
    "footer";
}

.api-reference-frame :deep(.scalar-app .references-sidebar),
.api-reference-frame :deep(.scalar-app [style*="grid-area: navigation"]),
.api-reference-frame :deep(.scalar-app .\[grid-area\:navigation\]),
.api-reference-frame :deep(.scalar-app [style*="grid-area: header"]),
.api-reference-frame :deep(.scalar-app .\[grid-area\:header\]) {
  display: none;
}

@media (max-width: 1000px) {
  .api-reference-frame :deep(.references-layout) {
    grid-template-columns: 100% !important;
    grid-template-rows: 0 0 auto auto !important;
    grid-template-areas:
      "header"
      "navigation"
      "rendered"
      "footer" !important;
  }
}

.api-reference-frame :deep(.scalar-app .bg-b-1),
.api-reference-frame :deep(.scalar-app .bg-b-2),
.api-reference-frame :deep(.scalar-app .bg-b-3) {
  background-color: transparent;
}

.api-reference-frame :deep(.scalar-app aside),
.api-reference-frame :deep(.scalar-app [class*="sidebar"]) {
  backdrop-filter: blur(18px);
}

.api-reference-frame :deep(.scalar-app .bg-sidebar-b-1),
.api-reference-frame :deep(.scalar-app .bg-b-header-1) {
  background-color: rgba(2, 6, 23, 0.86);
}

.api-reference-frame :deep(.scalar-app .border-border),
.api-reference-frame :deep(.scalar-app .border-sidebar-border),
.api-reference-frame :deep(.scalar-app .border-border-header) {
  border-color: rgba(148, 163, 184, 0.16);
}

.api-reference-frame :deep(.scalar-app a),
.api-reference-frame :deep(.scalar-app button) {
  transition:
    color 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.api-reference-frame :deep(.scalar-app button),
.api-reference-frame :deep(.scalar-app input),
.api-reference-frame :deep(.scalar-app textarea),
.api-reference-frame :deep(.scalar-app select) {
  border-radius: 8px;
}

.api-reference-frame :deep(.scalar-app pre),
.api-reference-frame :deep(.scalar-app code),
.api-reference-frame :deep(.scalar-app [class*="code"]),
.api-reference-frame :deep(.scalar-app [class*="snippet"]) {
  border-color: rgba(148, 163, 184, 0.16);
}

.api-reference-frame :deep(.scalar-app pre),
.api-reference-frame :deep(.scalar-app [class*="snippet"]) {
  background: rgba(2, 6, 23, 0.76);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.api-reference-frame :deep(.scalar-app [class*="method"]),
.api-reference-frame :deep(.scalar-app [class*="HttpMethod"]) {
  font-weight: 800;
  letter-spacing: 0;
}

.api-reference-frame :deep(.scalar-app [class*="card"]),
.api-reference-frame :deep(.scalar-app [class*="Card"]),
.api-reference-frame :deep(.scalar-app [class*="section"]),
.api-reference-frame :deep(.scalar-app [class*="Section"]) {
  border-color: rgba(148, 163, 184, 0.16);
}

.api-reference-frame :deep(.scalar-app [class*="tag" i]),
.api-reference-frame :deep(.scalar-app [class*="badge" i]) {
  letter-spacing: 0;
}

@media (max-width: 767px) {
  .api-reference-frame :deep(.scalar-app) {
    --scalar-sidebar-padding: 10px;
  }
}

</style>
