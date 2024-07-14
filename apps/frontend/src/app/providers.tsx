'use client'

import React, { useMemo } from 'react'
import { ApiService } from '@/services/api.service'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ApiContext } from '@/context/api.context'
import { Toaster } from 'react-hot-toast'


type Props = {
  children: React.ReactNode
};

export const Providers: React.FC<Props> = props => {
  const queryClient = useMemo(() => new QueryClient(), [])
  return (
    <QueryClientProvider client={queryClient}>
      <ApiContext.Provider value={new ApiService()}>
        <Toaster />
        {props.children}
      </ApiContext.Provider>
    </QueryClientProvider>
  )
}
