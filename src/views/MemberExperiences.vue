<template>
  <div class="card">
    <div class="flex justify-content-between align-items-center mb-3">
      <h2>Relaciones miembro - experiencia</h2>
      <div class="flex align-items-center gap-2">
        <InputSwitch v-model="verTodos"/>
        <span>{{ verTodos ? 'Mostrar todos' : 'Mostrar activos' }}</span>
      </div>
    </div>

    <div class="flex gap-3 mb-3">
      <InputText v-model="filtroMiembro" placeholder="Filtrar por miembro..." style="width: 36rem"/>
      <InputText v-model="filtroExperiencia" placeholder="Filtrar por experiencia..." style="width: 24rem"/>
    </div>

    <p>Total relaciones: {{ relacionesFiltradas.length }}</p>

    <DataTable
      :value="relacionesFiltradas"
      paginator
      :rows="10"
      dataKey="id"
      responsiveLayout="scroll"
      :rowsPerPageOptions="[10, 20, 50]"

    >
      <Column header="Miembro">
        <template #body="{ data }">
          {{ data.member?.lastname }} {{ data.member?.name }} ({{ data.member?.dniDocument }})
        </template>
      </Column>

      <Column header="Experiencia">
        <template #body="{ data }">
          {{ data.experience?.name }}
        </template>
      </Column>

      <Column header="Acciones">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button icon="pi pi-eye" class="p-button-text" @click="verDetalle(data)"/>
            <Button icon="pi pi-pencil" class="p-button-text" @click="editar(data)"/>
            <Button icon="pi pi-trash" class="p-button-text p-button-danger" @click="confirmarEliminacion(data)"/>
          </div>
        </template>
      </Column>
    </DataTable>
    <Dialog
      v-model:visible="mostrarDialogo"
      :modal="true"
      :closable="true"
      :dismissableMask="true"
      appendTo="body"
      :header="modoEdicion ? 'Editar relación' : 'Agregar experiencia'"
      style="width: 35rem">
      <div class="field">
        <label for="member">Miembro</label>
        <InputText v-if="modoEdicion" :modelValue="formulario.member.label" disabled/>
        <AutoComplete
          v-else
          v-model="formulario.member"
          :suggestions="sugerenciasMiembro"
          @complete="buscarMiembro"
          field="label"
        />

      </div>
      <div class="field">
        <label for="experience">Experiencia</label>
        <AutoComplete v-model="formulario.experience" :suggestions="sugerenciasExperiencia"
                      @complete="buscarExperiencia" field="label"/>
      </div>

      <div class="flex justify-content-end mt-3">
        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="cerrarDialogo"/>
        <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="guardar"/>
      </div>
    </Dialog>


    <Dialog
      v-model:visible="mostrarDetalle"
      header="Detalle"
      :modal="true"
      appendTo="body"
      style="width: 30rem"
      :closable="true"
      :dismissableMask="true"
    >

      <div class="mb-2"><strong>Miembro:</strong> {{ seleccionado.member?.lastname }} {{ seleccionado.member?.name }}
        ({{ seleccionado.member?.dniDocument }})
      </div>
      <div class="mb-2"><strong>Experiencia:</strong> {{ seleccionado.experience?.name }}</div>
      <div class="mt-4 text-sm">
        <div><strong>Acción:</strong> {{ seleccionado.audi_action }}</div>
        <div><strong>Fecha:</strong> {{ seleccionado.audi_date }}</div>
        <div><strong>Usuario:</strong> {{ seleccionado.audi_user }}</div>
      </div>
      <Button label="Cerrar" icon="pi pi-times" class="p-button-text mt-3" @click="mostrarDetalle = false"/>
    </Dialog>


  </div>


</template>

<script setup>
import {ref, onMounted, computed, nextTick} from 'vue';
import {useToast} from 'primevue/usetoast';
import {useConfirm} from 'primevue/useconfirm';
import memberExperienceService from '@/services/memberExperience.service';
import {getComboMembers, getComboExperiences} from '@/services/combo.service'
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputSwitch from 'primevue/inputswitch';
import InputText from 'primevue/inputtext';
import Dialog from 'primevue/dialog';
import AutoComplete from 'primevue/autocomplete';


