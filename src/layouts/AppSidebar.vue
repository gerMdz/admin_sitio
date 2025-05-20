<script setup>
import AppMenu from './AppMenu.vue';

const version = __APP_VERSION__;
const entorno = __APP_ENV__ === 'production' ? 'Producción' : 'Desarrollo';
</script>

<template>
  <div class="layout-sidebar">
    <div class="mt-auto text-center text-xs text-gray-500 py-2 border-top-1 border-gray-200">

      v{{ version }} - {{ entorno }}

    </div>
    <app-menu></app-menu>
  </div>
</template>

<style lang="scss" scoped></style>
