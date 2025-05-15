<template>
  <div
    class="w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-xl bg-gray-200 flex items-center justify-center overflow-hidden ring-2 ring-gray-300"
  >
    <img
      v-if="url"
      :src="url"
      :alt="`Foto de ${memberId}`"
      class="w-full h-full object-cover"
    />
    <i
      v-else
      class="pi pi-user text-3xl md:text-4xl lg:text-6xl text-gray-500"
    ></i>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import api from '@/api/axios';

const props = defineProps({
  memberId: {type: Number, required: true},
});

const url = ref(null);

onMounted(async () => {
  try {
    const response = await api.get(`/foto/${props.memberId}`, {
      responseType: 'blob',
    });

    const blob = new Blob([response.data], {type: 'image/jpeg'});
    url.value = URL.createObjectURL(blob);
  } catch (err) {
    console.error('Error al obtener la foto:', err);
  }
});
</script>
