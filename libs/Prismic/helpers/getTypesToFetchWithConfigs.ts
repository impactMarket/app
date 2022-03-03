const getTypesToFetchWithConfigs = (types?: string[]) => [
    'pwa-config',
    'pwa-modals',
    'pwa-translations',
    'pwa-user-config',
    ...(types || [])
];

export default getTypesToFetchWithConfigs;
