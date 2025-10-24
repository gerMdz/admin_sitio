<template>
  <AccordionPanel value="3">
    <AccordionHeader>
      <i class="pi pi-users mr-2"></i> Grupo
    </AccordionHeader>
    <AccordionContent>
      <div class="pl-4 space-y-1 text-gray-700">
        <p>Guía: {{ member.nameGuia || '—' }}</p>
        <p>Grupo: {{ member.nameGroup || member.grupo || '—' }}</p>
        <p>Participa GP: {{ member.participateGp ? 'Sí' : 'No' }}</p>
        <p>Jefe de familia: {{ member.bossFamily ? 'Sí' : 'No' }}</p>
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
