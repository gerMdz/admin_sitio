<template>
  <div class="layout flex min-h-screen relative">
    <!-- Sidebar -->
    <Sidebar v-model:visible="sidebarVisible" :modal="isMobile" position="left">
      <!-- Menú lateral aquí -->
    </Sidebar>

    <!-- Área principal -->
    <div class="flex flex-column flex-grow-1">
      <Menubar class="p-3 shadow-2 flex justify-between">
        <template #start>
          <div class="flex items-center gap-2">
            <Button v-if="isMobile" icon="pi pi-bars" @click="sidebarVisible = !sidebarVisible" class="p-button-text" />
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

    <!-- Configurator -->
    <Configurator v-if="showConfigurator" @close="showConfigurator = false" />
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue';
import Configurator from '@/components/Configurator.vue';
import Menubar from 'primevue/menubar';
import Button from 'primevue/button';
import { useLogout } from '@/composables/logout';
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  components: {
    Sidebar,
    Menubar,
    Button,
    Configurator
  },
  setup() {
    const { logout } = useLogout();
    const showConfigurator = ref(false);
    const sidebarVisible = ref(true);
    const isMobile = ref(false);

    const handleResize = () => {
      if (window.innerWidth < 768) {
        isMobile.value = true;
        sidebarVisible.value = false; // <-- FORZAR cerrado en mobile
      } else {
        isMobile.value = false;
        sidebarVisible.value = true; // <-- FORZAR abierto en desktop
      }
    };


    onMounted(() => {
      handleResize();
      window.addEventListener('resize', handleResize);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
    });

    const toggleConfigurator = () => {
      showConfigurator.value = !showConfigurator.value;
    };

    return { logout, showConfigurator, toggleConfigurator, sidebarVisible, isMobile };
  },
};
</script>

<style scoped>
.layout {
  background-color: #f8f9fa;
}
</style>