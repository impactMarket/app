import { ServerStyleSheet } from 'styled-components';
import Document, {
    DocumentContext,
    Head,
    Html,
    Main,
    NextScript
} from 'next/document';
import React from 'react';

class MyDocument extends Document {
    static getInitialProps: any = async (ctx: DocumentContext) => {
        const sheet = new ServerStyleSheet();
        const originalRenderPage = ctx.renderPage;

        try {
            ctx.renderPage = () =>
                originalRenderPage({
                    enhanceApp: (App) => (props) => {
                        const AppContent = App as any;

                        return sheet.collectStyles(<AppContent {...props} />);
                    }
                });

            const initialProps = await Document.getInitialProps(ctx);

            return {
                ...initialProps,
                styles: (
                    <>
                        {initialProps.styles}
                        {sheet.getStyleElement()}
                    </>
                )
            };
        } finally {
            sheet.seal();
        }
    };

    render() {
        const HeadContent = Head as any;
        const NextScriptContent = NextScript as any;

        return (
            <Html>
                <HeadContent>
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
                    <link
                        href="https://fonts.googleapis.com/css2?family=Italianno&display=swap"
                        rel="stylesheet"
                    ></link>
                    <link href="/manifest.json" rel="manifest" />
                    <link href="/img/app-icon.png" rel="apple-touch-icon" />
                    <meta content="#fff" name="theme-color" />
                </HeadContent>
                <body>
                    <Main />
                    <NextScriptContent />
                    {
                        // chat feature can be only in one url, so avoid enabling it
                        // eslint-disable-next-line no-process-env
                        process.env.NEXT_PUBLIC_ENABLE_LIVE_AGENT_CHAT ===
                        'true' ? (
                            <script type="text/javascript" src="/la-chat.js" />
                        ) : null
                    }
                </body>
            </Html>
        );
    }
}

export default MyDocument;
