<template>
  <MemberRelationshipPanel
    value="8"
    title="Etapa de vida"
    icon="pi-clock"
    :items="lifeStages"
    itemTextKey="lifeStage"
    emptyText="etapa de vida"
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

const lifeStages = ref([]);

onMounted(async () => {
  try {
    const response = await api.get(`/member-life-stages/member/${props.memberId}`);
    lifeStages.value = response.data;
  } catch (error) {
    console.error('Error al cargar etapas de vida:', error);
  }
});
</script>
