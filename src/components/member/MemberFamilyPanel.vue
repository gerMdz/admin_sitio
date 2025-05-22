<template>
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
</template>

<script setup>
import {formatearFecha} from '@/utils/date';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';

defineProps({
  familyRelations: {
    type: Array,
    default: () => []
  }
});

function mostrarSiNo(valor) {
  if (valor === 'si') return 'Sí';
  if (valor === 'no') return 'No';
  return '—';
}
</script>
