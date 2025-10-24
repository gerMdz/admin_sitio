<template>
  <MemberRelationshipPanel
    value="12"
    title="Voluntariado"
    icon="pi-heart"
    :items="voluntaries"
    itemTextKey="voluntary"
    emptyText="voluntariados"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import MemberRelationshipPanel from './MemberRelationshipPanel.vue';
import { getMemberVoluntariesByMember } from '@/services/memberVoluntary.service';

const props = defineProps({
  memberId: {
    type: [Number, String],
    required: true
  }
});

const voluntaries = ref([]);

onMounted(async () => {
  try {
    const response = await getMemberVoluntariesByMember(props.memberId);
    voluntaries.value = response.data;
  } catch (error) {
    console.error('Error al cargar voluntariados:', error);
  }
});
</script>
