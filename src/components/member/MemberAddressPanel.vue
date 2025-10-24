<template>
  <AccordionPanel value="2">
    <AccordionHeader>
      <i class="pi pi-map-marker mr-2"></i> Domiclio
    </AccordionHeader>
    <AccordionContent>
      <div class="pl-4 space-y-1 text-gray-700">
        <p><i class="pi pi-home mr-2"></i>{{ member.address || '—' }}</p>
        <p>{{ member.locality }}, {{ member.district }}</p>
        <p>{{ member.state }}, {{ member.country }}</p>
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
