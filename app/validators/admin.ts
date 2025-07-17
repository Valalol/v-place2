import vine from '@vinejs/vine'

export const changeGridSizeValidator = vine.compile(
    vine.object({
        width: vine.number().min(0).withoutDecimals(),
        height: vine.number().min(0).withoutDecimals()
    })
)