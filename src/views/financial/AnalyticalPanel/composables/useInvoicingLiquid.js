import Axios from '@/service/Axios';
import { ref } from 'vue';
import { loadingOpen, loadingClose } from '../../../utils/computeds';
import { useToast } from 'primevue/usetoast';

export function useInvoicingLiquid() {
    const toast = useToast();

    const dataInvoicing = ref({
        monthly: { label: '', entry: 0, exit: 0, totality: 0 },
        yearly: { label: '', entry: 0, exit: 0, totality: 0 }
    });

    const getInfoInvoicing = async () => {
        loadingOpen();
        try {
            const response = await Axios.get('/panel_analytical/info_invoicing_liquid');
            dataInvoicing.value = response.data;
        } catch (error) {
            toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar informações das entrada!', life: 5000 });
            console.error(error);
        } finally {
            loadingClose();
        }
    };

    return {
        dataInvoicing,
        getInfoInvoicing
    };
}
