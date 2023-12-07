<script setup>
import { onMounted, ref, watch } from 'vue';
import { useLayout } from '@/layout/composables/layout';

const { isDarkTheme } = useLayout();

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


const lineOptions = ref(null);

onMounted(() => {});

const applyLightTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            },
            y: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            }
        }
    };
};

const applyDarkTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#ebedef'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            },
            y: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            }
        }
    };
};

const type = ref('Bruto');
const options = ref(['Bruto', 'Líquido']);

watch(
    isDarkTheme,
    (val) => {
        if (val) {
            applyDarkTheme();
        } else {
            applyLightTheme();
        }
    },
    { immediate: true }
);
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

                <div class="grid" v-if="type == 'Bruto'">
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

                <div class="grid" v-else>
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
            </div>
        </div>
    </div>
</template>
