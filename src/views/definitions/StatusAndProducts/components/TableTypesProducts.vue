<script setup>
import { ref, onMounted, Axios, loadingOpen, loadingClose, useToast } from '@/views/common';
import { useConfirm } from 'primevue/useconfirm';
import { useForm } from 'vee-validate';

const popup = ref(null);
const confirmPopup = useConfirm();
const toast = useToast();
const dataGetTypesProduct = ref([]);
const dataPostTypesProduct = ref([]);
const { handleSubmit } = useForm();

const getTypesProduct = async () => {
    loadingOpen();
    try {
        const response = await Axios.get('/types_product');
        dataGetTypesProduct.value = response.data;
        loadingClose();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data.msg, life: 5000 });
        loadingClose();
        console.error(error);
    }
};

const deleteTypesProduct = async (id) => {
    loadingOpen();
    try {
        const response = await Axios.delete('/types_product/' + id);
        toast.add({ severity: 'success', summary: 'Deletado', detail: 'Tipo de produto deletado com sucesso', life: 5000 });
        console.log(response.status);
        await getTypesProduct();
        loadingClose();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data.msg, life: 5000 });
        console.error(error);
        loadingClose();
    }
};

const confirmDeleteTypesProduct = (event, id) => {
    confirmPopup.require({
        target: event.target,
        message: 'Deseja realmente excluir este tipo de produto?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => {
            deleteTypesProduct(id);
        }
    });
};

const postTypesProduct = async () => {
    loadingOpen();
    try {
        const response = await Axios.post('/types_product', {
            name: dataPostTypesProduct.value.name,
        });
        toast.add({ severity: 'success', summary: 'Adicionado', detail: 'Novo tipo de produto adicionado com sucesso', life: 5000 });
        console.log(response.status);
        clearFields();
        await getTypesProduct();
        loadingClose();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data.msg, life: 5000 });
        console.error(error);
        loadingClose();
    }
};

const onSubmit = handleSubmit(async () => {
    if (dataPostTypesProduct.value.name) {
        await postTypesProduct();
    } else {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Preencha todos os campos!', life: 5000 });
    }
});

const clearFields = () => {
    dataPostTypesProduct.value = [];
}

onMounted(() => {
    getTypesProduct();
});
</script>

<template>
    <div class="card">
        <h5>TIPOS DE PRODUTO</h5>
        <Toolbar class="mb-4">
            <template v-slot:start>
                <form @submit="onSubmit" class="flex flex-column align-items-center gap-2">
                    <div class="grid p-fluid" style="margin: auto">
                        <span class="p-float-label">
                            <InputText type="text" id="addName" v-model="dataPostTypesProduct.name" style="width: auto;" />
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

