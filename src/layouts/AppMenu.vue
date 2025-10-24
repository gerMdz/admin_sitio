<script setup>
import {ref} from 'vue';

import AppMenuItem from './AppMenuItem.vue';
import {
  IconBriefcase,
  IconHeart,
  IconUserPlus,
  IconWorld,
  IconListCheck,
  IconSettings,
  IconMapPin,
  IconFileAnalytics,
  IconStar,
  IconUsers
} from "@tabler/icons-vue";
import {
  CalendarCheck,
  HeartHandshake,
  Users,
  Globe,
  Heart,
  Clock,
  Database,
  ListChecks,
  Share2
} from "lucide-vue-next";

const model = ref([
  {
    label: 'Main',
    items: [
      {label: 'Inicio', icon: ['fas', 'home'], to: '/panel', iconType: 'fa'},
      {label: 'Usuarios', icon: IconUsers, to: '/usuarios', iconType: 'component'},
      {label: 'Roles', icon: ['fas', 'id-card-clip'], to: '/roles', iconType: 'fa'}
    ]
  },
  {
    label: 'Catálogos',
    items: [
      {label: 'Estados Civiles', icon: IconUserPlus, to: '/civil-states', iconType: 'component'},
      {label: 'Disfrutes', icon: HeartHandshake, to: '/enjoys', iconType: 'component'},
      {label: 'Experiencias Completadas', icon: ListChecks, to: '/experiences', iconType: 'component'},
      {label: 'Categorías', icon: IconListCheck, to: '/categories', iconType: 'component'},
      {label: '¿Con quién vives?', icon: Users, to: '/family', iconType: 'component'},
      {label: 'Sexo', icon: 'pi pi-user', to: '/gender'},
      {label: 'Áreas de Interés', icon: Heart, to: '/interests', iconType: 'component'},
      {label: 'Etapas de Vida', icon: CalendarCheck, to: '/lifestages', iconType: 'component'},
      {label: 'Necesidades', icon: IconListCheck, to: '/needs', iconType: 'component'},
      {label: '¿Has utilizado estos servicios?', icon: IconBriefcase, to: '/services', iconType: 'component'},
      {label: 'Redes Sociales', icon: Globe, to: '/social-media', iconType: 'component'},
      {label: 'Voluntariados', icon: 'pi pi-users', to: '/voluntary'}
    ]
  },
  {
    label: 'Parámetros',
    items: [
      {label: 'Países', icon: IconWorld, to: '/countries', iconType: 'component'},
      {label: 'Provincias', icon: IconMapPin, to: '/states', iconType: 'component'}
    ]
  },
  {
    label: 'Audit',
    items: [
      {
        label: 'Logs API',
        icon: IconFileAnalytics,
        to: '/logs',
        iconType: 'component'
      }
    ]
  },
  {
    label: 'Miembros',
    items: [
      {label: 'Miembros', icon: ['fas', 'id-card-clip'], to: '/members', iconType: 'fa'},
      {label: 'Experiencias por Miembro', icon: IconStar, to: '/member-experiences', iconType: 'component'},
      {label: 'Relaciones Familiares', icon: Users, to: '/member-family', iconType: 'component'},
      {label: 'Intereses por miembro', icon: IconHeart, to: '/member-interests', iconType: 'component'},
      {label: 'Etapas de Vida de los miembros', icon: Clock, to: '/member-life-stages', iconType: 'component'},
      {label: 'Necesidades', icon: Database, to: '/member-needs', iconType: 'component'},
      {label: 'Servicios', icon: IconSettings, to: '/member-services', iconType: 'component'},
      {label: 'Redes sociales', icon: Share2, to: '/member-social-medias', iconType: 'component'},
      {label: 'Voluntariado', icon: 'pi pi-heart', to: '/member-voluntary'},
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
