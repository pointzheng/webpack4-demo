import React from 'react'
import {withRouter} from 'react-router-dom'
import PropTypes from 'prop-types'
import './index.less'
import {Form, Icon, Input, Button, Checkbox, message} from 'antd';

const FormItem = Form.Item;

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loginError: false,
            loginErrorMsg: '',
            loading: false,
            login: false,
            userInfo: {}
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();

        window.location.href = 'index.html'
    }

    render() {
      const {getFieldDecorator} = this.props.form;
      const inputStyle = {color: 'rgba(0,0,0,.25)'};

      return (
        <Form onSubmit={this.handleSubmit} className="login-form">
          <FormItem>
              {getFieldDecorator('userName', {
                  rules: [{required: true, message: 'input user name'}],
              })(
                  <Input prefix={<Icon type="user" style={inputStyle}/>} placeholder="用户名"/>
              )}
          </FormItem>
          <FormItem>
              {getFieldDecorator('password', {
                  rules: [{required: true, message: 'input password'}],
              })(
                  <Input prefix={<Icon type="lock" style={inputStyle}/>} type="password" placeholder="密码"/>
              )}
          </FormItem>
          <FormItem style={{marginBottom: 0, textAlign: "right"}}>
              <Button type="primary" loading={this.state.loading} htmlType="submit" className="login-form-button">
                  {
                      this.state.loading ?
                          'login...' :
                          this.state.login ? `welcome，${this.state.userInfo['userName']}` : '登录'
                  }
              </Button>
          </FormItem>
          {
              this.state.loginError &&
              <span style={{color: '#f5222d'}}>{this.state.loginErrorMsg}</span>
          }
        </Form>
      )
    }
}

LoginForm.contextTypes = {
    setLoginInfo: PropTypes.func,
    loginType: PropTypes.number
};

export default withRouter(Form.create()(LoginForm));
