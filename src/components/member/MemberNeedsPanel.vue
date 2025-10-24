<template>
  <MemberRelationshipPanel
    value="9"
    title="Necesidades señaladas"
    icon="pi-database"
    :items="needs"
    itemTextKey="need"
    emptyText="necesidades"
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

const needs = ref([]);

onMounted(async () => {
  try {
    const response = await api.get(`/member-need/member/${props.memberId}`);
    needs.value = response.data;
  } catch (error) {
    console.error('Error al cargar necesidades:', error);
  }
});
</script>
