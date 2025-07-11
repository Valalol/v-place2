<script setup lang="ts">
import { Button } from '@/components/ui/button';

import { usePage } from '@inertiajs/vue3';

const auth_user = usePage().props.auth_user
</script>

<template>
    <div class="flex flex-col items-center w-full">
        Hey
        <Button variant="outline">
            <a href="/discord/redirect">Login with Discord</a>
        </Button>
        <pre>{{ auth_user || {} }}</pre>
    </div>
</template>