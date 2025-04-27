<template>
  <ConfirmDialog
      :draggable="false"
      :closable="false"
      :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
      class="p-confirm-dialog-custom"
  />


  <div class="card">
    <div class="flex justify-content-between align-items-center mb-3">
      <h2>¿Has utilizado alguno de estos servicios?</h2>
      <div class="flex align-items-center gap-2">
        <InputSwitch v-model="verTodos"/>
        <span>{{ verTodos ? 'Mostrar todos' : 'Mostrar activos' }}</span>
        <Button label="Nuevo Servicio" icon="pi pi-plus" class="p-button-success ml-3" @click="nuevoServicio"/>
      </div>
    </div>

    <DataTable :value="serviciosFiltrados" paginator rows="10" responsiveLayout="scroll">
      <Column field="name" header="Nombre" sortable></Column>
      <Column field="audiAction" header="Estado">
        <template #body="slotProps">
          <span v-if="slotProps.data.audiAction === 'D'" class="text-red-500 font-semibold">Eliminado</span>
          <span v-else>Activo</span>
        </template>
      </Column>
      <Column header="Acciones">
        <template #body="slotProps">
          <Button icon="pi pi-pencil" class="p-button-text p-button-sm" @click="editarServicio(slotProps.data)"/>
          <Button icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger"
                  @click="eliminarServicio(slotProps.data)"/>
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="dialogVisible" modal header="Servicio" :style="{ width: '400px' }">
      <div class="p-fluid">
        <div class="field">
          <label>Nombre</label>
          <InputText v-model="servicioActual.name"/>
        </div>
      </div>

      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="dialogVisible = false"/>
        <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="guardarServicio"/>
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
import InputSwitch from 'primevue/inputswitch';
import ConfirmDialog from 'primevue/confirmdialog';
import {useConfirm} from 'primevue/useconfirm';


export default {
  components: {
    DataTable,
    Column,
    Dialog,
    InputText,
    Button,
    InputSwitch,
    ConfirmDialog
  },
  setup() {
    const servicios = ref([]);
    const servicioActual = ref({id: null, name: ''});
    const dialogVisible = ref(false);
    const verTodos = ref(false);
    const store = useStore();
    const toast = useToast();

    const auditId = store.state.user?.auditId || null;

    const serviciosFiltrados = useFiltrarActivos(servicios, verTodos);

    const cargarServicios = async () => {
      try {
        const response = await api.get('/services');
        servicios.value = response.data;
      } catch (error) {
        console.error('Error cargando servicios', error);
        toast.add({severity: 'error', summary: 'Error', detail: 'Error al cargar servicios.', life: 3000});
      }
    };

    const nuevoServicio = () => {
      servicioActual.value = {id: null, name: ''};
      dialogVisible.value = true;
    };

    const editarServicio = (servicio) => {
      servicioActual.value = {...servicio};
      dialogVisible.value = true;
    };

    const guardarServicio = async () => {
      if (!servicioActual.value.name.trim()) {
        toast.add({severity: 'warn', summary: 'Campo requerido', detail: 'El nombre es obligatorio.', life: 3000});
        return;
      }

      const payload = {
        name: servicioActual.value.name,
        audi_user: auditId,
        audi_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
        audi_action: servicioActual.value.id ? 'U' : 'I',
      };

      try {
        if (servicioActual.value.id) {
          await api.put(`/services/${servicioActual.value.id}`, payload);
          toast.add({severity: 'success', summary: 'Actualizado', detail: 'Servicio actualizado.', life: 3000});
        } else {
          await api.post('/services', payload);
          toast.add({severity: 'success', summary: 'Creada', detail: 'Servicio creado.', life: 3000});
        }

        dialogVisible.value = false;
        await cargarServicios();
      } catch (error) {
        console.error('Error guardando servicio', error);
        toast.add({severity: 'error', summary: 'Error', detail: 'Error al guardar servicio.', life: 3000});
      }
    };

    const confirm = useConfirm();
    const eliminarServicio = (servicio) => {
      confirm.require({
        message: '¿Está seguro que desea eliminar este Servicio?',
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
            await api.delete(`/services/${servicio.id}`, {data: payload});
            toast.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: 'Servicio eliminado correctamente.',
              life: 3000
            });
            await cargarServicios();
          } catch (error) {
            console.error('Error eliminando servicio', error);
            toast.add({severity: 'error', summary: 'Error', detail: 'Error al eliminar servicio.', life: 3000});
          }
        },
        reject: () => {
          toast.add({severity: 'info', summary: 'Cancelado', detail: 'Eliminación cancelada.', life: 3000});
        }
      });
    }

    onMounted(async () => {
      await cargarServicios();
    });

    return {
      servicios,
      servicioActual,
      dialogVisible,
      verTodos,
      serviciosFiltrados,
      nuevoServicio,
      editarServicio,
      guardarServicio,
      eliminarServicio,
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