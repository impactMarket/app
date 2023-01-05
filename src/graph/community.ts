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

export const getBeneficiaries = gql`
    query getBeneficiaries {
        communityEntities {
            beneficiaries
        }
    }
`;

export const getCommunityBeneficiaries = gql`
    query getBeneficiaries($ids: [String]) {
        communityEntities(where: {id_in: $ids}) {
            beneficiaries
        }
    }
`;

export const getInactiveBeneficiaries = gql`
    query getInactiveBeneficiaries($lastActivity_lt: Int!, $address: String!) {
        beneficiaryEntities(where: { lastActivity_lt: $lastActivity_lt, community: $address }){
            id
            address
            since
            claimed
        }
    }
`;
