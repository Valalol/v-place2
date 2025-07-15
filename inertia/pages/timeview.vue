<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';
import { onMounted, ref } from 'vue';

import { Pixel } from '#types/pixel';
import PixelGrid from '@/components/PixelGrid.vue';
import Menu from '@/components/Menu.vue';


interface PageProps {
    width: number
    height: number
    pixels: Pixel[]
    auth_user?: any
    flash?: {
        success?: string
        error?: string
    }
}

defineProps<PageProps>()
const props = usePage().props as unknown as PageProps

const pixels_ref = ref<Pixel[]>(props.pixels)


onMounted(() => {
    console.log(props.pixels);
    const latestPixelsMap = new Map<string, Pixel>();
    for (const pixel of props.pixels) {
        const key = `${pixel.x},${pixel.y}`
        latestPixelsMap.set(key, pixel)
    }
    pixels_ref.value = Array.from(latestPixelsMap.values())
})

</script>

<template>
    <div class="w-full h-screen flex flex-col items-center bg-foreground">
        <PixelGrid :height="height" :width="width" :pixels="pixels_ref" />
        <Menu :auth_user="auth_user" :timebar="true" />
    </div>
</template>