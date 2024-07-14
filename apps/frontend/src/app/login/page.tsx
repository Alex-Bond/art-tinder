'use client'

import React from 'react'
import { useApi } from '@/hooks/api'
import { Box, Button, Card, Container, Flex, Heading, Text } from '@radix-ui/themes'
import { useMutation } from '@tanstack/react-query'
import { Form, Formik } from 'formik'
import { TextField } from '@/components/forms/text-field'
import * as Yup from 'yup'
import { ErrorCallout } from '@/components/callouts/error-callout'
import { useAuth } from '@/hooks/auth'
import { redirect } from 'next/navigation'

type LoginForm = {
  username: string
  password: string
}

export default function Login() {
  const api = useApi()
  const { isAdmin } = useAuth()
  if (isAdmin) redirect('/admin')

  const { isPending, error, mutate: login } = useMutation({
    mutationFn: async (variables: LoginForm) => {
      return api?.login(variables.username, variables.password)
    },
  })

  return (
    <Flex style={{ background: 'var(--gray-a2)', minHeight: '100dvh' }} align='center'>
      <Container size='1'>
        <Formik<LoginForm>
          initialValues={{
            username: '',
            password: '',
          }}
          onSubmit={values => {
            login(values)
          }}
          validationSchema={Yup.object().shape({
            username: Yup.string().required('Username is required'),
            password: Yup.string().required('Password is required'),
          })}
        >
          <Form>
            <Card size='4'>
              <Flex gap='3' direction='column' p='3'>
                <Heading mb='2'>Sign in</Heading>
                {error && <ErrorCallout>{error.message}</ErrorCallout>}
                <Box>
                  <Text weight='medium' size='2'>Username</Text>
                  <TextField
                    name='username'
                  />
                </Box>
                <Box>
                  <Text weight='medium' size='2'>Password</Text>
                  <TextField
                    type='password'
                    name='password'
                  />
                </Box>
                <Button type='submit' loading={isPending}>Login</Button>
              </Flex>
            </Card>
          </Form>
        </Formik>
      </Container>
    </Flex>
  )
}
