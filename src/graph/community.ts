import { gql } from '@apollo/client';

export const getCommunityEntity = gql`
    query getCommunityEntity($address: String!) {
        communityEntity(id: $address) {
            beneficiaries
            contributed
            contributors
            estimatedFunds
            managers
            maxClaim
        }
    }
`;
