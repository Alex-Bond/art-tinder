import { useContext } from 'react'
import { ApiContext } from '@/context/api.context'

export const useApi = () => {
  return useContext(ApiContext)
}


