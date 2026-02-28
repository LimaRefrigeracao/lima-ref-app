import Axios from '@/service/Axios';
import { ref, inject, onMounted } from 'vue';
import { loadingOpen, loadingClose } from '../../../utils/computeds';
import { useToast } from 'primevue/usetoast';

export function useDialogAddExpenses() {
    const toast = useToast();
    const visibleDialogAdd = inject('visibleDialogAdd');

    const expenseTypes = ref([
        { name: 'Peça', code: 'P' },
        { name: 'Salário', code: 'S' },
        { name: 'Aluguel', code: 'A' },
        { name: 'Gasolina', code: 'G' },
        { name: 'Veículo', code: 'V' },
        { name: 'Feramenta', code: 'F' },
        { name: 'Pessoal', code: 'PS' },
        { name: 'Emergência', code: 'E' },
        { name: 'Outro', code: 'O' }
    ]);

    const dataDialogAddExpenses = ref({});

    const initDate = () => {
        dataDialogAddExpenses.value.date = new Date().toISOString().slice(0, 10);
    };

    const postAddExpense = async () => {
        loadingOpen();
        try {
            const response = await Axios.post('/expenses', {
                date: dataDialogAddExpenses.value.date,
                type: dataDialogAddExpenses.value.type.name,
                description: dataDialogAddExpenses.value.description,
                value: dataDialogAddExpenses.value.value
            });
            toast.add({ severity: 'success', summary: 'Adicionado', detail: response.msg, life: 8000 });
            dataDialogAddExpenses.value = {};
            initDate();
        } catch (error) {
            toast.add({ severity: 'error', summary: 'Erro', detail: error.response?.data?.msg || 'Erro ao tentar cadastrar despesa.', life: 8000 });
        } finally {
            loadingClose();
        }
    };

    const postAddExpenseValidate = () => {
        if (dataDialogAddExpenses.value.date && dataDialogAddExpenses.value.type && dataDialogAddExpenses.value.description && dataDialogAddExpenses.value.value) {
            visibleDialogAdd.value = false;
            postAddExpense();
        } else {
            toast.add({ severity: 'error', summary: 'Erro', detail: 'Todos os campos são obrigatórios.', life: 8000 });
        }
    };

    return {
        visibleDialogAdd,
        expenseTypes,
        dataDialogAddExpenses,
        initDate,
        postAddExpenseValidate
    };
}
