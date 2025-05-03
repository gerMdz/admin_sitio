<template>
  <div>
    <div class="field mb-3">
      <label for="miembro">Miembro</label>
      <InputText :value="nombreConDni(registro.member)" readonly/>
    </div>

    <div class="field mb-3">
      <label for="etapa">Etapa de Vida</label>
      <Dropdown
          v-model="form.life_stage_id"
          :options="opcionesEtapas"
          optionLabel="label"
          optionValue="id"
          placeholder="Seleccione una etapa"
          class="w-full"
          filter
          showClear
      />
    </div>
    <div class="flex justify-content-end gap-2 mt-4">
      <Button label="Cancelar" icon="pi pi-times" class="p-button-secondary" @click="$emit('cerrar')"/>
      <Button label="Guardar" icon="pi pi-check" class="p-button-success" @click="guardar"/>
    </div>
  </div>
</template>

<script setup>
import {ref, watch, onMounted} from 'vue';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import {getComboLifeStages} from '@/services/combo.service.js';
import {
  createMemberLifeStage,
  updateMemberLifeStage
} from '@/services/memberLifeStage.service.js';

const props = defineProps({
  registro: Object,
});

const emit = defineEmits(['cerrar', 'guardado']);

const form = ref({
  life_stage_id: null,
});

const opcionesEtapas = ref([]);

watch(() => props.registro, (nuevo) => {
  if (nuevo?.lifeStage?.id) {
    form.value.life_stage_id = nuevo.lifeStage.id;
  }
}, {immediate: true});

const guardar = async () => {
  if (props.registro.id) {
    await updateMemberLifeStage(props.registro.id, form.value);
  } else {
    await createMemberLifeStage({
      member_id: props.registro.member.id,
      life_stage_id: form.value.life_stage_id
    });
  }
  emit('guardado');
  emit('cerrar');
};

const nombreConDni = (miembro) => {
  if (!miembro?.nombre) return '';
  return `${miembro.nombre.name} ${miembro.nombre.lastname} (${miembro.dni})`;
};

onMounted(async () => {
  opcionesEtapas.value = await getComboLifeStages();
  console.log('Opciones etapa de vida:', opcionesEtapas.value);
});

</script>
