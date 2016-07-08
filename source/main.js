import "theme/default.js";
import {Settings, Session} from "settings";
import DataCenter from "datacenter";

import storage from 'plugins/storage';

import Expandable from 'components/expandable';

// window.onerror = err => alert(err);
window.addEventListener(
    'error',
    error => {
        Dialog.alert(`${error.message}\n${error.stack}`);
    },
    true
);

const {Route} = ReactRouter;

let dataNodes = null;

// window.addEventListener(
//     'contextmenu',
//     evt => {
//         console.log(evt.target);
//     }
// );
// chrome.runtime.onMessage.addListener(({type}) => {
//     (async () => {
//         switch (type) {
//             case 'add-list':
//                 const name = await Dialog.prompt(null, {title: "New Todo List", placeholder: "Name"});
//                 if (name === null || name === undefined) {
//                     return;
//                 }
//                 PubSub.publish("new.todo", name);
//                 break;
//         }
//     })();
//     return true;
// });

const genDisplay = ({type, ...data}) => {
    if (type === 'folder') {
        return <Expandable title={data.title}>{data.children.map(genDisplay)}</Expandable>;
    }
    return <div>{JSON.stringify(data)}</div>;
};

class Selectable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {selected: false};
    }

    componentDidMount = () => {
        this.token = PubSub.subscribe(
            "selected",
            (t, obj) => {
                const {selected} = this.state;
                const {onSelect = () => {}} = this.props;
                if (obj === this && selected === false) {
                    this.setState({selected: true});
                    onSelect(this);
                }
                if (obj !== this && selected === true) {
                    this.setState({selected: false});
                }
            }
        );
    }
    componentWillUnmount = () => {
        PubSub.unsubscribe(this.token);
    }

    select = (evt) => {
        // evt.preventDefault();
        evt.stopPropagation();
        PubSub.publish("selected", this);
    }

    render = () => {
        const {selected} = this.state;
        const {children, component = "div"} = this.props;

        return <UI.Touchable style={{backgroundColor: selected ? 'cyan' : ''}} component={component} onContextMenu={this.select}>{children}</UI.Touchable>;
    }
}

class Tree extends React.Component {
    constructor(props) {
        super(props);
    }

    select = () => {
        // console.log(this.refs.tree);
        currentNode = this.props.node;
    }

    render = () => {
        const {title, node} = this.props;
        const {children = []} = node;
        const childDisplay = (
            <div>
                {children.length > 0 ?
                    children.map(child => <div>{JSON.stringify(child)}</div>) :
                    <div>No lists or folders added</div>
                }
            </div>
        );

        return (
            <Selectable onSelect={this.select}>
                <Expandable title={title} initialExpanded={title === "Top Level"} ref="tree">{childDisplay}</Expandable>
            </Selectable>
        );
    }
}

const generateNode = (type) => {
};
class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {items: null};
    }

    componentDidMount = () => {
        chrome.storage.local.get(
            null,
            items => {
                if (items.hasOwnProperty('topLevel') === false) {
                    items.topLevel = {children: []};
                }
                dataNodes = items;
                this.forceUpdate();
                // this.setState({items});
            }
        );
    }

    render = () => {
        // const {items} = this.state;
        // let itemDisplay;

        // if (items !== null) {
        //     itemDisplay = "Items?";
        // }

        // console.log(dataNodes);
        // const manageFunction = (() => {
        //     let current = null;
        //
        // })();
        let display = null;

        if (dataNodes !== null) {
            display = <Tree title="Top Level" node={dataNodes.topLevel} />;
        }

        return (
            <UI.Screen title="Better Todo">
                <div style={{width: '100%', height: '100%'}} onContextMenu={() => currentNode = null}>
                    <div style={{paddingLeft: 10, paddingRight: 10}}>
                        {display}
                    </div>
                </div>
                {/*{itemDisplay}*/}
                {/*<div onContextMenu={evt => console.log('lol')}><UI.Image source="https://www.gravatar.com/avatar/94ba1c43defdcdcfe524858cccd8dbe4?s=200" width={200} height={200} /></div>*/}
            </UI.Screen>
        );
    }
}

let currentNode = null;
chrome.contextMenus.create({
    title: "New Todo List",
    documentUrlPatterns: [`chrome-extension://${chrome.runtime.id}/*`],
    id: '1'
});
chrome.contextMenus.onClicked.addListener(({menuItemId: id}) => {
    (async () => {
        switch (id) {
            case '1':
                console.log(currentNode);
                if (currentNode !== null) {
                    const name = await Dialog.prompt(null, {title: "New Todo List", placeholder: "Name"});
                    if (name === null || name === undefined) {
                        return;
                    }
                    PubSub.publish("new.todo", name);
                }
                // console.log('native?');
                // chrome.runtime.sendMessage({type: 'add-list'});
                break;
        }
    })();
    return true;
});

// window.addEventListener('touchstart', cblog);

App.start(
    <Route path="/" component={Main} />
);
