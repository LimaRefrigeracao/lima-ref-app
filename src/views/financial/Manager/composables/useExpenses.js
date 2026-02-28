import Axios from '@/service/Axios';
import { ref } from 'vue';
import { loadingOpen, loadingClose } from '../../../utils/computeds';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { formatData } from '../../../utils/computeds.js';
import { io } from 'socket.io-client';
import { provide, ref as vRef } from 'vue';

export function useExpenses() {
    const toast = useToast();
    const confirm = useConfirm();
    const socket = io(import.meta.env.VITE_BASE_URL_API);

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
        } catch (error) {
            toast.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível buscar despesas.', life: 8000 });
        } finally {
            loadingClose();
        }
    };

    const deleteExpense = async (id) => {
        loadingOpen();
        try {
            await Axios.delete('/expenses/' + id);
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Despesa deletada com sucesso!', life: 8000 });
        } catch (error) {
            toast.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível deletar despesa.', life: 8000 });
        } finally {
            loadingClose();
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

    return {
        visibleDialogAdd,
        dataGetExpenses,
        getExpenses,
        confirmDeleteExpense,
        formatData
    };
}
