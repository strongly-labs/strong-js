import React from 'react'

import { View, StyleSheet, Text } from 'react-native'
import { gql, useQuery } from '@apollo/client'

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
  const userWhere = {
    id,
  }
  const { loading, error, data } = useQuery(GET_ME, {
    variables: {
      userWhere,
    },
  })

  if (loading) return <Text>'Loading...'</Text>
  if (error) return <Text>{`Error! ${error.message}`}</Text>

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
