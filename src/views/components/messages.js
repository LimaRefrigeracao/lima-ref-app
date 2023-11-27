import { ref } from 'vue';
const messageLogin = ref([]);
const messageAddUser = ref([]);
const messageAddService = ref([]);
const messageAddEstimateOSSimple = ref([]);
const messageAddEstimateOSComplete = ref([]);
const messageEditInfoClient = ref([]);
const messageUpdateStatusService = ref([]);
const messageUpdateStatusPayment = ref([]);
const addMessage = (type, severity, content) => {
    if (type == 'login') {
        messageLogin.value.length = 0;
        messageLogin.value.push({ severity, content });
    } else if (type == 'addUser') {
        messageAddUser.value.length = 0;
        messageAddUser.value.push({ severity, content });
    } else if (type == 'addService') {
        messageAddService.value.length = 0;
        messageAddService.value.push({ severity, content });
    } else if (type == 'addEstimateOSSimple') {
        messageAddEstimateOSSimple.value.length = 0;
        messageAddEstimateOSSimple.value.push({ severity, content });
    } else if (type == 'addEstimateOSComplete') {
        messageAddEstimateOSComplete.value.length = 0;
        messageAddEstimateOSComplete.value.push({ severity, content });
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

export { messageAddUser, messageAddService, messageAddEstimateOSSimple, messageAddEstimateOSComplete, messageEditInfoClient, messageUpdateStatusService, messageUpdateStatusPayment, messageLogin, addMessage };
