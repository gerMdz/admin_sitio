<template>
  <Dialog :visible="visible" @update:visible="val => emit('update:visible', val)" :header="titulo" modal class="w-50rem" @hide="onHide">
    <form @submit.prevent="guardar">
      <Dropdown v-model="form.member" :options="comboMembers" optionLabel="label" optionValue="id" placeholder="Miembro" class="mb-3 w-full" />
      <AutoComplete
          v-model="form.family"
          :suggestions="sugerenciasFamily"
          @complete="buscarFamily"
          field="label"
          placeholder="Tipo de relación familiar"
          class="mb-3 w-full"
      />

      <Dropdown v-model="form.related" :options="comboMembers" optionLabel="label" optionValue="id" placeholder="Familiar" class="mb-3 w-full" />
      <div class="mb-3">
        <label><Checkbox v-model="form.asist_church" :binary="true" /> Asiste a la Iglesia</label>
      </div>
      <div class="mb-3">
        <label><Checkbox v-model="form.coexists" :binary="true" /> Convive</label>
      </div>
      <div class="text-right">
        <Button label="Guardar" icon="pi pi-check" type="submit" class="p-button-success" />
      </div>
    </form>
  </Dialog>

</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import AutoComplete from 'primevue/autocomplete'
import obtenerComboFamily from '@/services/combo.service'
import { obtenerComboMember, actualizarRelacion, crearRelacion } from '@/services/memberFamily.service'

const props = defineProps({
  visible: Boolean,
  modelo: Object,
  titulo: String
})
const emit = defineEmits(['actualizado', 'cerrar'])

const comboMembers = ref([])
const toast = useToast()

const form = ref({ asist_church: false, coexists: false })
const sugerenciasFamily = ref([])

async function buscarFamily(event) {
  const res = await obtenerComboFamily.obtenerComboFamily(event.query)
  sugerenciasFamily.value = res
}


onMounted(async () => {
  comboMembers.value = await obtenerComboMember()
})

watch(() => props.modelo, (val) => {
  form.value = val ? { ...val } : { asist_church: false, coexists: false }
}, { immediate: true })

function guardar() {
  const payload = {
    ...form.value,
    family_id: form.value.family.id,
    member_id: form.value.member.id,
    related_member_id: form.value.related?.id ?? null,
  }

  const saveFn = form.value.id ? actualizarRelacion : crearRelacion
  saveFn(payload).then(() => {
    toast.add({ severity: 'success', summary: 'Guardado', detail: 'Relación guardada', life: 3000 })
    emit('actualizado')
  })
}


function onHide() {
  emit('cerrar')
}
</script>
