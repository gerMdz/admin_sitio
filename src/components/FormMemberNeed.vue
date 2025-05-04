<template>
  <div>
    <div class="field mb-3">
      <label for="miembro">Miembro</label>
      <InputText :value="nombreConDni(registro.member)" readonly
                 v-tooltip="'Este valor no puede ser cambiado desde aquí'"
      />
    </div>

    <div class="field mb-3">
      <label for="necesidad">Necesidad</label>
      <Dropdown
          v-model="form.need_id"
          :options="opcionesNecesidades"
          optionLabel="label"
          optionValue="id"
          placeholder="Seleccione una necesidad"
          v-tooltip="'Seleccione una necesidad disponible'"
          class="w-full"
          filter
          virtualScroll
          lazy
          :loading="cargandoNecesidades"
          :virtualScrollItemSize="38"
          @filter="onBuscarNecesidades"
      />

    </div>
    <div class="flex justify-content-end gap-2 mt-4">
      <Button label="Cancelar" icon="pi pi-times" class="p-button-secondary" @click="$emit('cerrar')"


      />
      <Button label="Guardar" icon="pi pi-check" class="p-button-success" @click="guardar"

      />
    </div>
  </div>
</template>

<script setup>
import {ref, watch, onMounted} from 'vue';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import {getComboNeeds} from '@/services/combo.service.js';
import {
  createMemberNeed,
  updateMemberNeed
} from '@/services/memberNeed.service.js';

const opcionesNecesidades = ref([]);
const cargandoNecesidades = ref(false);
const paginaActual = ref(1);
const ultimaBusqueda = ref('');


const props = defineProps({
  registro: Object,
});

const emit = defineEmits(['cerrar', 'guardado']);

const form = ref({
  need_id: null,
});


watch(() => props.registro, (nuevo) => {
  if (nuevo?.need?.id) {
    form.value.need_id = nuevo.need.id;
  }
}, {immediate: true});

const guardar = async () => {
  if (props.registro.id) {
    await updateMemberNeed(props.registro.id, form.value);
  } else {
    await createMemberNeed({
      member_id: props.registro.member.id,
      need_id: form.value.need_id
    });
  }
  emit('guardado');
  emit('cerrar');
};

const nombreConDni = (miembro) => {
  return miembro?.nombre || '';
};

const onBuscarNecesidades = async (event) => {
  const texto = event?.value || '';
  paginaActual.value = 1;
  ultimaBusqueda.value = texto;
  cargandoNecesidades.value = true;

  const resultados = await getComboNeeds(texto, paginaActual.value);
  opcionesNecesidades.value = resultados;
  cargandoNecesidades.value = false;
};


onMounted(async () => {
  await onBuscarNecesidades({value: ''});
});

</script>

