<script setup>
import { onMounted, ref } from 'vue';
import { useTypesProducts } from './composables/useTypesProducts';

const popup = ref(null);

const { dataGetTypesProduct, dataPostTypesProduct, getTypesProduct, confirmDeleteTypesProduct, onSubmit } = useTypesProducts();

onMounted(() => {
    getTypesProduct();
});
</script>

<template>
    <ConfirmPopup />
    <Toast />
    <div class="card">
        <h5>TIPOS DE PRODUTO</h5>
        <Toolbar class="mb-4">
            <template v-slot:start>
                <form @submit="onSubmit" class="flex flex-column align-items-center gap-2">
                    <div class="grid p-fluid" style="margin: auto">
                        <span class="p-float-label">
                            <InputText type="text" id="addName" v-model="dataPostTypesProduct.name" style="width: auto" />
                            <label for="addName"><span style="color: red">*</span> Nome </label>
                        </span>

                        <Button type="submit" icon="pi pi-plus" class="p-button-rounded p-button-info p-button-outlined ml-2" v-tooltip.top="'Adicionar'" />
                    </div>
                </form>
            </template>
        </Toolbar>
        <DataTable :value="dataGetTypesProduct" :rowHover="true" :rows="10" showGridlines>
            <Column bodyClass="text-center" field="name" header="Opções">
                <template #body="{ data }">
                    <Chip :label="data.name" />
                </template>
            </Column>
            <Column bodyClass="text-center">
                <template #body="{ data }">
                    <Button ref="popup" @click="confirmDeleteTypesProduct($event, data.id)" icon="pi pi-trash" class="p-button-rounded p-button-danger p-button-outlined" v-tooltip.top="'Excluir'" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>
