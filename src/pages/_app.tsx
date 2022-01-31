import "../styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClientProvider } from "react-query";
import { queryClient } from "../services/queryClient";
import { ConfigProvider } from "antd";
import enUS from "antd/lib/locale/en_US";

import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({
  minimum: 0.3,
  easing: "ease",
  speed: 800,
  showSpinner: false,
});

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider direction="ltr" locale={enUS}>
        <Component {...pageProps} />
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
