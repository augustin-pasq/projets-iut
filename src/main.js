import './assets/main.css'

import "primeflex/primeflex.css"
import "primevue/resources/themes/lara-light-blue/theme.css";
import "primevue/resources/primevue.min.css";
import 'primeicons/primeicons.css';
import Tooltip from 'primevue/tooltip';

import { createApp } from 'vue'
import PrimeVue from 'primevue/config';

import App from './App.vue'

const app = createApp(App);

app.use(PrimeVue);
app.directive('tooltip', Tooltip);
app.mount('#app')
