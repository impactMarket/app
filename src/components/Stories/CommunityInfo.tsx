import {
    Box,
    Col,
    CountryFlag,
    DropdownMenu,
    Row,
    Text,
    TextLink,
    toast
} from '@impact-market/ui';
import { formatAddress } from '../../utils/formatAddress';
import { getCountryNameFromInitials } from '../../utils/countries';
import { useRouter } from 'next/router';
import Image from '../Image';
import Link from 'next/link';
import Message from '../../libs/Prismic/components/Message';
import React from 'react';
import config from '../../../config';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const CommmunityInfo = (props: any) => {
    const { handleClose, story, community } = props;
    const { t } = useTranslations();
    const router = useRouter();
    const { asPath } = router;

    const copyToClipboard = (content: string) => {
        navigator?.clipboard.writeText(content);
        toast.success(<Message id="copiedAddress" />);
    };

    const shareItems = [
        {
            icon: 'copy',
            onClick: () => copyToClipboard(config.publicUrl + asPath),
            title: 'Copy Link'
        }
    ];

    return (
        <>
            <Box fLayout="center between" flex pb={1} pl={0}>
                <Box>
                    <Box flex>
                        <Box onClick={() => handleClose()}>
                            <Link
                                href={`/communities/${story?.community?.id}`}
                                passHref
                            >
                                <Box
                                    h={3}
                                    pt="100%"
                                    style={{ position: 'relative' }}
                                    w={3}
                                >
                                    <Image
                                        alt=""
                                        src={story?.community?.coverMediaPath}
                                        style={{
                                            borderRadius: '50%',
                                            cursor: 'pointer'
                                        }}
                                    />
                                </Box>
                            </Link>
                        </Box>
                        <Box ml={1} mr={1}>
                            <Box onClick={() => handleClose()}>
                                <Link
                                    href={`/communities/${story?.community?.id}`}
                                    passHref
                                >
                                    <TextLink as="div">
                                        <Text g700 semibold>
                                            {story?.community?.name}
                                        </Text>
                                    </TextLink>
                                </Link>
                            </Box>
                            <Text as="div" g500 regular small>
                                <Box fLayout="center start" flex>
                                    <CountryFlag
                                        countryCode={story?.community?.country}
                                        height={1.2}
                                        mr={0.5}
                                    />
                                    <Box>
                                        <Text>
                                            {story?.community?.city},{' '}
                                            {getCountryNameFromInitials(
                                                story?.community?.country
                                            )}
                                        </Text>
                                    </Box>
                                </Box>
                            </Text>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Row>
                <Col colSize={6}>
                    <DropdownMenu
                        icon="chevronDown"
                        items={[
                            {
                                icon: 'open',
                                onClick: () =>
                                    window.open(
                                        config.explorerUrl?.replace(
                                            '#USER#',
                                            community?.contractAddress
                                        )
                                    ),
                                title: t('openInExplorer')
                            },
                            {
                                icon: 'copy',
                                onClick: () =>
                                    copyToClipboard(community?.contractAddress),
                                title: t('copyAddress')
                            }
                        ]}
                        title={formatAddress(community?.contractAddress, [
                            6,
                            4
                        ])}
                        wrapperProps={{ mt: 0.25 }}
                    />
                </Col>
                <Col colSize={6} right>
                    <DropdownMenu
                        icon="share"
                        items={shareItems}
                        rtl
                        title={t('share')}
                        titleColor="g900"
                    />
                </Col>
            </Row>
        </>
    );
};

export default CommmunityInfo;
