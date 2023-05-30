import './assets/main.css'

import "primeflex/primeflex.css"
import "primevue/resources/themes/lara-light-teal/theme.css";
import "primevue/resources/primevue.min.css";
import 'primeicons/primeicons.css';

import { createApp } from 'vue'
import PrimeVue from 'primevue/config';

import App from './App.vue'

const app = createApp(App);
app.use(PrimeVue);
app.mount('#app')