<script setup>
import {onMounted, ref} from 'vue';
import DashboardCards from "@/components/dashboard/DashboardCards.vue";
import LastMembers from "@/components/dashboard/LastMembers.vue";
import {getDashboardData} from '@/services/dashboard.service.js';

const dashboard = ref({});
const isLoading = ref(true);

onMounted(async () => {
  try {
    dashboard.value = await getDashboardData();
  } finally {
    isLoading.value = false;
  }
});

const mostrarDetalle = (member) => {
  console.log('Ver detalle de:', member);
  // Navegar o abrir modal aquí
};
</script>

<template>
  <div class="space-y-6">
    <!-- Tarjetas -->
    <div class="w-full">
      <DashboardCards :data="dashboard"/>
    </div>
    <hr class="my-6 border-t border-gray-200"/>


    <div class="mt-8 grid grid-cols-12 gap-6">
      <div class="col-span-12">
        <LastMembers
          :members="dashboard.latestMembers"
          @ver-detalle="mostrarDetalle"
        />
      </div>
    </div>


  </div>
</template>
