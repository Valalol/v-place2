<script setup lang="ts">
import { useForm, usePage } from '@inertiajs/vue3';
import { Transmit } from '@adonisjs/transmit-client'
import { onMounted, ref } from 'vue';

import { Pixel } from '#types/pixel';
import PixelGrid from '@/components/PixelGrid.vue';
import BottomFloatingMenu from '@/components/Menu.vue';


interface MainPageProps {
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

defineProps<MainPageProps>()
const props = usePage().props as unknown as MainPageProps

const pixels_ref = ref<Pixel[]>(props.pixels)
const auth_user = props.auth_user

const zoom = ref(0.6);


const form = useForm<{
    pixel: { x: number; y: number; name: string } | undefined,
    color: string | undefined
}>({
    pixel: undefined,
    color: undefined
})


function add_pixel() {
    form.post('/pixels', {
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
    <div class="w-full h-screen">
        <form @submit.prevent="add_pixel()" class="size-full flex flex-col items-center bg-foreground">
            <PixelGrid :height="height" :width="width" :pixels="pixels_ref" />

            <div id="floating_zone" class="absolute self-center bottom-16 w-fit flex flex-col items-center pointer-events-none">
                <div class="bg-accent mb-4">
                    {{ props.flash?.success }}
                    {{ props.flash?.error }}
                </div>
                <div
                    class="bg-accent rounded-full border shadow-xs w-fit max-w-screen px-7 mb-4 font-mono text-base/snug">
                    <span v-if="form.pixel">
                        <span v-if="form.pixel.name">{{ form.pixel.name }}</span>
                        ({{ form.pixel.x }},{{ form.pixel.y }})
                    </span>
                    <span>{{ zoom.toFixed(2) }}x</span>
                </div>

                <BottomFloatingMenu :colors="colors" :auth_user="auth_user" />
            </div>
        </form>
    </div>
</template>