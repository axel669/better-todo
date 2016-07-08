class Expandable extends React.Component {
    constructor(props) {
        super(props);
        const {initialExpanded = false} = props;
        this.state = {expanded: initialExpanded};
    }

    toggle = () => {
        let {expanded} = this.state;

        expanded = !expanded;
        this.setState({expanded});
    }

    render = () => {
        const {expanded} = this.state;
        let icon;
        let style;

        if (expanded === true) {
            icon = "ion-chevron-down";
        } else {
            icon = "ion-chevron-right";
            style = {display: 'none'};
        }

        style = {
            ...style,
            ...{
                paddingLeft: 20
            }
        };

        return (
            <div style={{padding: 2}}>
                <UI.Touchable component="div" onTap={this.toggle} style={{cursor: 'pointer', fontWeight: 600, fontSize: 18}}>
                    <span style={{fontFamily: "Ionic", display: 'inline-block', width: 20}}>{ionic[icon]}</span>{this.props.title}
                </UI.Touchable>
                <div style={style}>{this.props.children}</div>
            </div>
        );
    }
}

export default Expandable;
