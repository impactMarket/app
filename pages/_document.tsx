import Document, { Head, Html, Main, NextScript } from 'next/document';
import React from 'react';

class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
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
