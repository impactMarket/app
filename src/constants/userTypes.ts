const types = {
    ambassador: 'ambassador',
    beneficiary: 'beneficiary',
    borrower: 'borrower',
    councilMember: 'councilMember',
    demo: 'demo',
    donor: 'donor',
    manager: 'manager'
};

export type UserTypesType = keyof typeof types;

export default types;
