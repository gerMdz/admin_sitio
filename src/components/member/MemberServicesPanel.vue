<template>
  <MemberRelationshipPanel
    value="10"
    title="Servicios"
    icon="pi-cog"
    :items="services"
    itemTextKey="service"
    emptyText="servicios"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import MemberRelationshipPanel from './MemberRelationshipPanel.vue';
import { getMemberServicesByMember } from '@/services/memberService.service';

const props = defineProps({
  memberId: {
    type: [Number, String],
    required: true
  }
});

const services = ref([]);

onMounted(async () => {
  try {
    const response = await getMemberServicesByMember(props.memberId);
    services.value = response.data;
  } catch (error) {
    console.error('Error al cargar servicios:', error);
  }
});
</script>
