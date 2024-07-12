import React from 'react'
import { Flex, Spinner, Text } from '@radix-ui/themes'

type Props = {
  title?: string
};

export const Loading: React.FC<Props> = props => {
  const { title = 'Loading...' } = props
  return (
    <Flex direction='column' align='center'>
      <Spinner size='3' />
      <Text>{title}</Text>
    </Flex>
  )
}
