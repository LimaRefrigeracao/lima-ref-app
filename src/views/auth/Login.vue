<script setup>
import { ref, loadingOpen, loadingClose, useToast, computed } from '@/views/common';
import axios from 'axios';
import { useLayout } from '@/layout/composables/layout';
import { messageLogin, addMessage } from '../utils/messages.js';
import { useRouter } from 'vue-router';

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

const validate = async () => {
    if (!username.value && !password.value) {
        addMessage('login', 'error', 'Preencha todos os campos obrigatórios.');
    } else {
        login();
    }
};

const login = async () => {
    loadingOpen();
    try {
        const response = await axios.post(import.meta.env.VITE_BASE_URL_API + '/users/login', {
            username: username.value,
            password: password.value,
            remember: remember.value
        });
        loadingClose();
        const token = response.data.token;

        if (token && typeof token === 'string' && token.trim() !== '') {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            router.push('/operacional/servicos');
        } else {
            toast.add({ severity: 'error', summary: 'Erro no Login', detail: 'Token inválido ou ausente.', life: 5000 });
        }
    } catch (error) {
        loadingClose();
        toast.add({ severity: 'error', summary: 'Informação Inválida', detail: error.response.data.msg, life: 5000 });
    }
};
</script>

<template>
    <Toast />
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-6">
                        <img :src="logoUrl" height="100" class="mb-3" />
                    </div>
                    <transition-group tag="div">
                        <Message v-for="msg of messageLogin" :severity="msg.severity" :key="msg.content">{{ msg.content }}</Message>
                    </transition-group>
                    <div style="text-align: center">
                        <label for="username" class="block text-900 text-x font-medium mb-2"> NOME DE USUÁRIO </label>
                        <InputText id="username" type="text" v-model="username" class="w-full md:w-30rem mb-5" style="padding: 1rem" />

                        <label for="password" class="block text-900 font-medium text-x mb-2"> SENHA </label>
                        <InputText id="password" type="password" v-model="password" class="w-full md:w-30rem mb-5" style="padding: 1rem" />

                        <div class="flex align-items-center n mt-5 gap-5">
                            <Button label="Entrar" class="w-full p-3 text-xl" @click="validate()" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
