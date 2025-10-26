<template>
  <div class="card">
    <div class="flex justify-content-between align-items-center mb-3">
      <h2>¿Quiénes completaron el formulario?</h2>


      <div class="flex align-items-center gap-2">
        <ToggleSwitch v-model="verTodos"/>
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
      <Dropdown
        v-model="filtroCategoria"
        :options="opcionesCategoriaFiltro"
        optionLabel="label"
        optionValue="value"
        placeholder="Filtrar por categoría"
        class="w-18rem"
        :showClear="true"
      />
      <Button icon="pi pi-times" label="Limpiar" class="p-button-secondary p-button-sm" @click="limpiarFiltros"/>

    </div>
    <DataTable
      :value="miembrosFiltrados" paginator :rows="10" responsiveLayout="scroll"
      :rowsPerPageOptions="[10, 20, 50]"
    >
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
      <Column field="category" header="Categoría" sortable/>

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
          <Button icon="pi pi-eye" class="p-button-text" @click="verDetalle(slotProps.data.id)"/>
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

    <!-- Dialog para editar miembro -->
    <Dialog
      v-model:visible="dialogVisible"
      modal
      header="Editar Miembro"
      :style="{ width: '800px', maxWidth: '90vw' }"
      :closable="false"
      class="p-fluid member-edit-dialog"
    >
      <div class="p-fluid">
        <div class="grid formgrid">
          <div class="col-6">
            <div class="field">
              <label for="name">Nombre</label>
              <InputText id="name" v-model="miembroActual.name" required autofocus/>
            </div>
          </div>
          <div class="col-6">
            <div class="field">
              <label for="lastname">Apellido</label>
              <InputText id="lastname" v-model="miembroActual.lastname" required/>
            </div>
          </div>
          <div class="col-6">
            <div class="field">
              <label for="birthdate">Fecha de nacimiento</label>
              <Calendar id="birthdate" v-model="miembroActual.birthdate" dateFormat="dd/mm/yy"/>
            </div>
          </div>
          <div class="col-6">
            <div class="field">
              <label for="dni_document">DNI</label>
              <InputText id="dni_document" v-model="miembroActual.dni_document" required/>
            </div>
          </div>
          <div class="col-6">
            <div class="field">
              <label for="email">Email</label>
              <InputText id="email" v-model="miembroActual.email"/>
            </div>
          </div>
          <div class="col-6">
            <div class="field">
              <label for="phone">Teléfono</label>
              <InputText id="phone" v-model="miembroActual.phone"/>
            </div>
          </div>
          <div class="col-6">
            <div class="field">
              <label for="name_profession">Profesión</label>
              <InputText id="name_profession" v-model="miembroActual.name_profession"/>
            </div>
          </div>
          <div class="col-6">
            <div class="field">
              <label for="boss_family">Jefe de familia</label>
              <div class="flex align-items-center">
                <InputSwitch id="boss_family" v-model="miembroActual.boss_family"/>
                <span class="ml-2">{{ miembroActual.boss_family ? 'Sí' : 'No' }}</span>
              </div>
            </div>
          </div>
          <div class="col-12">
            <div class="field">
              <label for="artistic_skills">Habilidades artísticas</label>
              <Textarea id="artistic_skills" v-model="miembroActual.artistic_skills" rows="3"/>
            </div>
          </div>
          <div class="col-6">
            <div class="field">
              <label for="quantity_sons">Cantidad de hijos</label>
              <InputNumber id="quantity_sons" v-model="miembroActual.quantity_sons"/>
            </div>
          </div>
          <div class="col-6">
            <div class="field">
              <label for="celebracion">Celebración</label>
              <Dropdown id="celebracion" v-model="miembroActual.celebracion" :options="opcionesCelebracion" optionLabel="label" optionValue="value" placeholder="Seleccione una opción" :showClear="true"/>
            </div>
          </div>
          <div class="col-6">
            <div class="field">
              <label for="name_guia">Nombre del guía</label>
              <InputText id="name_guia" v-model="miembroActual.name_guia"/>
            </div>
          </div>
          <div class="col-6">
            <div class="field">
              <label for="name_group">Nombre del grupo</label>
              <InputText id="name_group" v-model="miembroActual.name_group"/>
            </div>
          </div>
          <div class="col-6">
            <div class="field">
              <label for="grupo">¿Asiste a un Grupo Pequeño?</label>
              <Dropdown id="grupo" v-model="miembroActual.grupo" :options="opcionesSiNo" optionLabel="label" optionValue="value" placeholder="Seleccione una opción" :showClear="true"/>
            </div>
          </div>
          <div class="col-6">
            <div class="field">
              <label for="participate_gp">¿Le gustaría participar?</label>
              <Dropdown id="participate_gp" v-model="miembroActual.participate_gp" :options="opcionesSiNo" optionLabel="label" optionValue="value" placeholder="Seleccione una opción" :showClear="true" :disabled="miembroActual.grupo === 'si'"/>
            </div>
          </div>
          <div class="col-6">
            <div class="field">
              <label for="genderId">Género</label>
              <Dropdown id="genderId" v-model="miembroActual.gender_id" :options="genders" optionLabel="name" optionValue="id" placeholder="Seleccione un género" :showClear="true"/>
            </div>
          </div>
          <div class="col-6">
            <div class="field">
              <label for="civilStateId">Estado Civil</label>
              <Dropdown id="civilStateId" v-model="miembroActual.civil_state_id" :options="civilStates" optionLabel="name" optionValue="id" placeholder="Seleccione un estado civil" :showClear="true"/>
            </div>
          </div>
          <div class="col-6">
            <div class="field">
              <label for="categoryId">Categoría</label>
              <Dropdown id="categoryId" v-model="miembroActual.category_id" :options="categories" optionLabel="nombre" optionValue="id" placeholder="Seleccione una categoría" :showClear="true"/>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="dialogVisible = false"/>
        <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="guardarMiembro"/>
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
import {getGenders} from '@/services/genderService.service';
import {getCivilStates} from '@/services/civilStateService.service';
import { getCategories } from '@/services/categoryService.service';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import ToggleSwitch from 'primevue/toggleswitch';
import InputSwitch from 'primevue/inputswitch';
import Calendar from 'primevue/calendar';
import Textarea from 'primevue/textarea';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';

