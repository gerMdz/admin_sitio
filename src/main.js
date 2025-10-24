import {createApp} from 'vue';
import App from './App.vue';
import router from './router';
import store from '@/stores/index.js';

import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';

import '@/assets/styles.scss';
import Tooltip from 'primevue/tooltip';
import ToastService from 'primevue/toastservice';
import DialogService from 'primevue/dialogservice';
import ConfirmationService from 'primevue/confirmationservice';
import StyleClass from 'primevue/styleclass';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Toast from 'primevue/toast';
import Dialog from 'primevue/dialog';
import ConfirmDialog from 'primevue/confirmdialog';


import {library} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {
  faHome,
  faUsersGear,
  faIdCardClip,
  faUserClock,
  faListCheck
} from '@fortawesome/free-solid-svg-icons';

library.add(faHome, faUsersGear, faIdCardClip, faUserClock, faListCheck);

import {Users, Calendar, HeartHandshake} from 'lucide-vue-next';
import {
  IconUsers,
  IconBriefcase,
  IconHeart,
  IconUserPlus
} from '@tabler/icons-vue';

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
app.use(ConfirmationService);
app.directive('styleclass', StyleClass);

app.directive('tooltip', Tooltip);

app.component('Button', Button);
app.component('InputText', InputText);
app.component('Password', Password);
app.component('Dialog', Dialog);
app.component('Toast', Toast);
app.component('ConfirmDialog', ConfirmDialog);

app.component('FontAwesomeIcon', FontAwesomeIcon);
app.component('LucideUsers', Users);
app.component('LucideCalendar', Calendar);
app.component('LucideHeartHandshake', HeartHandshake);
app.component('TablerUsers', IconUsers);
app.component('TablerBriefcase', IconBriefcase);
app.component('TablerHeart', IconHeart);
app.component('TablerUserPlus', IconUserPlus);

console.log('Usando tema: Aura');
console.log(document.querySelector(':root').style.cssText);

app.mount('#app');
