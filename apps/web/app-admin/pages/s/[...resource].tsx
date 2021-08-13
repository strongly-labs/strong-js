/* eslint-disable @next/next/no-page-custom-font */
import * as React from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { signIn, getSession } from 'next-auth/client'
import type { FullUser } from '@strong-js/auth'
import Crud from '@strong-js/crud'
import AdminSchema from '../../.strong/admin.json'

import styles from '../../styles/Admin.module.css'

interface PageProps {
  user: Partial<FullUser>
}

const config = {
  exclude: ['image'],
  badges: {
    role: {
      ADMIN: 'blue',
      USER: 'neutral',
    },
  },
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req })

  return {
    props: {
      user: session?.user?.role === 'ADMIN' || null,
    },
  }
}

const Admin = ({ user }: PageProps) => {
  const router = useRouter()
  const resourceName = router.query?.resource?.[0]

  return (
    <div className={styles.container}>
      <Head>
        <title>Strong-JS Admin</title>
        <meta name="description" content="Strong-JS Admin" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </Head>

      <main className={styles.main}>
        {user && typeof resourceName === 'string' ? (
          <>
            <h1>Manage {resourceName}</h1>
            <Crud
              rootSchema={AdminSchema}
              resourceName={resourceName}
              config={config}
            />
          </>
        ) : (
          <a href="#" onClick={() => signIn()}>
            Sign in
          </a>
        )}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image
              src="/admin/vercel.svg"
              alt="Vercel Logo"
              width={72}
              height={16}
            />
          </span>
        </a>
      </footer>
    </div>
  )
}

export default Admin
