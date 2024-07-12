'use client'

import axios from 'axios'
import { ListToVoteResponse } from '@/services/interfaces/list-to-vote.response'

export class ApiService {
  private client

  constructor() {
    this.client = axios.create({
      baseURL: 'http://localhost:3000/api',
      headers: {
        Authorization: typeof window !== 'undefined' ? localStorage?.getItem('authorization') : undefined,
      },
    })
    this.client.interceptors.response.use(
      response => {
        if (response.headers['authorization']) {
          localStorage.setItem('authorization', response.headers['authorization'])
          this.client.defaults.headers.Authorization = response.headers['authorization']
        }
        return response
      },
      error => Promise.reject(error),
    )
  }

  async login(login: string, password: string) {
    const resp = await this.client
      .post<{ status: 'ok' | 'error', message?: string }>(
        '/auth/login',
        {
          login: login,
          password: password,
        },
      )

    return resp.data
  }

  async getListToVote() {
    const resp = await this.client.get<ListToVoteResponse>('/voting/list-to-vote')
    if (resp.data.status != 'ok') throw new Error(resp.data.message)
    return resp.data.items || []
  }

  async vote(artId: string, isPositive: boolean) {
    const resp = await this.client.post('/voting/vote', { art_id: artId, is_positive: isPositive })
    if (resp.data.status != 'ok') throw new Error(resp.data.message)
    return resp.data.items || []
  }
}
