import { ViewContainer } from "@impact-market/ui";
import React, { useEffect } from "react";

// eslint-disable-next-line no-var
declare var LiveAgent: any;

const InnerSupport = () => {
    useEffect(() => {
        const scriptUrl = 'https://impactmarket.ladesk.com/scripts/track.js';
        const node = document.createElement('script');

        node.src = scriptUrl;
        node.id = 'la_x2s6df8d';
        node.type = 'text/javascript';
        node.async = true;
        node.onload = function(_) {
            LiveAgent.createForm('c9c9jlqg', document.getElementById("la-form-impactmarket"));
        };
        document.getElementsByTagName('head')[0].appendChild(node);
    }, []);

    return <></>;
}
const Support: React.FC<{ isLoading?: boolean }> = (props) => {
    const { isLoading } = props;

    return <ViewContainer isLoading={isLoading}>
        <div id="la-form-impactmarket" />
        <InnerSupport />
    </ViewContainer>;
}

export default Support;