<template>
  <MemberRelationshipPanel
    value="7"
    title="Intereses"
    icon="pi-heart"
    :items="interests"
    itemTextKey="interest"
    emptyText="intereses"
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

const interests = ref([]);

onMounted(async () => {
  try {
    const response = await api.get(`/member-interest/member/${props.memberId}`);
    interests.value = response.data;
  } catch (error) {
    console.error('Error al cargar intereses:', error);
  }
});
</script>
