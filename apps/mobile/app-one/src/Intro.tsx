/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, react-hooks/rules-of-hooks */
import React from 'react'

import { View, StyleSheet, Text, ActivityIndicator } from 'react-native'
import { gql, useQuery } from '@apollo/client'
import type { UserWhereUniqueInput } from '../.strong/graphql'

interface IntroProps {
  id?: string
}

const GET_ME = gql`
  query me($userWhere: UserWhereUniqueInput!) {
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
  const { loading, error, data } = useQuery(GET_ME, {
    variables: { userWhere },
  });
  
  if (loading) return <ActivityIndicator size="small" color="#0000ff" />;
  if (error) return <Text>{error.message}</Text>;

  return (
    <View style={styles.container}>
      <Text>Hello from GraphQL, {data?.user?.name}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
})

export default Intro
