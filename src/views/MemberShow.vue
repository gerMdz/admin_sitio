<template>
  <div class="max-w-4xl mx-auto mt-2 space-y-4">
    <!-- Spinner -->
    <ProgressSpinner
      v-if="loading"
      style="width: 50px; height: 50px; margin: 100px auto; display: block"
    />
    <div v-else>
      <div class="max-w-4xl mx-auto mt-2 space-y-4">
        <!-- Card fija con foto a la derecha -->
        <div class="card p-4 shadow-md bg-white rounded-xl flex flex-col md:flex-row justify-between items-start gap-6">
          <!-- Datos básicos -->
          <div class="flex-1">
            <h2 class="text-2xl font-bold">
              {{ member.name }} {{ member.lastname }}
            </h2>
            <p class="text-gray-600">DNI: {{ member.dniDocument }}</p>
            <p class="text-gray-600">Nacimiento: {{ formatearFecha(member.birthdate, 'es-AR', true) }}</p>
            <p v-if="member.relatedMember"
               class="inline-block mt-2 text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
              Relacionado</p>
          </div>

          <!-- Foto o silueta -->
          <div
            class="w-32 h-32 rounded-xl bg-gray-200 flex items-center justify-center overflow-hidden self-center md:self-start">
            <img
              v-if="fotoUrl"
              :src="fotoUrl"
              alt="Foto del miembro"
              class="object-cover w-full h-full"
            />
            <i v-else class="pi pi-user text-6xl text-gray-500"></i>
          </div>
        </div>

        <!-- Secciones colapsables -->
        <Accordion :value="['0']" multiple>
          <AccordionPanel value="0" class="panel-etapas">
            <AccordionHeader>
              <i class="pi pi-id-card mr-2"></i> Datos personales
            </AccordionHeader>
            <AccordionContent>
              <div class="pl-4 space-y-1 text-gray-700">
                <p>Profesión: {{ member.nameProfession || '—' }}</p>
                <p>Habilidades artísticas: {{ member.artisticSkills || '—' }}</p>
                <p>Género: {{ member.gender }}</p>
                <p>Estado civil: {{ member.civilState }}</p>
                <p>Celebración: {{ member.celebracion || '—' }}</p>
              </div>
            </AccordionContent>
          </AccordionPanel>

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

          <AccordionPanel value="3">
            <AccordionHeader>
              <i class="pi pi-users mr-2"></i> Grupo
            </AccordionHeader>
            <AccordionContent>
              <div class="pl-4 space-y-1 text-gray-700">
                <p>Guía: {{ member.nameGuia || '—' }}</p>
                <p>Grupo: {{ member.nameGroup || member.grupo || '—' }}</p>
                <p>Participa GP: {{ member.participateGp ? 'Sí' : 'No' }}</p>
                <p>Jefe de familia: {{ member.bossFamily ? 'Sí' : 'No' }}</p>
              </div>
            </AccordionContent>
          </AccordionPanel>

          <AccordionPanel value="4">
            <AccordionHeader>
              <i class="pi pi-info-circle mr-2"></i> Auditoría
            </AccordionHeader>
            <AccordionContent>
              <div class="pl-4 space-y-1 text-sm text-gray-500">
                <p>Última acción: {{ member.audiAction || '—' }}</p>
                <p>Fecha: {{ formatearFecha(member.audiDate, 'es-AR') }}</p>
                <p>Usuario: {{ member.audiUser || '—' }}</p>
              </div>
            </AccordionContent>
          </AccordionPanel>

          <AccordionPanel value="5" class="panel-experiencias">
            <AccordionHeader>
              <i class="pi pi-briefcase mr-2"></i> Experiencias
            </AccordionHeader>
            <AccordionContent>
              <div class="pl-4 space-y-1 text-gray-800">
                <div v-if="experiences.length === 0" class="text-gray-500">No tiene experiencias registradas</div>
                <ul v-else class="mt-0">
                  <li v-for="exp in experiences" :key="exp.id" class="pl-4 text-600">
                    {{ exp.experience }}
                    <span class="text-xs text-gray-500 italic pl-2">
                      Auditoría:
          ({{ formatearFecha(exp.audi_date, 'es-AR') }}, {{ exp.audi_user || '—' }})
        </span>
                  </li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionPanel>

          <AccordionPanel value="6" class="panel-familia">
            <AccordionHeader>
              <i class="pi pi-users mr-2"></i> Familia
            </AccordionHeader>
            <AccordionContent>
              <div class="pl-4 pr-4 py-2 text-gray-800">
                <template v-if="familyRelations.length > 0">
                  <div
                    v-for="rel in familyRelations"
                    :key="rel.id"
                    class="mb-2"
                  >
                    <div class="flex items-start gap-2">
                      <i class="pi pi-user text-pink-500 text-base mt-1"></i>
                      <div>
            <span class="text-xs inline-block bg-pink-100 text-pink-800 font-semibold px-2 py-0.5 rounded mr-2">
              {{ rel.family }}
            </span>

                        <span v-if="rel.related_member" class="font-semibold text-blue-700">
              {{ rel.related_member.name }} {{ rel.related_member.lastname }}
              <span class="text-sm text-gray-500">({{ rel.related_member.dniDocument }})</span>
            </span>

                        <span v-else class="italic text-gray-600">(Miembro no vinculado)</span>
                      </div>
                    </div>

                    <div class="pl-6 mt-1">
                      Vive con el miembro: {{ mostrarSiNo(rel.coexists) }} |
                      Asiste a la iglesia: {{ mostrarSiNo(rel.asist_church) }}
                    </div>

                    <div v-if="rel.audiDate || rel.audiUser" class="pl-6 text-xs text-gray-500 italic mt-1">
                      Auditoría: ({{ formatearFecha(rel.audiDate, 'es-AR') }} — {{ rel.audiUser || '—' }})
                    </div>
                  </div>
                </template>

                <p v-else class="text-gray-500">No hay relaciones familiares registradas.</p>
              </div>
            </AccordionContent>
          </AccordionPanel>

          <AccordionPanel value="7" class="panel-experiencias">
            <AccordionHeader>
              <i class="pi pi-briefcase mr-2"></i> Intereses
            </AccordionHeader>
            <AccordionContent>
              <div class="pl-4 space-y-1 text-gray-800">
                <div v-if="interests.length === 0" class="text-gray-500">No tiene intereses registradas</div>
                <ul v-else class="mt-0">
                  <li v-for="exp in interests" :key="exp.id" class="pl-4 text-600">
                    {{ exp.interest }}
                    <span class="text-xs text-gray-500 italic pl-2">
                      Auditoría:
          ({{ formatearFecha(exp.audi_date, 'es-AR') }}, {{ exp.audi_user || '—' }})
        </span>
                  </li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionPanel>

          <AccordionPanel value="8" class="panel-experiencias">
            <AccordionHeader>
              <i class="pi pi-briefcase mr-2"></i> Etapa de vida
            </AccordionHeader>
            <AccordionContent>
              <div class="pl-4 space-y-1 text-gray-800">
                <div v-if="lifeStages.length === 0" class="text-gray-500">No tiene etapa de vida registrada</div>
                <ul v-else class="mt-0">
                  <li v-for="exp in lifeStages" :key="exp.id" class="pl-4 text-600">
                    {{ exp.lifeStage }}
                    <span class="text-xs text-gray-500 italic pl-2">
                      Auditoría:
          ({{ formatearFecha(exp.audi_date, 'es-AR') }}, {{ exp.audi_user || '—' }})
        </span>
                  </li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionPanel>

        </Accordion>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, computed} from 'vue';
