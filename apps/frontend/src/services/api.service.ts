'use client'

import axios, { isAxiosError } from 'axios'
import { ListToVoteResponse } from '@/services/interfaces/list-to-vote.response'
import { UploadArtResponse } from '@/services/interfaces/upload-art.response'

export class ApiService {
  private client

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
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
    await this.wrapper(() =>
      this.client
        .post<{ status: 'ok' | 'error', message?: string }>(
          '/auth/login',
          {
            login: login,
            password: password,
          },
        ),
    )
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

  async getArtList() {
    const resp = await this.client.get<ListToVoteResponse>('/art/list')
    if (resp.data.status != 'ok') throw new Error(resp.data.message)
    return resp.data.items || []
  }

  async uploadArt(name: string, file: File) {
    const resp = await this.wrapper(() =>
      this.client.postForm<UploadArtResponse>('/art/create', {
        name,
        file,
      }),
    )
    if (resp.data.status != 'ok') throw new Error(resp.data.message)
    return resp.data.item || null
  }

  async deleteArt(id: string) {
    const resp = await this.wrapper(() =>
      this.client.post<UploadArtResponse>('/art/delete', {
        art_id: id,
      }),
    )
    if (resp.data.status != 'ok') throw new Error(resp.data.message)
    return resp.data.item || null
  }

  private async wrapper<T>(func: () => T) {
    try {
      return await func()
    } catch (e) {
      if (isAxiosError(e)) {
        if (e.response?.data.message) {
          throw new Error(e.response.data.message)
        }
      }
      throw e
    }
  }
}
