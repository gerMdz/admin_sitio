<template>
  <div class="sidebar bg-white shadow-2 flex flex-column h-screen w-64 p-4">
    <!-- Área superior: usuario y logout -->
    <div class="flex flex-column gap-2 mb-6">
      <div class="text-lg font-bold mb-2">Admin</div>
      <!--      <Button label="Cerrar Sesión" icon="pi pi-sign-out" class="p-button-danger w-full" @click="logout" />-->
    </div>

    <!-- Menú principal -->
    <div class="menu flex flex-column gap-2 flex-grow">
      <router-link
          v-for="item in mainLinks"
          :key="item.label"
          :to="item.to"
          class="link p-2 rounded-lg hover:bg-gray-100 flex items-center gap-2"
          :class="{ 'bg-gray-200 font-bold': isActive(item.to) }"
          @click="$emit('link-click')"
      >
        <i :class="item.icon"></i>
        <span>{{ item.label }}</span>
      </router-link>

      <div class="mt-4">
        <div class="text-gray-500 text-sm uppercase mb-2">Catálogo</div>
        <router-link
            v-for="item in catalogLinks"
            :key="item.label"
            :to="item.to"
            class="link p-2 rounded-lg hover:bg-gray-100 flex items-center gap-2"
            :class="{ 'bg-gray-200 font-bold': isActive(item.to) }"
            @click="$emit('link-click')"
        >
          <i :class="item.icon"></i>
          <span>{{ item.label }}</span>
        </router-link>
      </div>
      <div class="mt-4">
        <Button label="Cerrar Sesión" icon="pi pi-sign-out" class="p-button-danger w-full" @click="logout"/>
      </div>
    </div>
  </div>
</template>

<script>
import {useRoute} from 'vue-router';
import {useLogout} from '@/composables/logout';
import Button from 'primevue/button';

export default {
  emits: ['link-click'],
  components: {Button},
  setup() {
    const {logout} = useLogout();
    const route = useRoute();

    const isActive = (path) => {
      return route.path.startsWith(path);
    };

    const mainLinks = [
      {label: 'Inicio', icon: 'pi pi-home', to: '/panel'},
      {label: 'Usuarios', icon: 'pi pi-users', to: '/usuarios'},
      {label: 'Roles', icon: 'pi pi-id-card', to: '/roles'},
    ];

    const catalogLinks = [
      {label: 'Estados Civiles', icon: 'pi pi-user-plus', to: '/civil-states'},
      {label: 'Disfrutes', icon: 'pi pi-face-smile', to: '/enjoys', routerLink: true},
      {label: 'Experiencias Completadas', icon: 'pi pi-star', to: '/experiences', routerLink: true},
      {label: '¿Con quién vives?', icon: 'pi pi-users', to: '/family', routerLink: true,},
      {label: 'Sexo', icon: 'pi pi-user', to: '/gender', routerLink: true,},
      {label: 'Áreas de Interés', icon: 'pi pi-heart', to: '/interests', routerLink: true,},
      {label: 'Etapas de Vida', icon: 'pi pi-star', to: '/lifestages', routerLink: true,},
      {label: 'Necesidades', icon: 'pi pi-list', to: '/needs', routerLink: true},
      {label: '¿Has utilizado alguno de estos servicios?', icon: 'pi pi-briefcase', to: '/services', routerLink: true}, // <-- nuevo

    ];

    return {mainLinks, catalogLinks, logout, isActive};
  },
};
</script>

<style scoped>
.sidebar {
  background-color: #ffffff;
}
.p-sidebar {
  z-index: 1100 !important;
}

.link {
  text-decoration: none;
  color: inherit;
}
</style>