import {useConfirm} from 'primevue/useconfirm';
import ModalVerDetallesMember from '@/components/ModalVerDetallesMember.vue';

export default {
  components: {
    DataTable,
    Column,
    Dialog,
    InputText,
    Button,
    ToggleSwitch,
    InputSwitch,
    Calendar,
    Textarea,
    InputNumber,
    Dropdown,
    ModalVerDetallesMember,
  },
  methods: {
    verDetalle(id) {
      this.$router.push({name: 'MemberShow', params: {id}});
    }
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
    const filtroCategoria = ref(null);
    const genders = ref([]);
    const civilStates = ref([]);
    const categories = ref([]);

    const opcionesCategoriaFiltro = computed(() => {
      const opts = categories.value.map(c => ({ label: c.nombre, value: String(c.id) }))
      return [
        { label: 'Sin categoría', value: 'none' },
        ...opts
      ]
    });

    const opcionesCelebracion = ref([
      { label: 'Presencial', value: 'presencial' },
      { label: 'Virtual', value: 'virtual' }
    ]);

    const opcionesSiNo = ref([
      { label: 'Sí', value: 'si' },
      { label: 'No', value: 'no' }
    ]);


    const miembrosFiltrados = computed(() => {
      return miembros.value.filter(m => {
        const activo = verTodos.value || !m.audiAction || m.audiAction !== 'D';
        const coincideNombre = !filtroNombre.value || m.name?.toLowerCase().includes(filtroNombre.value.toLowerCase());
        const coincideApellido = !filtroApellido.value || m.lastname?.toLowerCase().includes(filtroApellido.value.toLowerCase());
        const coincideDni = !filtroDni.value || m.dniDocument?.includes(filtroDni.value);
        const coincideEmail = !filtroEmail.value || m.email?.toLowerCase().includes(filtroEmail.value.toLowerCase());
        const coincideCategoria = !filtroCategoria.value
          || (filtroCategoria.value === 'none' && (m.categoryId === null || m.categoryId === undefined || m.categoryId === '' ))
          || (String(m.categoryId) === String(filtroCategoria.value));
        return activo && coincideNombre && coincideApellido && coincideDni && coincideEmail && coincideCategoria;
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
      miembroActual.value = {
        id: null,
        name: '',
        lastname: '',
        birthdate: null,
        dni_document: '',
        email: '',
        phone: '',
        name_profession: '',
        artistic_skills: '',
        boss_family: false,
        quantity_sons: null,
        celebracion: '',
        name_guia: '',
        name_group: '',
        grupo: '',
        participate_gp: '',
        gender_id: null,
        civil_state_id: null,
        category_id: null
      };
      dialogVisible.value = true;
    };

    const editarMiembro = (miembro) => {
      // Map camelCase properties to snake_case for the form
      miembroActual.value = {
        id: miembro.id,
        name: miembro.name,
        lastname: miembro.lastname,
        birthdate: miembro.birthdate,
        dni_document: miembro.dniDocument,
        email: miembro.email,
        phone: miembro.phone,
        name_profession: miembro.nameProfession,
        artistic_skills: miembro.artisticSkills,
        boss_family: miembro.bossFamily,
        quantity_sons: miembro.quantitySons,
        celebracion: miembro.celebracion,
        name_guia: miembro.nameGuia,
        name_group: miembro.nameGroup,
        grupo: miembro.grupo,
        participate_gp: miembro.participateGp,
        gender_id: miembro.genderId,
        civil_state_id: miembro.civilStateId,
        category_id: miembro.categoryId ?? null
      };
      dialogVisible.value = true;
    };

    const limpiarFiltros = () => {
      filtroNombre.value = '';
      filtroApellido.value = '';
      filtroDni.value = '';
      filtroEmail.value = '';
      filtroCategoria.value = null;
    };


    const guardarMiembro = async () => {
      if (!miembroActual.value.name.trim() || !miembroActual.value.lastname.trim() || !miembroActual.value.dni_document.trim()) {
        toast.add({
          severity: 'warn',
          summary: 'Campos requeridos',
          detail: 'Nombre, apellido y DNI son obligatorios.',
          life: 3000
        });
        return;
      }

      // Map snake_case properties to camelCase for the API
      const payload = {
        name: miembroActual.value.name,
        lastname: miembroActual.value.lastname,
        birthdate: miembroActual.value.birthdate,
        dniDocument: miembroActual.value.dni_document,
        email: miembroActual.value.email,
        phone: miembroActual.value.phone,
        nameProfession: miembroActual.value.name_profession,
        artisticSkills: miembroActual.value.artistic_skills,
        bossFamily: miembroActual.value.boss_family ? 1 : 0,
        quantitySons: miembroActual.value.quantity_sons,
        celebracion: miembroActual.value.celebracion,
        nameGuia: miembroActual.value.name_guia,
        nameGroup: miembroActual.value.name_group,
        grupo: miembroActual.value.grupo,
        participateGp: miembroActual.value.participate_gp,
        genderId: miembroActual.value.gender_id,
        civilStateId: miembroActual.value.civil_state_id,
        categoryId: miembroActual.value.category_id ?? null,
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


    const cargarGenders = async () => {
      try {
        const data = await getGenders();
        genders.value = data;
      } catch (error) {
        console.error('Error cargando géneros', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar géneros.', life: 3000 });
      }
    };

    const cargarCivilStates = async () => {
      try {
        const data = await getCivilStates();
        civilStates.value = data;
      } catch (error) {
        console.error('Error cargando estados civiles', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar estados civiles.', life: 3000 });
      }
    };

    const cargarCategorias = async () => {
      try {
        const data = await getCategories({ activo: 'true' });
        categories.value = Array.isArray(data) ? data : [];
      } catch (error) {
        console.error('Error cargando categorías', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar categorías.', life: 3000 });
      }
    };

    onMounted(async () => {
      await cargarMiembros();
      await cargarGenders();
      await cargarCivilStates();
      await cargarCategorias();
    });

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
      filtroCategoria,
      opcionesCategoriaFiltro,
      limpiarFiltros,
      estadoClase,
      opcionesCelebracion,
      opcionesSiNo,
      genders,
      civilStates,
      categories
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

/* Estilos para el diálogo de edición */
.member-edit-dialog .p-dialog-content {
  padding: 1.5rem;
}

.member-edit-dialog .field {
  margin-bottom: 1.5rem;
}

.member-edit-dialog label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: block;
}

.member-edit-dialog .p-inputtext,
.member-edit-dialog .p-dropdown,
.member-edit-dialog .p-calendar,
.member-edit-dialog .p-inputnumber,
.member-edit-dialog .p-textarea {
  width: 100%;
}

.member-edit-dialog .p-dialog-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #dee2e6;
}

.member-edit-dialog .grid {
  row-gap: 0.5rem;
}
</style>
