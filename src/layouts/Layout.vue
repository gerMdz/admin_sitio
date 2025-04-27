<template>
  <div class="layout flex min-h-screen relative">
    <!-- Sidebar izquierdo -->
    <Sidebar />

    <!-- Área principal -->
    <div class="flex flex-column flex-grow-1">
      <Menubar class="p-3 shadow-2 flex justify-between">
        <template #start>
          <span class="text-2xl font-bold">Admin Panel</span>
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
import Configurator from '@/components/Configurator.vue'; // Todavía no lo hicimos, ahora te paso el básico
import Menubar from 'primevue/menubar';
import Button from 'primevue/button';
import { ref } from 'vue';
import { useLogout } from '@/composables/logout';

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

    const toggleConfigurator = () => {
      showConfigurator.value = !showConfigurator.value;
    };

    return { logout, showConfigurator, toggleConfigurator };
  },
};
</script>

<style scoped>
.layout {
  background-color: #f8f9fa;
}
</style>
