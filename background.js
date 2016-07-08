// chrome.app.runtime.onLaunched.addListener(() => {
//     chrome.app.window.create(
//         'index.html',
//         {
//             outerBounds: {
//                 width: 640,
//                 height: 480
//             }
//         }
//     );
// });

const biMap = () => {
    const kv = new Map();
    const vk = new Map();
    const set = (key, value) => {
        kv.set(key, value);
        vk.set(value, key);
    };
    const removeKey = (key) => {
        const value = kv.get(key);
        kv.delete(key);
        vk.delete(value);
    };
    const removeValue = (value) => {
        const key = vk.get(value);
        kv.delete(key);
        vk.delete(value);
    };
    const getKey = (key) => kv.get(key);
    const getValue = (value) => vk.get(value);
    const hasKey = (key) => kv.has(key);
    const hasValue = (value) => vk.has(value);

    return {
        set, removeKey, removeValue, getKey, getValue, hasKey, hasValue
    };
};

const async = (func) =>
    (...args) => new Promise(
        (resolve) => {
            func(...args, (...values) => {
                switch (values.length) {
                    case 0: resolve(undefined); break;
                    case 1: resolve(values[0]); break;
                    default: resolve(values);
                }
            });
        }
    );
const setInfo = (info) => {
    const {title, text, tabID: tabId} = info;
    chrome.browserAction.setBadgeText({text, tabId});
    chrome.browserAction.setTitle({title, tabId});
};
const sendMessage = (id, type, data = null) => new Promise(
    resolve => chrome.tabs.sendMessage(id, {type, data}, resolve)
);

const initPage = (info, tab) => {
    // console.log(tab);
    // chrome.tabs.remove(tab.id);
    // tab.url = "https://google.com";
    const [url, scheme, domain] = tab.url.match(/^(https?:\/\/)(\w+(\.\w+)+)/);
    chrome.tabs.create(
        {url: `index.html#${tab.url}`},
        (newTab) => {
            console.log('done?', tab, newTab);
            tabs.set(tab.id, newTab.id);
            chrome.tabs.update(tab.id, {selected: true});
        }
    );

    const options = {
        contexts: ['editable'],
        documentUrlPatterns: [`*://${domain}/*`]
    };
    const main = chrome.contextMenus.create(
        Object.assign(
            {
                title: "Add to group"
            },
            options
        )
    );
    const list = [
        chrome.contextMenus.create(
            Object.assign(
                {
                    title: "Test Group",
                    parentId: main,
                    onclick: info => console.log(info)
                },
                options
            )
        )
    ];

    for (const group of [1, 2, 3, 4, 5]) {
        chrome.contextMenus.create(
            Object.assign(
                {
                    title: `Remove from '${group}'`
                },
                options
            )
        );
    }
};

// chrome.browserAction.setPopup({popup: "index.html"});
chrome.contextMenus.create({
    title: "Add to new group",
    contexts: ['page', 'editable'],
    onclick: initPage
});
// chrome.browserAction.onClicked.addListener();
chrome.tabs.onRemoved.addListener(tab => {
    if (tabs.hasValue(tab) === true) {
        tabs.removeValue(tab);
    }
});
//chrome.webNavigation.getAllFrames({tabId: 1552}, res => console.log(res))

const tabs = biMap();
const menus = new Map();

// async(chrome.tabs.query)({}).then(tabs => {
//     for (const tab of tabs) {
//         lists.set(tab.id, {ids: new Set(), lastID: null});
//     }
// });
//
// chrome.contextMenus.create({
//     title: "Test?",
//     contexts: ['editable'],
//     onclick: (info, tab) => {
//         // console.log(tab);
//         console.log(ties, tab);
//         // sendMessage(tab.id, 'test').then(res => console.log(res));
//         // currentTab = tab;
//         // async(chrome.tabs.executeScript)(ties.get(tab.id), {code: "document.activeElement.id"}).
//         //     then(([results]) => {
//         //         console.log(results);
//         //         // const {ids, lastID} = lists.get(tab.id);
//         //         // const nextID = Date.now().toString();
//         //         // ids.add(results);
//         //         // if (lastID !== null) {
//         //         //     chrome.notifications.clear(lastID);
//         //         // }
//         //         // chrome.notifications.create(nextID, {message: Array.from(ids).join('\n'), iconUrl: 'bayonetta.png', title: 'Wat', type: 'basic'});
//         //         // lists.get(tab.id).lastID = nextID;
//         //     });
//     }
// }, () => {});
//
// chrome.contextMenus.create({
//     title: "Create Group",
//     contexts: ['editable'],
//     onclick: (info, tab) => {
//         currentTab = tab;
//         chrome.tabs.create({url: 'index.html'});
//     }
// }, () => {});

chrome.runtime.onMessage.addListener(({type, data}, sender, respond) => {
    messageHandlers[type](data, respond);
});

const messageHandlers = {
    test: (data, respond) => respond({time: Date.now(), num: Math.random()}),
    iframeURL: ({iframeID}, respond) => chrome.tabs.executeScript(iframeID, {code: "document.location.toString()"}, ([answer]) => respond(answer)),
    tabCreated: ({parentID, childID}, respond) => {
        // console.log(parentID, childID);
        ties.set(parentID, childID);
        respond({});
    }
};

// fetch(
//     "http://mobileappqa.centerforautism.com/echo",
//     {
//         body: '[1, 2, 3, 4]',
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     }
// ).then(
//     r => r.text()
// ).then(
//     console.log.bind(console)
// );

// chrome.contextMenus.create({
//     title: "Demo %s",
//     contexts: ["selection"]
// }, () => {});
//
// for (let x = 0; x < 15; x += 1) {
//     chrome.contextMenus.create({
//         title: "Look at me I'm Mr. Meeseeks (Paste)",
//         contexts: ['page', 'editable']
//     }, () => {});
// }
