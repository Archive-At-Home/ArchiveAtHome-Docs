<script setup lang="ts">
import { ApiReference } from '@scalar/api-reference'
import '@scalar/api-reference/style.css'

const configuration = {
  url: '/openapi/server.yaml',
  documentDownloadType: 'none',
  searchHotKey: 'k',
  theme: 'default',
  agent: {
    disabled: true,
  },
}
</script>

<template>
  <div class="api-reference-standalone">
    <ClientOnly>
      <ApiReference :configuration="configuration" />
    </ClientOnly>
  </div>
</template>

<style>
.api-reference-standalone {
  min-height: 100vh;
}

.api-reference-standalone :deep(.scalar-app) {
  min-height: 100vh;
}
</style>