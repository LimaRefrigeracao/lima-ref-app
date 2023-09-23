<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useRouter } from 'vue-router';
const router = useRouter();
const { changeThemeSettings, layoutConfig, onMenuToggle } = useLayout();

const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);

onMounted(() => {
    bindOutsideClickListener();
});

onBeforeUnmount(() => {
    unbindOutsideClickListener();
});

const logoUrl = computed(() => {
    return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.png`;
});

const topbarMenuClasses = computed(() => {
    return {
        'layout-topbar-menu-mobile-active': topbarMenuActive.value
    };
});

const bindOutsideClickListener = () => {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                topbarMenuActive.value = false;
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
};
const unbindOutsideClickListener = () => {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener);
        outsideClickListener.value = null;
    }
};
const isOutsideClicked = (event) => {
    if (!topbarMenuActive.value) return;

    const sidebarEl = document.querySelector('.layout-topbar-menu');
    const topbarEl = document.querySelector('.layout-topbar-menu-button');

    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
};

let modeSelected = null;
const onChangeTheme = (theme, mode) => {
    modeSelected = mode;
    const elementId = 'theme-css';
    const linkElement = document.getElementById(elementId);
    const cloneLinkElement = linkElement.cloneNode(true);
    const newThemeUrl = linkElement.getAttribute('href').replace(layoutConfig.theme.value, theme);
    cloneLinkElement.setAttribute('id', elementId + '-clone');
    cloneLinkElement.setAttribute('href', newThemeUrl);
    cloneLinkElement.addEventListener('load', () => {
        linkElement.remove();
        cloneLinkElement.setAttribute('id', elementId);
        changeThemeSettings(theme, mode === 'dark');
    });
    linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling);
};

const logout = async () => {
     // Limpe o token de autenticação ou qualquer outro estado de autenticação
      // Exemplo:
      // localStorage.removeItem('token');
      // this.isAuthenticated = false; // onde isAuthenticated é uma variável no seu componente que controla o estado de autenticação

      // Redirecione o usuário para a página de login ou página inicial
      const loginPath = '/';
      window.history.replaceState({}, 'Login', loginPath);
      router.push(loginPath);
}
</script>

<template>
    <div class="layout-topbar">
        <center>
            <img :src="logoUrl" alt="logo" style="width: 200px; height: 75px" />
        </center>

        <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
            <i class="pi pi-bars"></i>
        </button>

        <div class="layout-topbar-menu" :class="topbarMenuClasses">
            <div class="col-3">
                <i v-if="modeSelected == 'dark'" class="pi pi-sun" style="cursor: pointer; font-size: 25px" @click="onChangeTheme('lara-light-blue', 'light')"> </i>
                <i v-else class="pi pi-moon" style="cursor: pointer; font-size: 22px" @click="onChangeTheme('lara-dark-blue', 'dark')"> </i>
            </div>
            <div class="col-3 ml-5">
                <i class="pi pi-power-off" style="cursor: pointer; font-size: 22px; color:red;" @click="logout()"> </i>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
