<template>

  <template v-if="dashboard">
    <div class="grid grid-cols-12 gap-8">
      <div
        v-for="card in cards"
        :key="card.label"
        class="col-span-12 sm:col-span-6 xl:col-span-3"
      >
        <div class="card mb-0 w-full max-w-full">

          <div class="flex justify-between mb-4">
            <div>
              <span class="block text-muted-color font-medium mb-4">{{ card.label }}</span>
              <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ card.value }}</div>
            </div>
            <div
              class="flex items-center justify-center rounded-border"
              :class="card.bg"
              style="width: 2.5rem; height: 2.5rem"
            >
              <i :class="['pi', card.icon, card.color, '!text-xl']"></i>
            </div>
          </div>
          <span class="text-primary font-medium">{{ card.subtext }}</span>
          <span class="text-muted-color">{{ card.note }}</span>
        </div>
      </div>

      <div class="col-span-12 xl:col-span-6">
        <LastMembers :members="dashboard.latestMembers" @ver-detalle="mostrarDetalle"/>
      </div>
    </div>
  </template>


  <div v-if="isLoading"
       class="absolute inset-0 flex flex-column justify-center items-center bg-white/60 backdrop-blur-sm z-50">
    <i class="pi pi-spin pi-spinner" style="font-size: 3rem;"></i>
    <p class="mt-3 text-xl">Cargando información del panel...</p>
  </div>

</template>


<script>
import {getDashboardData} from '@/services/dashboard.service.js';
import DashboardCards from '@/components/dashboard/DashboardCards.vue';
import LastMembers from '@/components/dashboard/LastMembers.vue';

export default {
  name: 'Panel',
  components: {DashboardCards, LastMembers},
  data() {
    return {
      dashboard: null,
      isLoading: true
    };
  },
  methods: {
    mostrarDetalle(member) {
      console.log('Ver detalle de', member);
    }
  },
  computed: {
    cards() {
      return [
        {
          label: 'Fichas cargadas',
          value: this.dashboard.totalMembers,
          icon: 'pi-users',
          color: 'text-cyan-500',
          bg: 'bg-cyan-100 dark:bg-cyan-400/10',
          subtext: '',
          note: ''
        },
        {
          label: 'Encuestas realizadas',
          value: this.dashboard.completeSurveys,
          icon: 'pi-check-square',
          color: 'text-green-500',
          bg: 'bg-green-100 dark:bg-green-400/10',
          subtext: '',
          note: ''
        }
      ];
    }
  },
  async mounted() {
    try {
      this.dashboard = await getDashboardData();
    } finally {
      this.isLoading = false;
    }
  }
};
</script>
