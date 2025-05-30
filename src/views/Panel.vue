<template>
  <div class="w-full h-full flex flex-col">
    <div class="card mb-4">
      <h5>Dashboard</h5>
      <p>Bienvenido al panel de administración</p>
    </div>

    <div v-if="dashboard" class="w-full mb-4">
      <div class="flex flex-wrap -mx-2">
        <div v-for="card in cards" :key="card.label" class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-4">
          <div class="card h-full">
            <div class="flex justify-between items-center mb-3">
              <div>
                <span class="block text-500 font-medium mb-3">{{ card.label }}</span>
                <div class="text-900 font-medium text-xl">{{ card.value }}</div>
              </div>
              <div class="flex items-center justify-center bg-blue-100 rounded-full" style="width:2.5rem;height:2.5rem">
                <i :class="['pi', card.icon, card.color]"></i>
              </div>
            </div>
            <span v-if="card.subtext" class="text-green-500 font-medium">{{ card.subtext }}</span>
            <span v-if="card.note" class="text-500">{{ card.note }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-wrap -mx-2 flex-grow">
      <div v-if="dashboard" class="w-full lg:w-1/2 px-2 mb-4">
        <div class="card h-full">
          <h5>Últimos Miembros</h5>
          <LastMembers :members="dashboard.latestMembers" @ver-detalle="mostrarDetalle"/>
        </div>
      </div>

      <div class="w-full lg:w-1/2 px-2 mb-4">
        <div class="card h-full">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div class="col-span-1">
              <CivilStatePieChart />
            </div>
            <div class="col-span-1">
              <!-- Placeholder for Gender Chart -->
              <div class="flex justify-center items-center h-full">
                <p class="text-gray-500">Próximamente: Gráfico por Sexo</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="isLoading"
       class="absolute inset-0 flex flex-col justify-center items-center bg-white/60 backdrop-blur-sm z-50">
    <i class="pi pi-spin pi-spinner" style="font-size: 3rem;"></i>
    <p class="mt-3 text-xl">Cargando información del panel...</p>
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue';
import { getDashboardData } from '@/services/dashboard.service.js';
import LastMembers from '@/components/dashboard/LastMembers.vue';
import CivilStatePieChart from '@/components/dashboard/CivilStatePieChart.vue';

const dashboard = ref(null);
const isLoading = ref(true);

const cards = computed(() => {
  if (!dashboard.value) return [];

  return [
    {
      label: 'Fichas cargadas',
      value: dashboard.value.totalMembers,
      icon: 'pi-users',
      color: 'text-cyan-500',
      subtext: '',
      note: ''
    },
    {
      label: 'Encuestas realizadas',
      value: dashboard.value.completeSurveys,
      icon: 'pi-check-square',
      color: 'text-green-500',
      subtext: '',
      note: ''
    }
  ];
});

const mostrarDetalle = (member) => {
  console.log('Ver detalle de:', member);
  // Navegar o abrir modal aquí
};

onMounted(async () => {
  try {
    dashboard.value = await getDashboardData();
  } finally {
    isLoading.value = false;
  }
});
</script>
