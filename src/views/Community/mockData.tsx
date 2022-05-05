const getManagers = (timeoutInterval = 1000) => {
    const managers: any = [
        {
            avatar:'https://picsum.photos/120',
            beneficiaries:'Onboarded 22 Beneficiaires.',
            id:'0x43D2...a12f7',
            mail:'johndoe@myemail.com',
            manager:'Manager from May 12, 2020 – Present',
            name:'Paulo Silva Queirós',
            phone:'+1 669 2319892'   
        },
        {
            avatar:'https://picsum.photos/120',
            beneficiaries:'Onboarded 22 Beneficiaires.',
            id:'0x43D2...a12f7',
            mail:'johndoe@myemail.com',
            manager:'Manager from May 12, 2020 – Present',
            name:'Paulo Silva Queirós',
            phone:'+1 669 2319892'   
        },
        {
            avatar:'https://picsum.photos/120',
            beneficiaries:'Onboarded 22 Beneficiaires.',
            id:'0x43D2...a12f7',
            mail:'johndoe@myemail.com',
            manager:'Manager from May 12, 2020 – Present',
            name:'Paulo Silva Queirós',
            phone:'+1 669 2319892'   
        }  
    ];

    return new Promise((resolve) => {
        setTimeout(() => resolve(managers), timeoutInterval);
    })
}

export default getManagers
