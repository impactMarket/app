import { Box, Tab, TabList, TabPanel, Tabs, colors } from '@impact-market/ui';
import { styled } from 'styled-components';
import { usePrismicData } from 'src/libs/Prismic/components/PrismicDataProvider';
import RepaymentHistory from './RepaymentHistory';

const Microcredit = (props: { borrower: any }) => {
    const { borrower } = props;
    const { extractFromView } = usePrismicData();
    const { repaymentHistory } = extractFromView('microcredit') as any;

    // PROVISORY STYLED -> Add new style on UI (TabList) and DELETE this one
    const TabListStyled = styled(TabList)`
        ul {
            border-bottom: 0 !important;

            li {
                border: 1px solid ${colors.g300} !important;
                border-radius: 0 !important;
                padding: 0.625rem 1rem !important;
                margin: 0 !important;
                background-color: #fff !important;

                &:first-child {
                    border-radius: 8px 0 0 8px !important;
                }

                &:last-child {
                    border-radius: 0 8px 8px 0 !important;
                }

                &:only-child {
                    border-radius: 8px !important;
                }

                &.react-tabs__tab--selected {
                    background-color: ${colors.g50} !important;
                }

                + li {
                    margin-left: -1px !important;
                }

                &:after {
                    display: none !important;
                }

                p {
                    color: ${colors.g800} !important;
                }
            }
        }
    `;

    return (
        <>
            <Tabs>
                <TabListStyled>
                    <Tab title={repaymentHistory} />
                    {/* <Tab title="Communication History" />
                    <Tab title="Application History" /> */}
                </TabListStyled>
                <TabPanel>
                    <Box mt={0.5}>
                        <RepaymentHistory borrower={borrower} />
                    </Box>
                </TabPanel>
            </Tabs>
        </>
    );
};

export default Microcredit;
