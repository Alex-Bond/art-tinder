import React from 'react'
import { Box, BoxProps, Text } from '@radix-ui/themes'

type Props = {
  label?: string
  error?: string
  children?: React.ReactNode
} & BoxProps;
export const Field: React.FC<Props> = props => {
  const { label, error, children, ...otherProps } = props
  return (
    <Box {...otherProps}>
      {!!label && <Box mb='1'><Text weight='medium' size='2'>{label}</Text></Box>}
      {children}
      {error ? <Text color='red' size='1'>{error}</Text> : null}
    </Box>
  )
}
