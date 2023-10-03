import { getCountryNameFromInitials } from '../utils/countries';
import { selectCurrentUser } from '../state/slices/auth';
import { useSelector } from 'react-redux';
import config from '../../config';
import useSWR from 'swr';

interface CountryOption {
    label: string;
    value: number;
}

export function useMicrocreditManagersByCountry(country: any) {
    const auth = useSelector(selectCurrentUser);
    const { signature, message, eip712_message, eip712_signature } =
        useSelector(selectCurrentUser);

    const fetcher = (url: string) =>
        fetch(config.baseApiUrl + url, {
            headers: {
                Authorization: `Bearer ${auth.token}`,
                eip712signature: eip712_signature,
                eip712value: eip712_message,
                message,
                signature
            }
        }).then((res) => res.json());

    const { data, mutate, error } = useSWR(
        `/microcredit/managers/${country}`,
        fetcher
    );

    const managers = data?.data?.map((item: any) => ({
        label: item.firstName,
        value: item.address
    }));

    const loadingManagers = !data && !error;

    return {
        loadingManagers,
        managers,
        mutate
    };
}

export function useMicrocreditCountries() {
    const auth = useSelector(selectCurrentUser);
    const { signature, message, eip712_message, eip712_signature } =
        useSelector(selectCurrentUser);

    const fetcher = (url: string) =>
        fetch(config.baseApiUrl + url, {
            headers: {
                Authorization: `Bearer ${auth.token}`,
                eip712signature: eip712_signature,
                eip712value: eip712_message,
                message,
                signature
            }
        }).then((res) => res.json());

    const { data, mutate, error } = useSWR(`/microcredit`, fetcher);

    const countries = data?.data
        .map((country: string) => ({
            label: getCountryNameFromInitials(country),
            value: country
        }))
        .sort((a: CountryOption, b: CountryOption) => {
            const labelA = a.label.toUpperCase();
            const labelB = b.label.toUpperCase();

            // eslint-disable-next-line no-nested-ternary
            return labelA < labelB ? -1 : labelA > labelB ? 1 : 0;
        });

    const loadingCountries = !data && !error;

    return {
        countries,
        loadingCountries,
        mutate
    };
}
