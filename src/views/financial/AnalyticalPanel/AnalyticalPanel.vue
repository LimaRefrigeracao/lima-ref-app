<script setup>
import { ref } from 'vue';
import CardsNetEarnings from './components/CardsNetEarnings.vue';
import CardsGrossEarnings from './components/CardsGrossEarnings.vue';
const maxDate = ref(new Date());
const dates = ref();
const date = ref(new Date());
const type = ref('Bruto');
const options = ref(['Bruto', 'Líquido']);
const selectedTypeSearch = ref({ name: 'Geral', code: 'geral' });
const typeSearch = ref([
    { name: 'Geral', code: 'geral' },
    { name: 'Período de Tempo', code: 'periodo' },
    { name: 'Por Mês', code: 'mes' },
    { name: 'Por Ano', code: 'ano' }
]);
</script>

<template>
    <div class="grid flex justify-content-center">
        <div class="col-10 xl:col-10">
            <div class="card">
                <h5>MOVIMENTAÇÃO</h5>
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <Dropdown v-model="selectedTypeSearch" editable :options="typeSearch" optionLabel="name" placeholder="Select a City" class="w-full md:w-14rem" />
                        <Calendar class="ml-2" v-if="selectedTypeSearch.code == 'periodo'" v-model="dates" selectionMode="multiple" />
                        <Calendar class="ml-2" v-else-if="selectedTypeSearch.code == 'mes'" v-model="date" view="month" dateFormat="mm/yy" :maxDate="maxDate" />
                        <Calendar class="ml-2" v-else-if="selectedTypeSearch.code == 'ano'" v-model="date" view="year" dateFormat="yy" :maxDate="maxDate" />

                        <Button class="ml-2" icon="pi pi-search" v-tooltip.top="'Pesquisar'"/>
                    </template>
                    <template v-slot:end>
                        <SelectButton v-model="type" :options="options" aria-labelledby="basic" />
                    </template>
                </Toolbar>

                <CardsGrossEarnings v-if="type == 'Bruto'" />
                <CardsNetEarnings v-else />
            </div>
        </div>
    </div>
</template>
