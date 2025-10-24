<template>
  <MemberRelationshipPanel
    value="5"
    title="Experiencias"
    icon="pi-star"
    :items="experiences"
    itemTextKey="experience"
    emptyText="experiencias"
    class="panel-experiencias"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import MemberRelationshipPanel from './MemberRelationshipPanel.vue';
import api from '@/api/axios';

const props = defineProps({
  memberId: {
    type: [Number, String],
    required: true
  }
});

const experiences = ref([]);

onMounted(async () => {
  try {
    const response = await api.get(`/member-experience/member/${props.memberId}`);
    experiences.value = response.data;
  } catch (error) {
    console.error('Error al cargar experiencias:', error);
  }
});
</script>
