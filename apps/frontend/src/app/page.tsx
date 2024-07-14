'use client'

import { Box, Button, Flex, Text } from '@radix-ui/themes'
import styles from './page.module.css'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useApi } from '@/hooks/api'
import { useQueue } from '@uidotdev/usehooks'
import { ArtEntity } from '@/services/interfaces/art-entity'
import { useCallback, useEffect, useState } from 'react'
import { Loading } from '@/components/loading'

export default function Home() {
  const api = useApi()
  const queue = useQueue<ArtEntity>()
  const [imageLoading, setImageLoading] = useState(true)

  const { isPending, error, data, refetch } = useQuery({
    queryKey: ['listToVote'],
    queryFn: async () => {
      return api?.getListToVote()
    },
  })

  const { isPending: isVoteLoading, error: voteError, mutate: vote } = useMutation({
    mutationFn: async (variables: {
      artId: string
      isPositive: boolean
    }) => {
      return api?.vote(variables.artId, variables.isPositive)
    },
  })

  useEffect(() => {
    if (!data || isPending) return

    data.forEach(i => queue.add(i))
  }, [data])

  useEffect(() => {
    if (!isVoteLoading) return

    queue.remove()
    setImageLoading(true)
    if (queue.size === 1) refetch()
  }, [isVoteLoading])

  const onVote = useCallback((isPositive: boolean) => () => {
    if (!queue.first) return
    vote({ isPositive: true, artId: queue.first.id })
  }, [queue.queue])


  return (
    <>
      <Flex align='center' justify='center' className={styles.vote_container} p='2'>
        {isPending && <Loading title='Loading next art...' />}
        {queue.first && <Flex direction='column' className={styles.inner_container}>
          <Box>
            <img
              src={queue.first.imageUrl}
              alt='Art to vote'
              className={styles.art_image}
              onLoad={() => setImageLoading(false)}
              style={!imageLoading ? {} : { display: 'none' }}
            />
            {imageLoading &&
              <Flex p='5' justify='center' align='center' className={styles.image_loading}><Text>Loading image...</Text></Flex>}
            <Flex direction='row' justify='between'>
              <Button loading={isVoteLoading} color='crimson' onClick={onVote(false)}>Dislike</Button>
              <Button loading={isVoteLoading} color='cyan' onClick={onVote(true)}>Like</Button>
            </Flex>
          </Box>
        </Flex>}
        {!queue.first && !isPending && <Text>Oops! Looks like we run out of art</Text>}
      </Flex>
    </>
  )
}
