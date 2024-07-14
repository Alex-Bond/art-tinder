import React from 'react'
import { Box, BoxProps } from '@radix-ui/themes'
import { useField } from 'formik'
import { Field } from '@/components/forms/field'


type Props = {
  label?: string
  name: string
  type?: 'date' | 'datetime-local' | 'email' | 'hidden' | 'month' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'time' | 'url' | 'week'
  inputProps?: React.HTMLProps<HTMLInputElement>
} & BoxProps;
export const FileField: React.FC<Props> = props => {
  const { label, name, type, inputProps, ...rest } = props
  const [field, meta, helpers] = useField<File | null>(name)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (!field.value && inputRef.current) {
      inputRef.current.value = inputRef.current.defaultValue
    }
  }, [field.value])

  return (
    <Field error={meta.error} label={label} {...rest}>
      <Box>
        <input
          ref={inputRef}
          type='file'
          name={name}
          onChange={(event) => {
            if (!event.currentTarget.files?.length) return
            helpers.setValue(event.currentTarget.files?.[0] || null)
          }}
          {...inputProps}
        />
      </Box>
    </Field>
  )
}
