import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

import "bootstrap/dist/css/bootstrap.min.css";
import { SSRProvider } from "react-bootstrap";
import SiteHeader from "../components/SiteHeader";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SSRProvider>
      <div>
        <Head>
          <title>Algorithm Visualizations</title>
          <meta
            name="description"
            content="Visualization tool for various algorithms"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          <SiteHeader />
          <Component {...pageProps} />
        </main>
      </div>
    </SSRProvider>
  );
}

export default MyApp;
