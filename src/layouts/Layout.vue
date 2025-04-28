<template>
  <div class="layout flex min-h-screen relative">

    <!-- Sidebar Desktop Fijo -->
    <div v-if="!isMobile" class="sidebar-desktop flex flex-column p-3 shadow-2">
      <SidebarMenu />
    </div>

    <!-- Sidebar Mobile Modal -->
    <Sidebar
        v-else
        v-model:visible="sidebarVisible"
        modal
        dismissable
        position="left"
    >
      <SidebarMenu @link-click="handleLinkClick" />
    </Sidebar>

    <!-- Área principal -->
    <div class="flex flex-column flex-grow-1">
      <Menubar class="p-3 shadow-2 flex justify-between">
        <template #start>
          <div class="flex items-center gap-2">
            <Button
                v-if="isMobile"
                icon="pi pi-bars"
                class="p-button-text"
                @click="toggleSidebar"
            />
            <span class="text-2xl font-bold">Admin Panel</span>
          </div>
        </template>

        <template #end>
          <div class="flex items-center gap-2">
            <Button icon="pi pi-cog" class="p-button-rounded p-button-text" @click="toggleConfigurator" />
            <Button label="Cerrar Sesión" icon="pi pi-sign-out" class="p-button-danger" @click="logout" />
          </div>
        </template>
      </Menubar>

      <div class="p-5 flex-grow-1 overflow-auto">
        <router-view />
      </div>
    </div>

    <Configurator v-if="showConfigurator" @close="showConfigurator = false" />
  </div>
</template>

<script>
import Sidebar from 'primevue/sidebar';
import SidebarMenu from '@/components/Sidebar.vue'; // Sidebar real
import Configurator from '@/components/Configurator.vue';
import Menubar from 'primevue/menubar';
import Button from 'primevue/button';
import { useLogout } from '@/composables/logout';
import { ref, onMounted, onBeforeUnmount } from 'vue';

export default {
  components: {
    Sidebar,
    SidebarMenu,
    Menubar,
    Button,
    Configurator
  },
  setup() {
    const { logout } = useLogout();
    const showConfigurator = ref(false);
    const sidebarVisible = ref(false);
    const isMobile = ref(false);

    const handleResize = () => {
      isMobile.value = window.innerWidth < 768;
      sidebarVisible.value = false; // Al cambiar de tamaño, sidebar modal cerrado por defecto
    };

    onMounted(() => {
      handleResize();
      window.addEventListener('resize', handleResize);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResize);
    });

    const toggleConfigurator = () => {
      showConfigurator.value = !showConfigurator.value;
    };

    const toggleSidebar = () => {
      sidebarVisible.value = !sidebarVisible.value;
    };

    const handleLinkClick = () => {
      if (isMobile.value) {
        sidebarVisible.value = false;
      }
    };

    return {
      logout,
      showConfigurator,
      toggleConfigurator,
      sidebarVisible,
      isMobile,
      toggleSidebar,
      handleLinkClick
    };
  },
};
</script>

<style scoped>
.layout {
  background-color: #f8f9fa;
}

/* Sidebar Desktop Fijo */
.sidebar-desktop {
  width: 250px;
  min-height: 100vh;
  background-color: #ffffff;
}

.p-sidebar {
  z-index: 1100 !important;
}
</style>
