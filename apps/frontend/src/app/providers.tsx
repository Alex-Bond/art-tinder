'use client'

import React, { useMemo } from 'react'
import { ApiService } from '@/services/api.service'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ApiContext } from '@/context/api.context'


type Props = {
  children: React.ReactNode
};

export const Providers: React.FC<Props> = props => {
  const queryClient = useMemo(() => new QueryClient(), [])
  return (
    <QueryClientProvider client={queryClient}>
      <ApiContext.Provider value={new ApiService()}>
        {props.children}
      </ApiContext.Provider>
    </QueryClientProvider>
  )
}
