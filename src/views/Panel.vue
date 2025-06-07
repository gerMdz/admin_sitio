<template>
  <div class="w-full h-full flex flex-col">
    <div class="card mb-4">
      <h5>Dashboard</h5>
      <p>Bienvenido al panel de administración</p>
    </div>

    <div v-if="dashboard" class="w-full mb-4">
      <div class="card h-full">
        <h5>Estadísticas</h5>
        <div class="cards-container">
          <div v-for="card in cards" :key="card.label" class="card-item">
            <div class="card h-full">
              <div class="flex justify-between items-center mb-3">
                <div>
                  <span class="block text-500 font-medium mb-3">{{ card.label }}</span>
                </div>
                <div class="flex items-center justify-center bg-blue-100 rounded-full"
                     style="width:2.5rem;height:2.5rem">
                  <i :class="['pi', card.icon]" :style="{color: getColorValue(card.color)}"></i>
                </div>
              </div>
              <div class="flex justify-end">
                <div class="font-medium text-xl" :style="{color: getColorValue(card.color)}">{{ card.value }}
                  {{ card.subtext }}
                </div>
              </div>
              <!--              <span v-if="card.subtext" class="text-green-500 font-medium">{{ card.subtext }}</span>-->
              <!--              <span v-if="card.note" class="text-500">{{ card.note }}</span>-->
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-wrap -mx-2 flex-grow">
      <div v-if="dashboard" class="w-full md:w-1/2 px-2 mb-4">
        <div class="card h-full">
          <h5>Últimos Miembros</h5>
          <LastMembers :members="dashboard.latestMembers" @ver-detalle="mostrarDetalle"/>
        </div>
      </div>

      <div class="w-full md:w-1/2 px-2 mb-4">
        <div class="card h-full">
          <h5>Gráficos</h5>
          <div class="charts-container">
            <div>
              <CivilStatePieChart/>
            </div>
            <div>
              <LifeStageChart/>
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

<style scoped>
.charts-container, .cards-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

@media (min-width: 800px) {
  .charts-container, .cards-container {
    flex-direction: row;
  }

  .charts-container > div, .cards-container > div {
    flex: 1;
  }
}

.card-item {
  width: 100%;
  padding: 0.5rem;
}
</style>

<script setup>
import {ref, computed, onMounted} from 'vue';
import {getDashboardData} from '@/services/dashboard.service.js';
import LastMembers from '@/components/dashboard/LastMembers.vue';
import CivilStatePieChart from '@/components/dashboard/CivilStatePieChart.vue';
import LifeStageChart from '@/components/dashboard/LifeStageChart.vue';

const dashboard = ref(null);
const isLoading = ref(true);

const cards = computed(() => {
  if (!dashboard.value) return [];

  return [
    {
      label: 'Fichas cargadas',
      value: dashboard.value.totalMembers,
      icon: 'pi-users',
      color: 'text-primary',
      subtext: 'fichas',
      note: ''
    },
    {
      label: 'Encuestas realizadas',
      value: dashboard.value.completeSurveys,
      icon: 'pi-check-square',
      color: 'text-primary',
      subtext: 'encuestas',
      note: ''
    }
  ];
});

const mostrarDetalle = (member) => {
  console.log('Ver detalle de:', member);
  // Navegar o abrir modal aquí
};

const getColorValue = (colorClass) => {
  // Map color class names to CSS color values
  const colorMap = {
    'text-cyan-500': '#06b6d4', // Tailwind cyan-500
    'text-green-500': '#10b981', // Tailwind green-500
    'text-blue-500': '#3b82f6',  // Tailwind blue-500
    'text-orange-500': '#f97316', // Tailwind orange-500
    'text-red-500': '#ef4444',   // Tailwind red-500
    'text-purple-500': '#a855f7', // Tailwind purple-500
    'text-pink-500': '#ec4899',  // Tailwind pink-500
    'text-indigo-500': '#6366f1', // Tailwind indigo-500
    'text-yellow-500': '#eab308', // Tailwind yellow-500
    'text-gray-500': '#6b7280',  // Tailwind gray-500
    'text-primary': '#10b981',  // Tailwind gray-500
  };

  return colorMap[colorClass] || '#000000'; // Default to black if color not found
};

onMounted(async () => {
  try {
    dashboard.value = await getDashboardData();
  } finally {
    isLoading.value = false;
  }
});
</script>
