import Axios from '@/service/Axios';
import { ref } from 'vue';
import { colorTypes, loadingOpen, loadingClose } from '../../../utils/computeds';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useForm } from 'vee-validate';

export function useStatusPayment() {
    const toast = useToast();
    const confirmPopup = useConfirm();
    const { handleSubmit } = useForm();

    const dataGetStatusPayment = ref([]);
    const dataPostStatusPayment = ref([]);

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
        } catch (error) {
            toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data.msg, life: 5000 });
            console.error(error);
        } finally {
            loadingClose();
        }
    };

    const deleteStatusPayment = async (id) => {
        loadingOpen();
        try {
            await Axios.delete('/status_payment/' + id);
            toast.add({ severity: 'success', summary: 'Deletado', detail: 'Status de pagamento deletado com sucesso', life: 5000 });
            await getStatusPayment();
        } catch (error) {
            toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data.msg, life: 5000 });
            console.error(error);
        } finally {
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

    const clearFields = () => {
        dataPostStatusPayment.value = [];
    };

    const postStatusPayment = async () => {
        loadingOpen();
        try {
            await Axios.post('/status_payment', {
                description: dataPostStatusPayment.value.description,
                cod: dataPostStatusPayment.value.cod,
                color: dataPostStatusPayment.value.color
            });
            toast.add({ severity: 'success', summary: 'Adicionado', detail: 'Novo Status de pagamento adicionado com sucesso', life: 5000 });
            clearFields();
            await getStatusPayment();
        } catch (error) {
            toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data.msg, life: 5000 });
            console.error(error);
        } finally {
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

    return {
        colorTypes,
        dataGetStatusPayment,
        dataPostStatusPayment,
        getStatusPayment,
        confirmDeleteStatusPayment,
        onSubmit
    };
}