import {useRoute} from 'vue-router';
import api from '@/api/axios';
import {formatearFecha} from '@/utils/date';
import {getFotoMiembro} from '@/utils/foto';

import ProgressSpinner from 'primevue/progressspinner';
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';

const route = useRoute();
const member = ref({});
const experiences = ref([]);
const interests = ref([]);
const lifeStages = ref([]);
const familyRelations = ref([]);

const loading = ref(true);

const fotoUrl = computed(() => member.value.id ? getFotoMiembro(member.value.id) : null);

function mostrarSiNo(valor) {
  if (valor === 'si') return 'Sí';
  if (valor === 'no') return 'No';
  return '—';
}


onMounted(async () => {
  const memberId = route.params.id;

  try {
    const [resMember, resExp, resFamilyRelations, resInterest, resLifeStages] = await Promise.all([
      api.get(`/members/${memberId}`),
      api.get(`/member-experience/member/${memberId}`),
      api.get(`/member-family/member/${memberId}`),
      api.get(`/member-interest/member/${memberId}`),
      api.get(`/member-life-stages/member/${memberId}`),
    ]);

    member.value = resMember.data;
    experiences.value = resExp.data;
    familyRelations.value = resFamilyRelations.data;
    interests.value = resInterest.data;
    lifeStages.value = resLifeStages.data;
  } catch (e) {
    console.error('Error al cargar datos', e);
  } finally {
    loading.value = false;
  }
});
</script>
<style scoped>
:deep(.panel-experiencias) {
  --p-accordion-header-background: #ffffff;
  --p-accordion-header-hover-background: #fef4dc;
  --p-accordion-header-active-background: #fef4dc;
  --p-accordion-content-background: #fef4dc;
  --p-accordion-header-color: #000;
  --p-accordion-panel-border-color: 4px solid #ffb74d;

  border-left: 4px solid #ffb74d; /* fallback si el token no se aplica */
  box-shadow: inset 4px 0 0 #ffb74d;
}

:deep(.p-accordion-content),
:deep(.p-accordion-header),
:deep(.p-accordion-panel) {
  border-left: none;
}

:deep(.panel-familia .p-accordion-content) {
  background: #fdeff0; /* mismo que el header */
  border-top: none;
}


:deep(.panel-familia) {
  --p-accordion-header-background: #fdeff0;
  --p-accordion-header-hover-background: #f8d7da;
  --p-accordion-header-active-background: #f8bbd0;
  --p-accordion-content-background: #fdeff0;
  --p-accordion-header-color: #5e1a33;

  border-left: 4px solid #f06292;
}

:deep(.panel-familia .p-accordion-content) {
  background: #fdeff0;
  border-top: none;
  padding-top: 0.5rem;
}

:deep(.panel-familia .p-accordion-header) {
  border-bottom: none;
}


:deep(.panel-etapas) {
  border-left: 4px solid #42a5f5;
  --p-accordion-header-background: #e3f2fd;
}


</style>
