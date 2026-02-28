import { ref } from 'vue';
import Swal from 'sweetalert2';
import { io } from 'socket.io-client';
const socket = io(import.meta.env.VITE_BASE_URL_API);

/* Color Palette */
const colorTypes = ref([
    { severity: null, hex: '#757575' },
    { severity: null, hex: '#8F48D2' },
    { severity: 'info', hex: '#3B82F6' },
    { severity: 'warning', hex: '#F59E0B' },
    { severity: 'danger', hex: '#EF4444' },
    { severity: 'success', hex: '#22C55E' }
]);

/* Tables Types */
const optionsTypesTables = ref([
    { value: 1, label: 'Oficina' },
    { value: 2, label: 'Depósito' }
]);

/* Formated Data D/M/A */
const formatData = (dataString) => {
    if (!dataString) {
        return '---';
    }
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

export { optionsTypesTables, socket, colorTypes, formatData, sendWhatsAppMessage, sendInfoClientsWhats, loadingOpen, loadingClose };
