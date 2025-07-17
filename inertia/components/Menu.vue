<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { ref, computed, onMounted, onUnmounted } from 'vue';

import { User } from '#types/user';

import { Check, ChevronUp, LogOut } from 'lucide-vue-next';
import { bright } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'



interface Props {
    place_pixel?: boolean
    timebar?: boolean
    colors?: string[]
    auth_user?: User
}

const props = withDefaults(defineProps<Props>(), {
    place_pixel: false,
    timebar: false
})

interface Emits {
    place_pixel: []
}
const emits = defineEmits<Emits>()

const color_selected = ref<string | undefined>(undefined)

defineExpose({
    color_selected
})


// Reactive current time for progress calculation
const now = ref(new Date())
let timeInterval: NodeJS.Timeout | null = null

const parseUTC = (timeStr: string): number => {
    return new Date(timeStr).getTime()
}

// Calculate progress percentage (0-100)
const pixelProgress = computed(() => {
    if (!props.auth_user?.lastPixelTime || !props.auth_user?.nextPixelTime) return 100

    const lastTime = parseUTC(props.auth_user.lastPixelTime)
    const nextTime = parseUTC(props.auth_user.nextPixelTime)
    const currentTime = now.value.getTime()

    if (currentTime >= nextTime) return 100

    const totalDuration = nextTime - lastTime
    const elapsed = currentTime - lastTime

    return Math.max(0, Math.min(100, (elapsed / totalDuration) * 100))
})

// Calculate remaining time in seconds
const remainingSeconds = computed(() => {
    if (!props.auth_user?.nextPixelTime) return 0

    const nextTime = parseUTC(props.auth_user.nextPixelTime)
    const currentTime = now.value.getTime()

    return Math.max(0, Math.ceil((nextTime - currentTime) / 1000))
})

// Update current time every second
onMounted(() => {
    timeInterval = setInterval(() => {
        now.value = new Date()
    }, 1000)
})

onUnmounted(() => {
    if (timeInterval) {
        clearInterval(timeInterval)
    }
})

</script>

<template>
    <div
        class="px-3 md:px-5 py-2 md:py-3 border shadow-xs rounded-lg bg-accent flex flex-row justify-between items-center gap-3 md:gap-6 pointer-events-auto">
        <div class="text-base md:text-xl font-bold select-none">V/place</div>
        <div v-if="props.place_pixel" class="flex flex-row items-center gap-3">
            <div class="flex xl:hidden">
                <Select v-model="color_selected">
                    <SelectTrigger>
                        <div v-if="color_selected" class="w-12 h-4 border shadow-xs rounded-sm align-middle"
                            :style="{ backgroundColor: color_selected }"></div>
                        <SelectValue v-else placeholder="Color" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Colors</SelectLabel>
                            <SelectItem v-for="color in props.colors" :value="color">
                                <div class="w-16 h-6 border shadow-xs rounded-sm" :style="{ backgroundColor: color }">
                                </div>
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div class="hidden xl:flex gap-1">
                <div v-for="color, index of props.colors" :key="index" class="w-7 h-7 border shadow-xs rounded-sm flex items-center justify-center cursor-pointer [&>*]:invisible
                    peer-checked:scale-120 peer-checked:[&>*]:visible"
                    :class="{ 'scale-120 [&>*]:visible': color === color_selected }" :style="{ backgroundColor: color }"
                    @click="color_selected = color">
                    <Check class="size-4" :color="bright(color) ? 'white' : 'black'" />
                </div>
            </div>

            <div v-if="remainingSeconds > 0" class="w-16 md:w-32 flex flex-col gap-1">
                <div class="text-xs text-center">
                    <span>{{ remainingSeconds }}s</span><span class="hidden md:inline"> remaining</span>
                </div>
                <Progress :model-value="pixelProgress" class="h-2" />
            </div>

            <Button variant="default" type="button" @click="emits('place_pixel')">
                <!--  :disabled="form.processing" -->
                <Check class="size-4" />
                <span class="hidden md:flex">Place pixel</span>
            </Button>
        </div>
        <div>
            <a v-if="!props.auth_user" href="/discord/redirect">
                <Button variant="outline" type="button">
                    Login with Discord
                </Button>
            </a>
            <DropdownMenu v-else>
                <DropdownMenuTrigger as-child>
                    <Button variant="outline">
                        <Avatar>
                            <AvatarImage :src="props.auth_user?.avatarUrl ?? ''" alt="" />
                        </Avatar>
                        <span class="hidden md:flex">{{ props.auth_user?.name }}</span>
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
</template>
