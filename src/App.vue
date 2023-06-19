<template>
  <div class="card relative z-2 grid flex-row m-0">
    <div v-bind:class="[isOpen ? 'col-12 xl:col-3 h-screen flex flex-column justify-content-center p-0 shadow-7' : 'col-2 xl:col-3 h-screen flex flex-column justify-content-center p-0 shadow-7']">
      <Card class="h-full border-noround xl:p-6">
        <template #content>
          <div v-bind:class="[isOpen ? 'flex p-3 xl:flex flex-column justify-content-between h-full' : 'hidden xl:flex flex-column justify-content-between h-full']">
            <div class="grid justify-content-between m-0">
              <Button v-bind:class="[isOpen ? 'col-10' : 'col-12']" icon="pi pi-home" outlined label="Afficher toutes les tâches" @click="getAll"/>
              <Button v-bind:class="[isOpen ? 'col-2' : 'hidden']" icon="pi pi-bars" raised rounded aria-label="Menu" @click="displayMenu"/>
            </div>
            <div class="flex flex-column gap-2">
              <h3>Filtrer les tâches</h3>
              <MultiSelect v-model="selectedState" display="chip" :options="states" optionLabel="name"
                           placeholder="État"/>
              <MultiSelect v-model="selectedPriority" display="chip" :options="priorities" optionLabel="name"
                           placeholder="Priorité"/>
              <Calendar v-model="dateBegin" placeholder="Date de début" showIcon showButtonBar dateFormat="dd/mm/yy"
                        :minDate="minDate"/>
              <Calendar v-model="dateEnd" placeholder="Date de fin" showIcon showButtonBar dateFormat="dd/mm/yy"
                        :minDate="new Date(dateBegin)"/>
              <Button icon="pi pi-filter" label="Filtrer" @click="filter"/>
            </div>
            <Button icon="pi pi-plus" rounded label="Ajouter une tâche" @click="showDialog"/>

            <Dialog :dismissableMask="true" :draggable="false" v-model:visible="dialogVisible" modal
                    :header="mode === 'add' ? 'Créer une nouvelle tâche' : 'Modifier la tâche'" :style="{ width: '53vh' }">
              <strong  v-if="errorMessageValidation" class="text-red-lighten-1">{{ errorMessageValidation }}</strong>
              <Form class="flex flex-column pt-2 gap-2" @submit="handleFormSubmit">
                <Field name="title" v-slot="{ field, errorMessage }">
                  <InputText :class="{ 'p-invalid': errorMessage }" v-bind="field" v-model="newTask.title"
                             placeholder="Titre" :value="newTask.title"/>
                </Field>
                <Field name="description" v-slot="{ field, errorMessage }">
                  <Textarea :class="{ 'p-invalid': errorMessage }" v-bind="field" v-model="newTask.description"
                            autoResize
                            rows="5" cols="30" placeholder="Description" :value="newTask.description"/>
                </Field>
                <div class="grid">
                  <Field name="dateBegin" v-slot="{ field, errorMessage }">
                    <Calendar :class="{ 'col-6': true, 'p-invalid': errorMessage }" v-bind="field"
                              v-model="newTask.dateBegin" placeholder="Date de début" showIcon showButtonBar
                              dateFormat="dd/mm/yy" :minDate="minDate" :value="newTask.dateBegin"/>
                  </Field>
                  <Field name="dateEnd" v-slot="{ field, errorMessage }">
                    <Calendar :class="{ 'col-6': true, 'p-invalid': errorMessage }" v-bind="field"
                              v-model="newTask.dateEnd" placeholder="Date de fin" showIcon showButtonBar
                              dateFormat="dd/mm/yy" :minDate="new Date(newTask.dateBegin)" :value="newTask.dateEnd"/>
                  </Field>
                </div>
                <Field name="selectedState" v-slot="{ field, errorMessage }">
                  <Dropdown :class="{ 'p-invalid': errorMessage }" v-bind="field" v-model="newTask.selectedState"
                            optionLabel="name" :options="states" placeholder="État" :value="newTask.selectedState"/>
                </Field>
                <Field name="selectedPriority" v-slot="{ field, errorMessage }">
                  <Dropdown :class="{ 'p-invalid': errorMessage }" v-bind="field" v-model="newTask.selectedPriority"
                            optionLabel="name" :options="priorities"
                            placeholder="Priorité" :value="newTask.selectedPriority"/>
                </Field>

                <div class="flex flex-row justify-content-end pt-4">
                  <Button label="Annuler" icon="pi pi-times" @click="hideDialog" text/>
                  <Button type="submit" :label="mode === 'add' ? 'Créer la tâche' : 'Modifier la tâche'" icon="pi pi-check"/>
                </div>
              </Form>
            </Dialog>
          </div>
          <div v-bind:class="[isOpen ? 'h-full hidden xl:hidden justify-content-center align-items-center' : 'h-full flex xl:hidden justify-content-center align-items-center']">
            <Button icon="pi pi-bars" raised rounded aria-label="Menu" @click="displayMenu"/>
          </div>
        </template>
      </Card>
    </div>

    <div v-bind:class="[isOpen ? 'hidden flex-column gap-5 p-4 col-10 xl:col-9 overflow-y-scroll max-h-screen' : 'flex flex-column gap-5 p-4 col-10 xl:col-9 overflow-y-scroll max-h-screen']">
      <template v-for="task in tasks" :key="task.id">
        <Card class="py-3 xl:py-5 px-4 xl:px-6">
          <template #title>
            <div class="flex flex-row flex-wrap align-items-center column-gap-4 xl:gap-4">
              <Button icon="pi pi-check" rounded outlined @click="completeTask(task)"/>
              <h2 class="m-0 py-3">{{ task.title }}</h2>
              <Button class="w-2rem h-2rem" icon="pi pi-pencil" rounded text
                      severity="secondary" aria-label="Modifier les informations" @click="handleEdit(task)"/>
            </div>
            <div class="flex flex-row flex-wrap gap-2 pl-2 pt-1">
              <Tag icon="pi pi-calendar" :value="task.dateBegin + ' - ' + task.dateEnd"></Tag>
              <Tag icon="pi pi-info-circle" :severity="task.selectedState.severity"
                   :value="task.selectedState.name"></Tag>
              <Tag icon="pi pi-exclamation-triangle" :severity="task.selectedPriority.severity"
                   :value="task.selectedPriority.name"></Tag>
            </div>
          </template>
          <template #content>
            <p class="m-0 pl-2 pt-5 pb-3 text-lg"> {{ task.description }}</p>
          </template>
        </Card>
      </template>
    </div>
  </div>
