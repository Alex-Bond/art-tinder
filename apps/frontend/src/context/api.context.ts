import { createContext } from 'react'
import { ApiService } from '@/services/api.service'

export const ApiContext = createContext<ApiService | null>(null)
