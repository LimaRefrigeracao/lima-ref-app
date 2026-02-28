import Axios from '@/service/Axios';
import { ref, inject, onMounted } from 'vue';
import { loadingOpen, loadingClose } from '../../../utils/computeds';
import { useToast } from 'primevue/usetoast';
import { messageAddService, addMessage } from '../../../utils/messages.js';

export function useDialogServiceAdd() {
    const toast = useToast();
    const displayModalAdd = inject('displayDialogAdd');
    const dataPostService = ref({});

    const statusServiceMapping = ref([]);
    const getStatusService = async () => {
        try {
            const response = await Axios.get('/status_service');
            statusServiceMapping.value = response.data;
            statusServiceMapping.value.forEach((value) => {
                if (value.color) {
                    value.color = JSON.parse(value.color);
                }
            });
        } catch (error) {
            console.error(error);
        }
    };

    const typesProductOptions = ref([]);
    const getTypesProduct = async () => {
        try {
            const response = await Axios.get('/types_product');
            typesProductOptions.value = response.data.map((item) => item.name);
        } catch (error) {
            console.error(error);
        }
    };

    const closeModal = () => {
        if (displayModalAdd.value === true) {
            messageAddService.value.length = 0;
            displayModalAdd.value = false;
            dataPostService.value.product = '';
            dataPostService.value.client = '';
            dataPostService.value.telephone = '';
            dataPostService.value.adress = '';
            dataPostService.value.status = '';
            dataPostService.value.observation = '';
        }
    };

    const postService = async () => {
        loadingOpen();
        try {
            await Axios.post('/services', {
                product: dataPostService.value.product,
                client: dataPostService.value.client,
                telephone: dataPostService.value.telephone,
                adress: dataPostService.value.adress,
                status: dataPostService.value.status.cod,
                observation: dataPostService.value.observation,
                created_at: dataPostService.value.created_at,
                typeTable: 1
            });
            toast.add({ severity: 'success', summary: 'Adicionado', detail: 'Serviço adicionado com sucesso', life: 5000 });
            closeModal();
        } catch (error) {
            toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao adicionar serviço', life: 5000 });
            console.error(error);
        } finally {
            loadingClose();
        }
    };

    const validatePostService = async () => {
        if (!dataPostService.value.product || !dataPostService.value.client || !dataPostService.value.telephone || !dataPostService.value.status.cod) {
            addMessage('addService', 'error', 'Preencha todos os campos obrigatórios.');
        } else {
            await postService();
        }
    };

    const initDate = () => {
        dataPostService.value.created_at = new Date().toISOString().slice(0, 10);
    };

    return {
        displayModalAdd,
        dataPostService,
        statusServiceMapping,
        typesProductOptions,
        messageAddService,
        getStatusService,
        getTypesProduct,
        validatePostService,
        closeModal,
        initDate
    };
}
