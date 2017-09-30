import React, {Component} from "react";

class DefaultLayout extends Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <div>
                <h1>Example showing Medium posts</h1>
                <main>{this.props.children()}</main>
            </div>
        );
    }
}

export {DefaultLayout};
export default DefaultLayout;