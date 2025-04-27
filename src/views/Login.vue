<template>
  <div class="flex justify-center items-center min-h-screen">
    <div class="p-8 shadow-lg rounded-lg bg-white w-96">
      <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="field mb-4">
          <label for="email">Email</label>
          <InputText id="email" v-model="email" class="w-full" />
        </div>
        <div class="field mb-4">
          <label for="password">Contraseña</label>
          <Password id="password" v-model="password" toggleMask class="w-full" />
        </div>
        <Button label="Iniciar Sesión" type="submit" class="w-full p-button-primary" />
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import api from '@/api/axios';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';

export default {
  components: {
    InputText,
    Password,
    Button
  },
  setup() {
    const email = ref('');
    const password = ref('');
    const store = useStore();
    const router = useRouter();
    const toast = useToast();

    const handleLogin = async () => {
      try {
        const response = await api.post('/login_check', {
          email: email.value,
          password: password.value,
        });

        const token = response.data.token;
        const user = response.data.user;

        store.dispatch('saveSession', { user, token });

        toast.add({ severity: 'success', summary: 'Bienvenido', detail: 'Inicio de sesión correcto.', life: 3000 });
        router.push('/panel');
      } catch (error) {
        console.error(error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Credenciales incorrectas.', life: 3000 });
      }
    };

    return {
      email,
      password,
      handleLogin
    };
  }
};
</script>
