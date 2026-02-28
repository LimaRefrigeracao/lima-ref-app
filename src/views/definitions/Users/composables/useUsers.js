import Axios from '@/service/Axios';
import { ref } from 'vue';
import { loadingOpen, loadingClose } from '../../../utils/computeds';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

export function useUsers() {
    const toast = useToast();
    const confirmPopup = useConfirm();

    const dataGetUsers = ref([]);

    const getUsers = async () => {
        loadingOpen();
        try {
            const response = await Axios.get('/users');
            dataGetUsers.value = response.data;
        } catch (error) {
            toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar serviços do depósito', life: 5000 });
            console.error(error);
        } finally {
            loadingClose();
        }
    };

    const deleteUser = async (id) => {
        loadingOpen();
        try {
            await Axios.delete('/users/' + id);
            toast.add({ severity: 'success', summary: 'Deletado', detail: 'Usuário deletado com sucesso', life: 5000 });
            await getUsers();
        } catch (error) {
            toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data.msg, life: 5000 });
            console.error(error);
        } finally {
            loadingClose();
        }
    };

    const confirmDeleteUser = (event, id) => {
        confirmPopup.require({
            target: event.target,
            message: 'Deseja realmente excluir este usuário?',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            accept: () => {
                deleteUser(id);
            }
        });
    };

    return {
        dataGetUsers,
        getUsers,
        deleteUser,
        confirmDeleteUser
    };
}
