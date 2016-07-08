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
const without = (obj, ...exclude) =>
    Object.keys(obj).reduce(
        (result, key) => {
            if (exclude.indexOf(key) === -1) {
                result[key] = obj[key];
            }
            return result;
        },
        {}
    );

chrome.app.runtime.onLaunched.addListener(
    () => {
        chrome.app.window.create(
            'index.html',
            {
                outerBounds: {
                    width: 640,
                    height: 800
                },
                id: '0'
            }
        );
    }
);

// chrome.contextMenus.create({
//     title: "New Todo List",
//     documentUrlPatterns: [`chrome-extension://${chrome.runtime.id}/*`],
//     id: '1'
// });
// chrome.contextMenus.onClicked.addListener(({menuItemId: id}) => {
//     switch (id) {
//         case '1':
//             chrome.runtime.sendMessage({type: 'add-list'});
//             break;
//     }
// });
