<template>
  <div class="max-w-5xl mx-auto mt-4 px-4 sm:px-6 lg:px-8">
    <!-- Spinner -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <ProgressSpinner
        class="w-16 h-16"
        strokeWidth="4"
        animationDuration=".7s"
        fill="var(--surface-ground)"
        stroke="var(--primary-color)"
      />
    </div>
    <div v-else class="space-y-6">
      <!-- Botones de navegación -->
      <div class="flex justify-between mb-4">
        <Button
          icon="pi pi-arrow-left"
          label="Miembro Anterior"
          class="p-button-outlined px-4 py-2"
          @click="goToPreviousMember"
          :disabled="!previousMemberId"
        />
        <Button
          icon="pi pi-arrow-right"
          iconPos="right"
          label="Miembro Siguiente"
          class="p-button-outlined px-4 py-2"
          @click="goToNextMember"
          :disabled="!nextMemberId"
        />
      </div>

      <!-- Información básica del miembro -->
      <Card class="shadow-md border-0 overflow-hidden">
        <template #content>
          <MemberBasicInfo :member="member" />
        </template>
      </Card>

      <!-- Secciones colapsables -->
      <Accordion :value="['0']" multiple class="member-accordion">
        <MemberPersonalDataPanel :member="member" />
        <MemberContactPanel :member="member" />
        <MemberAddressPanel :member="member" />
        <MemberGroupPanel :member="member" />
        <MemberAuditPanel :member="member" />
        <MemberExperiencesPanel :member-id="member.id" />
        <MemberFamilyPanel :family-relations="familyRelations" />
        <MemberInterestsPanel :member-id="member.id" />
        <MemberLifeStagesPanel :member-id="member.id" />
        <MemberNeedsPanel :member-id="member.id" />

        <!-- Nuevas relaciones -->
        <MemberServicesPanel :member-id="member.id" />
        <MemberSocialMediaPanel :member-id="member.id" />
        <MemberVoluntaryPanel :member-id="member.id" />
      </Accordion>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, computed, watch} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import api from '@/api/axios';

// Componentes PrimeVue
import ProgressSpinner from 'primevue/progressspinner';
import Accordion from 'primevue/accordion';
import Card from 'primevue/card';
import Button from 'primevue/button';

// Componentes personalizados
import MemberBasicInfo from '@/components/member/MemberBasicInfo.vue';
import MemberPersonalDataPanel from '@/components/member/MemberPersonalDataPanel.vue';
import MemberContactPanel from '@/components/member/MemberContactPanel.vue';
import MemberAddressPanel from '@/components/member/MemberAddressPanel.vue';
import MemberGroupPanel from '@/components/member/MemberGroupPanel.vue';
import MemberAuditPanel from '@/components/member/MemberAuditPanel.vue';
import MemberFamilyPanel from '@/components/member/MemberFamilyPanel.vue';
import MemberExperiencesPanel from '@/components/member/MemberExperiencesPanel.vue';
import MemberInterestsPanel from '@/components/member/MemberInterestsPanel.vue';
import MemberLifeStagesPanel from '@/components/member/MemberLifeStagesPanel.vue';
import MemberNeedsPanel from '@/components/member/MemberNeedsPanel.vue';
import MemberServicesPanel from '@/components/member/MemberServicesPanel.vue';
import MemberSocialMediaPanel from '@/components/member/MemberSocialMediaPanel.vue';
import MemberVoluntaryPanel from '@/components/member/MemberVoluntaryPanel.vue';

const route = useRoute();
const router = useRouter();
const member = ref({});
const familyRelations = ref([]);
const loading = ref(true);

// Computed properties for navigation
const previousMemberId = computed(() => {
  // Since member IDs are consecutive integers, we can just decrement by 1
  return member.value.id > 1 ? member.value.id - 1 : null;
});

const nextMemberId = computed(() => {
  // Since member IDs are consecutive integers, we can just increment by 1
  return member.value.id ? member.value.id + 1 : null;
});

// Navigation functions
const goToPreviousMember = () => {
  if (previousMemberId.value) {
    console.log('Navigating to previous member:', previousMemberId.value);
    router.push({
      name: 'MemberShow',
      params: { id: previousMemberId.value }
    }).catch(err => console.error('Navigation error:', err));
  }
};

