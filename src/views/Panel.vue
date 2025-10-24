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

.charts-container > div {
  padding: 0.5rem;
  margin-bottom: 1rem;
}

.charts-container > div > * {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  border-radius: var(--content-border-radius);
  padding: 1rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.charts-container > div > *:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.card-item {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
}

.card-item .card {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  transition: transform 0.2s, box-shadow 0.2s;
}

.card-item .card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
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
  const colorMap = {
    'text-cyan-500': 'var(--p-cyan-600)',
    'text-green-500': 'var(--p-green-600)',
    'text-blue-500': 'var(--p-blue-600)',
    'text-orange-500': 'var(--p-orange-600)',
    'text-red-500': 'var(--p-red-600)',
    'text-purple-500': 'var(--p-purple-600)',
    'text-pink-500': 'var(--p-pink-600)',
    'text-indigo-500': 'var(--p-indigo-600)',
    'text-yellow-500': 'var(--p-yellow-600)',
    'text-gray-500': 'var(--text-color-secondary)',
    'text-primary': 'var(--primary-color)',
  };

  return colorMap[colorClass] || 'var(--text-color)';
};


onMounted(async () => {
  try {
    dashboard.value = await getDashboardData();
  } finally {
    isLoading.value = false;
  }
});
</script>
