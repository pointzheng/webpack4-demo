import "./index.scss";
import {Modal, Button} from 'antd'
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

export default class IndexPage extends Component {
	render() {
		return (
			<Button type="primary">This is ant button</Button>
		)
	}
}

ReactDOM.render(<IndexPage />, document.getElementById("root"));
