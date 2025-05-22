<template>
  <AccordionPanel value="4">
    <AccordionHeader>
      <i class="pi pi-info-circle mr-2"></i> Auditoría
    </AccordionHeader>
    <AccordionContent>
      <div class="pl-4 space-y-1 text-sm text-gray-500">
        <p>Última acción: {{ member.audiAction || '—' }}</p>
        <p>Fecha: {{ formatearFecha(member.audiDate, 'es-AR') }}</p>
        <p>Usuario: {{ member.audiUser || '—' }}</p>
      </div>
    </AccordionContent>
  </AccordionPanel>
</template>

<script setup>
import {formatearFecha} from '@/utils/date';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';

defineProps({
  member: {
    type: Object,
    required: true
  }
});
</script>
