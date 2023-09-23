import { ref } from 'vue';
const messageAddService = ref([]);
const messageAddEstimateOS = ref([]);
const messageEditInfoClient = ref([]);
const messageUpdateStatusService = ref([]);
const messageUpdateStatusPayment = ref([]);
const addMessage = (type, severity, content) => {
    if (type == 'addService') {
        messageAddService.value.length = 0;
        messageAddService.value.push({ severity, content });
    } else if (type == 'addEstimateOS') {
        messageAddEstimateOS.value.length = 0;
        messageAddEstimateOS.value.push({ severity, content });
    } else if (type == 'editInfoClient') {
        messageEditInfoClient.value.length = 0;
        messageEditInfoClient.value.push({ severity, content });
    } else if (type == 'updateStatusService') {
        messageUpdateStatusService.value.length = 0;
        messageUpdateStatusService.value.push({ severity, content });
    } else if (type == 'updateStatusPayment') {
        messageUpdateStatusPayment.value.length = 0;
        messageUpdateStatusPayment.value.push({ severity, content });
    }
};

export { messageAddService, messageAddEstimateOS, messageEditInfoClient, messageUpdateStatusService, messageUpdateStatusPayment, addMessage};
