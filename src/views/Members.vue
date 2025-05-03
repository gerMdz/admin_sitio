<template>


  <div class="card">
    <div class="flex justify-content-between align-items-center mb-3">
      <h2>¿Quiénes completaron el formulario?</h2>


      <div class="flex align-items-center gap-2">
        <InputSwitch v-model="verTodos"/>
        <span>{{ verTodos ? 'Mostrar todos' : 'Mostrar activos' }}</span>
        <Button label="Nuevo Miembro" icon="pi pi-plus" class="p-button-success ml-3" @click="nuevoMiembro"/>
      </div>
    </div>
    <p>Total miembros: {{ miembros.length }}</p>
    <div class="flex gap-3 mt-2">
      <InputText v-model="filtroNombre" placeholder="Filtrar por nombre" class="w-15rem"/>
      <InputText v-model="filtroApellido" placeholder="Filtrar por apellido" class="w-15rem"/>
      <InputText v-model="filtroDni" placeholder="Filtrar por DNI" class="w-15rem"/>
      <InputText v-model="filtroEmail" placeholder="Filtrar por email" class="w-15rem"/>
      <Button icon="pi pi-times" label="Limpiar" class="p-button-secondary p-button-sm" @click="limpiarFiltros"/>

    </div>
    <DataTable :value="miembrosFiltrados" paginator rows="10" responsiveLayout="scroll">
      <Column field="name" header="Nombre" sortable/>
      <Column field="lastname" header="Apellido" sortable/>
      <Column header="Nacimiento">
        <template #body="slotProps">
          {{ formatearFecha(slotProps.data.birthdate) }}
        </template>
      </Column>
      <Column field="dniDocument" header="DNI" sortable/>
      <Column field="email" header="Email" sortable/>
      <Column field="phone" header="Teléfono" sortable/>
      <Column field="address" header="Dirección" sortable/>
      <Column field="civilState" header="Estado civil" sortable/>
      <Column field="gender" header="Género">
        <template #body="slotProps">
          {{
            slotProps.data.relatedMember && slotProps.data.audiAction !== 'U'
                ? '—'
                : slotProps.data.gender || '—'
          }}
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
          <Button icon="pi pi-pencil" class="p-button-text p-button-sm" @click="editarMiembro(slotProps.data)"/>
          <Button icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger"
                  @click="eliminarMiembro(slotProps.data)"/>
          <Button icon="pi pi-eye" class="p-button-text p-button-sm" @click="verDetallesMiembro(slotProps.data)"/>
        </template>
      </Column>
    </DataTable>

    <ModalVerDetallesMember
        v-model:visible="modalVisible"
        :datos="datosDetalles"
    />

    <Dialog
        :visible="visible"
        @update:visible="$emit('update:visible', $event)"
        modal
        dismissableMask
        header="Detalles del miembro"
        :style="{ width: '500px' }"
    >
      <div v-if="datos" class="p-fluid">
        <div class="field">
          <label>Nombre</label>
          <p class="p-inputtext">{{ datos.name }}</p>
        </div>

        <div class="field">
          <label>Apellido</label>
          <p class="p-inputtext">{{ datos.lastname }}</p>
        </div>

        <div class="field">
          <label>Fecha de nacimiento</label>
          <p class="p-inputtext">{{ formatearFecha(datos.birthdate) }}</p>
        </div>

        <div class="field">
          <label>DNI</label>
          <p class="p-inputtext">{{ datos.dni_document }}</p>
        </div>

        <div class="field">
          <label>Email</label>
          <p class="p-inputtext">{{ datos.email }}</p>
        </div>

        <div class="field">
          <label>Teléfono</label>
          <p class="p-inputtext">{{ datos.phone }}</p>
        </div>

        <div class="field">
          <label>Dirección</label>
          <p class="p-inputtext">{{ datos.address }}</p>
        </div>

        <div class="field">
          <label>Género</label>
          <p class="p-inputtext">
            {{
              datos.relatedMember === true && datos.audiAction !== 'U'
                  ? '—'
                  : datos.gender || '—'
            }}
          </p>
        </div>



        <div class="field">
          <label>Estado civil</label>
          <p class="p-inputtext">{{ datos.civilState }}</p>
        </div>

        <div class="field">
          <label>Fecha de auditoría</label>
          <p class="p-inputtext">{{ formatearFechaHora(datos.audi_date) }}</p>
        </div>

        <div class="field" v-if="datos.audi_user">
          <label>Registrado por</label>
          <p class="p-inputtext">{{ datos.audi_user.nombre }} ({{ datos.audi_user.email }})</p>
        </div>
      </div>

      <template #footer>
        <Button label="Cerrar" icon="pi pi-times" class="p-button-text" @click="$emit('update:visible', false)"/>
      </template>
    </Dialog>

  </div>
</template>

<script>
import {ref, onMounted, computed} from 'vue';
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

import {useConfirm} from 'primevue/useconfirm';
import ModalVerDetallesMember from '@/components/ModalVerDetallesMember.vue';

