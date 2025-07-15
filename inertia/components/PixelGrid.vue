<script setup lang="ts">
import { ref } from "vue";

import VueZoomable from "vue-zoomable";
import "vue-zoomable/dist/style.css";

import { Pixel } from '#types/pixel';

import { Check } from "lucide-vue-next";
import { bright } from "@/lib/utils";



interface Props {
    height: number
    width: number
    pixels: Pixel[]
}
const props = defineProps<Props>()

const pixel_selected = ref<Pixel | undefined>(undefined)
const pixel_hovered = ref<Pixel | undefined>(undefined)
const zoom = ref<number>(0.6);
const pan = ref<{ x: number, y: number }>({ x: 0, y: 0 });

defineExpose({
    pixel_selected,
    pixel_hovered,
    zoom,
    pan
})

</script>

<template>
    <VueZoomable class="size-full" selector="#playground" :enable-control-button="false" :min-zoom="0.1"
        :wheel-zoom-step="0.15" v-model:pan="pan" v-model:zoom="zoom">
        <div id="playground" class="grid" :style="{
            gridTemplateRows: `repeat(${props.height}, 1fr)`,
            gridTemplateColumns: `repeat(${props.width}, 1fr)`
        }">
            <div v-for="pixel in props.pixels" :key="`${pixel.x},${pixel.y}`" class="w-10 h-10 border-0 border-primary flex items-center justify-center text-[9px] [&>*]:invisible
                hover:scale-120 hover:shadow-md hover:shadow-black/50"
                :class="{ 'scale-130 shadow-md shadow-black/50 [&>*]:visible': pixel === pixel_selected }"
                :style="{ backgroundColor: pixel.color }" @click="pixel_selected = pixel"
                @mouseover="pixel_hovered = pixel">
                <Check :color="bright(pixel.color) ? 'white' : 'black'" />
            </div>
        </div>
    </VueZoomable>
</template>
