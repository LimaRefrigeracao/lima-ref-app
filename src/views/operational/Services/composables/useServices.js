import Axios from '@/service/Axios';
import pdfGenerator from '@/service/PdfGenerator.js';
import { ref, onBeforeMount, provide } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { messageAddService, messageAddEstimateOSSimple, messageAddEstimateOSComplete, messageEditInfoClient, messageUpdateStatusService, messageUpdateStatusPayment, addMessage } from '../../../utils/messages.js';
import { optionsTypesTables, socket, formatData, sendWhatsAppMessage, sendInfoClientsWhats, loadingOpen, loadingClose } from '../../../utils/computeds.js';

export function useServices() {
    const toast = useToast();
    const confirmPopup = useConfirm();

    /* Service Status */
    const statusServiceOptions = ref([]);
    const statusServiceMapping = ref([]);
    const getStatusService = async () => {
        try {
            const response = await Axios.get('/status_service');
            statusServiceOptions.value = response.data.map((item) => item.cod.toString());
            statusServiceMapping.value = response.data;
            statusServiceMapping.value.forEach((value) => {
                if (value.color) value.color = JSON.parse(value.color);
            });
        } catch (error) {
            console.error(error);
        }
    };
    const getStyleStatusService = (cod) => statusServiceMapping.value.find((item) => item.cod === cod) || null;

    /* Payment Status */
    const statusPaymentOptions = ref([]);
    const statusPaymentMapping = ref([]);
    const getStatusPayment = async () => {
        try {
            const response = await Axios.get('/status_payment');
            statusPaymentOptions.value = response.data.map((item) => item.cod.toString());
            statusPaymentMapping.value = response.data;
            statusPaymentMapping.value.forEach((value) => {
                if (value.color) value.color = JSON.parse(value.color);
            });
        } catch (error) {
            console.error(error);
        }
    };
    const getStyleStatusPayment = (cod) => statusPaymentMapping.value.find((item) => item.cod === cod) || null;

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

    /* Table / Filters */
    const typeTable = ref({ value: 1, label: 'Oficina' });
    const loading = ref(null);
    const filters = ref(null);
    const initFilters = () => {
        filters.value = {
            order_of_service: { value: null },
            product: { value: null },
            client: { value: null },
            telephone: { value: null },
            adress: { value: null },
            status: { value: null },
            payment_status: { value: null },
            observation: { value: null },
            created_at: { value: null }
        };
    };
    const clearFilter = () => initFilters();

    /* OS type */
    const typeOS = ref({ label: 'Simplificada', value: 'simples' });
    const typeOsOptions = ref([
        { label: 'Simplificada', value: 'simples' },
        { label: 'Detalhada', value: 'completa' }
    ]);

    /* Services data */
    const dataGetOS = ref([]);
    socket.on('reloadDataOrders', (data) => { dataGetOS.value = data; });

    const getUniqueOS = async (order_of_service) => {
        try {
            const response = await Axios.get('/order_of_service/' + order_of_service);
            dataGetOS.value = response.data[0];
            return dataGetOS.value;
        } catch (error) {
            toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar OS específica', life: 5000 });
            console.error(error);
        }
    };

    const dataGetService = ref([]);
    socket.on('reloadDataService', (data) => { dataGetService.value = data; });

    const getServices = async () => {
        loadingOpen();
        try {
            const response = await Axios.get('/services');
            dataGetService.value = response.data;
            initFilters();
        } catch (error) {
            toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar serviços', life: 5000 });
            console.error(error);
        } finally {
            loadingClose();
        }
    };

    const getServicesWarehouse = async () => {
        loadingOpen();
        try {
            const response = await Axios.get('/services/warehouse');
            dataGetService.value = response.data;
            initFilters();
        } catch (error) {
            toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar serviços do depósito', life: 5000 });
            console.error(error);
        } finally {
            loadingClose();
        }
    };

    const updateWarehouseForService = async (id) => {
        try {
            await Axios.put('/services/warehouse/' + id + '/true', { typeTable: typeTable.value.value });
            toast.add({ severity: 'success', summary: 'Enviado', detail: '', life: 5000 });
        } catch (error) {
            toast.add({ severity: 'error', summary: 'Erro', detail: '', life: 5000 });
            console.error(error);
        }
    };
    const confirmUpdateForServices = (event, idService) => {
        confirmPopup.require({
            target: event.target,
            message: 'Deseja levar este serviço de volta?',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            accept: () => { updateWarehouseForService(idService); }
        });
    };

    const deleteService = async (idService, cod_order) => {
        loadingOpen();
        try {
            await Axios.delete('/services/' + idService + '/' + cod_order + '/' + typeTable.value.value);
            toast.add({ severity: 'success', summary: 'Deletado', detail: 'Serviço deletado com sucesso', life: 5000 });
        } catch (error) {
            toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao deletar serviço', life: 5000 });
            console.error(error);
        } finally {
            loadingClose();
        }
    };
    const confirmDeleteService = (event, data) => {
        confirmPopup.require({
            target: event.target,
            message: 'Deseja realmente excluir este serviço?',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            accept: () => { deleteService(data.id, data.order_of_service); }
        });
    };

    const updateWarehouse = async (id) => {
        loadingOpen();
        try {
            await Axios.put('/services/warehouse/' + id + '/false', { typeTable: typeTable.value.value });
            toast.add({ severity: 'success', summary: 'Enviado', detail: 'Serviço enviado ao depósito', life: 5000 });
        } catch (error) {
            toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao enviar serviço ao depósito', life: 5000 });
            console.error(error);
        } finally {
            loadingClose();
        }
    };
    const confirmUpdateWarehouse = (event, idService) => {
        confirmPopup.require({
            target: event.target,
            message: 'Deseja enviar este serviço ao depósito?',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            accept: () => { updateWarehouse(idService); }
        });
    };

    /* Edit info client */
    const originalInfoClient = ref({});
    const dataEditInfoClient = ref({});
    const displayModalEditInfo = ref(false);
    const positionModalEditInfo = ref(false);

    const isInfoClientChanged = () => JSON.stringify(dataEditInfoClient.value) !== JSON.stringify(originalInfoClient.value);
    const resetInfoClient = () => { dataEditInfoClient.value = { ...originalInfoClient.value }; };
    const openModalEditInfo = (position, data) => {
        messageEditInfoClient.value.length = 0;
        displayModalEditInfo.value = true;
        positionModalEditInfo.value = position;
        ['id', 'product', 'client', 'telephone', 'adress', 'observation'].forEach((k) => {
            dataEditInfoClient.value[k] = data[k];
            originalInfoClient.value[k] = data[k];
        });
    };
    const updateInfoClient = async () => {
        loadingOpen();
        try {
            await Axios.put('/services/info/client/' + dataEditInfoClient.value.id, {
                product: dataEditInfoClient.value.product,
                client: dataEditInfoClient.value.client,
                telephone: dataEditInfoClient.value.telephone,
                adress: dataEditInfoClient.value.adress,
                observation: dataEditInfoClient.value.observation,
                typeTable: typeTable.value.value
            });
            toast.add({ severity: 'success', summary: 'Editado', detail: 'As informações do cliente foram editadas', life: 5000 });
            closeModal();
        } catch (error) {
            toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao editar as informações do cliente', life: 5000 });
            console.error(error);
        } finally {
            loadingClose();
        }
    };
    const validateEditInfoClient = async () => {
        if (!dataEditInfoClient.value.product || !dataEditInfoClient.value.client || !dataEditInfoClient.value.telephone) {
            addMessage('editInfoClient', 'error', 'Preencha todos os campos obrigatórios.', true);
        } else {
            await updateInfoClient();
        }
    };

    /* Edit status */
    const dataEditStatus = ref({ id: null, status: null, label: '' });
    const displayModalEditStatus = ref(false);
    const positionModalEditStatus = ref(false);
    const openModalEditStatus = (position, data) => {
        messageUpdateStatusService.value.length = 0;
        displayModalEditStatus.value = true;
        positionModalEditStatus.value = position;
        dataEditStatus.value.label = getStyleStatusService(data.status).description;
        dataEditStatus.value.id = data.id;
        dataEditStatus.value.status = data.status;
    };
    const updateStatus = async () => {
        loadingOpen();
        try {
            await Axios.put('/services/status/' + dataEditStatus.value.id + '/' + dataEditStatus.value.status, { typeTable: typeTable.value.value });
            toast.add({ severity: 'success', summary: 'Atualizado', detail: 'Status atualizado com sucesso', life: 5000 });
            closeModal();
        } catch (error) {
            toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar o status', life: 5000 });
            console.error(error);
        } finally {
            loadingClose();
        }
    };
    const validateUpdateStatusService = async () => {
        if (!dataEditStatus.value.status) {
            addMessage('updateStatusService', 'error', 'Campo obrigatório.');
        } else {
            await updateStatus();
        }
    };

    /* Edit payment status */
    const dataEditPaymentStatus = ref({ id: null, payment_status: null, label: '' });
    const displayModalEditPaymentStatus = ref(false);
    const positionModalEditPaymentStatus = ref(false);
    const openModalEditPaymentStatus = (position, data) => {
        messageUpdateStatusPayment.value.length = 0;
        displayModalEditPaymentStatus.value = true;
        positionModalEditPaymentStatus.value = position;
        dataEditPaymentStatus.value.label = getStyleStatusPayment(data.payment_status).description;
        dataEditPaymentStatus.value.id = data.id;
        dataEditPaymentStatus.value.payment_status = data.payment_status;
    };
    const updatePaymentStatus = async () => {
        loadingOpen();
        try {
            await Axios.put('/services/status/payment/' + dataEditPaymentStatus.value.id + '/' + dataEditPaymentStatus.value.payment_status, { typeTable: typeTable.value.value });
            toast.add({ severity: 'success', summary: 'Atualizado', detail: 'Status de pagamento atualizado com sucesso', life: 5000 });
            closeModal();
        } catch (error) {
            toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar o status de pagamento ', life: 5000 });
            console.error(error);
        } finally {
            loadingClose();
        }
    };
    const validateUpdateStatusPayment = async () => {
        if (!dataEditPaymentStatus.value.payment_status) {
            addMessage('updateStatusPayment', 'error', 'Campo obrigatório.');
        } else {
            await updatePaymentStatus();
        }
    };

    /* Estimate OS */
    const dataPutOrderOfServiceSimple = ref({});
    const dataPutOrderOfServiceComplete = ref({});
    const displayModalOS = ref(false);
    const positionModalOS = ref(false);
    const dataViewEstimateOS = ref([]);
    const displayButtonRemoveOS = ref(false);

    const openModalOS = async (position, data) => {
        const dataOS = await getUniqueOS(data.order_of_service);
        displayButtonRemoveOS.value = data.status !== 13;
        if (dataOS) {
            messageAddEstimateOSSimple.value.length = 0;
            messageAddEstimateOSComplete.value.length = 0;
            dataViewEstimateOS.value = JSON.parse(dataOS.estimate);
            dataPutOrderOfServiceSimple.value = dataViewEstimateOS.value && dataViewEstimateOS.value.length > 0
                ? dataViewEstimateOS.value
                : { 0: { id: null, description: '', price: null } };
            displayModalOS.value = true;
            positionModalOS.value = position;
            typeOS.value = dataViewEstimateOS.value[0].amount !== ''
                ? { label: 'Detalhada', value: 'completa' }
                : { label: 'Simplificada', value: 'simples' };
        } else {
            toast.add({ severity: 'info', summary: 'Sem Orçamento', detail: 'Não foi encontrado o orçamento desse serviço.', life: 5000 });
        }
    };

    const validateUpdateEstimateOS = async (data) => {
        if (typeOS.value.value === 'simples') {
            if (!dataPutOrderOfServiceSimple.value[0].description || !dataPutOrderOfServiceSimple.value[0].price) {
                addMessage('addEstimateOSSimple', 'error', 'Preencha todos os campos obrigatórios.');
            } else {
                await updateEstimateOS(data);
            }
        } else {
            if (!dataPutOrderOfServiceComplete.value.amount || !dataPutOrderOfServiceComplete.value.description || !dataPutOrderOfServiceComplete.value.price) {
                addMessage('addEstimateOSComplete', 'error', 'Preencha todos os campos obrigatórios.');
            } else {
                await updateEstimateOS(data);
            }
        }
    };

    const updateEstimateOS = async (data) => {
        loadingOpen();
        try {
            const dataPutOrderOfService = ref({});
            if (typeOS.value.value === 'simples') {
                dataPutOrderOfService.value.amount = '';
                dataPutOrderOfService.value.description = dataPutOrderOfServiceSimple.value[0].description;
                dataPutOrderOfService.value.price = dataPutOrderOfServiceSimple.value[0].price;
            } else {
                dataPutOrderOfService.value = dataPutOrderOfServiceComplete.value;
            }
            await Axios.put('/order_of_service/estimate/' + data.order_of_service, {
                type: typeOS.value.value,
                id: !dataPutOrderOfService.value.id ? null : dataPutOrderOfService.value.id,
                amount: dataPutOrderOfService.value.amount,
                description: dataPutOrderOfService.value.description,
                price: dataPutOrderOfService.value.price
            });
            closeModal();
            await openModalOS('top', data);
            toast.add({ severity: 'success', summary: 'Adicionado', detail: 'Registro de OS adicionado com sucesso', life: 5000 });
        } catch (error) {
            console.error(error);
            toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao adicionar registro de OS', life: 5000 });
        } finally {
            loadingClose();
        }
    };

    const deleteEstimateOS = async (cod, data) => {
        loadingOpen();
        try {
            await Axios.delete('/order_of_service/estimate/' + cod + '/' + data.id);
            toast.add({ severity: 'success', summary: 'Deletado', detail: 'Registro de OS deletado com sucesso', life: 5000 });
            const dataOpen = { order_of_service: cod };
            closeModal();
            await openModalOS('top', dataOpen);
        } catch (error) {
            toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao deletar registro de OS', life: 5000 });
            console.error(error);
        } finally {
            loadingClose();
        }
    };

    /* Modal view observation */
    const displayModalViewObservation = ref(false);
    const positionModalViewObservation = ref(false);
    const dataViewObservation = ref({ id: null, observation: '' });
    const openModalViewObservation = (position, data) => {
        displayModalViewObservation.value = true;
        positionModalViewObservation.value = position;
        dataViewObservation.value.id = data.id;
        dataViewObservation.value.observation = data.observation;
    };

    /* Modal view adress */
    const displayModalViewAdress = ref(false);
    const positionModalViewAdress = ref(false);
    const dataViewAdress = ref({ id: null, adress: '' });
    const openModalViewAdress = (position, data) => {
        displayModalViewAdress.value = true;
        positionModalViewAdress.value = position;
        dataViewAdress.value.id = data.id;
        dataViewAdress.value.adress = data.adress;
    };

    /* Modal add */
    const displayModalAdd = ref(false);
    provide('displayDialogAdd', displayModalAdd);
    const openModalAdd = () => {
        messageAddService.value.length = 0;
        displayModalAdd.value = true;
    };

    /* Close modal (centralizado) */
    const closeModal = () => {
        if (displayModalOS.value === true) {
            dataPutOrderOfServiceComplete.value.amount = null;
            dataPutOrderOfServiceComplete.value.description = '';
            dataPutOrderOfServiceComplete.value.price = null;
        }
        if (displayModalEditPaymentStatus.value === true) {
            messageUpdateStatusPayment.value.length = 0;
            displayModalEditPaymentStatus.value = false;
            Object.assign(dataEditPaymentStatus.value, { id: '', payment_status: '', label: '' });
        }
        if (displayModalEditStatus.value === true) {
            messageUpdateStatusService.value.length = 0;
            displayModalEditStatus.value = false;
            Object.assign(dataEditStatus.value, { id: '', status: '', label: '' });
        }
        if (displayModalEditInfo.value === true) {
            messageEditInfoClient.value.length = 0;
            displayModalEditInfo.value = false;
            Object.assign(dataEditInfoClient.value, { id: '', product: '', client: '', telephone: '', adress: '', observation: '' });
        }
    };

    /* Change table */
    const changeTable = async (type) => {
        if (type === 1) await getServices();
        else if (type === 2) await getServicesWarehouse();
    };

    /* Overlay */
    const idop = ref(null);
    const op = ref();
    const toggle = async (event, id) => {
        idop.value = id;
        const result = await openOverlay(id);
        if (result) op.value.toggle(event);
    };
    const openOverlay = (id) => id === idop.value;

    return {
        // utils
        optionsTypesTables, formatData, sendWhatsAppMessage, sendInfoClientsWhats, pdfGenerator,
        // state
        typeTable, loading, filters, typeOS, typeOsOptions,
        // messages
        messageAddEstimateOSSimple, messageAddEstimateOSComplete, messageEditInfoClient,
        messageUpdateStatusService, messageUpdateStatusPayment, messageAddService,
        // status
        statusServiceOptions, statusPaymentOptions,
        getStyleStatusService, getStyleStatusPayment,
        // data
        dataGetOS, dataGetService,
        typesProductOptions,
        // modals
        displayModalOS, positionModalOS, dataViewEstimateOS, displayButtonRemoveOS,
        dataPutOrderOfServiceSimple, dataPutOrderOfServiceComplete,
        displayModalViewObservation, positionModalViewObservation, dataViewObservation,
        displayModalViewAdress, positionModalViewAdress, dataViewAdress,
        displayModalEditPaymentStatus, positionModalEditPaymentStatus, dataEditPaymentStatus,
        displayModalEditStatus, positionModalEditStatus, dataEditStatus,
        displayModalEditInfo, positionModalEditInfo, dataEditInfoClient,
        displayModalAdd,
        // methods - data fetch
        getStatusService, getStatusPayment, getTypesProduct, getServices,
        // methods - actions
        clearFilter, changeTable, openModalAdd, closeModal,
        openModalOS, validateUpdateEstimateOS, deleteEstimateOS,
        openModalViewObservation, openModalViewAdress,
        openModalEditPaymentStatus, validateUpdateStatusPayment,
        openModalEditStatus, validateUpdateStatusService,
        openModalEditInfo, validateEditInfoClient, isInfoClientChanged, resetInfoClient,
        confirmDeleteService, confirmUpdateWarehouse, confirmUpdateForServices,
        toggle, openOverlay, idop, op
    };
}
