<script setup>
import { onMounted, ref } from 'vue';

onMounted(() => {});
</script>
<template>
    <div class="card">
        <div class="flex justify-content-between align-items-center mb-5">
            <h5>Best Selling Products</h5>
        </div>
        <ul class="list-none p-0 m-0">
            <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                <div>
                    <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Space T-Shirt</span>
                    <div class="mt-1 text-600">Clothing</div>
                </div>
                <div class="mt-2 md:mt-0 flex align-items-center">
                    <div class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style="height: 8px">
                        <div class="bg-orange-500 h-full" style="width: 50%"></div>
                    </div>
                    <span class="text-orange-500 ml-3 font-medium">%50</span>
                </div>
            </li>
            <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                <div>
                    <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Portal Sticker</span>
                    <div class="mt-1 text-600">Accessories</div>
                </div>
                <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                    <div class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style="height: 8px">
                        <div class="bg-cyan-500 h-full" style="width: 16%"></div>
                    </div>
                    <span class="text-cyan-500 ml-3 font-medium">%16</span>
                </div>
            </li>
            <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                <div>
                    <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Supernova Sticker</span>
                    <div class="mt-1 text-600">Accessories</div>
                </div>
                <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                    <div class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style="height: 8px">
                        <div class="bg-pink-500 h-full" style="width: 67%"></div>
                    </div>
                    <span class="text-pink-500 ml-3 font-medium">%67</span>
                </div>
            </li>
            <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                <div>
                    <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Wonders Notebook</span>
                    <div class="mt-1 text-600">Office</div>
                </div>
                <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                    <div class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style="height: 8px">
                        <div class="bg-green-500 h-full" style="width: 35%"></div>
                    </div>
                    <span class="text-green-500 ml-3 font-medium">%35</span>
                </div>
            </li>
            <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                <div>
                    <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Mat Black Case</span>
                    <div class="mt-1 text-600">Accessories</div>
                </div>
                <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                    <div class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style="height: 8px">
                        <div class="bg-purple-500 h-full" style="width: 75%"></div>
                    </div>
                    <span class="text-purple-500 ml-3 font-medium">%75</span>
                </div>
            </li>
            <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                <div>
                    <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Robots T-Shirt</span>
                    <div class="mt-1 text-600">Clothing</div>
                </div>
                <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                    <div class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style="height: 8px">
                        <div class="bg-teal-500 h-full" style="width: 40%"></div>
                    </div>
                    <span class="text-teal-500 ml-3 font-medium">%40</span>
                </div>
            </li>
        </ul>
    </div>
</template>