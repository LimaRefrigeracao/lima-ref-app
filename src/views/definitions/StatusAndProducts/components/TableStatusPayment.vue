<script setup>
import { ref, onMounted, Axios, loadingOpen, loadingClose, useToast } from '@/views/common';
import { colorTypes } from '../../../components/computeds';
import { useConfirm } from 'primevue/useconfirm';
import { useForm } from 'vee-validate';

const popup = ref(null);
const confirmPopup = useConfirm();
const toast = useToast();
const dataGetStatusPayment = ref([]);
const dataPostStatusPayment = ref([]);
const { handleSubmit } = useForm();

const getStatusPayment = async () => {
    loadingOpen();
    try {
        const response = await Axios.get('/status_payment');
        dataGetStatusPayment.value = response.data;
        dataGetStatusPayment.value.forEach((value) => {
            if (value.color) {
                value.color = JSON.parse(value.color);
            }
        });
        loadingClose();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data.msg, life: 5000 });
        loadingClose();
        console.error(error);
    }
};

const deleteStatusPayment = async (id) => {
    loadingOpen();
    try {
        const response = await Axios.delete('/status_payment/' + id);
        toast.add({ severity: 'success', summary: 'Deletado', detail: 'Status de pagamento deletado com sucesso', life: 5000 });
        console.log(response.status);
        await getStatusPayment();
        loadingClose();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data.msg, life: 5000 });
        console.error(error);
        loadingClose();
    }
};

const confirmDeleteStatusPayment = (event, id) => {
    confirmPopup.require({
        target: event.target,
        message: 'Deseja realmente excluir este status?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => {
            deleteStatusPayment(id);
        }
    });
};

const postStatusPayment = async () => {
    loadingOpen();
    try {
        const response = await Axios.post('/status_payment', {
            description: dataPostStatusPayment.value.description,
            cod: dataPostStatusPayment.value.cod,
            color: dataPostStatusPayment.value.color
        });
        toast.add({ severity: 'success', summary: 'Adicionado', detail: 'Novo Status de pagamento adicionado com sucesso', life: 5000 });
        console.log(response.status);
        clearFields();
        await getStatusPayment();
        loadingClose();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data.msg, life: 5000 });
        console.error(error);
        loadingClose();
    }
};

const onSubmit = handleSubmit(async () => {
    if (dataPostStatusPayment.value.description && dataPostStatusPayment.value.cod && dataPostStatusPayment.value.color) {
        await postStatusPayment();
    } else {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Preencha todos os campos!', life: 5000 });
    }
});

const clearFields = () => {
    dataPostStatusPayment.value = [];
};

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

