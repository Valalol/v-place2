<script setup lang="ts">
import { Pixel } from '#types/pixel';
import { Button } from '@/components/ui/button';
import { usePage } from '@inertiajs/vue3';

interface MainPageProps {
    width: number
    height: number
    // pixelsMap: Record<number, Record<number, Pixel>>
    pixels: Pixel[]
    auth_user?: any
}

defineProps<MainPageProps>()

const props = usePage().props as unknown as MainPageProps
const auth_user = props.auth_user
</script>

<template>
    <div class="flex flex-col items-center w-full">
        Hey
        <Button variant="outline">
            <a href="/discord/redirect">Login with Discord</a>
        </Button>
        <pre>{{ auth_user || {} }}</pre>


        <div id="main_grid" class="grid w-[600px] h-[600px]" :style="{
            gridTemplateRows: `repeat(${props.height}, 1fr)`,
            gridTemplateColumns: `repeat(${props.width}, 1fr)`
        }">
            <div v-for="pixel in props.pixels" :key="pixel.x + '' + pixel.y" class="border-1 border-[#e4e4e4]"
                :style="{
                    backgroundColor: `rgb(${pixel.x * 10}, ${pixel.y * 10}, ${pixel.x*pixel.y*7})`
                }">
            </div>
        </div>
    </div>
</template>