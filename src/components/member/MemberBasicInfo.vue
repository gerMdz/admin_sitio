<template>
  <div class="flex flex-row justify-between items-start gap-6">
    <!-- Datos básicos -->
    <div class="flex-1 min-w-0">
      <h2 class="text-2xl font-bold">
        {{ member.name }} {{ member.lastname }}
      </h2>
      <p class="text-gray-600">DNI: {{ member.dniDocument }}</p>
      <p class="text-gray-600">Nacimiento: {{ formatearFecha(member.birthdate, 'es-AR', true) }}
        <span v-if="member.birthdate" class="ml-2 text-gray-500">({{ calcularEdad(member.birthdate) }} años)</span>
      </p>
      <Chip v-if="member.relatedMember"
         class="mt-2 text-blue-800 bg-blue-100 border border-blue-200 shadow-sm"
         label="Relacionado" />
      <Chip v-else
         class="mt-2 text-gray-700 bg-gray-100 border border-gray-200 shadow-sm"
         label="Miembro Principal" />
    </div>
    <div class="mr-4 ml-auto">
      <FotoMiembro :member-id="member.id"/>
    </div>
  </div>
</template>

<script setup>
import {formatearFecha} from '@/utils/date';
import FotoMiembro from "@/components/FotoMiembro.vue";
import Chip from 'primevue/chip';

defineProps({
  member: {
    type: Object,
    required: true
  }
});

// Función para calcular la edad a partir de la fecha de nacimiento
function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) return '';

  const fechaNac = new Date(fechaNacimiento);
  const hoy = new Date();

  let edad = hoy.getFullYear() - fechaNac.getFullYear();
  const mes = hoy.getMonth() - fechaNac.getMonth();

  // Si aún no ha pasado el cumpleaños este año, restar un año
  if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
    edad--;
  }

  return edad;
}
</script>
