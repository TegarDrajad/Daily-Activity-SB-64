// import { AuthProvider } from '@/context/authContext'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

const RootLayout = dynamic(() => import('@/layout'), { ssr: false })

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const metaTitle =
    router.pathname === '/' ? 'Home' : router.pathname.replace('/', '')
  return (
    // <AuthProvider>
    //   <Component {...pageProps} />
    // </AuthProvider>
    <RootLayout metaTitle={metaTitle}>
      <Component {...pageProps} />
    </RootLayout>
  )
}