</template>

<script>
import {reactive, ref} from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Calendar from 'primevue/calendar'
import Dropdown from 'primevue/dropdown'
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import Knob from 'primevue/knob'
import MultiSelect from "primevue/multiselect"
import {Field, Form} from 'vee-validate'
import * as yup from 'yup';
import {usePrimeVue} from "primevue/config";

let tasks = ref([])
for (let key in localStorage) if (localStorage.getItem(key) !== null) tasks.value.push(JSON.parse(localStorage.getItem(key)))

let selectedState = ref(null)
let selectedPriority = ref(null)
let dateBegin = ref()
let dateEnd = ref()

export default {
  setup() {
    const primeVue = usePrimeVue();

    primeVue.config.locale.dayNamesMin = ['lu', 'ma', 'me', 'je', 've', 'sa', 'di']
    primeVue.config.locale.monthNames = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
    primeVue.config.locale.monthNamesShort = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']
    primeVue.config.locale.today = "Aujourd'hui"
    primeVue.config.locale.clear = "Effacer"
  },
  data() {
    return {
      isOpen : ref(false),
      mode: "add",
      taskId: "",
      minDate: new Date(),
      dateBegin: dateBegin,
      dateEnd: dateEnd,
      tasks: tasks,
      dialogVisible: false,
      newTask: reactive({
        title: '',
        description: '',
        dateBegin: null,
        dateEnd: null,
        selectedState: null,
        selectedPriority: null,
      }),
      selectedState: selectedState,
      states: [
        {name: 'A faire', code: 'todo', severity: 'success'},
        {name: 'En cours', code: 'in_progress', severity: 'warning'},
        {name: 'Terminé', code: 'done', severity: 'success'},
      ],
      selectedPriority: selectedPriority,
      priorities: [
        {name: 'Haute', code: 'high', severity: 'danger'},
        {name: 'Moyenne', code: 'medium', severity: 'warning'},
        {name: 'Basse', code: 'low', severity: 'success'},
      ],
      errorMessageValidation: ""
    }
  },
  methods: {
    showDialog() {
      this.mode = "add"
      this.taskId = ""
      this.newTask.title = ''
      this.newTask.description = ''
      this.newTask.dateBegin = null
      this.newTask.dateEnd = null
      this.newTask.selectedState = null
      this.newTask.selectedPriority = null

      this.isOpen = false
      this.dialogVisible = true
    },
    hideDialog() {
      this.dialogVisible = false
    },
    handleEdit(task) {
      this.mode = "edit"
      this.taskId = task.id
      this.newTask.title = task.title
      this.newTask.description = task.description
      this.newTask.dateBegin = new Date(task.dateBegin.split("/").reverse().join("-"))
      this.newTask.dateEnd = new Date(task.dateEnd.split("/").reverse().join("-"))
      this.newTask.selectedState = task.selectedState
      this.newTask.selectedPriority = task.selectedPriority

      console.log(this.newTask)

      this.dialogVisible = true
    },
    handleFormSubmit() {
      const days = Math.round((this.newTask.dateEnd - new Date()) / (1000 * 3600 * 24))
      if (this.newTask.title === '' || this.newTask.description === '' || this.newTask.dateBegin === null || this.newTask.dateEnd === null || this.newTask.selectedState === null || this.newTask.selectedPriority === null) {
        this.errorMessageValidation = "Veuillez remplir tous les champs"
        return
      }

      let task = {
        title: this.newTask.title,
        description: this.newTask.description,
        selectedState: this.newTask.selectedState,
        selectedPriority: this.newTask.selectedPriority,
        days: days > 0 ? days : 0,
      }

      if (typeof this.newTask.dateBegin == "Date") task.dateBegin = this.newTask.dateBegin
      else if (typeof this.newTask.dateBegin == "object") task.dateBegin = new Date(this.newTask.dateBegin)
      else task.dateBegin = new Date(this.newTask.dateBegin)

      if (typeof this.newTask.dateEnd == "Date") task.dateEnd = this.newTask.dateEnd
      else if (typeof this.newTask.dateEnd == "object") task.dateEnd = new Date(this.newTask.dateEnd)
      else task.dateEnd = new Date(this.newTask.dateEnd)

      if (task.dateBegin > task.dateEnd) {
        this.errorMessageValidation = "La date de début doit être inférieure à la date de fin"
        return
      }

      task.dateEnd = task.dateEnd.toLocaleDateString('fr-FR')
      task.dateBegin = task.dateBegin.toLocaleDateString('fr-FR')

      if (this.mode === "add") task.id = localStorage.length.toString()
      else if (this.mode === "edit") task.id = this.taskId

      localStorage.setItem(task.id, JSON.stringify(task))

      if (this.mode === "edit") tasks.value = tasks.value.filter(task => task.id !== this.taskId)
      tasks.value.push(task)

      this.dialogVisible = false
    },
    completeTask(task) {
      tasks.value.forEach((t, index) => {
        if (t.id === task.id) tasks.value.splice(index, 1)
      })
      localStorage.removeItem(task.id)
    },
    filter() {
      let allTasks = []
      for (let key in localStorage) if (localStorage.getItem(key) !== null) allTasks.push(JSON.parse(localStorage.getItem(key)))

      let filteredStates = selectedState.value && selectedState.value.length > 0 ? selectedState.value.map(state => state.code) : ["todo", "in_progress", "done"]
      let filteredPriorities = selectedPriority.value && selectedPriority.value.length > 0 ? selectedPriority.value.map(priority => priority.code) : ["high", "medium", "low"]
      let dateBegin2 = dateBegin.value ? new Date(dateBegin.value) : null
      if (dateBegin2) {
        dateBegin2.setHours(0, 0, 0, 0)
      }
      let dateEnd2 = dateEnd.value ? new Date(dateEnd.value) : null
      if (dateEnd2) {
        dateEnd2.setHours(23, 59, 59, 999)
      }

      tasks.value = allTasks.filter((task) => {
        let dateBegin3 = new Date(task.dateBegin.split("/").reverse().join("-"))
        let dateEnd3 = new Date(task.dateEnd.split("/").reverse().join("-"))

        return filteredStates.includes(task.selectedState.code) && 
          filteredPriorities.includes(task.selectedPriority.code) &&
          (dateBegin2 === null || dateBegin3 >= dateBegin2) &&
          (dateEnd2 === null || dateEnd3 <= dateEnd2)
      });

      this.isOpen = false
    },
    getAll() {
      selectedPriority.value = selectedState.value = undefined
      dateBegin.value = dateEnd.value = undefined
      tasks.value = []
      for (let key in localStorage) if (localStorage.getItem(key) !== null) tasks.value.push(JSON.parse(localStorage.getItem(key)))

      this.isOpen = false
    },
    displayMenu() {
      this.isOpen = !this.isOpen
    }
  },
  components: {
    Button,
    Dialog,
    InputText,
    Textarea,
    Calendar,
    Dropdown,
    Card,
    Tag,
    Knob,
    MultiSelect,
    Field,
    Form
  },
}
</script>