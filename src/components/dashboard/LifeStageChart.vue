<script setup>
import { ref, onMounted, computed } from 'vue';
import Chart from 'primevue/chart';
import { getMembersByLifeStage } from '@/services/dashboard.service.js';

const lifeStageData = ref([]);
const loading = ref(true);

const chartData = computed(() => {
  if (!lifeStageData.value || lifeStageData.value.length === 0) {
    return {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: []
        }
      ]
    };
  }

  // Extract labels and data from the life stage data
  const labels = lifeStageData.value.map(item => item.name);
  const data = lifeStageData.value.map(item => item.count);

  // Generate colors for each segment
  const backgroundColors = generateColors(lifeStageData.value.length);

  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: backgroundColors
      }
    ]
  };
});

const chartOptions = computed(() => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const dataset = tooltipItem.dataset;
            const total = dataset.data.reduce((acc, data) => acc + data, 0);
            const currentValue = dataset.data[tooltipItem.dataIndex];
            const percentage = parseFloat((currentValue / total * 100).toFixed(1));
            return `${tooltipItem.label}: ${currentValue} (${percentage}%)`;
          }
        }
      }
    }
  };
});

// Function to generate colors for the pie chart segments
function generateColors(count) {
  const baseColors = [
    '#42A5F5', // blue
    '#66BB6A', // green
    '#FFA726', // orange
    '#EF5350', // red
    '#AB47BC', // purple
    '#26C6DA', // cyan
    '#EC407A', // pink
    '#7E57C2', // indigo
    '#78909C', // blue-grey
    '#FFCA28'  // amber
  ];

  // If we have more segments than colors, we'll repeat colors
  const colors = [];
  for (let i = 0; i < count; i++) {
    colors.push(baseColors[i % baseColors.length]);
  }

  return colors;
}

onMounted(async () => {
  try {
    lifeStageData.value = await getMembersByLifeStage();
  } catch (error) {
    console.error('Error al obtener etapas de vida:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="card">
    <h5>Distribución por Etapa de Vida</h5>
    <div v-if="loading" class="flex justify-center items-center p-4">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
    </div>
    <div v-else-if="lifeStageData.length === 0" class="p-4 text-center text-gray-500">
      No hay datos disponibles
    </div>
    <div v-else class="chart-container">
      <Chart type="pie" :data="chartData" :options="chartOptions" class="w-full h-full" />
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  position: relative;
  height: 250px;
  width: 100%;
  margin: 0 auto;
}
</style>
