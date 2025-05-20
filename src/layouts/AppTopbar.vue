<script setup>
import {ref, onMounted, onBeforeUnmount} from 'vue';
import {useLayout} from '@/composables/layout';
import Logout from '@/components/Logout.vue';

const {toggleMenu, toggleDarkMode, isDarkTheme} = useLayout();

const isMenuVisible = ref(false);
const isMobile = ref(false);

function handleClickOutside(event) {
  const menu = document.querySelector('.layout-topbar-menu');
  const ellipsis = document.querySelector('.layout-topbar-menu-button');
  if (
    menu &&
    !menu.contains(event.target) &&
    !ellipsis.contains(event.target)
  ) {
    isMenuVisible.value = false;
  }
}

onMounted(() => {
  isMobile.value = window.innerWidth < 1024;
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 1024;
    if (!isMobile.value) {
      isMenuVisible.value = false;
    }
  });
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div class="layout-topbar">
    <div class="layout-topbar-logo-container">
      <button class="layout-menu-button layout-topbar-action" @click="toggleMenu">
        <i class="pi pi-bars"></i>
      </button>
      <router-link to="/" class="layout-topbar-logo">
        <span>Admin</span>
      </router-link>
    </div>

    <div class="layout-topbar-actions">
      <button class="layout-topbar-action" @click="toggleDarkMode">
        <i :class="['pi', isDarkTheme ? 'pi-moon' : 'pi-sun']"></i>
      </button>

      <button
        class="layout-topbar-menu-button layout-topbar-action"
        @click="isMenuVisible = !isMenuVisible"
      >
        <i class="pi pi-ellipsis-v"></i>
      </button>

      <div :class="['layout-topbar-menu', { hidden: isMobile && !isMenuVisible }]">
        <div class="layout-topbar-menu-content">
          <Logout/>
        </div>
      </div>
    </div>
  </div>
</template>
