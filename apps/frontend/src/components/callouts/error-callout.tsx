import { Callout } from '@radix-ui/themes'
import React from 'react'
import { InfoCircledIcon } from '@radix-ui/react-icons'

type Props = {
  children: React.ReactNode
};
export const ErrorCallout: React.FC<Props> = props => {
  return (
    <Callout.Root color='red'>
      <Callout.Icon>
        <InfoCircledIcon />
      </Callout.Icon>
      <Callout.Text>
        {props.children}
      </Callout.Text>
    </Callout.Root>
  )
}
