<template>
  <div class="max-w-4xl mx-auto mt-2 space-y-4">
    <!-- Card fija con foto a la derecha -->
    <div class="card p-4 shadow-md bg-white rounded-xl flex flex-col md:flex-row justify-between items-start gap-6">
      <!-- Datos básicos -->
      <div class="flex-1">
        <h2 class="text-2xl font-bold">
          {{ member.name }} {{ member.lastname }}
        </h2>
        <p class="text-gray-600">DNI: {{ member.dniDocument }}</p>
        <p class="text-gray-600">Nacimiento: {{ formatearFecha(member.birthdate, 'es-AR') }}</p>
        <p v-if="member.relatedMember" class="inline-block mt-2 text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
          Relacionado</p>
      </div>

      <!-- Foto o silueta -->
      <div
        class="w-32 h-32 rounded-xl bg-gray-200 flex items-center justify-center overflow-hidden self-center md:self-start">
        <img
          v-if="fotoUrl"
          :src="fotoUrl"
          alt="Foto del miembro"
          class="object-cover w-full h-full"
        />
        <i v-else class="pi pi-user text-6xl text-gray-500"></i>
      </div>
    </div>

    <!-- Secciones colapsables -->
    <Accordion multiple :activeIndex="[0]">
      <AccordionTab>
        <template #header>
          <i class="pi pi-id-card mr-2"></i> Datos personales
        </template>
        <div class="pl-4 space-y-1 text-gray-700">
          <p>Profesión: {{ member.nameProfession || '—' }}</p>
          <p>Habilidades artísticas: {{ member.artisticSkills || '—' }}</p>
          <p>Género: {{ member.gender }}</p>
          <p>Estado civil: {{ member.civilState }}</p>
          <p>Celebración: {{ member.celebracion || '—' }}</p>
        </div>
      </AccordionTab>

      <AccordionTab>
        <template #header>
          <i class="pi pi-phone mr-2"></i> Contacto
        </template>
        <div class="pl-4 space-y-1 text-gray-700">
          <p><i class="pi pi-envelope mr-2"></i>{{ member.email || '—' }}</p>
          <p><i class="pi pi-phone mr-2"></i>{{ member.phone || '—' }}</p>
          <p><i class="pi pi-home mr-2"></i>{{ member.address || '—' }}</p>
        </div>
      </AccordionTab>

      <AccordionTab>
        <template #header>
          <i class="pi pi-map-marker mr-2"></i> Ubicación
        </template>
        <div class="pl-4 space-y-1 text-gray-700">
          <p>{{ member.locality }}, {{ member.district }}</p>
          <p>{{ member.state }}, {{ member.country }}</p>
        </div>
      </AccordionTab>

      <AccordionTab>
        <template #header>
          <i class="pi pi-users mr-2"></i> Grupo
        </template>
        <div class="pl-4 space-y-1 text-gray-700">
          <p>Guía: {{ member.nameGuia || '—' }}</p>
          <p>Grupo: {{ member.nameGroup || member.grupo || '—' }}</p>
          <p>Participa GP: {{ member.participateGp ? 'Sí' : 'No' }}</p>
          <p>Jefe de familia: {{ member.bossFamily ? 'Sí' : 'No' }}</p>
        </div>
      </AccordionTab>

      <AccordionTab>
        <template #header>
          <i class="pi pi-info-circle mr-2"></i> Auditoría
        </template>
        <div class="pl-4 space-y-1 text-sm text-gray-500">
          <p>Última acción: {{ member.audiAction || '—' }}</p>
          <p>Fecha: {{ formatearFecha(member.audiDate, 'es-AR') }}</p>
          <p>Usuario: {{ member.audiUser || '—' }}</p>
        </div>
      </AccordionTab>
    </Accordion>
  </div>
</template>

<script setup>
import {onMounted, ref, computed} from 'vue';
import {useRoute} from 'vue-router';
import api from '@/api/axios';
import {formatearFecha} from '@/utils/date';
import {getFotoMiembro} from '@/utils/foto';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';

const route = useRoute();
const member = ref({});

const fotoUrl = computed(() => {
  return member.value.id ? getFotoMiembro(member.value.id) : null;
});

onMounted(async () => {
  const res = await api.get(`/members/${route.params.id}`);
  member.value = res.data;
});
</script>
