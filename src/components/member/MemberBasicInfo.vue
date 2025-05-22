<template>
  <div class="flex flex-row justify-between items-start gap-6">
    <!-- Datos básicos -->
    <div class="flex-1 min-w-0">
      <h2 class="text-2xl font-bold">
        {{ member.name }} {{ member.lastname }}
      </h2>
      <p class="text-gray-600">DNI: {{ member.dniDocument }}</p>
      <p class="text-gray-600">Nacimiento: {{ formatearFecha(member.birthdate, 'es-AR', true) }}</p>
      <p v-if="member.relatedMember"
         class="inline-block mt-2 text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
        Relacionado</p>
    </div>
    <div class="mr-4 ml-auto">
      <FotoMiembro :member-id="member.id"/>
    </div>
  </div>
</template>

<script setup>
import {formatearFecha} from '@/utils/date';
import FotoMiembro from "@/components/FotoMiembro.vue";

defineProps({
  member: {
    type: Object,
    required: true
  }
});
</script>
