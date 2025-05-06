<template>
  <div class="formgrid grid">
    <div class="field col-12">
      <label for="miembro">Miembro</label>
      <p class="text-base font-semibold text-primary">
        {{ nombreConDni(props.registro?.member) }}
      </p>
    </div>


    <div class="field col-12">
      <label for="voluntary">Voluntariado recibida</label>
      <Dropdown
        v-model="form.voluntary"
        :options="voluntaries"
        optionLabel="label"
        optionValue="id"
        placeholder="Selecciona un voluntariado"
        filter
        showClear
        :class="{ 'p-invalid': submitted && !form.voluntary }"
      />
    </div>
    <div class="field col-12">
      <label for="service">Servicio activo</label>
      <Checkbox
        v-model="form.service"
        optionLabel="label"
        optionValue="id"
        placeholder="Está activo "
        filter
        showClear
        :class="{ 'p-invalid': submitted && !form.service }"
      />
    </div>

    <div class="col-12 flex justify-content-end mt-4">
      <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="$emit('cerrar')"/>
      <Button label="Guardar" icon="pi pi-check" class="p-button-primary ml-2" @click="guardar"/>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, watch} from 'vue'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'

import {createMemberVoluntary, updateMemberVoluntary} from '@/services/memberVoluntary.service.js'
import {getComboVoluntaries} from '@/services/combo.service'
import {nombreConDni} from '@/utils'

const props = defineProps({
  registro: Object
})

const emit = defineEmits(['cerrar', 'guardado'])

const form = ref({
  member: null,
  voluntary: null
})
const voluntaries = ref([])
const submitted = ref(false)

onMounted(async () => {
  voluntaries.value = await getComboVoluntaries()
  if (props.registro) {
    console.log(props.registro.voluntary)
    form.value = {
      member: props.registro.member.id,
      voluntary: props.registro.voluntary?.id ?? null,
      service: props.registro.voluntary?.service ?? null
    }
  }
})

watch(() => props.registro, (nuevo) => {
  if (nuevo) {
    form.value = {
      member: nuevo.member.id,
      voluntary: nuevo.voluntary?.id ?? null,
      service: nuevo.voluntary?.service ?? null
    }
  }
})

const guardar = async () => {
  submitted.value = true
  if (!form.value.voluntary) return

  if (props.registro?.id) {
    await updateMemberVoluntary(props.registro.id, form.value)
  } else {
    await createMemberVoluntary(form.value)
  }

  emit('guardado')
  emit('cerrar')
}
</script>
