<script setup lang="ts">
import { router, useForm, usePage } from '@inertiajs/vue3';
import { Transmit } from '@adonisjs/transmit-client'
import { onMounted, ref } from 'vue';

import VueZoomable from "vue-zoomable";
import "vue-zoomable/dist/style.css";

import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Check, ChevronUp, LogOut } from 'lucide-vue-next';

import { Pixel } from '#types/pixel';


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

const pixels_ref = ref<Pixel[]>(props.pixels)
const auth_user = props.auth_user

const zoom = ref(0.6);
const pan = ref({ x: 0, y: 0 });

function bright(c: string) {
    c = c.replace(/^#/, '')
    if (c.length == 3) c = c.replace(/./g, x => x + x)
    let [r, g, b] = [0, 2, 4].map(i => parseInt(c.slice(i, i + 2), 16))
    return .299 * r + .587 * g + .114 * b < 70
}


const form = useForm({
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
        console.log('Received from Transmit:', data.message)
        const idx = pixels_ref.value.findIndex(
            p => p.x === data.message.x && p.y === data.message.y
        )
        if (idx !== -1) {
            pixels_ref.value[idx].color = data.message.color
            pixels_ref.value[idx].userId = data.message.userId
        }
    })
})


</script>

<template>
    <div class="w-full h-screen">
        <!-- <pre>{{ auth_user }}</pre> -->
        <form @submit.prevent="add_pixel()" class="size-full flex flex-col items-center bg-foreground">
            <VueZoomable class="size-full" selector="#playground" :enable-control-button="false" :min-zoom="0.1"
                :wheel-zoom-step="0.15" v-model:pan="pan" v-model:zoom="zoom">
                <div id="playground" class="grid" :style="{
                    gridTemplateRows: `repeat(${props.height}, 1fr)`,
                    gridTemplateColumns: `repeat(${props.width}, 1fr)`
                }">
                    <div v-for="pixel in pixels_ref" :key="`${pixel.x},${pixel.y}`">
                        <input :id="`pixel-${pixel.x}-${pixel.y}`" type="radio" name="pixel"
                            :value="{ x: pixel.x, y: pixel.y }" v-model="form.pixel" class="peer hidden" />
                        <label :for="`pixel-${pixel.x}-${pixel.y}`"
                            class="w-10 h-10 border-0 border-primary
                            flex items-center justify-center text-[9px] [&>*]:invisible
                            hover:scale-120 hover:shadow-md hover:shadow-black/50
                            peer-checked:scale-130 peer-checked:shadow-md peer-checked:shadow-black/50 peer-checked:[&>*]:visible"
                            :style="{ backgroundColor: pixel.color }">
                            <Check :color="bright(pixel.color) ? 'white' : 'black'" />
                        </label>
                    </div>
                </div>
            </VueZoomable>

            <div id="floating_menu"
                class="absolute self-center bottom-16 w-2/3 px-7 py-3 rounded-lg bg-accent flex flex-row justify-between items-center">
                <div class="text-xl font-bold select-none">V/place</div>
                <div id="colors" class="flex gap-3">
                    <div v-for="color, index of colors" :key="index">
                        <input :id="`color-${index}`" type="radio" name="color" :value="color" v-model="form.color"
                            class="peer hidden" />
                        <label :for="`color-${index}`"
                            class="w-8 h-8 border shadow-xs rounded-sm flex items-center justify-center cursor-pointer [&>*]:invisible peer-checked:scale-120 peer-checked:[&>*]:visible"
                            :style="{ backgroundColor: color }">
                            <Check :color="bright(color) ? 'white' : 'black'" />
                        </label>
                    </div>
                </div>
                <div>
                    <a v-if="!auth_user" href="/discord/redirect">
                        <Button variant="outline" type="button">
                            Login with Discord
                        </Button>
                    </a>
                    <div v-else class="flex items-center gap-3">
                        <Button variant="default" type="submit" :disabled="form.processing">
                            <Check class="size-4" />
                            Place pixel
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger as-child>
                                <Button variant="outline">
                                    <Avatar>
                                        <AvatarImage :src="auth_user.avatarUrl" alt="" />
                                    </Avatar>
                                    <p>{{ auth_user.name }}</p>
                                    <ChevronUp />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent class="w-30">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>
                                        <span>Profile</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <span>Settings</span>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem @click="router.visit('/discord/logout')">
                                    <span>Log out</span>
                                    <DropdownMenuShortcut>
                                        <LogOut />
                                    </DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>
<!-- [&:peer-checked>*]:block -->