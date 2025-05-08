<template>
<!--  <ConfirmDialog-->
<!--    :draggable="false"-->
<!--    :closable="false"-->
<!--    :breakpoints="{ '960px': '75vw', '640px': '90vw' }"-->
<!--    class="p-confirm-dialog-custom"-->
<!--  />-->


  <div class="card">
    <div class="flex justify-content-between align-items-center mb-3">
      <h2>Provincias</h2>
      <div class="flex align-items-center gap-2">
        <ToggleSwitch v-model="verTodos"/>
        <span>{{ verTodos ? 'Mostrar todos' : 'Mostrar activos' }}</span>
        <Button label="Nueva Provincia" icon="pi pi-plus" class="p-button-success ml-3" @click="nuevoPais"/>
      </div>
    </div>

    <DataTable :value="provinciasFiltradas"
               paginator
               :rows="10"
               :rowsPerPageOptions="[10, 20, 50]"
               responsiveLayout="scroll"
    >
      <Column field="nombre" header="Nombre" sortable></Column>
      <Column field="pais" header="País" sortable></Column>
      <Column field="audiAction" header="Estado">
        <template #body="slotProps">
          <span v-if="slotProps.data.audiAction === 'D'" class="text-red-500 font-semibold">Eliminada</span>
          <span v-else>Activo</span>
        </template>
      </Column>
      <Column header="Acciones">
        <template #body="slotProps">
          <Button icon="pi pi-pencil" class="p-button-text p-button-sm" @click="editarProvincia(slotProps.data)"/>
          <Button icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger"
                  @click="eliminarProvincia(slotProps.data)"/>
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="dialogVisible" modal header="País" :style="{ width: '400px' }">
      <div class="p-fluid">
        <div class="field">
          <label>Nombre</label>
          <InputText v-model="provinciaActual.name"/>
        </div>
      </div>
      <div class="p-fluid">
        <div class="field">
          <label>País</label>
          <InputText v-model="provinciaActual.country"/>
        </div>
      </div>

      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="dialogVisible = false"/>
        <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="guardarProvincia"/>
      </template>
    </Dialog>
  </div>
</template>

<script>
import {ref, onMounted} from 'vue';
import {useStore} from 'vuex';
import {useToast} from 'primevue/usetoast';
import {useFiltrarActivos} from '@/composables/useFiltrarActivos';
import api from '@/api/axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import ToggleSwitch from 'primevue/toggleswitch';
import ConfirmDialog from 'primevue/confirmdialog';
import {useConfirm} from 'primevue/useconfirm';

export default {
  components: {
    DataTable,
    Column,
    Dialog,
    InputText,
    Button,
    ToggleSwitch,
    ConfirmDialog
  },
  setup() {
    const provincias = ref([]);
    const provinciaActual = ref({id: null, name: ''});
    const dialogVisible = ref(false);
    const verTodos = ref(false);
    const store = useStore();
    const toast = useToast();

    const auditId = store.state.user?.auditId || null;

    const provinciasFiltradas = useFiltrarActivos(provincias, verTodos);

    const cargarProvincias = async () => {
      try {
        const response = await api.get('/states');
        provincias.value = response.data;
      } catch (error) {
        console.error('Error cargando provincias', error);
        toast.add({severity: 'error', summary: 'Error', detail: 'Error al cargar provincia.', life: 3000});
      }
    };

    const nuevoProvincia = () => {
      provinciasActual.value = {id: null, name: '', country: ''};
      dialogVisible.value = true;
    };

    const editarProvincia = (provincia) => {
      provinciaActual.value = {...provincia};
      dialogVisible.value = true;
    };

    const guardarProvincia = async () => {
      if (!provinciaActual.value.name.trim()) {
        toast.add({severity: 'warn', summary: 'Campo requerido', detail: 'El nombre es obligatorio.', life: 3000});
        return;
      }
      if (!provinciaActual.value.country.trim()) {
        toast.add({severity: 'warn', summary: 'Campo requerido', detail: 'El país es obligatorio.', life: 3000});
        return;
      }

      const payload = {
        name: provinciaActual.value.name,
        country_id: provinciaActual.value.country,
        audi_user: auditId,
        audi_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
        audi_action: provinciaActual.value.id ? 'U' : 'I',
      };

      try {
        if (provinciaActual.value.id) {
          await api.put(`/states/${paisActual.value.id}`, payload);
          toast.add({severity: 'success', summary: 'Actualizado', detail: 'Provincia actualizada.', life: 3000});
        } else {
          await api.post('/states', payload);
          toast.add({severity: 'success', summary: 'Creada', detail: 'Provincia creada.', life: 3000});
        }

        dialogVisible.value = false;
        await cargarProvincias();
      } catch (error) {
        console.error('Error guardando provincia', error);
        toast.add({severity: 'error', summary: 'Error', detail: 'Error al guardar provincia.', life: 3000});
      }
    };

    const confirm = useConfirm();
    const eliminarProvincia = (provincia) => {
      confirm.require({
        message: '¿Está seguro que desea eliminar esta provincia?',
        header: 'Confirmar eliminación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí, eliminar',
        rejectLabel: 'No, cancelar',
        acceptClass: 'p-button-danger',
        rejectClass: 'p-button-secondary',
        accept: async () => {
          const payload = {
            audi_user: auditId,
            audi_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
          };

          try {
            await api.delete(`/states/${pais.id}`, {data: payload});
            toast.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: 'Provincia eliminada correctamente.',
              life: 3000
            });
            await cargarProvincias();
          } catch (error) {
            console.error('Error eliminando provincia', error);
            toast.add({severity: 'error', summary: 'Error', detail: 'Error al eliminar provincia.', life: 3000});
          }
        },
        reject: () => {
          toast.add({severity: 'info', summary: 'Cancelado', detail: 'Eliminación cancelada.', life: 3000});
        }
      });
    }

    onMounted(async () => {
      await cargarProvincias();
    });

    return {
      provincias,
      provinciaActual,
      dialogVisible,
      verTodos,
      provinciasFiltradas,
      nuevoProvincia,
      editarProvincia,
      guardarProvincia,
      eliminarProvincia,
      confirm,
    };
  },
};
</script>
<style scoped>
.p-confirm-dialog-custom {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
