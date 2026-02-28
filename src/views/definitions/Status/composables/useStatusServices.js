import Axios from '@/service/Axios';
import { ref } from 'vue';
import { colorTypes, loadingOpen, loadingClose } from '../../../utils/computeds';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useForm } from 'vee-validate';

export function useStatusServices() {
    const toast = useToast();
    const confirmPopup = useConfirm();
    const { handleSubmit } = useForm();

    const dataGetStatusServices = ref([]);
    const dataPostStatusServices = ref([]);

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
        } catch (error) {
            toast.add({ severity: 'error', summary: 'Erro', detail: error.response?.data?.msg || 'Erro ao buscar status de serviço', life: 5000 });
        } finally {
            loadingClose();
        }
    };

    const deleteStatusServices = async (id) => {
        loadingOpen();
        try {
            const response = await Axios.delete('/status_service/' + id);
            toast.add({ severity: 'success', summary: 'Deletado', detail: response.msg, life: 5000 });
            await getStatusServices();
        } catch (error) {
            toast.add({ severity: 'error', summary: 'Erro', detail: error.response?.data?.msg || 'Erro ao deletar status de serviço', life: 5000 });
        } finally {
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

    const clearFields = () => {
        dataPostStatusServices.value = [];
    };

    const postStatusServices = async () => {
        loadingOpen();
        try {
            const response = await Axios.post('/status_service', {
                description: dataPostStatusServices.value.description,
                cod: dataPostStatusServices.value.cod,
                color: JSON.stringify(dataPostStatusServices.value.color)
            });
            toast.add({ severity: 'success', summary: 'Adicionado', detail: response.msg, life: 5000 });
            clearFields();
            await getStatusServices();
        } catch (error) {
            toast.add({ severity: 'error', summary: 'Erro', detail: error.response?.data?.msg || 'Erro ao adicionar status de serviço', life: 5000 });
        } finally {
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

    return {
        colorTypes,
        dataGetStatusServices,
        dataPostStatusServices,
        getStatusServices,
        confirmDeleteStatusServices,
        onSubmit
    };
}
