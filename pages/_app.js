import React, { useState, useEffect } from "react";
import { Provider } from "react-redux";
import Router from "next/router";
import Head from "next/head";

import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import { ResetStyle } from "../styles/Reset";
import { GlobalStyle } from "../styles/Global";
import Layout from "../layout";

import Middleware from "../middleware";
import { PagePreloader } from "../components/pagepreloader";

import { ApolloProvider } from "@apollo/client";
import { client } from "../apolloClient";

import store from "../redux/store";

function MyApp({ Component, pageProps }) {
    const [preload, setPreload] = useState(true);

    const currentView = Component?.renderData?.currentView
        ? Component.renderData.currentView
        : "Dashboard";
    const headerVisibility = Component?.renderData?.header ? Component.renderData.header : "true";

    // Listen page change
    Router.events.on("routeChangeStart", () => {
        setPreload(true);
    });
    Router.events.on("routeChangeComplete", () => {
        setPreload(false);
        window.scrollTo(0, 0);
    });
    Router.events.on("routeChangeError", () => {
        setPreload(false);
    });

    useEffect(() => {
        setPreload(false);
    }, []);

    return (
        <>
            <Head>
                <title>School App</title>
            </Head>
            <GlobalStyle />
            <ResetStyle />
            <PagePreloader visible={preload} />

            <Provider store={store}>
                <Middleware authRequired={Component?.renderData?.authRequired} />
                <ApolloProvider client={client}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Layout currentView={currentView} headerVisibility={headerVisibility}>
                            <Component {...pageProps} />
                        </Layout>
                    </MuiPickersUtilsProvider>
                </ApolloProvider>
            </Provider>
        </>
    );
}

export default MyApp;
