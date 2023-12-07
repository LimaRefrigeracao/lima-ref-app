<script setup>
import { ref } from 'vue';
import CardsNetEarnings from './components/CardsNetEarnings.vue';
import CardsGrossEarnings from './components/CardsGrossEarnings.vue';

const type = ref('Bruto');
const options = ref(['Bruto', 'Líquido']);
</script>

<template>
    <div class="grid flex justify-content-center">
        <div class="col-8 xl:col-8">
            <div class="card">
                <h5>GANHOS</h5>
                <Toolbar class="mb-4">
                    <template v-slot:start> </template>
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
