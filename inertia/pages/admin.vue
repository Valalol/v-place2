<script setup lang="ts">
import { router, usePage } from '@inertiajs/vue3';
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'


interface Props {
    width: number
    height: number
    auth_user?: any
    success?: string
    error?: string
}

defineProps<Props>()
const page = usePage()
const props = page.props as unknown as Props


const sizeFormSchema = toTypedSchema(z.object({
    width: z.number().int().min(1),
    height: z.number().int().min(1),
}))

const { handleSubmit } = useForm({
    validationSchema: sizeFormSchema,
    initialValues: {
        width: props.width || 25,
        height: props.height || 25,
    }
})

const onSubmit = handleSubmit((values) => {
    console.log(values);
    // router.post('/admin/size', values)
})

</script>

<template>
    <div class="flex flex-row m-5 gap-12">
        <form class=" w-1/4 space-y-6" @submit="onSubmit">
            <h3 class="text-2xl font-bold">Grid size</h3>
            <FormField v-slot="{ componentField }" name="width">
                <FormItem>
                    <FormLabel>Width</FormLabel>
                    <FormControl>
                        <Input type="number" min="1" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="height">
                <FormItem>
                    <FormLabel>Height</FormLabel>
                    <FormControl>
                        <Input type="number" min="1" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            </FormField>
            <Button type="submit">
                Submit
            </Button>
        </form>
    </div>
</template>