const relaciones = ref([]);
const verTodos = ref(false);
const filtroMiembro = ref('');
const filtroExperiencia = ref('');

const relacionesFiltradas = computed(() => {
  return relaciones.value.filter((r) => {
    if (!verTodos.value && !r && r.audi_action === 'D') return false;

    const miembroTexto = `${r.member?.lastname ?? ''} ${r.member?.name ?? ''} ${r.member?.dniDocument ?? ''}`.toLowerCase();
    const experienciaTexto = `${r.experience?.name ?? ''}`.toLowerCase();

    return miembroTexto.includes(filtroMiembro.value.toLowerCase()) &&
      experienciaTexto.includes(filtroExperiencia.value.toLowerCase());
  });
});

const mostrarDialogo = ref(false);
const mostrarDetalle = ref(false);
const seleccionado = ref({});
const modoEdicion = ref(false);
const formulario = ref({member: null, experience: null});

const sugerenciasMiembro = ref([]);
const sugerenciasExperiencia = ref([]);
const toast = useToast();
const confirm = useConfirm();

const cargarRelaciones = async () => {
  try {
    const res = await memberExperienceService.getAll();
    relaciones.value = res.data;
  } catch (error) {
    toast.add({severity: 'error', summary: 'Error cargando datos', detail: error.message, life: 5000});
    console.error('Error al cargar relaciones:', error);
  }
};

const nuevaRelacion = () => {
  modoEdicion.value = false;
  formulario.value = {member: null, experience: null};
  mostrarDialogo.value = true;
};

const verDetalle = (data) => {
  seleccionado.value = data;
  mostrarDetalle.value = true;
};

const editar = async (data) => {
  modoEdicion.value = true;

  formulario.value = {
    member: {
      id: data.member.id,
      label: `${data.member.lastname} ${data.member.name} (${data.member.dniDocument})`
    },
    experience: {
      id: data.experience.id,
      label: data.experience.name
    }
  };

  seleccionado.value = data;
  await buscarExperiencia({query: ''});
  await nextTick();
  mostrarDialogo.value = true;
};

const cerrarDialogo = () => {
  mostrarDialogo.value = false;
};

const guardar = async () => {
  const payload = {
    member_id: formulario.value.member.id,
    experience_id: formulario.value.experience.id
  };


  try {
    if (modoEdicion.value) {
      await memberExperienceService.update(seleccionado.value.id, payload);
      toast.add({severity: 'success', summary: 'Actualizado correctamente', life: 3000});
    } else {
      await memberExperienceService.create(payload);
      toast.add({severity: 'success', summary: 'Registrado correctamente', life: 3000});
    }
    mostrarDialogo.value = false;
    await cargarRelaciones();
  } catch (error) {
    if (error.response?.status === 409 && error.response.data?.duplicate) {
      toast.add({severity: 'warn', summary: 'Ya existe esta relación', life: 4000});
    } else {
      toast.add({severity: 'error', summary: 'Error al guardar', detail: error.message, life: 4000});
    }
  }
};

const confirmarEliminacion = (data) => {
  confirm.require({
    message: '¿Está seguro de eliminar esta experiencia de los datos?',
    header: 'Confirmar eliminación',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Sí, eliminar',
    rejectLabel: 'No, cancelar',
    acceptClass: 'p-button-danger',
    rejectClass: 'p-button-secondary',
    accept: async () => {
      await memberExperienceService.remove(data.id);
      toast.add({severity: 'success', summary: 'Eliminado correctamente', life: 3000});
      await cargarRelaciones();
    }
  });
};

const buscarMiembro = async (event) => {
  sugerenciasMiembro.value = await getComboMembers(event.query);
};

const buscarExperiencia = async (event) => {
  sugerenciasExperiencia.value = await getComboExperiences(event.query);
};

onMounted(async () => {
  await cargarRelaciones();
});

</script>

<style scoped>
.card {
  padding: 1rem;
}
</style>
