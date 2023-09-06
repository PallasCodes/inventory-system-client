<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { ItemService } from 'src/api/item.api'

import ItemsInfoCardsList, { ItemCard } from '../components/ItemsInfoCardsList.vue'
import ItemsTable, { ItemTable } from '../components/ItemsTable.vue'
import SingleItemsTable, { SingleItemTable } from '../components/SingleItemsTable.vue'

const search = ref<string>('')
const filteredCategories = ref<string[]>([])
const filteredStates = ref<string[]>([])

const itemCards = ref<ItemCard[]>([
  {
    amount: 100,
    color: 'primary',
    icon: 'check',
    description: 'Items disponibles',
  },
  {
    amount: 20,
    color: 'red',
    icon: 'check',
    description: 'Items no disponibles',
  },
  {
    amount: 80,
    color: 'green',
    icon: 'check',
    description: 'Items prestados',
  },
  {
    amount: 20,
    color: 'orange',
    icon: 'check',
    description: 'Items pendientes',
  },
])

const items = ref<ItemTable[]>([])
const singleItems = ref<SingleItemTable[]>([])

const isTableDataLoading = ref<boolean>(true)

onMounted(async () => {
  const { data } = await ItemService.findAll()
  isTableDataLoading.value = false
  items.value = data
})

const onClickRow = async (idItem: string) => {
  const { data } = await ItemService.findOneById(idItem)
  singleItems.value = data.singleItems
}
</script>

<template>
  <q-page class="q-mx-lg q-py-md">
    <ItemsInfoCardsList :items-cards="itemCards" class="q-mb-xl" />

    <div class="row">
      <div class="col-auto">
        <q-input
          v-model="search"
          type="search"
          placeholder="Buscar item"
          dense
          standout
          filled
          style="font-size: 12px !important; width: 280px"
          class="q-mr-xl"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div class="col-auto">
        <q-select
          borderless
          v-model="filteredCategories"
          :options="[]"
          label="Filtrar por estatus"
          dense
          style="width: 160px"
          class="q-mr-lg"
        />
      </div>
      <div class="col-auto">
        <q-select
          borderless
          v-model="filteredStates"
          :options="[]"
          label="Filtrar por categoría"
          dense
          style="width: 160px"
        />
      </div>
    </div>

    <div class="row q-mt-lg">
      <div class="col-auto">
        <ItemsTable
          :items="items"
          :is-loading="isTableDataLoading"
          @on-row-click="onClickRow"
        />
      </div>
    </div>

    <div class="row q-mt-lg">
      <div class="auto">
        <SingleItemsTable :single-items="singleItems" :is-loading="isTableDataLoading" />
      </div>
    </div>
  </q-page>
</template>