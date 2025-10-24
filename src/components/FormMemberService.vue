<template>
  <div class="formgrid grid">
    <div class="field col-12">
      <label for="miembro">Miembro</label>
      <p class="text-base font-semibold text-primary">
        {{ nombreConDni(props.registro?.member) }}
      </p>
    </div>


    <div class="field col-12">
      <label for="service">Servicio recibido</label>
      <Dropdown
          v-model="form.service"
          :options="servicios"
          optionLabel="label"
          optionValue="id"
          placeholder="Selecciona un servicio"
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

import {createMemberService, updateMemberService} from '@/services/memberService.service.js'
import {getComboServices} from '@/services/combo.service'
import {nombreConDni} from '@/utils'

const props = defineProps({
  registro: Object
})

const emit = defineEmits(['cerrar', 'guardado'])

const form = ref({
  member: null,
  service: null
})
const servicios = ref([])
const submitted = ref(false)

onMounted(async () => {
  servicios.value = await getComboServices()
  if (props.registro) {
    form.value = {
      member: props.registro.member.id,
      service: props.registro.service?.id ?? null
    }
  }
})

watch(() => props.registro, (nuevo) => {
  if (nuevo) {
    form.value = {
      member: nuevo.member.id,
      service: nuevo.service?.id ?? null
    }
  }
})

const guardar = async () => {
  submitted.value = true
  if (!form.value.service) return

  if (props.registro?.id) {
    await updateMemberService(props.registro.id, form.value)
  } else {
    await createMemberService(form.value)
  }

  emit('guardado')
  emit('cerrar')
}
</script>
