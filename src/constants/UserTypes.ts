const types = {
    beneficiary: 'beneficiary',
    demo: 'demo',
    donor: 'donor',
    manager: 'manager'
};

export type UserTypesType = keyof typeof types;

export default types;
