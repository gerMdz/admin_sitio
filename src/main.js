import {createApp} from 'vue';
import App from './App.vue';
import router from './router';
import store from "@/stores/index.js";

import PrimeVue from 'primevue/config';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import ToastService from 'primevue/toastservice';
import DialogService from 'primevue/dialogservice';
import 'primevue/resources/themes/saga-blue/theme.css';
import Aura from '@primeuix/themes/aura';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import '@/assets/sakai/styles.scss';
import Toast from 'primevue/toast';

// import 'primevue/resources/themes/sakai/theme.css';




import ConfirmationService from 'primevue/confirmationservice';



const app = createApp(App);

app.use(router);
app.use(store);

app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark'
        }
    }
});
app.use(ToastService);
app.use(DialogService);

app.component('Button', Button);
app.component('InputText', InputText);
app.component('Password', Password);
app.use(ConfirmationService);
app.component('Toast', Toast);

app.mount('#app');
