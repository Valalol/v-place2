<script setup lang="ts">
import { Pixel } from '#types/pixel';
import { Button } from '@/components/ui/button';
import { usePage } from '@inertiajs/vue3';

interface MainPageProps {
    width: number
    height: number
    pixelsMap: Record<number, Record<number, Pixel>>
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
        <!-- <pre>{{ pixelsMap || {} }}</pre> -->
        <div id="main_grid" class="overflow-hidden" :style="{
            display: 'grid',
            gridTemplateRows: `repeat(${props.height}, 1fr)`,
            gridTemplateColumns: `repeat(${props.width}, 1fr)`
            }">
            <div v-for="y in props.height" :key="y">
                <div v-for="x in props.width" :key="x">
                    {{ pixelsMap[x-1][y-1] }}
                </div>
            </div>
        </div>
    </div>
</template>