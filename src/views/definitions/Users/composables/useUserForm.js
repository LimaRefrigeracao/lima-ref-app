import Axios from '@/service/Axios';
import { ref } from 'vue';
import { loadingOpen, loadingClose } from '../../../utils/computeds';
import { messageAddUser, addMessage } from '../../../utils/messages.js';
import { useToast } from 'primevue/usetoast';

export function useUserForm(getUsers) {
    const toast = useToast();

    const dataPostUser = ref([]);
    const displayModalAdd = ref(false);

    const openModalAdd = () => {
        messageAddUser.value.length = 0;
        displayModalAdd.value = true;
    };

    const closeModal = () => {
        if (displayModalAdd.value === true) {
            displayModalAdd.value = false;
            dataPostUser.value = [];
        }
    };

    const customBase64Uploader = async (event) => {
        const file = event.files[0];
        const reader = new FileReader();
        let blob = await fetch(file.objectURL).then((r) => r.blob());

        const targetSizeBytes = 40 * 1024;

        if (blob.size > targetSizeBytes) {
            toast.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Imagem muito grande. Max: 30KB. Para redimencionar sua imagem acesse: https://www.shutterstock.com/pt/image-resizer ',
                life: 8000
            });
        } else {
            reader.readAsDataURL(blob);
            reader.onloadend = function () {
                const base64data = reader.result;
                dataPostUser.value.signature = base64data;
            };
        }
    };

    const postUser = async () => {
        loadingOpen();
        try {
            await Axios.post('/auth/register', {
                username: dataPostUser.value.username,
                email: dataPostUser.value.email,
                password: dataPostUser.value.password,
                confirmPassword: dataPostUser.value.confirmPassword,
                signature: dataPostUser.value.signature,
                admin: dataPostUser.value.admin
            });
            toast.add({ severity: 'success', summary: 'Adicionado', detail: 'Usuário adicionado com sucesso', life: 5000 });
            await getUsers();
            closeModal();
        } catch (error) {
            toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao adicionar usuário', life: 5000 });
            console.error(error);
        } finally {
            loadingClose();
        }
    };

    const validatePostUser = async () => {
        if (!dataPostUser.value.username || !dataPostUser.value.email || !dataPostUser.value.password || !dataPostUser.value.confirmPassword) {
            addMessage('addUser', 'error', 'Preencha todos os campos obrigatórios.');
        } else if (dataPostUser.value.password !== dataPostUser.value.confirmPassword) {
            addMessage('addUser', 'error', 'Senhas incoerentes.');
        } else {
            await postUser();
        }
    };

    return {
        dataPostUser,
        displayModalAdd,
        openModalAdd,
        closeModal,
        customBase64Uploader,
        validatePostUser
    };
}
