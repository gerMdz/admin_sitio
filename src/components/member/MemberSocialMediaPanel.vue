<template>
  <MemberRelationshipPanel
    value="11"
    title="Redes sociales"
    icon="pi-share-alt"
    :items="socialMedia"
    itemTextKey="socialMedia"
    emptyText="redes sociales"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import MemberRelationshipPanel from './MemberRelationshipPanel.vue';
import { getMemberSocialMediasByMember } from '@/services/memberSocialMedia.service';

const props = defineProps({
  memberId: {
    type: [Number, String],
    required: true
  }
});

const socialMedia = ref([]);

onMounted(async () => {
  try {
    const response = await getMemberSocialMediasByMember(props.memberId);
    socialMedia.value = response.data;
  } catch (error) {
    console.error('Error al cargar redes sociales:', error);
  }
});
</script>
