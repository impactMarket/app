import Document, { Head, Html, Main, NextScript } from 'next/document';
import React from 'react';

class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    <link
                        href="https://fonts.googleapis.com"
                        rel="preconnect"
                    />
                    <link
                        crossOrigin="true"
                        href="https://fonts.gstatic.com"
                        rel="preconnect"
                    />
                    <link
                        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
                        rel="stylesheet"
                    />
                    <link href="/manifest.json" rel="manifest" />
                    <link href="/icon.png" rel="apple-touch-icon" />
                    <meta content="#fff" name="theme-color" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
