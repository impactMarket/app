import { gql } from '@apollo/client';

export const getCommunityBeneficiaries = gql`
    query getCommunityBeneficiaries($address: String!) {
        beneficiaryEntities(where: {community: $address}) {
            id
            state
        }
    }
`;

export const getBeneficiary = gql`
    query getBeneficiary($id: String!) {
        beneficiaryEntity(id: $id) {
            address
            id
            state
        }
    }
`;

export const getCommunityManagers = gql`
    query getCommunityManagers($address: String!) {
        managerEntities(where: {community: $address}) {
            id
            state
        }
    }
`;
