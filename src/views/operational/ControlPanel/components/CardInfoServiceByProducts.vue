<script setup>
import { onMounted, ref } from 'vue';
import Axios from '../../../../service/Axios';
import { loadingOpen, loadingClose } from '../../../components/computeds.js';
import { useToast } from 'primevue/usetoast';
const toast = useToast();

const data = ref([]);
const getCountProductByService = async () => {
    loadingOpen();
    try {
        const response = await Axios.get('/panel_control/product_by_service');
        data.value = response.data;
        console.log(response.data)
        loadingClose();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar dados', life: 5000 });
        console.error(error);
        loadingClose();
    }
};

onMounted(() => {
    getCountProductByService();
});
</script>
<template>
    <Toast />
    <div class="card">
        <div class="flex justify-content-between align-items-center mb-5">
            <h5>Quantidade por Tipo de Produto</h5>
        </div>
        <ul class="list-none p-0 m-0">
            <li v-for="product in data.values" :key="product.index" class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                <div>
                    <span class="text-900 mr-2 mb-1 md:mb-0">{{ product.name }}</span>
                </div>
                <div class="mt-2 md:mt-0 flex align-items-center">
                    <div class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style="height: 8px">
                        <div :class="'bg-' + product.color + ' h-full'" :style="'width:' + Math.floor(product.count / data.length * 100) + '%'"></div>
                    </div>
                    <span :class="'text-' + product.color + ' ml-3 font-medium'">{{ product.count }}</span>
                </div>
            </li>
        </ul>
    </div>
</template>