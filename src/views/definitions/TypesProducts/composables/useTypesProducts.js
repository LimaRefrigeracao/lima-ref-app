import Axios from '@/service/Axios';
import { ref } from 'vue';
import { loadingOpen, loadingClose } from '../../../utils/computeds';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useForm } from 'vee-validate';

export function useTypesProducts() {
    const toast = useToast();
    const confirmPopup = useConfirm();
    const { handleSubmit } = useForm();

    const dataGetTypesProduct = ref([]);
    const dataPostTypesProduct = ref([]);

    const getTypesProduct = async () => {
        loadingOpen();
        try {
            const response = await Axios.get('/types_product');
            dataGetTypesProduct.value = response.data;
        } catch (error) {
            toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data.msg, life: 5000 });
            console.error(error);
        } finally {
            loadingClose();
        }
    };

    const deleteTypesProduct = async (id) => {
        loadingOpen();
        try {
            await Axios.delete('/types_product/' + id);
            toast.add({ severity: 'success', summary: 'Deletado', detail: 'Tipo de produto deletado com sucesso', life: 5000 });
            await getTypesProduct();
        } catch (error) {
            toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data.msg, life: 5000 });
            console.error(error);
        } finally {
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

    const clearFields = () => {
        dataPostTypesProduct.value = [];
    };

    const postTypesProduct = async () => {
        loadingOpen();
        try {
            await Axios.post('/types_product', {
                name: dataPostTypesProduct.value.name
            });
            toast.add({ severity: 'success', summary: 'Adicionado', detail: 'Novo tipo de produto adicionado com sucesso', life: 5000 });
            clearFields();
            await getTypesProduct();
        } catch (error) {
            toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data.msg, life: 5000 });
            console.error(error);
        } finally {
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

    return {
        dataGetTypesProduct,
        dataPostTypesProduct,
        getTypesProduct,
        confirmDeleteTypesProduct,
        onSubmit
    };
}
