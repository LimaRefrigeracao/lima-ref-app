<script setup>
import { onMounted, ref } from 'vue';
import { useStatusPayment } from '../composables/useStatusPayment';

const popup = ref(null);

const { colorTypes, dataGetStatusPayment, dataPostStatusPayment, getStatusPayment, confirmDeleteStatusPayment, onSubmit } = useStatusPayment();

onMounted(() => {
    getStatusPayment();
});
</script>

<template>
    <div class="card">
        <h5>STATUS DE PAGAMENTO</h5>
        <Toolbar class="mb-4">
            <template v-slot:start>
                <form @submit="onSubmit" class="flex flex-column align-items-center gap-2">
                    <div class="grid p-fluid" style="margin: auto">
                        <span class="p-float-label">
                            <InputNumber id="addCod" v-model="dataPostStatusPayment.cod" style="max-width: 80px" />
                            <label for="addCod"><span style="color: red">*</span> Código </label>
                        </span>
                        <span class="p-float-label ml-2">
                            <InputText type="text" id="addDescription" v-model="dataPostStatusPayment.description" style="max-width: 140px" />
                            <label for="addDescription"><span style="color: red">*</span> Descrição </label>
                        </span>
                        <span class="p-float-label ml-2">
                            <Dropdown id="addColor" :options="colorTypes" v-model="dataPostStatusPayment.color" style="min-width: 80px">
                                <template #value="slotProps">
                                    <div v-if="slotProps.value">
                                        <Badge :style="{ background: slotProps.value.hex }" style="margin-bottom: 2px" />
                                    </div>
                                </template>
                                <template #option="slotProps">
                                    <Badge size="large" :style="{ background: slotProps.option.hex }" />
                                </template>
                            </Dropdown>
                            <label for="addColor"><span style="color: red">*</span> Cor</label>
                        </span>

                        <Button type="submit" icon="pi pi-plus" class="p-button-rounded p-button-info p-button-outlined ml-2" v-tooltip.top="'Adicionar'" />
                    </div>
                </form>
            </template>
        </Toolbar>
        <DataTable :value="dataGetStatusPayment" :rowHover="true" :rows="10" showGridlines>
            <Column bodyClass="text-center" field="cod" header="Código">
                <template #body="{ data }">
                    <Chip :label="data.cod" />
                </template>
            </Column>
            <Column bodyClass="text-center" field="description" header="Descrição">
                <template #body="{ data }">
                    <Tag :value="data.description" :style="{ background: data.color.hex }" />
                </template>
            </Column>
            <Column bodyClass="text-center">
                <template #body="{ data }">
                    <Button ref="popup" @click="confirmDeleteStatusPayment($event, data.id)" icon="pi pi-trash" class="p-button-rounded p-button-danger p-button-outlined" v-tooltip.top="'Excluir'" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>
