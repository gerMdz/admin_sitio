<template>
  <div class="formgrid grid">
    <div class="field col-12">
      <label for="miembro">Miembro</label>
      <p class="text-base font-semibold text-primary">
        {{ nombreConDni(props.registro?.member) }}
      </p>
    </div>


    <div class="field col-12">
      <label for="socialMedia">Red social recibida</label>
      <Dropdown
        v-model="form.socialMedia"
        :options="socialMedias"
        optionLabel="label"
        optionValue="id"
        placeholder="Selecciona una red social"
        filter
        showClear
        :class="{ 'p-invalid': submitted && !form.socialMedia }"
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

import {createMemberSocialMedia, updateMemberSocialMedia} from '@/services/memberSocialMedia.service.js'
import {getComboSocialMedias} from '@/services/combo.service'
import {nombreConDni} from '@/utils'

const props = defineProps({
  registro: Object
})

const emit = defineEmits(['cerrar', 'guardado'])

const form = ref({
  member: null,
  socialMedia: null
})
const socialMedias = ref([])
const submitted = ref(false)

onMounted(async () => {
  socialMedias.value = await getComboSocialMedias()
  if (props.registro) {
    console.log(props.registro.socialMedia)
    form.value = {
      member: props.registro.member.id,
      socialMedia: props.registro.socialMedia?.id ?? null
    }
  }
})

watch(() => props.registro, (nuevo) => {
  if (nuevo) {
    form.value = {
      member: nuevo.member.id,
      socialMedia: nuevo.socialMedia?.id ?? null
    }
  }
})

const guardar = async () => {
  submitted.value = true
  if (!form.value.socialMedia) return

  if (props.registro?.id) {
    await updateMemberSocialMedia(props.registro.id, form.value)
  } else {
    await createMemberSocialMedia(form.value)
  }

  emit('guardado')
  emit('cerrar')
}
</script>
