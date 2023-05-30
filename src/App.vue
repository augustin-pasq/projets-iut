<template>
  <div class="card relative z-2">
    <Menubar :model="items">
      <template #end>
        <Button icon="pi pi-check" rounded aria-label="Filter" @click="visible = true"/>

        <Dialog v-model:visible="visible" modal header="Créer une nouvelle tâche" :style="{ width: '50vw' }">
          <form class="flex flex-column pt-2 gap-2" @submit.prevent="handleFormSubmit">
            <InputText v-model="title" placeholder="Titre"/>
            <Textarea v-model="description" autoResize rows="5" cols="30" placeholder="Description"/>
            <Calendar v-model="dateBegin" showTime hourFormat="24" placeholder="Date de début" showIcon/>
            <Calendar v-model="dateEnd" showTime hourFormat="24" placeholder="Date de fin" showIcon/>
            <Dropdown v-model="selectedState" optionLabel="name" :options="states" placeholder="État"/>
            <Dropdown v-model="selectedPriority" optionLabel="name" :options="priorities" placeholder="Priorité"/>

            <div class="flex flex-row justify-content-end pt-4">
              <Button label="Annuler" icon="pi pi-times" @click="visible = false" text />
              <Button type="submit" label="Créer la tâche" icon="pi pi-check" autofocus />
            </div>
          </form>
        </Dialog>
      </template>
    </Menubar>

  </div>
</template>

<script setup>
console.log(window.localStorage)

import Menubar from 'primevue/menubar';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Calendar from 'primevue/calendar';
import Dropdown from 'primevue/dropdown';
import {ref} from "vue";

const items = ref([
  {
    label: 'Afficher toutes les tâches',
    icon: 'pi pi-fw pi-file',
  },
  {
    label: 'Afficher les tâches par état',
    icon: 'pi pi-fw pi-pencil',
    items: [
      {
        label: 'A faire',
        icon: 'pi pi-fw pi-pencil',
      },
      {
        label: 'En cours',
        icon: 'pi pi-fw pi-pencil',
      },
      {
        label: 'Terminé',
        icon: 'pi pi-fw pi-pencil',
      }
    ]
  },
  {
    label: 'Afficher les tâches par priorité',
    icon: 'pi pi-fw pi-pencil',
    items: [
      {
        label: 'Haute',
        icon: 'pi pi-fw pi-pencil',
      },
      {
        label: 'Moyenne',
        icon: 'pi pi-fw pi-pencil',
      },
      {
        label: 'Basse',
        icon: 'pi pi-fw pi-pencil',
      }
    ]
  },
  {
    label: 'Afficher les tâches par date de début',
    icon: 'pi pi-fw pi-file',
  },
  {
    label: 'Afficher les tâches par date de fin',
    icon: 'pi pi-fw pi-file',
  },
]);

const visible = ref(false);
const title = ref();
const description = ref();
const dateBegin = ref();
const dateEnd = ref();
const selectedState = ref();
const states = ref([
  {name: 'A faire', code: 'todo'},
  {name: 'En cours', code: 'in_progress'},
  {name: 'Terminé', code: 'done'},
]);
const selectedPriority = ref();
const priorities = ref([
  {name: 'Haute', code: 'high'},
  {name: 'Moyenne', code: 'medium'},
  {name: 'Basse', code: 'low'},
]);

const handleFormSubmit = () => {
  const task = {
    title: title.value,
    description: description.value,
    dateBegin: dateBegin.value,
    dateEnd: dateEnd.value,
    selectedState: selectedState.value,
    selectedPriority: selectedPriority.value
  }

  window.localStorage.setItem(`task${window.localStorage.length + 1}`, JSON.stringify(task))

  // Réinitialiser les champs du formulaire
  title.value = "";
  description.value = "";
  dateBegin.value = null;
  dateEnd.value = null;
  selectedState.value = null;
  selectedPriority.value = null;

  // Masquer le dialogue
  visible.value = false;
}
</script>