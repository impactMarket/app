import { useSelector } from 'react-redux';

import {
    Box,
    Button,
    Card,
    Col,
    Display,
    Label,
    Row,
    Spinner,
    Text,
    TextLink,
    toast
} from '@impact-market/ui';
import { CommunityContract, useGetCommunityContractMutation } from '../../api/community';
import { currencyFormat } from '../../utils/currencies';
import { getCountryNameFromInitials } from '../../utils/countries';
import { selectCurrentUser } from '../../state/slices/auth';
import { useImpactMarketCouncil } from '@impact-market/utils/useImpactMarketCouncil';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import CanBeRendered from '../../components/CanBeRendered';
import Image from '../../components/Image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import RichText from '../../libs/Prismic/components/RichText';
import String from '../../libs/Prismic/components/String';
import generateCommunityProposal from '../../helpers/generateCommunityProposal';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';


const Community = ({ data, requestsCount, setRequestsCount }: any) => {
    const [community] = useState(data);
    const { addCommunity } = useImpactMarketCouncil();
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingCommunity, setIsLoadingCommunity] = useState(false);
    const [isAdded, setIsAdded] = useState(false);
    const [getCommunityContract] = useGetCommunityContractMutation();
    const [communityContract, setCommunityContract] = useState<CommunityContract>();
    const { view } = usePrismicData();
    const { t } = useTranslations();

    const auth = useSelector(selectCurrentUser);
    const language = auth?.user?.language || 'en-US';
    const currency = auth?.user?.currency || 'USD';
    const localeCurrency = new Intl.NumberFormat(language, {
        currency,
        style: 'currency'
    });

    useEffect(() => {
        const getCommunityContractMethod = async () => {
            try {
                setIsLoadingCommunity(true);
                const response = await getCommunityContract(community.id).unwrap();

                setCommunityContract(response);

                setIsLoadingCommunity(false);
            } catch (error) {
                console.log(error);

                return false;
            }
        };

        getCommunityContractMethod();
    }, []);

    const handleAddCommunity = async () => {
        try {
            setIsLoading(true);

            const response = await addCommunity(
                generateCommunityProposal(community, community.contract)
            );

            if (typeof response === 'number') {
                setIsAdded(true);
            }

            setRequestsCount(requestsCount - 1);
            setIsLoading(false);
            toast.success(<RichText content={view.data.messageRequestsGenerated}/>);
        } catch (error) {
            toast.error(<RichText content={view.data.messageRequestsNotGenerated}/>);
            setIsLoading(false);
        }  
    };

    return (
        <>
            {isLoadingCommunity ? (
                <Row fLayout="center" h="50vh" mt={2}>
                    <Spinner isActive />
                </Row>
            ) : (
                <Card mt={1}>
                    <Row pt={1}>
                        <Col colSize={{sm: 3, xs: 12}} pt={0}>
                            <Box pt="100%" style={{position: 'relative'}} w="100%">
                                <Image alt="" src={community.coverMediaPath} style={{borderRadius: '8px'}} />
                            </Box>
                        </Col>

                        <Col colSize={{sm: 8, xs: 12}} pl={{sm: 1, xs: 1}} pt={0}>
                            <Display>{community.name}</Display>
                            <Box>
                                <Text>{community.city}, {getCountryNameFromInitials(community.country)}</Text>
                            </Box>

                            <Link href={`/communities/${community.id}`} passHref>
                                <Text>
                                    <TextLink medium>
                                        <String id="seeMore" />...
                                    </TextLink>
                                </Text>
                            </Link>

                            <Box pt={1}>    
                                <RichText content={view.data.messageTotalClaimAmount} variables={{ total: (() => currencyFormat(community.contract.maxClaim, localeCurrency)) }}/>
                                <RichText content={view.data.messageMinutesIncrement} variables={{ minutes: (communityContract?.data?.incrementInterval / 12) }}/>
                            </Box>

                            <CanBeRendered types={['councilMember']}>
                                <Box pt={1}>
                                    {!isAdded ? (
                                        <Button disabled={isLoading} isLoading={!!isLoading} onClick={handleAddCommunity}>
                                            <String id="generateProposal" />
                                        </Button>
                                    ): (
                                        <Label content={t('generatedSuccessfully')} icon="arrowUp" success />
                                    )}
                                </Box>
                            </CanBeRendered>
                        </Col>
                    </Row>
                </Card>
            )}
        </>
    )
};

export default Community;
