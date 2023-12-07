<script setup lang="ts">
import { ref } from 'vue';
const products = ref([
    {
        id: 1000,
        name: 'James Butt',
        country: {
            name: 'Algeria',
            code: 'dz'
        },
        company: 'Benton, John B Jr',
        date: '2015-09-13',
        status: 'unqualified',
        verified: true,
        activity: 17,
        representative: {
            name: 'Ioni Bowcher',
            image: 'ionibowcher.png'
        },
        balance: 70663
    }
]);
</script>
<template>
    <div class="grid">
        <div class="col-12 lg:col-8 xl:col-4">
            <Card class="mb-1">
                <template #content>
                    <div class="flex justify-content-between">
                        <div>
                            <span class="block text-500 font-medium mb-3">SEMANAL</span>
                            <span class="text-green-500 font-medium">24/07 a 31/07 </span>
                        </div>
                        <div class="flex align-items-center justify-content-center">
                            <div class="text-900 font-medium text-xl">R$ 152,00</div>
                        </div>
                    </div>
                </template>
            </Card>
            <DataTable :value="products" scrollable showGridlines scrollHeight="200px">
                <Column field="name" header="Despesas"></Column>
                <Column field="country.name"></Column>
            </DataTable>
        </div>
        <div class="col-12 lg:col-8 xl:col-4">
            <Card class="mb-0">
                <template #content>
                    <div class="flex justify-content-between">
                        <div>
                            <span class="block text-500 font-medium mb-3"> MENSAL </span>
                            <span class="text-green-500 font-medium"> Julho </span>
                        </div>
                        <div class="flex align-items-center justify-content-center">
                            <div class="text-900 font-medium text-xl">R$ 152,00</div>
                        </div>
                    </div>
                </template>
            </Card>
        </div>
        <div class="col-12 lg:col-8 xl:col-4">
            <Card class="mb-0">
                <template #content>
                    <div class="flex justify-content-between">
                        <div>
                            <span class="block text-500 font-medium mb-3"> ANUAL </span>
                            <span class="text-green-500 font-medium"> 2024 </span>
                        </div>
                        <div class="flex align-items-center justify-content-center">
                            <div class="text-900 font-medium text-xl">R$ 152,00</div>
                        </div>
                    </div>
                </template>
            </Card>
        </div>
    </div>
</template>