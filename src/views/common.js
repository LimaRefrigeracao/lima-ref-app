import Axios from '@/service/Axios';
import { ref, onMounted, onBeforeMount, computed, provide, inject } from 'vue';
import { loadingOpen, loadingClose } from './utils/computeds';
import { useToast } from 'primevue/usetoast';

export { ref, onMounted, onBeforeMount, computed, Axios, loadingOpen, loadingClose, useToast, provide, inject };
