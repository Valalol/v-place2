<script setup lang="ts">
import { router, usePage } from '@inertiajs/vue3';
import { Transmit } from '@adonisjs/transmit-client'
import { onMounted, ref } from 'vue';

import { Pixel } from '#types/pixel';
import PixelGrid from '@/components/PixelGrid.vue';
import BottomFloatingMenu from '@/components/Menu.vue';


interface PageProps {
    width: number
    height: number
    colors: string[]
    // pixelsMap: Record<number, Record<number, Pixel>>
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
const auth_user = props.auth_user

const pixelGridRef = ref<InstanceType<typeof PixelGrid>>()
const menuRef = ref<InstanceType<typeof BottomFloatingMenu>>()


function add_pixel() {
    router.post('/pixels', {
        pixel: {
            x: pixelGridRef.value?.pixel_selected?.x,
            y: pixelGridRef.value?.pixel_selected?.y
        },
        color: menuRef.value?.color_selected
    }, {
        onSuccess: () => {
            // console.log('form success');
        },
    })
}

let subscription: ReturnType<Transmit['subscription']> | null = null

onMounted(async () => {
    const transmit = new Transmit({
        baseUrl: window.location.origin,
    })
    subscription = transmit.subscription('global')
    await subscription.create()

    subscription.onMessage((data: { 'message': Pixel }) => {
        // console.log('Received from Transmit:', data.message)
        const idx = pixels_ref.value.findIndex(
            p => p.x === data.message.x && p.y === data.message.y
        )
        if (idx !== -1) {
            pixels_ref.value[idx].color = data.message.color
            pixels_ref.value[idx].userId = data.message.userId
            if (pixels_ref.value[idx].user) pixels_ref.value[idx].user.name = data.message.user?.name
            else pixels_ref.value[idx].user = { name: data.message.user?.name }
        }
    })
})

</script>

<template>
    <div class="w-full h-screen flex flex-col items-center bg-foreground">
        <PixelGrid ref="pixelGridRef" :height="height" :width="width" :pixels="pixels_ref" />

        <div id="floating_zone"
            class="absolute self-center bottom-16 w-fit flex flex-col items-center pointer-events-none">
            <div class="bg-accent mb-4">
                {{ props.flash?.success }}
                {{ props.flash?.error }}
            </div>
            <div class="bg-accent rounded-full border shadow-xs w-fit max-w-screen px-7 mb-4 font-mono text-base/snug">
                <span v-if="pixelGridRef?.pixel_selected">
                    <span v-if="pixelGridRef.pixel_selected.user?.name">{{ pixelGridRef.pixel_selected.user.name
                        }}</span>
                    ({{ pixelGridRef.pixel_selected.x }},{{ pixelGridRef.pixel_selected.y }})
                </span>
                <span>{{ pixelGridRef?.zoom.toFixed(2) }}x</span>
            </div>

            <BottomFloatingMenu ref="menuRef" :place_pixel="true" :colors="colors" :auth_user="auth_user" @place_pixel="add_pixel" />
        </div>
    </div>
</template>