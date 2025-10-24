<template>
  <div class="card">
    <div class="flex justify-content-between align-items-center mb-3">
      <h2>Categorías</h2>
      <div class="flex align-items-center gap-2">
        <InputSwitch v-model="verTodos" />
        <span>{{ verTodos ? 'Mostrar todos' : 'Mostrar activos' }}</span>
        <Button label="Nueva Categoría" icon="pi pi-plus" class="p-button-success ml-3" @click="nuevaCategoria" />
      </div>
    </div>

    <div class="grid mb-3">
      <div class="col-12 md:col-4">
        <span class="p-float-label w-full">
          <InputText id="f-nombre" v-model="filtros.nombre" class="w-full" />
          <label for="f-nombre">Filtrar por nombre</label>
        </span>
      </div>
      <div class="col-12 md:col-4">
        <span class="p-float-label w-full">
          <InputText id="f-descripcion" v-model="filtros.descripcion" class="w-full" />
          <label for="f-descripcion">Filtrar por descripción</label>
        </span>
      </div>
      <div class="col-12 md:col-4 flex align-items-end gap-2">
        <Button label="Buscar" icon="pi pi-search" @click="cargarCategorias" />
        <Button label="Limpiar" icon="pi pi-filter-slash" class="p-button-secondary" @click="limpiarFiltros" />
      </div>
    </div>

    <DataTable :value="categorias" paginator rows="10" responsiveLayout="scroll">
      <Column field="nombre" header="Nombre" sortable></Column>
      <Column field="descripcion" header="Descripción" sortable></Column>
      <Column field="identificador" header="Identificador" sortable></Column>
      <Column field="activo" header="Activo">
        <template #body="slotProps">
          <i v-if="slotProps.data.activo" class="pi pi-check text-green-500" />
          <i v-else class="pi pi-times text-red-500" />
        </template>
      </Column>
      <Column header="Acciones">
        <template #body="slotProps">
          <Button icon="pi pi-pencil" class="p-button-text p-button-sm" @click="editarCategoria(slotProps.data)" />
          <Button icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger" @click="eliminarCategoria(slotProps.data)" />
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="dialogVisible" modal header="Categoría" :style="{ width: '500px' }">
      <div class="p-fluid">
        <div class="field">
          <label>Nombre</label>
          <InputText v-model="categoriaActual.nombre" />
        </div>
        <div class="field">
          <label>Descripción</label>
          <InputText v-model="categoriaActual.descripcion" />
        </div>
        <div class="field">
          <label>Identificador</label>
          <InputText v-model="categoriaActual.identificador" />
        </div>
        <div class="field flex align-items-center gap-2">
          <InputSwitch v-model="categoriaActual.activo" />
          <label class="m-0">Activo</label>
        </div>
      </div>

      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="dialogVisible = false" />
        <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="guardarCategoria" />
      </template>
    </Dialog>

    <ConfirmDialog />
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import InputSwitch from 'primevue/inputswitch'
import ConfirmDialog from 'primevue/confirmdialog'
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/services/categoryService.service'

export default {
  components: { DataTable, Column, Dialog, InputText, Button, InputSwitch, ConfirmDialog },
  setup() {
    const categorias = ref([])
    const categoriaActual = ref({ id: null, nombre: '', descripcion: '', identificador: '', activo: true })
    const dialogVisible = ref(false)
    const verTodos = ref(false)
    const filtros = ref({ nombre: '', descripcion: '' })

    const toast = useToast()
    const confirm = useConfirm()

    const cargarCategorias = async () => {
      try {
        const params = {
          nombre: filtros.value.nombre || undefined,
          descripcion: filtros.value.descripcion || undefined,
          activo: verTodos.value ? undefined : 'true'
        }
        const data = await getCategories(params)
        categorias.value = Array.isArray(data) ? data : []
      } catch (error) {
        console.error('Error cargando categorías', error)
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar categorías.', life: 3000 })
      }
    }

    const limpiarFiltros = async () => {
      filtros.value = { nombre: '', descripcion: '' }
      await cargarCategorias()
    }

    const nuevaCategoria = () => {
      categoriaActual.value = { id: null, nombre: '', descripcion: '', identificador: '', activo: true }
      dialogVisible.value = true
    }

    const editarCategoria = (categoria) => {
      categoriaActual.value = { ...categoria }
      dialogVisible.value = true
    }

    const guardarCategoria = async () => {
      if (!categoriaActual.value.nombre.trim() || !categoriaActual.value.descripcion.trim()) {
        toast.add({ severity: 'warn', summary: 'Campos requeridos', detail: 'Nombre y descripción son obligatorios.', life: 3000 })
        return
      }

      const payload = {
        nombre: categoriaActual.value.nombre,
        descripcion: categoriaActual.value.descripcion,
        identificador: categoriaActual.value.identificador || null,
        activo: !!categoriaActual.value.activo
      }

      try {
        if (categoriaActual.value.id) {
          await updateCategory(categoriaActual.value.id, payload)
          toast.add({ severity: 'success', summary: 'Actualizada', detail: 'Categoría actualizada.', life: 3000 })
        } else {
          await createCategory(payload)
          toast.add({ severity: 'success', summary: 'Creada', detail: 'Categoría creada.', life: 3000 })
        }
        dialogVisible.value = false
        await cargarCategorias()
      } catch (error) {
        console.error('Error guardando categoría', error)
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al guardar categoría.', life: 3000 })
      }
    }

    const eliminarCategoria = (categoria) => {
      confirm.require({
        message: '¿Está seguro que desea eliminar esta categoría?',
        header: 'Confirmar eliminación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí, eliminar',
        rejectLabel: 'No, cancelar',
        acceptClass: 'p-button-danger',
        rejectClass: 'p-button-secondary',
        accept: async () => {
          try {
            await deleteCategory(categoria.id)
            toast.add({ severity: 'success', summary: 'Eliminada', detail: 'Categoría eliminada.', life: 3000 })
            await cargarCategorias()
          } catch (error) {
            console.error('Error eliminando categoría', error)
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar categoría.', life: 3000 })
          }
        }
      })
    }

    watch(verTodos, async () => {
      await cargarCategorias()
    })

    onMounted(async () => {
      await cargarCategorias()
    })

    return {
      categorias,
      categoriaActual,
      dialogVisible,
      verTodos,
      filtros,
      cargarCategorias,
      limpiarFiltros,
      nuevaCategoria,
      editarCategoria,
      guardarCategoria,
      eliminarCategoria
    }
  }
}
</script>

<style scoped>
.p-confirm-dialog-custom {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  0% { opacity: 0; transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1); }
}
</style>