const goToNextMember = () => {
  if (nextMemberId.value) {
    console.log('Navigating to next member:', nextMemberId.value);
    router.push({
      name: 'MemberShow',
      params: { id: nextMemberId.value }
    }).catch(err => console.error('Navigation error:', err));
  }
};

// Function to load member data
const loadMemberData = async (memberId) => {
  loading.value = true;

  try {
    const [resMember, resFamilyRelations] = await Promise.all([
      api.get(`/members/${memberId}`),
      api.get(`/member-family/member/${memberId}`),
    ]);

    member.value = resMember.data;
    familyRelations.value = resFamilyRelations.data;
  } catch (e) {
    console.error('Error al cargar datos', e);
  } finally {
    loading.value = false;
  }
};

// Watch for changes in the route parameter
watch(() => route.params.id, (newId) => {
  if (newId) {
    console.log('Member ID changed in URL, loading new data:', newId);
    loadMemberData(newId);
  }
});

onMounted(() => {
  const memberId = route.params.id;
  loadMemberData(memberId);
});
</script>
<style scoped>
/* Estilos generales para el acordeón */
::deep(.member-accordion) {
  --transition-speed: 0.3s;
}

::deep(.member-accordion .p-accordion-tab) {
  margin-bottom: 1rem;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow var(--transition-speed) ease, transform var(--transition-speed) ease;
}

::deep(.member-accordion .p-accordion-tab:hover) {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

::deep(.member-accordion .p-accordion-header-link) {
  padding: 1rem 1.25rem;
  transition: background-color var(--transition-speed) ease;
}

::deep(.member-accordion .p-accordion-content) {
  padding: 1.25rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

/* Estilos para panel-experiencias */
::deep(.panel-experiencias) {
  --panel-color: #ff9800;
  --panel-light-color: rgba(255, 152, 0, 0.1);
  --panel-hover-color: rgba(255, 152, 0, 0.2);

  border-left: 4px solid var(--panel-color);
}

::deep(.panel-experiencias .p-accordion-header-link) {
  background-color: white;
  color: rgba(0, 0, 0, 0.8);
  border-bottom: none;
}

::deep(.panel-experiencias .p-accordion-header-link:hover) {
  background-color: var(--panel-light-color);
}

::deep(.panel-experiencias .p-accordion-header-link.p-highlight) {
  background-color: var(--panel-light-color);
  color: rgba(0, 0, 0, 0.9);
}

::deep(.panel-experiencias .p-accordion-content) {
  background-color: white;
  border-top: 1px solid var(--panel-light-color);
}

/* Estilos para panel-familia */
::deep(.panel-familia) {
  --panel-color: #e91e63;
  --panel-light-color: rgba(233, 30, 99, 0.1);
  --panel-hover-color: rgba(233, 30, 99, 0.2);

  border-left: 4px solid var(--panel-color);
}

::deep(.panel-familia .p-accordion-header-link) {
  background-color: white;
  color: rgba(0, 0, 0, 0.8);
  border-bottom: none;
}

::deep(.panel-familia .p-accordion-header-link:hover) {
  background-color: var(--panel-light-color);
}

::deep(.panel-familia .p-accordion-header-link.p-highlight) {
  background-color: var(--panel-light-color);
  color: rgba(0, 0, 0, 0.9);
}

::deep(.panel-familia .p-accordion-content) {
  background-color: white;
  border-top: 1px solid var(--panel-light-color);
  padding-top: 1.25rem;
}

/* Estilos para panel-etapas */
::deep(.panel-etapas) {
  --panel-color: #2196f3;
  --panel-light-color: rgba(33, 150, 243, 0.1);
  --panel-hover-color: rgba(33, 150, 243, 0.2);

  border-left: 4px solid var(--panel-color);
}

::deep(.panel-etapas .p-accordion-header-link) {
  background-color: white;
  color: rgba(0, 0, 0, 0.8);
  border-bottom: none;
}

::deep(.panel-etapas .p-accordion-header-link:hover) {
  background-color: var(--panel-light-color);
}

::deep(.panel-etapas .p-accordion-header-link.p-highlight) {
  background-color: var(--panel-light-color);
  color: rgba(0, 0, 0, 0.9);
}

::deep(.panel-etapas .p-accordion-content) {
  background-color: white;
  border-top: 1px solid var(--panel-light-color);
}
</style>
