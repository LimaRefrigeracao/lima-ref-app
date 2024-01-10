<script setup>
import Axios from '@/service/Axios';
import { io } from 'socket.io-client';
import { ref, onBeforeMount, provide } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

import { formatData, loadingOpen, loadingClose } from '../../utils/computeds';

import DialogAddExpenses from './components/DialogAddExpenses.vue';

const socket = io(import.meta.env.VITE_BASE_URL_API);
const confirm = useConfirm();
const toast = useToast();

const visibleDialogAdd = ref(false);
provide('visibleDialogAdd', visibleDialogAdd);

const dataGetExpenses = ref([]);
socket.on('reloadDataExpenses', (data) => {
    dataGetExpenses.value = data;
});
const getExpenses = async () => {
    loadingOpen();
    try {
        const response = await Axios.get('/expenses');
        dataGetExpenses.value = response.data;
        loadingClose();
    } catch (error) {
        loadingClose();
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível buscar despesas.', life: 8000 });
    }
};

onBeforeMount(() => {
    getExpenses();
});

const deleteExpense = async (id) => {
    loadingOpen();
    try {
        await Axios.delete('/expenses/' + id);
        loadingClose();
        toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Despesa deletada com sucesso!', life: 8000 });
    } catch (error) {
        loadingClose();
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível deletar despesa.', life: 8000 });
    }
};

const confirmDeleteExpense = (event, data) => {
    confirm.require({
        target: event.currentTarget,
        message: 'Deseja realmente excluir esta despesa?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => {
            deleteExpense(data.id);
        }
    });
};
</script>
<template>
    <Toast />
    <ConfirmPopup />
    <div class="card">
        <h5>DESPESAS</h5>

        <Toolbar class="mb-4">
            <template #start>
                <Button label="Cadastrar" icon="pi pi-sign-out" severity="warning" iconPos="left" @click="visibleDialogAdd = true" />
                <DialogAddExpenses />
            </template>
            <template #end> </template>
        </Toolbar>

        <DataTable :value="dataGetExpenses" :rowHover="true" paginator showGridlines :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem">
            <Column field="id" header="#"></Column>
            <Column field="date" sortable header="Data">
                <template #body="{ data }">
                    {{ formatData(data.date) }}
                </template>
            </Column>
            <Column field="type" header="Tipo"></Column>
            <Column field="description" header="Descrição" style="width: 30%"></Column>
            <Column field="value" header="Valor">
                <template #body="{ data }"> R$ {{ parseFloat(data.value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} </template>
            </Column>
            <Column style="width: 5%">
                <template #body="{ data }">
                    <Button @click="confirmDeleteExpense($event, data)" icon="pi pi-trash" class="ml-1 p-button-rounded p-button-danger" v-tooltip.top="'Excluir'" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>
