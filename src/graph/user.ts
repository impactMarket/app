import { gql } from '@apollo/client';

export const getCommunityBeneficiaries = gql`
    query getCommunityBeneficiaries($address: String!) {
        beneficiaryEntities(where: {community: $address}) {
            id
            state
        }
    }
`;
