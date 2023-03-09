import { request } from 'graphql-request';
import config from '../../config';
import useSWR from 'swr';

export default function useBeneficiariesCount(query?: Array<any>) {
    const fetcher = (query: string, variables: string) =>
        request(config.graphUrl, query, variables);

    const { data, error } = useSWR(query, fetcher);

    const loading = !data && !error;
    const beneficiariesCount = data?.communityEntities?.reduce(
        (partialSum: number, a: any) => partialSum + a?.beneficiaries,
        0
    );

    return {
        beneficiariesCount,
        data,
        error,
        loading
    };
}