export default {
  components: {
    DataTable,
    Column,
    Dialog,
    InputText,
    Button,
    InputSwitch,

    ModalVerDetallesMember,
  },
  setup() {
    const miembros = ref([]);
    const miembroActual = ref({id: null, name: '', lastname: ''});
    const dialogVisible = ref(false);
    const verTodos = ref(false);
    const store = useStore();
    const toast = useToast();
    const auditId = store.state.user?.auditId || null;
    const modalVisible = ref(false);
    const datosDetalles = ref(null);
    const filtroNombre = ref('');
    const filtroApellido = ref('');
    const filtroDni = ref('');
    const filtroEmail = ref('');


    const miembrosFiltrados = computed(() => {
      return miembros.value.filter(m => {
        const activo = verTodos.value || !m.audiAction || m.audiAction !== 'D';
        const coincideNombre = !filtroNombre.value || m.name?.toLowerCase().includes(filtroNombre.value.toLowerCase());
        const coincideApellido = !filtroApellido.value || m.lastname?.toLowerCase().includes(filtroApellido.value.toLowerCase());
        const coincideDni = !filtroDni.value || m.dniDocument?.includes(filtroDni.value);
        const coincideEmail = !filtroEmail.value || m.email?.toLowerCase().includes(filtroEmail.value.toLowerCase());
        return activo && coincideNombre && coincideApellido && coincideDni && coincideEmail;
      });
    });

    const estadoClase = (item) => {
      return item.audiAction === 'D' ? 'text-red-400' : 'text-green-600';
    };


    const cargarMiembros = async () => {
      try {
        const response = await api.get('/members');
        miembros.value = response.data;
      } catch (error) {
        toast.add({severity: 'error', summary: 'Error', detail: 'Error al cargar miembros.', life: 3000});
      }
    };

    const nuevoMiembro = () => {
      miembroActual.value = {id: null, name: '', lastname: ''};
      dialogVisible.value = true;
    };

    const editarMiembro = (miembro) => {
      miembroActual.value = {...miembro};
      dialogVisible.value = true;
    };

    const limpiarFiltros = () => {
      filtroNombre.value = '';
      filtroApellido.value = '';
      filtroDni.value = '';
      filtroEmail.value = '';
    };


    const guardarMiembro = async () => {
      if (!miembroActual.value.name.trim() || !miembroActual.value.lastname.trim()) {
        toast.add({
          severity: 'warn',
          summary: 'Campos requeridos',
          detail: 'Nombre y apellido son obligatorios.',
          life: 3000
        });
        return;
      }

      const payload = {
        name: miembroActual.value.name,
        lastname: miembroActual.value.lastname,
        audi_user: auditId,
        audi_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
        audi_action: miembroActual.value.id ? 'U' : 'I',
      };

      try {
        if (miembroActual.value.id) {
          await api.put(`/members/${miembroActual.value.id}`, payload);
          toast.add({severity: 'success', summary: 'Actualizado', detail: 'Miembro actualizado.', life: 3000});
        } else {
          await api.post('/members', payload);
          toast.add({severity: 'success', summary: 'Creado', detail: 'Miembro creado.', life: 3000});
        }

        dialogVisible.value = false;
        await cargarMiembros();
      } catch (error) {
        toast.add({severity: 'error', summary: 'Error', detail: 'Error al guardar miembro.', life: 3000});
      }
    };

    const confirm = useConfirm();
    const eliminarMiembro = (miembro) => {
      confirm.require({
        message: '¿Está seguro que desea eliminar este miembro?',
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
            await api.delete(`/members/${miembro.id}`, {data: payload});
            toast.add({severity: 'success', summary: 'Eliminado', detail: 'Miembro eliminado.', life: 3000});
            await cargarMiembros();
          } catch (error) {
            toast.add({severity: 'error', summary: 'Error', detail: 'Error al eliminar miembro.', life: 3000});
          }
        },
        reject: () => {
          toast.add({severity: 'info', summary: 'Cancelado', detail: 'Eliminación cancelada.', life: 3000});
        }
      });
    };

    const verDetallesMiembro = async (miembro) => {
      try {
        const response = await api.get(`/members/${miembro.id}`);
        datosDetalles.value = response.data;
        modalVisible.value = true;
      } catch (error) {
        toast.add({severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los detalles.', life: 3000});
      }
    };

    const formatearFecha = (iso) => {
      if (!iso) return '';
      if (iso === '-0001-11-30') return '';
      console.log(iso)
      const [year, month, day] = iso.split('T')[0].split('-');
      return `${day}/${month}/${year}`;
    };

    const formatearFechaHora = (iso) => {
      if (!iso) return '';
      const date = new Date(iso);
      return date.toLocaleString('es-AR', {
        dateStyle: 'short',
        timeStyle: 'short',
      });
    };


    onMounted(cargarMiembros);

    return {
      miembros,
      miembroActual,
      dialogVisible,
      verTodos,
      miembrosFiltrados,
      nuevoMiembro,
      editarMiembro,
      guardarMiembro,
      eliminarMiembro,
      confirm,
      modalVisible,
      datosDetalles,
      verDetallesMiembro,
      formatearFecha,
      formatearFechaHora,
      filtroApellido,
      filtroDni,
      filtroEmail,
      filtroNombre,
      limpiarFiltros,
      estadoClase

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
