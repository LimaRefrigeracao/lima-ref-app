import { ref, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useLayout } from '@/layout/composables/layout';
import { loadingOpen, loadingClose } from '../../utils/computeds';
import { messageLogin, addMessage } from '../../utils/messages.js';

export function useLogin() {
    const toast = useToast();
    const router = useRouter();
    const { layoutConfig } = useLayout();

    const username = ref('');
    const password = ref('');
    const remember = ref(false);

    messageLogin.value.length = 0;

    const logoUrl = computed(() => {
        return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.png`;
    });

    const login = async () => {
        loadingOpen();
        try {
            const response = await axios.post(import.meta.env.VITE_BASE_URL_API + '/auth/login', {
                username: username.value,
                password: password.value,
                remember: remember.value
            });

            const token = response.data.token;

            if (token && typeof token === 'string' && token.trim() !== '') {
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                router.push('/operacional/servicos');
            } else {
                toast.add({ severity: 'error', summary: 'Erro no Login', detail: 'Token inválido ou ausente.', life: 5000 });
            }
        } catch (error) {
            toast.add({ severity: 'error', summary: 'Informação Inválida', detail: error.response.data.msg, life: 5000 });
        } finally {
            loadingClose();
        }
    };

    const validate = async () => {
        if (!username.value && !password.value) {
            addMessage('login', 'error', 'Preencha todos os campos obrigatórios.');
        } else {
            await login();
        }
    };

    return {
        username,
        password,
        remember,
        logoUrl,
        messageLogin,
        validate
    };
}
