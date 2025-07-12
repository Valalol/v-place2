<script setup lang="ts">
import { Pixel } from '#types/pixel';
import { Button } from '@/components/ui/button';
import { usePage } from '@inertiajs/vue3';
import { ref } from 'vue';
import { Check, ChevronRight, ChevronUp } from 'lucide-vue-next';
import VueZoomable from "vue-zoomable";
import "vue-zoomable/dist/style.css";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface MainPageProps {
    width: number
    height: number
    colors: string[]
    // pixelsMap: Record<number, Record<number, Pixel>>
    pixels: Pixel[]
    auth_user?: any
}

defineProps<MainPageProps>()
const props = usePage().props as unknown as MainPageProps
const auth_user = props.auth_user

const zoom = ref(0.6);
const pan = ref({ x: 0, y: 0 });

function bright(c: string) {
    c = c.replace(/^#/, '')
    if (c.length == 3) c = c.replace(/./g, x => x + x)
    let [r, g, b] = [0, 2, 4].map(i => parseInt(c.slice(i, i + 2), 16))
    return .299 * r + .587 * g + .114 * b < 70
}

</script>

<template>
    <div class="flex flex-col items-center w-full h-screen bg-foreground">
        <!-- <pre>{{ auth_user }}</pre> -->

        <VueZoomable class="size-full" selector="#playground" :enable-control-button="false" :min-zoom="0.1"
            :wheel-zoom-step="0.15" v-model:pan="pan" v-model:zoom="zoom">
            <div id="playground" class="grid" :style="{
                gridTemplateRows: `repeat(${props.height}, 1fr)`,
                gridTemplateColumns: `repeat(${props.width}, 1fr)`
            }">
                <div v-for="pixel in props.pixels" :key="`${pixel.x},${pixel.y}`"
                    class="w-10 h-10 border border-[#8b57a8] flex items-center justify-center text-[9px] hover:scale-120 hover:shadow-md hover:shadow-black/50"
                    :style="{ backgroundColor: `rgb(${pixel.x / props.width * 250}, ${pixel.y / props.height * 250}, 100)` }"
                    @click="console.log(`Clicked on pixel (${pixel.x}, ${pixel.y})`);">
                    <!-- :class="`bg-[#${pixel.color.toLowerCase()}]`" -->
                    {{ `(${pixel.x}, ${pixel.y})` }}
                </div>
            </div>
        </VueZoomable>

        <div id="floating_menu"
            class="absolute self-center bottom-16 w-2/3 px-7 py-3 rounded-lg bg-accent flex flex-row justify-between items-center">
            <div class="text-xl font-bold select-none">V/place</div>
            <div id="colors" class="flex gap-3">
                <div v-for="color, index of colors" :key="index">
                    <input :id="`color-${index}`" type="radio" name="color" :value="color" class="peer hidden" />
                    <label :for="`color-${index}`"
                        class="w-8 h-8 border-2 border-black rounded-sm flex items-center justify-center cursor-pointer [&>*]:invisible peer-checked:scale-120 peer-checked:[&>*]:visible"
                        :style="{ backgroundColor: color }">
                        <Check :color="bright(color) ? 'white' : 'black'" />
                    </label>
                </div>
            </div>
            <div>
                <Button v-if="!auth_user" variant="outline">
                    <a href="/discord/redirect">Login with Discord</a>
                </Button>
                <div v-else class="flex items-center gap-3">
                    <Button variant="default">
                        <Check class="size-4" />
                        Place pixel
                    </Button>
                    <Button variant="outline">
                        <Avatar>
                            <AvatarImage :src="auth_user.avatarUrl" alt="@unovue" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <p>{{ auth_user.name }}</p>
                        <ChevronUp />
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>
<!-- [&:peer-checked>*]:block -->