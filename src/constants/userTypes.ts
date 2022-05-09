const types = {
    ambassador: 'ambassador',
    beneficiary: 'beneficiary',
    demo: 'demo',
    donor: 'donor',
    manager: 'manager',
    subDAOMember: 'subDAOMember'
};

export type UserTypesType = keyof typeof types;

export default types;
