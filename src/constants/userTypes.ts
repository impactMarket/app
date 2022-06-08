const types = {
    ambassador: 'ambassador',
    beneficiary: 'beneficiary',
    councilMember: 'councilMember',
    demo: 'demo',
    donor: 'donor',
    manager: 'manager',
};

export type UserTypesType = keyof typeof types;

export default types;
