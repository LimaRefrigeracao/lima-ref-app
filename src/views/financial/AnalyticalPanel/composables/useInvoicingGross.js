import Axios from '@/service/Axios';
import { ref } from 'vue';
import { loadingOpen, loadingClose } from '../../../utils/computeds';
import { useToast } from 'primevue/usetoast';

export function useInvoicingGross() {
    const toast = useToast();

    const dataEarnings = ref({
        daily: { value: 0, day: '' },
        weekly: { value: 0, week: '' },
        monthly: { value: 0, month: '' },
        yearly: { value: 0, year: '' }
    });

    const getInfoEarnings = async () => {
        loadingOpen();
        try {
            const response = await Axios.get('/panel_analytical/info_values_os_paid');
            dataEarnings.value = response.data;
        } catch (error) {
            toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar informações das entrada!', life: 5000 });
            console.error(error);
        } finally {
            loadingClose();
        }
    };

    return {
        dataEarnings,
        getInfoEarnings
    };
}
