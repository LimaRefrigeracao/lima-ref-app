import { ref } from 'vue';
import Swal from 'sweetalert2';
import { io } from 'socket.io-client';
const socket = io(import.meta.env.VITE_BASE_URL_API);

const productsTypes = ref(['Máquina de Lavar', 'Geladeira', 'Freezer', 'Micro-ondas', 'Forno Elétrico', 'Air Fryer', 'Central de Ar', 'Bebedouro', 'Ar-Condicionado', 'Expositor', 'Tanquinho', 'Lava e Seca', 'Secadora', 'Outros']);
const statusPaymentOptions = ref(['1', '2', '3']);
const statusPaymentMapping = ref({
    1: 'Aberto',
    2: 'Pendente',
    3: 'Pago'
});
const statusServiceOptions = ref(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13']);
const statusServiceMapping = ref({
    1: 'Visitar',
    2: 'Buscar',
    3: 'Na Fila',
    4: 'Mexendo',
    5: 'Orçamentado',
    6: 'Autorizado',
    7: 'Aguardando peças',
    8: 'Consertando',
    9: 'Testando',
    10: 'Pronto',
    11: 'Entregar',
    12: 'Devolver',
    13: 'Concluído'
});
const statusTypes = ref([
    { code: 1, name: 'Visitar' },
    { code: 2, name: 'Buscar' },
    { code: 3, name: 'Na Fila' },
    { code: 4, name: 'Mexendo' },
    { code: 5, name: 'Orçamentado' },
    { code: 6, name: 'Autorizado' },
    { code: 6, name: 'Aguardando peças' },
    { code: 6, name: 'Consertando' },
    { code: 7, name: 'Testando' },
    { code: 8, name: 'Pronto' },
    { code: 9, name: 'Entregar' },
    { code: 10, name: 'Devolver' },
    { code: 11, name: 'Concluído' }
]);

const getStatusServiceLabel = (status) => {
    return statusServiceMapping.value[status] || status;
};
const getStatusPaymentLabel = (status) => {
    return statusPaymentMapping.value[status] || status;
};
const getStatusPaymentClass = (status) => {
    switch (status) {
        case 1:
            return 'info';
        case 2:
            return 'warning';
        case 3:
            return 'success';
        default:
            return '';
    }
};
const getStatusServiceClass = (status) => {
    switch (status) {
        case 1:
            return 'info';
        case 2:
            return 'info';
        case 3:
            return 'info';
        case 4:
            return 'warning';
        case 5:
            return 'warning';
        case 6:
            return 'warning';
        case 7:
            return 'warning';
        case 8:
            return 'warning';
        case 9:
            return 'warning';
        case 10:
            return 'success';
        case 11:
            return 'success';
        case 12:
            return 'success';
        case 13:
            return 'success';
        default:
            return '';
    }
};
const formatData = (dataString) => {
    const partes = dataString.split('-');
    if (partes.length !== 3) {
        return 'Data inválida';
    }
    const ano = partes[0].substring(2);
    const mes = partes[1];
    const dia = partes[2];
    return `${dia}/${mes}/${ano}`;
};

const sendWhatsAppMessage = (data, dataEstimate) => {
    const jsonData = JSON.parse(dataEstimate.estimate);
    const list = jsonData.map((item) => {
        const description = item.description.replace(/\n/g, ' ');
        return `${item.amount} - ${description}`;
    });
    const listString = list.join('\n');
    const phoneNumber = data.telephone;
    let connection = '';
    let initMessage = '';
    switch (data.product) {
        case 'Máquina de Lavar' || 'Geladeira' || 'Air Fryer' || 'Central de Ar' || 'Lava e Seca' || 'Secadora':
            connection = 'da sua';
            break;
        case 'Freezer' || 'Micro-ondas' || 'Forno Elétrico' || 'Tanquinho' || 'Expositor' || 'Bebedouro' || 'Ar-Condicionado':
            connection = 'do seu';
            break;
        case 'Outros':
            initMessage = 'Olá, vim passar o seu orçamento';
            break;
    }

    let message = '';
    if (data.product == 'Outros') {
        message = `${initMessage}!\n\n${listString}.\n\nFica no valor de R$${dataEstimate.value},00.`;
    } else {
        message = `Olá, vim passar o orçamento do conserto ${connection} ${data.product}!\n\n${listString}.\n\nFica no valor de R$${dataEstimate.value},00.`;
    }

    const encodedPhoneNumber = encodeURIComponent(phoneNumber);
    const encodedMessage = encodeURIComponent(message);

    const whatsappLink = `https://wa.me/${encodedPhoneNumber}?text=${encodedMessage}`;

    window.open(whatsappLink, '_blank');
};

const loadingOpen = () => {
    Swal.fire({
        title: 'Carregando',
        didOpen: () => {
            Swal.showLoading();
        }
    });
};

const loadingClose = () => {
    Swal.close();
};

const googleMapsUrl = (adress) => {
    const adressFormated = encodeURIComponent(adress);
    const mapsLink = `https://www.google.com/maps/search/?api=1&query=${adressFormated}`;
    window.open(mapsLink, '_blank');
};

export {
    productsTypes,
    statusPaymentOptions,
    statusServiceOptions,
    statusTypes,
    socket,
    formatData,
    getStatusServiceLabel,
    getStatusPaymentLabel,
    getStatusPaymentClass,
    getStatusServiceClass,
    sendWhatsAppMessage,
    loadingOpen,
    loadingClose,
    googleMapsUrl
};
