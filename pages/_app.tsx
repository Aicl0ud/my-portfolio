import '../styles/globals.css'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
declare global {
  interface Window {
    OverworldMaps:any;
  }
}
export default MyApp
