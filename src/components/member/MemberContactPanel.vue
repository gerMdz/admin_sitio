<template>
  <AccordionPanel value="1">
    <AccordionHeader>
      <i class="pi pi-phone mr-2"></i> Contacto
    </AccordionHeader>
    <AccordionContent>
      <div class="pl-4 space-y-1 text-gray-700">
        <p><i class="pi pi-envelope mr-2"></i>{{ member.email || '—' }}</p>
        <p><i class="pi pi-phone mr-2"></i>{{ member.phone || '—' }}</p>
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
