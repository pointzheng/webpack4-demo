import React from "react";
import ReactDOM from 'react-dom';
import PropTypes from "prop-types";
import LoginForm from "../../components/LoginForm/index.jsx";
import { BrowserRouter as Router } from 'react-router-dom'
import { Card, Icon } from 'antd'
import "./main.less";

class PageLogin extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
      return (
        <Router>
          <Card className='login-card' hoverable>
              <h2 style={{textAlign: "center", marginBottom: 25}}>
                钓鱼排行榜登录
              </h2>
              <LoginForm />
          </Card>
        </Router>
      )
  }
}

PageLogin.contextTypes = {
    login: PropTypes.bool,
    userInfo: PropTypes.object,
    setLoginInfo: PropTypes.func
};

ReactDOM.render(<PageLogin />, document.getElementById("root"));
