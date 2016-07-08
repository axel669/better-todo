export default {
    read(keys) {
        return new Promise(
            resolve => chrome.storage.local.get(
                keys,
                obj => {
                    switch (true) {
                        case (typeof keys === 'string'): {
                            resolve(obj[keys]);
                            break;
                        }
                        case (Array.isArray(keys) === true): {
                            resolve(keys.map(key => obj[key]));
                            break;
                        }
                        default: {
                            resolve(obj);
                        }
                    }
                }
            )
        );
    },
    write(items) {
        return new Promise(resolve => chrome.storage.local.set(items, () => resolve(true)));
    }
};
