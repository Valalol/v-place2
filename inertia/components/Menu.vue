<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { ref } from 'vue';

import { User } from '#types/user';

import { Check, ChevronUp, LogOut } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'


interface Props {
    colors: string[]
    auth_user?: User
}
defineProps<Props>()

const color_selected = ref<string | undefined>(undefined)

function bright(c: string) {
    c = c.replace(/^#/, '')
    if (c.length == 3) c = c.replace(/./g, x => x + x)
    let [r, g, b] = [0, 2, 4].map(i => parseInt(c.slice(i, i + 2), 16))
    return .299 * r + .587 * g + .114 * b < 70
}

</script>

<template>
    <div class="px-3 md:px-5 py-2 md:py-3 border shadow-xs rounded-lg bg-accent flex flex-row justify-between items-center gap-1 md:gap-8 pointer-events-auto">
        <div class="text-base md:text-xl font-bold select-none">V/place</div>
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
                        <SelectItem v-for="color in colors" :value="color">
                            <div class="w-16 h-6 border shadow-xs rounded-sm" :style="{ backgroundColor: color }"></div>
                        </SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
        <div class="hidden xl:flex gap-1">
            <div v-for="color, index of colors" :key="index">
                <div class="w-7 h-7 border shadow-xs rounded-sm flex items-center justify-center cursor-pointer [&>*]:invisible
                    peer-checked:scale-120 peer-checked:[&>*]:visible"
                    :class="{ 'scale-120 [&>*]:visible': color === color_selected }" :style="{ backgroundColor: color }"
                    @click="color_selected = color">
                    <Check class="size-4" :color="bright(color) ? 'white' : 'black'" />
                </div>
            </div>
        </div>
        <div>
            <a v-if="!auth_user" href="/discord/redirect">
                <Button variant="outline" type="button">
                    Login with Discord
                </Button>
            </a>
            <div v-else class="flex items-center gap-3">
                <Button variant="default" type="submit">
                    <!--  :disabled="form.processing" -->
                    <Check class="size-4" />
                    <span class="hidden md:flex">Place pixel</span>
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                        <Button variant="outline">
                            <Avatar>
                                <AvatarImage :src="auth_user.avatarUrl ?? ''" alt="" />
                            </Avatar>
                            <span class="hidden md:flex">{{ auth_user.name }}</span>
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
</template>
