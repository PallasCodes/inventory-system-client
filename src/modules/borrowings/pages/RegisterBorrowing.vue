<script setup lang="ts">
// TODO: FIGURE OUT A WAY TO DISTINGUISH EACH SINGLE ITEM // INSTEAD OF A SELECTION INPUT
// IT COULD BE USED A SCROLL CATALOG WITH EACH PUCTURE AND THEIR SKU, A BOTTOM THAT OPENS THE
// SINGLE ITEM HISTORY ON A NEW TAB COULD BE ADDED ASWELL
import { Loading } from 'quasar'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { EmployeeService } from 'src/api/employee.api'
import { ItemService } from 'src/api/item.api'
import { Employee } from 'src/modules/employees/interfaces/employee.interface'
import { Item } from 'src/modules/inventory/interfaces/Item'
import { SingleItem } from 'src/modules/inventory/stores/single-item-store'
import { formatters } from 'src/utils/formatters'
import { handleRequest } from 'src/utils/handleRequest'
import { notEmpty } from 'src/utils/formValidations'
import { BorrowingsService } from 'src/api/borrowings.api'

const router = useRouter()

interface RegisterCategoryForm {
  borrowingDate: string | null
  borrowingDeadline?: string | null
  comments?: string | null
  idEmployee: string | any | null
  idItem: string | null
  idSingleItem: string | null
}

const formData = ref<RegisterCategoryForm>({
  borrowingDate: formatters.dateToString(new Date()),
  borrowingDeadline: null,
  comments: null,
  idEmployee: null,
  idItem: null,
  idSingleItem: null,
})

const employeesCatalog = ref<Employee[]>()
const itemsCatalog = ref<Item[]>()
const singleItemsCatalog = ref<SingleItem[]>()

async function getEmployeesCatalog() {
  const { data, error, message } = await handleRequest(EmployeeService.findAll)

  if (error) {
    message?.display()
  } else {
    employeesCatalog.value = data
  }
}

async function getItemsCatalog() {
  const { data, error, message } = await handleRequest(ItemService.findAll)

  if (error) {
    message?.display()
  } else {
    itemsCatalog.value = data
  }
}

async function onItemSelected(idItem: Item) {
  const { data, error, message } = await handleRequest(ItemService.findOneById, idItem)

  console.log(data.singleItems)

  if (error) {
    message?.display()
  } else {
    singleItemsCatalog.value = data.singleItems
      .filter((i: any) => i.singleItemStatus?.idSingleItemStatus === 1)
      .map((i: any) => i.sku)
    // TODO: CREATE A CATALOG OF CONSTANT VARIABLES SO THE IDSINGLEITEMSTATUS ISN'T HARD CODED
  }
}

onMounted(() => {
  getEmployeesCatalog()
  getItemsCatalog()
})

async function onClickRegister() {
  Loading.show()

  const { idItem, ...payload } = formData.value

  const { error, message } = await handleRequest(BorrowingsService.register, {
    ...payload,
  })

  Loading.hide()
  message?.display()

  if (!error) router.replace({ name: 'borrowings' })
}
</script>

<template>
  <q-page class="q-mx-lg q-py-md">
    <q-card style="max-width: 500px; width: 100%" class="q-pa-md">
      <q-card-section>
        <q-form @submit.prevent="onClickRegister">
          <div class="row q-gutter-sm">
            <div class="col-12">
              <span
                class="block text-subtitle2"
                style="font-size: 16px !important; color: #222 !important"
                >Registrar préstamo</span
              >
            </div>
            <div class="col-12">
              <q-input
                v-model="formData.borrowingDate"
                type="date"
                label="Fecha del préstamo*"
                :rules="[notEmpty]"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="formData.borrowingDeadline"
                type="date"
                label="Fecha de entrega"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="formData.comments"
                type="textarea"
                no-resize
                :rows="3"
                auto-grow
                label="Comentarios"
              />
            </div>
            <div class="col-12">
              <q-select
                v-model="formData.idEmployee"
                label="Empleado*"
                :options="employeesCatalog"
                option-value="idEmployee"
                option-label="fullName"
                :rules="[notEmpty]"
                emit-value
                map-options
              />
            </div>
            <div class="col-12">
              <q-select
                v-model="formData.idItem"
                label="Item*"
                :options="itemsCatalog"
                option-value="idItem"
                option-label="name"
                @update:model-value="onItemSelected"
                emit-value
                map-options
                :rules="[notEmpty]"
              />
            </div>
            <div class="col-12">
              <q-select
                v-model="formData.idSingleItem"
                label="Pieza*"
                :options="singleItemsCatalog"
                :rules="[notEmpty]"
              />
            </div>
            <div class="col-12">
              <q-btn type="submit" color="green" class="q-mt-md" size="md"
                >Registrar</q-btn
              >
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<style scoped>
.q-field__label {
  font-size: 14px !important;
}

.textarea {
  resize: none !important;
}
</style>
