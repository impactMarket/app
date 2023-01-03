import { Box, Button, Card, Display, Grid, ProgressCard } from '@impact-market/ui';
import { selectCurrentUser } from '../../state/slices/auth';
import { useLearnAndEarn } from '@impact-market/utils/useLearnAndEarn';
import { useSelector } from 'react-redux';
import RichText from '../../libs/Prismic/components/RichText';
import config from '../../../config';
import styled from 'styled-components';
import useSWR from 'swr';

const CardsGrid = styled(Grid)`
    flex-wrap: wrap;
    
    .grid-col {
        flex: 1;
        min-width: 17rem;
    }
`;

const RewardsButton = styled(Button)`
    border: transparent;
    width: fit-content;
`;

const Metrics = (props: any) => {
    const { amount = false, levelId = false, signature: signatures = false } = props.claimRewards;
    const auth = useSelector(selectCurrentUser);
    const { claimRewardForLevels } = useLearnAndEarn();

    const fetcher = (url: string) =>
        fetch(config.baseApiUrl + url, {
            headers: { Authorization: `Bearer ${auth.token}` }
        }).then((res) => res.json());

    const { data } = useSWR(`/learn-and-earn`, fetcher);
    const totals = data?.data;

    const totalData = [
        { ...totals?.level, label: 'Levels Completed' },
        { ...totals?.lesson, label: 'Lessons Completed' },
    ];

    const hasRewards = amount && levelId && signatures;
    const disabled = hasRewards ? { bgS400: true } : {};

    return (
        <CardsGrid colSpan={1} cols={{ lg: 3,md: 1, sm: 3, xs: 1 }} margin='1.5rem -.75rem' flex>
            {totalData.map((item) => (
                <ProgressCard
                    label={item.label}
                    progress={
                        item?.completed ?? (item?.received / item?.total) * 100
                    }
                    pathColor="p600"
                >
                    <Display semibold>
                        {`${item?.completed ?? item?.received} `}
                        <span
                            style={{
                                fontWeight: 400
                            }}
                        >
                            {'of'}
                        </span>
                        {` ${item?.total}`}
                    </Display>
                </ProgressCard>
            ))}
            <Card flex style={{alignItems: 'center', justifyContent: 'center'}} h="100%">
                <Box flex fDirection={'column'} style={{alignItems: 'center'}}>
                    <RichText center g500 medium small mb="1rem" content={hasRewards ? props.copy.success : props.copy.failed} />
                    <RewardsButton
                        onClick={async () => {
                            // console.log(!!claimRewards.length);
                            
                            console.log(auth.user.address);

                            console.log(auth.user.address.toString(),
                            [levelId],
                            [amount],
                            [signatures]);
                            

                            const response = await claimRewardForLevels(
                                auth.user.address.toString(),
                                [levelId],
                                [amount],
                                [signatures]
                            );

                            console.log(response);
                        }}
                        {...disabled}
                        disabled={!(hasRewards)}
                    >
                        {'Claim Rewards'}
                    </RewardsButton>
                </Box>
            </Card>
        </CardsGrid>
    );
};

export default Metrics;
