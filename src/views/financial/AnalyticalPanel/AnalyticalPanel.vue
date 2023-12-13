<script setup>
import CardsInvoicingGross from './components/CardsInvoicingGross.vue';
import CardsInvoicingLiquid from './components/CardsInvoicingLiquid.vue';
import { ref } from 'vue';

const type = ref('Bruto');
const optionsType = ref(['Bruto', 'Líquido']);
</script>

<template>
    <div class="grid flex justify-content-center">
        <div class="col-12 xl:col-12">
            <div class="card">
                <Toolbar class="mb-4">
                    <template #start>
                        <strong style="font-size: large"> FATURAMENTO </strong>
                    </template>

                    <template #end>
                        <SelectButton v-model="type" :options="optionsType" aria-labelledby="basic" />
                    </template>
                </Toolbar>

                <CardsInvoicingGross v-if="type == 'Bruto'" />
                <CardsInvoicingLiquid v-else />
            </div>
        </div>
    </div>
</template>
