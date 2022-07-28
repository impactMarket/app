import {
    Box,
    Row,
    Spinner
} from '@impact-market/ui';
import Map from '../../components/Map';
import useClaimsLocation from "./claimsLocation";

const ClaimsMap = () => {
    const { claimsLocations, loadingClaims } = useClaimsLocation();

    return (
        <Box
            borderRadius={{ sm: '16px 0 0 16px', xs: '0' }}
            h={{ sm: 22, xs: 11 }}
            mt={1}
            overflow="hidden"
        >
            { loadingClaims ? (
                <Row fLayout="center" h="50vh" mt={2}>
                    <Spinner isActive />
                </Row>
            ) : (
                <Map claims={claimsLocations} />
            )}
            
        </Box>
    )
};

export default ClaimsMap;
