import React, { Component } from 'react';
import { render } from 'react-dom';

interface Props {}

interface State {}

class App extends Component<Props, State> {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>Funcionando</div>
        )
    }
}

function start() {
    render(<App />, document.getElementById("root"));
}

start();