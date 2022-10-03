import {
    Box
} from '@impact-market/ui';
import { useState } from 'react';
import Map from '../../components/Map';
import styled from 'styled-components';
import useClaimsLocation from "../../hooks/useClaimsLocation";

const LoadingWrapper = styled.div`
    background: white;
    height: 100%; 
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    path {
	 	fill:white;
        animation: dash 1s alternate infinite;
       }
       
       @keyframes dash {
         to {
            stroke: white;
         }
       }
`;

const ClaimsMap = () => {
    const { claimsLocations, loadingClaims } = useClaimsLocation();

    const [preview, setPreview] = useState(true);
    
    return (
        <Box
            borderRadius={{ sm: '16px 0 0 16px', xs: '0' }}
            h={{ sm: 22, xs: 11 }}
            mt={1}
            overflow="hidden"
        >
            { loadingClaims || preview && (
                <LoadingWrapper style={{background: 'white', height: '100%', width: '100%'}}>
                    <svg fill="none" height="100px" viewBox="0 0 45 43" width="100px" xmlns="http://www.w3.org/2000/svg">
                        <path d="M28.3679 11.9829C30.8269 13.7793 32.4061 16.6667 32.4061 19.9236C32.4061 25.3491 28.0079 29.7473 22.5824 29.7473C17.1569 29.7473 12.7587 25.3491 12.7587 19.9236C12.7587 16.6667 14.3379 13.7793 16.7969 11.9829C19.3073 10.1489 19.8557 6.62701 18.0217 4.11658C16.1877 1.60615 12.6658 1.05779 10.1554 2.89179C4.91955 6.71682 1.5 12.9212 1.5 19.9236C1.5 31.567 10.9389 41.0059 22.5824 41.0059C34.2259 41.0059 43.6648 31.567 43.6648 19.9236C43.6648 12.9212 40.2452 6.71682 35.0094 2.89179C32.499 1.05779 28.9771 1.60615 27.1431 4.11658" stroke="#2362FB" strokeLinecap="round" strokeWidth="2.66592"/>
                        <path d="M16.3644 12.3171C14.1583 14.1233 12.7583 16.8587 12.7583 19.9234C12.7583 25.3489 17.1565 29.7471 22.582 29.7471C28.0075 29.7471 32.4057 25.3489 32.4057 19.9234C32.4057 16.8587 31.0057 14.1233 28.7996 12.3171C27.5731 11.3131 27.3929 9.50494 28.3969 8.27854C29.401 7.05213 31.2091 6.87187 32.4355 7.8759C35.9161 10.7254 38.1454 15.0652 38.1454 19.9234C38.1454 28.5188 31.1774 35.4868 22.582 35.4868C13.9865 35.4868 7.01855 28.5188 7.01855 19.9234C7.01855 15.0652 9.24788 10.7254 12.7285 7.8759" stroke="#2362FB" strokeLinecap="round" strokeWidth="2.66592"/>
                    </svg>
                </LoadingWrapper>
            )}

            <Map claims={claimsLocations} onLoad={setPreview} />
            
        </Box>
    )
};

export default ClaimsMap;
