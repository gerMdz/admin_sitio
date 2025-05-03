<template>
  <div class="card">
    <div class="flex justify-content-between align-items-center mb-3">
      <h2>Intereses por miembro</h2>
      <div class="flex gap-2">
        <AutoComplete
            v-model="filtroMiembro"
            :suggestions="sugerenciasMiembro"
            optionLabel="label"
            placeholder="Filtrar por miembro"
            @complete="buscarMiembro"
            class="w-20rem"
            forceSelection
        />

        <AutoComplete
            v-model="filtroInteres"
            :suggestions="sugerenciasInteres"
            optionLabel="label"
            placeholder="Filtrar por interés"
            @complete="buscarInteres"
            class="w-20rem"
        >
          <template #option="slotProps">
            {{ slotProps.option.nombre.name }}
          </template>
        </AutoComplete>
      </div>
      <div class="flex align-items-center gap-2 ml-3">
        <InputSwitch v-model="verTodos"/>
        <span>{{ verTodos ? 'Mostrar todos' : 'Mostrar activos' }}</span>
      </div>
    </div>

    <DataTable :value="itemsFiltrados" responsiveLayout="scroll">
      <Column header="Miembro">
        <template #body="slotProps">
          {{ nombreConDni(slotProps.data.member) }}
        </template>
      </Column>

      <Column header="Interés">
        <template #body="slotProps">
          {{ slotProps.data.interest.nombre.name }}
        </template>
      </Column>
      <Column header="Estado">
        <template #body="slotProps">
    <span :class="estadoClase(slotProps.data)">
      {{ slotProps.data.audiAction === 'D' ? '❌' : '✅' }}
    </span>
        </template>
      </Column>


      <Column header="Acciones">
        <template #body="slotProps">
          <Button icon="pi pi-eye" class="p-button-text" @click="verDetalle(slotProps.data)"/>
          <Button icon="pi pi-pencil" class="p-button-text" @click="editar(slotProps.data)"/>
          <Button icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger"
                  @click="confirmarEliminacion(slotProps.data)"/>
        </template>
      </Column>
    </DataTable>

    <Dialog
        v-model:visible="dialogoDetalleVisible"
        modal
        dismissableMask
        header="Detalle del interés asignado"
        :style="{ width: '500px' }"
    >
      <div class="mb-2">
        <h6 class="mb-0">Miembro</h6>
        <h4 class="mt-0"> {{ itemSeleccionado?.member?.nombre?.name }}
          {{ itemSeleccionado?.member?.nombre?.lastname }} ({{ itemSeleccionado?.member?.dni }})</h4>

      </div>

      <div class="mb-2">
        <h6 class="mb-0">Interés</h6>
        <h4 class="mt-0"> {{ itemSeleccionado?.interest?.nombre?.name }}</h4>
      </div>
      <hr/>
      <div class="mb-2">

        <h6 class="mt-3 mb-2">Datos internos</h6>
        <p><strong>Usuario:</strong> {{ itemSeleccionado?.audiUser ?? 'No registrado' }}</p>
        <p><strong>Fecha:</strong> {{ formatearFecha(itemSeleccionado?.audiDate) }}</p>
        <p><strong>Acción:</strong> {{
            itemSeleccionado?.audiAction === 'I' ? 'Creación' :
                itemSeleccionado?.audiAction === 'U' ? 'Actualización' :
                    itemSeleccionado?.audiAction === 'D' ? 'Eliminación' :
                        'No registrada'
          }}</p>
      </div>


      <template #footer>
        <Button label="Cerrar" icon="pi pi-times" class="p-button-text" @click="dialogoDetalleVisible = false"/>
      </template>
    </Dialog>

    <Dialog
        v-model:visible="dialogoVisible"
        modal
        dismissableMask
        header="Editar interés de miembro"
        :style="{ width: '500px' }"
    >
      <FormMemberInterest :formulario="formulario"/>

      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="dialogoVisible = false"/>
        <Button label="Guardar" icon="pi pi-check" class="p-button-primary" @click="guardar"/>
      </template>
    </Dialog>

  </div>
</template>
<script setup>
import {ref, computed, onMounted, nextTick, watch} from 'vue'
import {getComboMembers, getComboInterests} from '@/services/combo.service'
import {
  listarMemberInterests,
  eliminarMemberInterest,
  actualizarMemberInterest
} from '@/services/memberInterest.service'

import {useConfirm} from 'primevue/useconfirm'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputSwitch from 'primevue/inputswitch'
import Dialog from 'primevue/dialog'
import AutoComplete from 'primevue/autocomplete'
import FormMemberInterest from "@/components/FormMemberInterest.vue";

const confirm = useConfirm()

const items = ref([])
const filtroMiembro = ref(null)
const filtroInteres = ref(null)
const sugerenciasMiembro = ref([])
const sugerenciasInteres = ref([])

const dialogoDetalleVisible = ref(false)
const itemSeleccionado = ref(null)

const dialogoVisible = ref(false)
const formulario = ref({
  id: null,
  member: null,
  interest: null
})

const verTodos = ref(false)

const itemsFiltrados = computed(() => {
  return items.value.filter(item => {
    const coincideMiembro = !filtroMiembro.value || item.member.id === filtroMiembro.value.id
    const coincideInteres = !filtroInteres.value || item.interest.id === filtroInteres.value.id
    const esActivo = verTodos.value || !item.audiAction || item.audiAction !== 'D'
    return coincideMiembro && coincideInteres && esActivo
  })
})


function formatearFecha(fecha) {
  if (!fecha) return '—'
  return new Date(fecha).toLocaleString('es-AR', {
    dateStyle: 'short',
    timeStyle: 'short'
  })
}

function estadoClase(item) {
  return item.audiAction === 'D' ? 'text-gray-400' : 'text-green-600'
}


function nombreConDni(miembro) {
  if (!miembro?.nombre) return ''
  return `${miembro.nombre.name} ${miembro.nombre.lastname} (${miembro.dni})`
}

function nombreInteres(interes) {
  return interes?.nombre?.name || ''
}


const editar = async (item) => {
  formulario.value = {
    id: item.id,
    member: item.member,
    interest: item.interest ?? null
  }

  await nextTick() // espera a que reactive el DOM antes de abrir el dialog
  dialogoVisible.value = true
}


const guardar = async () => {
  const payload = {
    member_id: formulario.value.member.id,
    interest_id: formulario.value.interest.id,
  }

  await actualizarMemberInterest(formulario.value.id, payload)
  dialogoVisible.value = false

  // Refrescar lista completa
  items.value = await listarMemberInterests()
}

const verDetalle = (item) => {
  itemSeleccionado.value = item
  dialogoDetalleVisible.value = true
}


onMounted(async () => {
  items.value = await listarMemberInterests(verTodos.value)
})

watch(verTodos, async (nuevoValor) => {
  items.value = await listarMemberInterests(nuevoValor)
})


const buscarMiembro = async (event) => {
  sugerenciasMiembro.value = await getComboMembers(event.query)
}


const buscarInteres = async (event) => {
  sugerenciasInteres.value = await getComboInterests(event.query)
}

const confirmarEliminacion = (item) => {
  confirm.require({
    message: `¿Seguro que deseas eliminar el interés "${item.interest.nombre.name}" de ${nombreConDni(item.member)}?`,
    header: 'Confirmar eliminación',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Sí, eliminar',
    rejectLabel: 'No, cancelar',
    acceptClass: 'p-button-danger',
    rejectClass: 'p-button-secondary',
    accept: async () => {
      await eliminarMemberInterest(item.id)
      items.value = await listarMemberInterests()
    }
  })
}


</script>