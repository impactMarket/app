import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import _ from 'lodash';

import {
    Box,
    Button,
    Card,
    DropdownMenu,
    Text,
    closeModal,
    // colors,
    openModal,
    toast
} from '@impact-market/ui';
import { currencyFormat } from '../utils/currencies';
import { formatAddress } from '../utils/formatAddress';
import { formatPercentage } from '../utils/percentages';
import { useGetCommunityCampaignMutation } from '../api/community';
import { usePrismicData } from '../libs/Prismic/components/PrismicDataProvider';

import Message from '../libs/Prismic/components/Message';
import ProgressBar from './ProgressBar';
import RichText from '../libs/Prismic/components/RichText';
import String from '../libs/Prismic/components/String';
import config from '../../config';
import useFilters from '../hooks/useFilters';
import useTranslations from '../libs/Prismic/hooks/useTranslations';

// import { RampInstantSDK } from "@ramp-network/ramp-instant-sdk";

// import styled from 'styled-components';

interface DonateCardProps {
    backers: number;
    beneficiariesNumber: number;
    community: string;
    contractAddress: string;
    goal: number;
    raised: number;
    type: string;
    action: () => void;
}

// const BoxWrapper = styled.div`
//     Button {
//         background: white;
//         border: 1px solid ${colors.p500};
//         color: ${colors.p500};
//         width: 100%;

//         p {
//             display: flex;
//             align-items: center;
//         }
//     } 
// `;

const DonateCard = (props: DonateCardProps) => {
    const {
        raised,
        goal,
        contractAddress,
        beneficiariesNumber,
        backers,
        type,
        community,
        action
    } = props;

    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslations();
    const { view } = usePrismicData();
    const { getByKey } = useFilters();
    const { asPath } = useRouter();
    const quotient = raised / goal || 0;
    const [campaignUrl, setCampaignUrl] = useState('');
    const [getCommunityCampaign] = useGetCommunityCampaignMutation();

    useEffect(() => {
        const getData = async () => {
            try {
                //  Get community's campaign URL
                const communityCampaign = await getCommunityCampaign(community).unwrap() as any;

                setCampaignUrl(communityCampaign?.data?.campaignUrl);
            } catch (error) {
                console.log(error);
            }
        }

        getData()
    }, []);

    const handleMiscDonationClick = () => {
        if (!window) {
            return;
        }

        window.open(campaignUrl, '_blank');
    };

    // const triggerRamp = () => {
    //     new RampInstantSDK({
    //         hostAppName: 'impactMarket',
    //         hostLogoUrl: 'https://www.gitbook.com/cdn-cgi/image/height=40,fit=contain,dpr=2,format=auto/https%3A%2F%2F2074548608-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FCYFjCZsJmtFWjyXZmVH8%252Flogo%252FrnP1xUXSL3jJHhxKkA82%252Flogo_blue_on_transparent_background.png%3Falt%3Dmedia%26token%3D42e89872-c292-4ccc-b8c5-771b055c4581',
    //         swapAmount: '',
    //         swapAsset: "CELO_CUSD",
    //         userAddress: contractAddress,
    //     }).show();
    // };

    useEffect(() => {
        return () => {
            closeModal(() => {});
        }
    }, []);

    useEffect(() => {
        if (getByKey('contribute') !== undefined && type === 'contribute') {
            openModal('contribute', {
                contractAddress,
                value: getByKey('contribute')
            });
        }
    }, [asPath]);

    const onClick = async () => {
        setIsLoading(true);

        await action();

        setIsLoading(false);
    }

    const copyToClipboard = (address: any) => {
        navigator.clipboard.writeText(address);

        toast.success(<Message id="copiedAddress" />);
    }

    return (
        <Card padding={1.4} w="100%">
            <Box fLayout="center" flex>
                <RichText
                    center
                    content={view.data.messageBeneficiariesHelped}
                    g900
                    maxW={14}
                    medium
                    semibold
                    variables={{ beneficiariesNumber }}
                />
            </Box>
            <Box mt={1.5}>
                <Button h={3.8} isLoading={isLoading} onClick={onClick} w="100%">
                    <Text large medium>
                        <String id={type} />
                    </Text>
                </Button>
            </Box>
            {/* 
            Temporarily hide the ramp feature to donate

            <BoxWrapper>
                <Text flex g500 mt={0.5} small style={{justifyContent: 'center'}}>
                    <String id="or" />
                </Text>
                <Button
                    mt={0.5}
                    onClick={triggerRamp}
                    p50
                    secondary
                >
                    <Text medium w="100%">
                        Fiat · Revolut · Apple Pay
                    </Text>
                </Button>
            </BoxWrapper>
            */}
            {!!campaignUrl &&
                <Box tAlign="center">
                    <Text g500 mt={0.5} small>
                        <String id="or" />
                    </Text>
                    <Button
                        fluid
                        gray
                        mt={0.5}
                        onClick={handleMiscDonationClick}
                    >
                        <Text medium w="100%">
                            <String id="creditCard" />
                        </Text>
                    </Button>
                    <Box fLayout="center" inlineFlex mt={0.5}>
                        <Text extrasmall g500 mr={0.25}>
                            <String id="poweredBy" />
                        </Text>
                        <a href="https://esolidar.com" rel="noreferrer noopener" target="_blank">
                            <img alt="e-solidar logo" height="14px" src="/img/partners/esolidar.svg" width="65px" />
                        </a>
                    </Box>
                </Box>
            }
            <Box fLayout="between" flex mt={1}>
                <Box left>
                    <Text g500 left mt={1} small>
                        {`${_.upperFirst(t('raisedFrom'))} ${backers} ${t('backers')}`}
                    </Text>
                </Box>
                <Box right>
                    <Text g500 mt={1} right small>
                        <String id="goal" />
                    </Text>
                </Box>
            </Box>
            <Box fLayout="between" flex>
                <Box left>
                    <Text g900 semibold small>
                        {currencyFormat(raised)} ({formatPercentage(Number.isFinite(quotient) ? quotient : 0)})
                    </Text>
                </Box>
                <Box right>
                    <Text g900 semibold small>
                        {currencyFormat(goal)}
                    </Text>
                </Box>
            </Box>
            <Box mt={0.8}>
                <ProgressBar
                    progress={quotient * 100}
                    state={{ info: false }}
                />
            </Box>
            <RichText
                center
                content={view.data.messageExploreContract}
                g500
                mt={1}
                small
            />
            <Box center>
                <DropdownMenu
                    icon="chevronDown"
                    items={[
                        {
                            icon: 'open',
                            onClick: () => window.open(config.explorerUrl?.replace('#USER#', contractAddress)),
                            title: t('openInExplorer')
                        },
                        {
                            icon: 'copy',
                            onClick: () => copyToClipboard(contractAddress),
                            title: t('copyAddress')
                        }
                    ]}
                    title={formatAddress(contractAddress, [6, 5])}
                />
            </Box>
        </Card>
    );
};

export default DonateCard;
