<template>
  <div>
    <Button label="Cerrar Sesión" icon="pi pi-sign-out" @click="logout" class="p-button-danger" />
  </div>
</template>

<script>
import { useLogout } from '@/composables/logout';

export default {
  setup() {
    const { logout } = useLogout();
    return { logout };
  },
};
</script>
