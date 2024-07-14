'use client'

import { Box, Button, Container, Flex, Heading, Link, Popover, Table, Text } from '@radix-ui/themes'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useApi } from '@/hooks/api'
import dayjs from 'dayjs'
import { TextField } from '@/components/forms/text-field'
import { Form, Formik, FormikProps } from 'formik'
import { FileField } from '@/components/forms/file-field'
import { useCallback, useEffect, useRef, useState } from 'react'
import * as Yup from 'Yup'
import { ExternalLinkIcon, TrashIcon } from '@radix-ui/react-icons'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/auth'
import { redirect } from 'next/navigation'

type UploadFormValues = {
  file_name: string,
  file: null | File
}

export default function Admin() {
  const api = useApi()
  const formRef = useRef<FormikProps<UploadFormValues>>(null)
  const auth = useAuth()

  if (!auth.isAdmin) redirect('/login')

  const [uploadOpen, setUploadOpen] = useState(false)

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ['artList'],
    queryFn: async () => api?.getArtList(),
  })

  const {
    isPending: creationPending,
    status: creationStatus,
    error: creationError,
    isSuccess: creationSuccess,
    mutate: createArt,
  } = useMutation({
    mutationFn: async (variables: UploadFormValues) => {
      return api?.uploadArt(variables.file_name, variables.file!)
    },
  })

  useEffect(() => {
    if (creationStatus != 'success') return

    refetch()
    formRef.current?.resetForm()
  }, [creationStatus])

  const { mutate } = useMutation({
    mutationFn: async (variables: { artId: string, name: string }) => {
      return api?.deleteArt(variables.artId)
    },
    onSuccess: async (_, variables) => {
      refetch()
      toast.success(`'${variables.name}' art removed.`)
    },
  })

  const onDelete = useCallback((artId: string, name: string) => () => {
    if (confirm(`You are you wont to delete '${name}'`)) {
      mutate({ artId, name })
    }
  }, [])


  return (
    <Flex style={{ background: 'var(--gray-a2)', minHeight: '100dvh' }} p='4'>
      <Container size='3'>
        <Flex direction='column' gap='3'>
          <Flex direction='row' style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <Heading>Arts</Heading>
            <Popover.Root open={uploadOpen}>
              <Popover.Trigger onClick={() => setUploadOpen(!uploadOpen)}>
                <Button>Upload</Button>
              </Popover.Trigger>
              <Popover.Content width='360px' align='end'>
                <Formik
                  innerRef={formRef}
                  initialValues={{
                    file_name: '',
                    file: null,
                  }}
                  validationSchema={Yup.object().shape({
                    file_name: Yup.string().required('File name is required'),
                    file: Yup.mixed().required('Please select file'),
                  })}
                  onSubmit={values => {
                    if (creationPending) return
                    createArt(values)
                  }}
                >
                  <Form>
                    <Flex gap='3'>
                      <Flex direction='column' gap='3' flexGrow='1'>
                        <TextField name='file_name' label='Name' />
                        <FileField name='file' label='File' inputProps={{
                          accept: 'image/jpeg,image/jpg',
                        }} />
                        <Flex gap='3' mt='3' justify='end'>
                          <Popover.Close>
                            <Button size='1' type='submit' loading={creationPending}>Upload</Button>
                          </Popover.Close>
                        </Flex>
                      </Flex>
                    </Flex>
                  </Form>
                </Formik>
              </Popover.Content>
            </Popover.Root>
          </Flex>

          <Table.Root variant='surface'>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Rating</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Votes</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Image</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Created At</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {isLoading && <Table.Row>
                <Table.Cell colSpan={7}>
                  <Box p='3' style={{ textAlign: 'center' }}>
                    <Text>Loading...</Text>
                  </Box>
                </Table.Cell>
              </Table.Row>}
              {data?.map(item => (
                <Table.Row key={item.id}>
                  <Table.RowHeaderCell>{item.name}</Table.RowHeaderCell>
                  <Table.Cell>{item.rating}</Table.Cell>
                  <Table.Cell>{item.votes}</Table.Cell>
                  <Table.Cell>
                    <Link href={item.imageUrl} target='_blank'>View image <ExternalLinkIcon /></Link>
                  </Table.Cell>
                  <Table.Cell>{dayjs(item.created_at).toString()}</Table.Cell>
                  <Table.Cell>
                    <Button variant='ghost' color='red' onClick={onDelete(item.id, item.name)}>
                      <TrashIcon /> Delete
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Flex>
      </Container>
    </Flex>
  )
}
