<template>
  <AccordionPanel value="0" class="panel-etapas">
    <AccordionHeader>
      <i class="pi pi-id-card mr-2"></i> Datos personales
    </AccordionHeader>
    <AccordionContent>
      <div class="pl-4 space-y-1 text-gray-700">
        <p>Profesión: {{ member.nameProfession || '—' }}</p>
        <p>Habilidades artísticas: {{ member.artisticSkills || '—' }}</p>
        <p>Género: {{ member.gender }}</p>
        <p>Estado civil: {{ member.civilState }}</p>
        <p>Celebración: {{ member.celebracion || '—' }}</p>
      </div>
    </AccordionContent>
  </AccordionPanel>
</template>

<script setup>
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
