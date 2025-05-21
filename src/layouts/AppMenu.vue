<script setup>
import {ref} from 'vue';

import AppMenuItem from './AppMenuItem.vue';
import {IconBriefcase, IconHeart, IconUserPlus} from "@tabler/icons-vue";
import {CalendarCheck, HeartHandshake, Users} from "lucide-vue-next";

const model = ref([
  {
    label: 'Main',
    items: [
      {label: 'Inicio', icon: ['fas', 'home'], to: '/panel', iconType: 'fa'},
      {label: 'Usuarios', icon: ['fas', 'users-gear'], to: '/usuarios', iconType: 'fa'},
      {label: 'Roles', icon: ['fas', 'id-card-clip'], to: '/roles', iconType: 'fa'}
    ]
  },
  {
    label: 'Catálogos',
    items: [
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
    ]
  },
  {
    label: 'Parámetros',

    items: [
      {label: 'Países', icon: 'pi pi-users', to: '/countries'},
      {label: 'Provincias', icon: 'pi pi-users', to: '/states'}
    ]
  },
  {
    label: 'Audit',

    items: [
      {
        label: 'Logs API',
        icon: 'pi pi-list',
        to: '/logs'
      }

    ]
  },
  {
    label: 'Miembros',
    items: [
      {label: 'Miembros', icon: ['fas', 'id-card-clip'], to: '/members', iconType: 'fa'},
      {label: 'Experiencias por Miembro', icon: 'pi pi-star', to: '/member-experiences'},
      {label: 'Relaciones Familiares', icon: Users, to: '/member-family'},
      {label: 'Intereses por miembro', icon: 'pi pi-heart', to: '/member-interests'},
      {label: 'Etapas de Vida de los miembros', icon: ['fas', 'user-clock'], to: '/member-life-stages', iconType: 'fa'},
      {label: 'Necesidades', icon: ['fas', 'user-clock'], to: '/member-needs', iconType: 'fa'},
      {label: 'Servicios', icon: 'pi pi-heart-fill', to: '/member-services'},
      {label: 'Redes sociales', icon: 'pi pi-like', to: '/member-social-medias'},
      {label: 'Voluntariado', icon: 'pi pi-like', to: '/member-voluntary'},
    ]
  }
]);
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="item">
      <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
      <li v-if="item.separator" class="menu-separator"></li>
    </template>
  </ul>
</template>

<style lang="scss" scoped></style>
