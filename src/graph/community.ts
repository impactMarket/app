import { gql } from '@apollo/client';

export const getCommunityEntity = gql`
    query getCommunityEntity($address: String!) {
        communityEntity(id: $address) {
            beneficiaries
            contributed
            contributors
            estimatedFunds
            lastActivity
            managers
            maxClaim
        }
    }
`;

export const getCommunityEntities = gql`
    query getCommunityEntities($ids: [String], $orderDirection: String) {
        communityEntities(
            orderBy: lastActivity
            orderDirection: $orderDirection
            where: { id_in: $ids }
        ) {
            id
            lastActivity
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
        communityEntities(where: { id_in: $ids }) {
            beneficiaries
        }
    }
`;

export const getInactiveBeneficiaries = gql`
    query getInactiveBeneficiaries($lastActivity_lt: Int!, $address: String!) {
        beneficiaryEntities(
            where: { lastActivity_lt: $lastActivity_lt, community: $address }
        ) {
            id
            address
            since
            claimed
        }
    }
`;
