<template>
  <div class="card">
    <div class="flex justify-content-between align-items-center mb-3">
      <h2>Redes sociales de los Miembros</h2>
      <div class="flex align-items-center gap-2">
        <InputSwitch v-model="verTodos"
                     v-tooltip="'Alternar entre activos y todos los registros eliminados o modificados'"/>
        <span>{{ verTodos ? 'Mostrar todos' : 'Mostrar activos' }}</span>
      </div>
    </div>

    <div class="flex gap-2 mb-3">
      <MultiSelect
        v-model="filtroMiembros"
        :options="miembros"
        optionLabel="label"
        optionValue="id"
        placeholder="Filtrar por miembro(s)"
        display="chip"
        filter
        @filter="onBuscarMiembros"
        :loading="cargandoMiembros"
        class="w-40rem"
        v-tooltip="'Buscar y seleccionar uno o más miembros para filtrar'"
      />

      <Dropdown
        v-model="filtroSocialMedia"
        :options="socialMedias"
        optionLabel="label"
        optionValue="id"
        placeholder="Filtrar por red social"
        showClear
        filter
        v-tooltip="'Filtrar los resultados según red social asociada'"
      />
    </div>

    <DataTable
      :value="filtrados"
      paginator
      :rows="10"
      :rowsPerPageOptions="[10, 20, 50]"
      responsiveLayout="scroll"
    >
      <Column header="Miembro">
        <template #body="slotProps">
          {{ nombreConDni(slotProps.data.member) }}
        </template>
      </Column>

      <Column field="socialMedia.nombre" header="Red social"/>
      <Column field="socialMedia.otras" header="Otra"/>

      <Column header="Estado">
        <template #body="slotProps">
          {{ slotProps.data.audiAction === 'D' ? '❌' : '✔️' }}
        </template>
      </Column>

      <Column header="Acciones">
        <template #body="slotProps">
          <Button icon="pi pi-eye" class="p-button-text" @click="verDetalle(slotProps.data)"/>
          <Button icon="pi pi-pencil" class="p-button-text" @click="editar(slotProps.data)"/>
          <Button icon="pi pi-trash" class="p-button-text p-button-danger"
                  @click="confirmarEliminacion(slotProps.data)"/>
        </template>
      </Column>
    </DataTable>

    <Dialog
      v-model:visible="mostrarForm"
      modal
      dismissableMask
      header="Editar Red Social"
      :style="{ width: '40vw' }"
    >
      <FormMemberSocialMedia :registro="registroSeleccionado" @cerrar="cerrarForm" @guardado="cargarDatos"/>
    </Dialog>

    <Dialog
      v-model:visible="mostrarDetalle"
      modal
      dismissableMask
      header="Detalle del servicio"
      :style="{ width: '500px' }"
    >
      <div class="mb-2">
        <h6 class="mb-0">Miembro</h6>
        <h4 class="mt-0">{{ nombreConDni(registroSeleccionado?.member) }}</h4>
      </div>

      <div class="mb-2">
        <h6 class="mb-0">Red Social</h6>
        <h4 class="mt-0">{{ registroSeleccionado?.socialMedia?.nombre }}</h4>
        <h6 class="mt-0">{{ registroSeleccionado?.socialMedia?.otras }}</h6>
      </div>

      <hr class="my-3 border-gray-300"/>

      <div class="mb-2">
        <h6 class="mt-3 mb-2">Datos internos</h6>
        <p><strong>Usuario:</strong> {{ registroSeleccionado?.audiUser ?? 'No registrado' }}</p>
        <p><strong>Fecha:</strong> {{ formatearFecha(registroSeleccionado?.audiDate) }}</p>
        <p><strong>Acción:</strong> {{ auditoriaLabel(registroSeleccionado?.audiAction) }}</p>
      </div>

      <template #footer>
        <Button label="Cerrar" icon="pi pi-times" class="p-button-text" @click="mostrarDetalle = false"/>
      </template>
    </Dialog>
  </div>
</template>
<script setup>
import {ref, computed, onMounted, onBeforeUnmount, watch} from 'vue'
import Button from 'primevue/button'
import InputSwitch from 'primevue/inputswitch'
import Dropdown from 'primevue/dropdown'
import MultiSelect from 'primevue/multiselect'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import {useConfirm} from 'primevue/useconfirm'
import debounce from 'lodash/debounce'

import {
  getMemberSocialMedias,
  deleteMemberSocialMedia
} from '@/services/memberSocialMedia.service.js'

import {
  getComboMembers,
  getComboSocialMedias
} from '@/services/combo.service'

import FormMemberSocialMedia from '@/components/FormMemberSocialMedia.vue'
import {nombreConDni, formatearFecha, auditoriaLabel} from '@/utils'

const filtroMiembros = ref([])
const miembros = ref([])
const cargandoMiembros = ref(false)

const filtroSocialMedia = ref(null)
const socialMedias = ref([])

const datos = ref([])
const mostrarForm = ref(false)
const mostrarDetalle = ref(false)
const verTodos = ref(false)
const registroSeleccionado = ref(null)
const confirm = useConfirm()

const onBuscarMiembros = async (event) => {
  cargandoMiembros.value = true
  const texto = event?.value || ''
  miembros.value = await getComboMembers(texto)
  cargandoMiembros.value = false
}

const cargarCombos = async () => {
  miembros.value = await getComboMembers()
  socialMedias.value = await getComboSocialMedias()
}

const cargarDatos = async () => {
  datos.value = await getMemberSocialMedias(verTodos.value)
}

const filtrados = computed(() => {
  return datos.value.filter(d =>
    (filtroMiembros.value.length === 0 || filtroMiembros.value.includes(d.member?.id)) &&
    (!filtroSocialMedia.value || d.socialMedia?.id === filtroSocialMedia.value)
  )
})

const editar = (registro) => {
  registroSeleccionado.value = registro
  mostrarForm.value = true
}

const verDetalle = (registro) => {
  registroSeleccionado.value = registro
  mostrarDetalle.value = true
}

const cerrarForm = () => {
  mostrarForm.value = false
  registroSeleccionado.value = null
}

const confirmarEliminacion = (item) => {
  confirm.require({
    message: `¿Seguro que deseas eliminar la red social "${item.socialMedia.nombre}" de ${nombreConDni(item.member)}?`,
    header: 'Confirmar eliminación',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Sí, eliminar',
    rejectLabel: 'No, cancelar',
    acceptClass: 'p-button-danger',
    rejectClass: 'p-button-secondary',
    accept: async () => {
      await deleteMemberSocialMedia(item.id)
      await cargarDatos()
    }
  })
}

const cargarDatosDebounced = debounce(() => {
  cargarDatos()
}, 200)

onBeforeUnmount(() => {
  cargarDatosDebounced.cancel()
})

onMounted(async () => {
  await cargarCombos()
  await cargarDatos()
  await onBuscarMiembros({value: ''})
})

watch(verTodos, () => {
  cargarDatosDebounced()
})
</script>
