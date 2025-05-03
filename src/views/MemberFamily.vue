<template>
  <div class="card">
    <div class="flex justify-content-between align-items-center mb-3">
      <h2>Relaciones Familiares</h2>
      <div class="flex align-items-center gap-2">
        <InputSwitch v-model="verTodos"/>
        <span>{{ verTodos ? 'Mostrar todos' : 'Mostrar activos' }}</span>
<!--        <Button label="Nueva Relación" icon="pi pi-plus" class="p-button-success ml-3" @click="nuevaRelacion"/>-->
      </div>
    </div>

    <div class="flex gap-3 mb-3">
      <AutoComplete
          v-model="filtroMember"
          :suggestions="sugerenciasMember"
          @complete="buscarMember"
          field="label"
          placeholder="Miembro"
          class="w-30rem"
      />

      <AutoComplete
          v-model="filtroRelated"
          :suggestions="sugerenciasRelated"
          @complete="buscarRelated"
          field="label"
          placeholder="Familiar"
          class="w-30rem"
      />

    </div>

    <DataTable
        :value="relacionesFiltradas"
        :paginator="true"
        :rows="10"
        dataKey="id"
        responsiveLayout="scroll"
    >
      <Column header="Miembro">
        <template #body="slotProps">
          {{ slotProps.data.member?.name }} {{ slotProps.data.member?.lastname }}
        </template>
      </Column>

      <Column header="Familiar">
        <template #body="slotProps">
          {{ slotProps.data.related_member?.name }} {{ slotProps.data.related_member?.lastname }}
        </template>
      </Column>
      <Column field="family" header="Parentesco"/>


      <Column header="Asiste a Iglesia">
        <template #body="slotProps">
          {{ slotProps.data.asist_church === 'si' ? 'Sí' : slotProps.data.asist_church === 'no' ? 'No' : 'Sin dato' }}
        </template>
      </Column>

      <Column header="Convive">
        <template #body="slotProps">
          {{ slotProps.data.coexists === 'si' ? 'Sí' : slotProps.data.coexists === 'no' ? 'No' : 'Sin dato' }}
        </template>
      </Column>

      <Column header="Acciones">
        <template #body="slotProps">
          <Button icon="pi pi-eye" class="p-button-text p-button-sm" @click="verDetalle(slotProps.data)"/>
          <Button icon="pi pi-pencil" class="p-button-text p-button-sm" @click="editar(slotProps.data)"/>
          <Button icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger"
                  @click="confirmarEliminacion(slotProps.data)"/>
        </template>
      </Column>
    </DataTable>

    <ConfirmDialog/>

    <Dialog v-model:visible="mostrarDetalle" header="Detalle de Relación Familiar" modal class="w-50rem">
      <div v-if="relacionSeleccionada">
        <p><strong>Miembro:</strong> {{ relacionSeleccionada.member?.name }} {{ relacionSeleccionada.member?.lastname }}</p>
        <p><strong></strong> {{ relacionSeleccionada.related_member?.name }} {{ relacionSeleccionada.related_member?.lastname }}</p>


      </div>
    </Dialog>

    <!-- Formulario -->
    <FormMemberFamily
        v-model:visible="mostrarFormulario"
        :modelo="relacionSeleccionada"
        :titulo="relacionSeleccionada ? 'Editar Relación' : 'Nueva Relación'"
        @actualizado="recargarListado"
        @cerrar="mostrarFormulario = false"
    />
  </div>

</template>

<script setup>
import {ref, onMounted, computed} from 'vue'
import {useConfirm} from 'primevue/useconfirm'
import {useToast} from 'primevue/usetoast'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputSwitch from 'primevue/inputswitch'
import Dialog from 'primevue/dialog'
import ConfirmDialog from 'primevue/confirmdialog'
import {obtenerTodo, eliminarRelacion, obtenerComboMember} from '@/services/memberFamily.service'
import AutoComplete from 'primevue/autocomplete'

import FormMemberFamily from '@/components/FormMemberFamily.vue'


const relaciones = ref([])
const comboMembers = ref([])
const verTodos = ref(false)
const confirm = useConfirm()
const toast = useToast()

const mostrarDetalle = ref(false)
const relacionSeleccionada = ref(null)

const mostrarFormulario = ref(false)

const filtroMember = ref(null)
const filtroRelated = ref(null)

const sugerenciasMember = ref([])
const sugerenciasRelated = ref([])

async function buscarMember(event) {
  const res = await obtenerComboMember(event.query)
  sugerenciasMember.value = res
}

async function buscarRelated(event) {
  const res = await obtenerComboMember(event.query)
  sugerenciasRelated.value = res
}


function editar(relacion) {
  relacionSeleccionada.value = {
    ...relacion,
    family: { id: relacion.family_id, label: relacion.family },
    member: relacion.member, // ya es un objeto { id, ... }
    related: relacion.related_member ?? null
  }
  mostrarFormulario.value = true
}


function nuevaRelacion() {
  relacionSeleccionada.value = null
  mostrarFormulario.value = true
}

async function recargarListado() {
  relaciones.value = await obtenerTodo()
}


onMounted(async () => {
  relaciones.value = await obtenerTodo()
  comboMembers.value = await obtenerComboMember()
})

const relacionesFiltradas = computed(() => {
  return relaciones.value.filter(r => {
    const esActivo = r.audiAction === null || r.audiAction === 'I'
    return (verTodos.value || esActivo) &&
        (!filtroMember.value || r.member?.id === filtroMember.value.id) &&
        (!filtroRelated.value || r.related_member?.id === filtroRelated.value.id)
  })
})



function verDetalle(relacion) {
  relacionSeleccionada.value = relacion
  mostrarDetalle.value = true
}

function confirmarEliminacion(relacion) {
  confirm.require({
    message: '¿Seguro que deseas eliminar esta relación?',
    header: 'Confirmar eliminación',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Sí, eliminar',
    rejectLabel: 'No, cancelar',
    acceptClass: 'p-button-danger',
    rejectClass: 'p-button-secondary',
    accept: async () => {
      await eliminarRelacion(relacion.id)
      relaciones.value = relaciones.value.filter(r => r.id !== relacion.id)
      toast.add({severity: 'success', summary: 'Eliminado', detail: 'Relación eliminada', life: 3000})
    }
  })
}
</script>
