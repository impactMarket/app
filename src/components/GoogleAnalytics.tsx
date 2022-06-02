/* eslint-disable react/no-danger */
import Head from 'next/head';
import React from 'react';
import config from '../../config';

const { gaId } = config;

const GoogleAnalytics = () => {
    return (
        <Head>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
            <script
                dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());

                        gtag('config', '${gaId}', {
                            page_path: window.location.pathname,
                        });
                    `
                }}
            />
        </Head>
    );
};

export default GoogleAnalytics;
