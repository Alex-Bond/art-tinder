import React from 'react'
import { BoxProps, TextField as RawTextField } from '@radix-ui/themes'
import { useField } from 'formik'
import { Field } from '@/components/forms/field'


type Props = {
  label?: string
  name: string
  type?: 'date' | 'datetime-local' | 'email' | 'hidden' | 'month' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'time' | 'url' | 'week'
} & BoxProps;
export const TextField: React.FC<Props> = props => {
  const { label, name, type, ...rest } = props
  const [field, meta, helpers] = useField(name)

  return (
    <Field error={meta.error} label={label} {...rest}>
      <RawTextField.Root
        type={type}
        {...field}
        {...(meta.error ? { color: 'red', variant: 'soft' } : {})}
      />
    </Field>
  )
}
