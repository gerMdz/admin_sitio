import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';


export function useLogout() {
const router = useRouter();
const toast = useToast();

const logout = () => {
localStorage.removeItem('token');
toast.add({ severity: 'success', summary: 'Logout', detail: 'Sesión cerrada', life: 3000 });
router.push('/login');
};

return { logout };
}
