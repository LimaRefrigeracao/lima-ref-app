<script setup>
import Axios from '@/service/Axios';
import { io } from 'socket.io-client';
import { ref, onBeforeMount, provide } from 'vue';
import { loadingOpen, loadingClose, formatData } from '../../utils/computeds';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import DialogAddEmployee from './components/DialogAddEmployee.vue';

const socket = io(import.meta.env.VITE_BASE_URL_API);
socket.on('reloadDataEmployees', (data) => {
    dataGetEmployees.value = data;
});

const popup = ref(null);
const confirmPopup = useConfirm();
const toast = useToast();

const dataGetEmployees = ref([]);
const getEmployees = async () => {
    loadingOpen();
    try {
        const response = await Axios.get('/employees');
        dataGetEmployees.value = response.data;

        loadingClose();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar funcionários.', life: 5000 });
        loadingClose();
        console.error(error);
    }
};

const deleteEmployee = async (id) => {
    loadingOpen();
    try {
        await Axios.delete('/employees/' + id);
        toast.add({ severity: 'success', summary: 'Deletado', detail: 'Funcionário deletado com sucesso', life: 5000 });

        await getEmployees();
        loadingClose();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data.msg, life: 5000 });
        console.error(error);
        loadingClose();
    }
};

const confirmDeleteEmployee = (event, id) => {
    confirmPopup.require({
        target: event.target,
        message: 'Deseja realmente excluir este funcionério?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => {
            deleteEmployee(id);
        }
    });
};

const visibleDialogAdd = ref(false);
provide('visibleDialogAdd', visibleDialogAdd);

onBeforeMount(() => {
    getEmployees();
});
</script>

<template>
    <ConfirmPopup />
    <Toast />
    <div class="card">
        <h5>FUNCIONÁRIOS</h5>
        <Toolbar class="mb-4">
            <template v-slot:start>
                <div class="my-2">
                    <DialogAddEmployee />
                    <Button label="Adicionar" icon="pi pi-plus" class="p-button-primary mr-2" @click="visibleDialogAdd = true" />
                </div>
            </template>
        </Toolbar>
        <DataTable :value="dataGetEmployees" :rowHover="true" showGridlines tableStyle="min-width: 50rem">
            <Column bodyClass="text-center" field="full_name" header="Funcionário">
                <template #body="{ data }"> {{ data.full_name }} ({{ data.cpf }}) </template>
            </Column>
            <Column bodyClass="text-center" field="telephone" header="Telefone"></Column>
            <Column bodyClass="text-center" field="address" header="Endereço"></Column>
            <Column bodyClass="text-center" field="entry_date" header="Data de Entrada">
                <template #body="{ data }">
                    {{ formatData(data.entry_date) }}
                </template>
            </Column>
            <Column bodyClass="text-center" field="payment_type" header="Tipo de Pagamento">
                <template #body="{ data }">
                    {{ data.payment_type }}
                </template>
            </Column>
            <Column bodyClass="text-center" field="total_salary" header="Salário Total">
                <template #body="{ data }"> R$ {{ parseFloat(data.total_salary).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} </template>
            </Column>
            <Column bodyClass="text-center" field="pix_key" header="Chave Pix"></Column>
            <Column bodyClass="text-center">
                <template #body="{ data }">
                    <Button ref="popup" @click="confirmDeleteEmployee($event, data.id)" icon="pi pi-trash" class="p-button-rounded p-button-danger" v-tooltip.top="'Excluir'" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>
