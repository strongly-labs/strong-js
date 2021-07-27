import { GetStaticProps, InferGetStaticPropsType } from 'next'

import { createSwaggerSpec } from 'next-swagger-doc'
import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'

const ApiDoc = ({ spec }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <SwaggerUI spec={spec} />
}

export const getStaticProps: GetStaticProps = async () => {
  const spec: Record<string, any> = createSwaggerSpec({
    title: 'Admin API',
    version: '0.0.1',
    apiFolder: 'pages/api/s',
    openApiVersion: '3.0.0',
  })
  return {
    props: {
      spec,
    },
  }
}

export default ApiDoc
