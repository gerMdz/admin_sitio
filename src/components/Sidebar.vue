<template>
  <div class="sidebar bg-white shadow-2 flex flex-column h-screen w-64 p-4">
    <div class="flex flex-column gap-2 mb-3">
      <div class="text-lg font-bold mb-2">Admin
        <p class="text-center text-xs text-gray-500 py-2 border-top-1 border-gray-200">
          v{{ version }} - {{ entorno }}
        </p>
      </div>
    </div>


    <div class="menu flex flex-column gap-2 flex-grow">
      <router-link
        v-for="item in mainLinks"
        :key="item.label"
        :to="item.to"
        class="link p-2 rounded-lg hover:bg-gray-100 flex items-center gap-2"
        :class="{ 'bg-gray-200 font-bold': isActive(item.to) }"
        @click="$emit('link-click')"
      >
        <font-awesome-icon :icon="item.icon" class="icon-normalized"/>
        <span>{{ item.label }}</span>
      </router-link>

      <div class="mt-2">
        <div
          class="text-gray-500 text-sm uppercase mb-2 cursor-pointer select-none flex justify-between items-center"
          @click="catalogOpen = !catalogOpen"
        >
          <span>Catálogo</span>
          <i :class="catalogOpen ? 'pi pi-chevron-down' : 'pi pi-chevron-right'"></i>
        </div>

        <transition name="fade">
          <div v-if="catalogOpen">
            <router-link
              v-for="item in catalogLinks"
              :key="item.label"
              :to="item.to"
              class="link p-2 rounded-lg hover:bg-gray-100 flex items-center gap-2"
              :class="{ 'bg-gray-200 font-bold': isActive(item.to) }"
              @click="$emit('link-click')"
            >
              <font-awesome-icon v-if="item.iconType === 'fa'" :icon="item.icon" class="icon-normalized"/>
              <i v-else-if="typeof item.icon === 'string' && item.icon.includes('pi ')" :class="item.icon"
                 class="icon-normalized"/>
              <component v-else :is="item.icon" class="icon-normalized"/>
              <span>{{ item.label }}</span>
            </router-link>
          </div>
        </transition>
      </div>

      <div class="mt-2">
        <div class="text-gray-500 text-sm uppercase mb-2">Familia</div>
        <router-link
          v-for="item in membersLinks"
          :key="item.label"
          :to="item.to"
          class="link p-2 rounded-lg hover:bg-gray-100 flex items-center gap-2"
          :class="{ 'bg-gray-200 font-bold': isActive(item.to) }"
          @click="$emit('link-click')"
        >
          <font-awesome-icon v-if="item.iconType === 'fa'" :icon="item.icon" class="icon-normalized"/>
          <i v-else-if="typeof item.icon === 'string' && item.icon.includes('pi ')" :class="item.icon"
             class="icon-normalized"/>
          <component v-else :is="item.icon" class="icon-normalized"/>
          <span>{{ item.label }}</span>
        </router-link>
      </div>

      <div class="mt-4">
        <Button label="Cerrar Sesión" icon="pi pi-sign-out" class="p-button-danger w-full" @click="logout"/>
      </div>
    </div>
  </div>
  <div class="mt-auto text-center text-xs text-gray-500 py-2 border-top-1 border-gray-200">

    v{{ version }} - {{ entorno }}

  </div>

</template>

<script>
import {useRoute} from 'vue-router';
import {useLogout} from '@/composables/logout';
import Button from 'primevue/button';
import {ref} from 'vue';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {Users, CalendarCheck, HeartHandshake} from 'lucide-vue-next';
import {IconBriefcase, IconHeart, IconUserPlus} from '@tabler/icons-vue';


export default {
  emits: ['link-click'],
  components: {
    Button,
    FontAwesomeIcon,
    LucideUsers: Users,
    LucideCalendarCheck: CalendarCheck,
    LucideHeartHandshake: HeartHandshake,
    TablerBriefcase: IconBriefcase,
    TablerHeart: IconHeart,
    TablerUserPlus: IconUserPlus
  },
  setup() {
    const version = __APP_VERSION__;
    const entorno = __APP_ENV__ === 'production' ? 'Producción' : 'Desarrollo';
    const catalogOpen = ref(false);
    const {logout} = useLogout();
    const route = useRoute();

    const isActive = (path) => route.path.startsWith(path);

    const mainLinks = [
      {label: 'Inicio', icon: ['fas', 'home'], to: '/panel', iconType: 'fa'},
      {label: 'Usuarios', icon: ['fas', 'users-gear'], to: '/usuarios', iconType: 'fa'},
      {label: 'Roles', icon: ['fas', 'id-card-clip'], to: '/roles', iconType: 'fa'}
    ];

    const catalogLinks = [
      {label: 'Estados Civiles', icon: IconUserPlus, to: '/civil-states'},
      {label: 'Disfrutes', icon: HeartHandshake, to: '/enjoys'},
      {label: 'Experiencias Completadas', icon: ['fas', 'list-check'], to: '/experiences', iconType: 'fa'},
      {label: '¿Con quién vives?', icon: Users, to: '/family'},
      {label: 'Sexo', icon: 'pi pi-user', to: '/gender'},
      {label: 'Áreas de Interés', icon: IconHeart, to: '/interests'},
      {label: 'Etapas de Vida', icon: CalendarCheck, to: '/lifestages'},
      {label: 'Necesidades', icon: 'pi pi-list', to: '/needs'},
      {label: '¿Has utilizado estos servicios?', icon: IconBriefcase, to: '/services'},
      {label: 'Redes Sociales', icon: 'pi pi-globe', to: '/social-media'},
      {label: 'Voluntariados', icon: 'pi pi-users', to: '/voluntary'}
    ];

    const membersLinks = [
      {label: 'Miembros', icon: ['fas', 'id-card-clip'], to: '/members', iconType: 'fa'},
      {label: 'Experiencias por Miembro', icon: 'pi pi-star', to: '/member-experiences'},
      {label: 'Relaciones Familiares', icon: Users, to: '/member-family'},
      {label: 'Intereses por miembro', icon: 'pi pi-heart', to: '/member-interests'},
      {label: 'Etapas de Vida de los miembros', icon: ['fas', 'user-clock'], to: '/member-life-stages', iconType: 'fa'},
      {label: 'Necesidades', icon: ['fas', 'user-clock'], to: '/member-needs', iconType: 'fa'},
      {label: 'Servicios', icon: 'pi pi-heart-fill', to: '/member-services'},
      {label: 'Redes sociales', icon: 'pi pi-like', to: '/member-social-medias'},
    ];

    return {
      mainLinks,
      catalogLinks,
      membersLinks,
      logout,
      isActive,
      catalogOpen,
      version,
      entorno
    };
  }
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

.fade-enter-active, .fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  max-height: 0;
}

.icon-normalized {
  width: 1.25rem; /* 20px = w-5 */
  height: 1.25rem; /* 20px = h-5 */
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

</style>
