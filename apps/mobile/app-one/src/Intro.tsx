import React from 'react'

import { View, StyleSheet, Text } from 'react-native'
import { gql, useLazyQuery } from '@apollo/client'
import type { UserWhereUniqueInput } from '../.strong/graphql'

interface IntroProps {
  id?: string
}

const GET_ME = gql`
  query me {
    user(where: $userWhere) {
      name
    }
  }
`
const Intro: React.FC<IntroProps> = ({ id }) => {
  if (!id) return null
  const userWhere: UserWhereUniqueInput = {
    id,
  }
  const [loadMe, { called, loading, data }] = useLazyQuery(
    GET_ME,
    { variables: { userWhere } }
  );

  if (called && loading) return <p>Loading ...</p>
  if (!called) {
    return <button onClick={() => loadMe()}>Load me</button>
  }
  return (
    <View style={styles.container}>
      <Text>Name: {data.name}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
})

export default Intro
