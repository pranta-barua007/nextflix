import { useRouter } from 'next/router';
import { useState, useEffect } from 'react'

import Loading from '../components/loading/loading.component';
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleRouteChangeComplete = () => {
      setIsLoading(false);
    }

    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    router.events.on("routeChangeError", handleRouteChangeComplete);
  
    return () => {
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
      router.events.off("routeChangeError", handleRouteChangeComplete);
    }
  }, [router]);

  return (
    isLoading ? <Loading /> : <Component {...pageProps} />
  )
}

export default MyApp
