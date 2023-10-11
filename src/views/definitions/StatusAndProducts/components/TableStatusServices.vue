<script setup>
import { ref, onMounted } from 'vue';
import { loadingOpen, loadingClose, colorTypes } from '../../../components/computeds';
import Axios from '../../../../service/Axios';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useForm } from 'vee-validate';

const popup = ref(null);
const confirmPopup = useConfirm();
const toast = useToast();
const dataGetStatusServices = ref([]);
const dataPostStatusServices = ref([]);
const { handleSubmit } = useForm();

const getStatusServices = async () => {
    loadingOpen();
    try {
        const response = await Axios.get('/status_service');
        dataGetStatusServices.value = response.data;
        dataGetStatusServices.value.forEach((value) => {
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

const deleteStatusServices = async (id) => {
    loadingOpen();
    try {
        const response = await Axios.delete('/status_service/' + id);
        toast.add({ severity: 'success', summary: 'Deletado', detail: 'Status de serviço deletado com sucesso', life: 5000 });
        console.log(response.status);
        await getStatusServices();
        loadingClose();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data.msg, life: 5000 });
        console.error(error);
        loadingClose();
    }
};

const confirmDeleteStatusServices = (event, id) => {
    confirmPopup.require({
        target: event.target,
        message: 'Deseja realmente excluir este status?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => {
            deleteStatusServices(id);
        }
    });
};

const postStatusServices = async () => {
    loadingOpen();
    try {
        const response = await Axios.post('/status_service', {
            description: dataPostStatusServices.value.description,
            cod: dataPostStatusServices.value.cod,
            color: dataPostStatusServices.value.color
        });
        toast.add({ severity: 'success', summary: 'Adicionado', detail: 'Novo Status de serviço adicionado com sucesso', life: 5000 });
        console.log(response.status);
        clearFields();
        await getStatusServices();
        loadingClose();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data.msg, life: 5000 });
        console.error(error);
        loadingClose();
    }
};

const onSubmit = handleSubmit(async () => {
    if (dataPostStatusServices.value.description && dataPostStatusServices.value.cod && dataPostStatusServices.value.color) {
        await postStatusServices();
    } else {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Preencha todos os campos!', life: 5000 });
    }
});

const clearFields = () => {
    dataPostStatusServices.value = [];
};

onMounted(() => {
    getStatusServices();
});
</script>

<template>
    <div class="card">
        <h5>STATUS DE SERVIÇO</h5>
        <Toolbar class="mb-4">
            <template v-slot:start>
                <form @submit="onSubmit" class="flex flex-column align-items-center gap-2">
                    <div class="grid p-fluid" style="margin: auto">
                        <span class="p-float-label">
                            <InputNumber id="addCod" v-model="dataPostStatusServices.cod" style="max-width: 80px" />
                            <label for="addCod"><span style="color: red">*</span> Código </label>
                        </span>
                        <span class="p-float-label ml-2">
                            <InputText type="text" id="addDescription" v-model="dataPostStatusServices.description" style="max-width: 140px" />
                            <label for="addDescription"><span style="color: red">*</span> Descrição </label>
                        </span>
                        <span class="p-float-label ml-2">
                            <Dropdown id="addColor" :options="colorTypes" v-model="dataPostStatusServices.color" style="min-width: 80px">
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
        <DataTable :value="dataGetStatusServices" :rowHover="true" :rows="10" showGridlines>
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
                    <Button ref="popup" @click="confirmDeleteStatusServices($event, data.id)" icon="pi pi-trash" class="p-button-rounded p-button-danger p-button-outlined" v-tooltip.top="'Excluir'" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

