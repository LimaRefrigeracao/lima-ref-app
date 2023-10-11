import { ref } from 'vue';
import Swal from 'sweetalert2';
import { io } from 'socket.io-client';
const socket = io(import.meta.env.VITE_BASE_URL_API);
import Axios from '../../service/Axios';

/* Color Palette */
const colorTypes = ref([
    { severity: null, hex: '#757575' },
    { severity: null, hex: '#8F48D2' },
    { severity: 'info', hex: '#3B82F6' },
    { severity: 'warning', hex: '#F59E0B' },
    { severity: 'danger', hex: '#EF4444' },
    { severity: 'success', hex: '#22C55E' }
]);

/* Service Status */
const statusServiceOptions = ref([]);
const statusServiceMapping = ref([]);
const getStatusService = async () => {
    try {
        const response = await Axios.get('/status_service');
        statusServiceOptions.value = response.data.map((item) => item.cod.toString());
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
await getStatusService();
const getStyleStatusService = (cod) => {
    const statusService = statusServiceMapping.value.find((item) => item.cod === cod);
    return statusService || null;
};

/* Payment Status */
const statusPaymentOptions = ref([]);
const statusPaymentMapping = ref([]);
const getStatusPayment = async () => {
    try {
        const response = await Axios.get('/status_payment');
        statusPaymentOptions.value = response.data.map((item) => item.cod.toString());
        statusPaymentMapping.value = response.data;
        statusPaymentMapping.value.forEach((value) => {
            if (value.color) {
                value.color = JSON.parse(value.color);
            }
        });
    } catch (error) {
        console.error(error);
    }
};
await getStatusPayment();
const getStyleStatusPayment = (cod) => {
    const statusPayment = statusPaymentMapping.value.find((item) => item.cod === cod);
    return statusPayment || null;
};

/* Products Types */
const typesProductOptions = ref([]);
const getTypesProduct = async () => {
    try {
        const response = await Axios.get('/types_product');
        typesProductOptions.value = response.data.map((item) => item.name);
    } catch (error) {
        console.error(error);
    }
};
await getTypesProduct();

/* Tables Types */
const optionsTypesTables = ref([
    { value: 1, label: 'Oficina' },
    { value: 2, label: 'Depósito' }
]);

/* Formated Data D/M/A */
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

/* Message Whatsapp Client */
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

/* Message Whatsapp Employeers */
const sendInfoClientsWhats = (data) => {
    let adress = '';
    let mapsLink = '';
    if (data.adress) {
        const adressFormated = encodeURIComponent(data.adress);
        adress = `\nEndereço: ${data.adress}`;
        mapsLink = `\nGoogleMaps: https://www.google.com/maps/search/?api=1&query=${adressFormated}`;
    }

    const message = `Produto: ${data.product} \nCliente: ${data.client} \nTelefone: ${data.telephone} ${adress} ${mapsLink}`;
    const encodedMessage = encodeURIComponent(message);

    const whatsappLink = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappLink, '_blank');
};

/* Loads Alert */
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

export {
    typesProductOptions,
    statusPaymentOptions,
    statusServiceOptions,
    statusServiceMapping,
    optionsTypesTables,
    socket,
    colorTypes,
    formatData,
    getStyleStatusService,
    getStyleStatusPayment,
    sendWhatsAppMessage,
    sendInfoClientsWhats,
    loadingOpen,
    loadingClose
};
