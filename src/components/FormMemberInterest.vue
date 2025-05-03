<template>
  <div>
    <div class="field mb-3">
      <label class="font-bold">Miembro</label>
      <InputText
          :value="mostrarNombreConDni(formulario.member)"
          disabled
          class="w-full"
      />
    </div>

    <div class="field mb-3" v-if="formulario?.interest !== undefined">
      <label class="font-bold">Interés</label>
      <AutoComplete
          v-model="formulario.interest"
          :suggestions="sugerenciasInteres"
          @complete="buscarInteres"
          placeholder="Seleccionar interés"
          optionLabel="nombre.name"
          class="w-full"
          forceSelection
      >
        <template #item="slotProps">
          {{ slotProps.item.nombre.name }}
        </template>
        <template #option="slotProps">
          {{ slotProps.option.nombre.name }}
        </template>
      </AutoComplete>
    </div>

  </div>
</template>

<script setup>
import {ref} from 'vue'
import {getComboInterests} from '@/services/combo.service'
import AutoComplete from "primevue/autocomplete";

const props = defineProps({
  formulario: Object
})

const sugerenciasInteres = ref([])

const buscarInteres = async (event) => {
  console.log('Buscando interés con:', event.query)
  sugerenciasInteres.value = await getComboInterests(event.query)
}


function mostrarNombreConDni(member) {
  if (!member?.nombre) return ''
  return `${member.nombre.name} ${member.nombre.lastname} (${member.dni})`
}
</script>
