import React from 'react';
import ReactDOM from 'react-dom';
import { Layout, Menu, Card, Form, Icon, Input, Button, Checkbox, message } from 'antd';
import { getToken, setToken, delToken, setUserName, delUserName, getUserName, setRole, getRole } from '../../local';
import { signin } from '../../api';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { ROUTES } from "../../config/routes.config";
import _ from "lodash";

const routes = _.clone(ROUTES);

const md5 = require('md5')
const { Header, Sider, Content } = Layout;
const FormItem = Form.Item;
const menus = ['event','spot','articles','fisharticles', 'user', 'app', 'spotswiper', 'classswiper','finance', 'stats', 'point'];

class LayoutMain extends React.Component {

  //let paths = ['article'];
  constructor(props) {
    super(props);
    //setToken('null')
    let token = getToken();
    // let path = props.location.pathname;
    // console.dir(menus.map(x => '/' + x));
    let path = "/spot"
    let key = menus.map(x => '/' + x).indexOf("path");
    let loginPage = false;
    // if(!token) {
    //   loginPage = true
    //   delToken();
    //   delUserName();
    // }
		//
    // if(getUserName() == 'caiwu' && key != 8) {
    //   key = 8;
    //   window.location.hash = 'finance';
    // }
    // if(getUserName() == 'yuying' && key == 8) {
    //   key = 0;
    // }
    // if(getUserName() == 'yunying_yonghu' && key != 4) {
    //   key = 4;
    //   window.location.hash = 'user';
    // }
    let username = getUserName();

		username = "admin";
    this.state = { username, collapsed: false, loginPage, selectkeys: [key > 0 ? key + '' : '0'] };
  }


  toggle () {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }


  handleSubmit(e) {
    e.preventDefault();

    this.props.form.validateFields(async (err, values) => {
      if (err) {
        console.log("提交数据错误!");
        return;
      }
      let r = await signin({name: values.username, password: md5(values.password)});
      if(r && r.data.token) {
        setToken('Bearer ' + r.data.token);
        setUserName(values.username);
        window.location.href = '/';
      }
    });
  }

  logout () {
    delToken();
    delUserName();
    window.location.reload();
  }

  menuCick(data) {
    console.dir(data.key);
    this.setState({ selectkeys: [data.key + '' ]});
    if(data.key <= 10) return window.location.hash = menus[data.key];
  }

  render() {
    const { getFieldDecorator , getFieldsError } = this.props.form;
    let { username } = this.state;
    let route = routes[0]

    console.log("route is:", route)
    return (
    <Router>
      <Layout style={{ height: '100%'}}>
        <Sider
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
        >
          <div className="logo" style={{ height: '64px',height: '64px', color:' #fff', 'textAlign': 'center', 'lineHeight': '64px' }}>
            管理后台
          </div>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['0']} selectedKeys={ this.state.selectkeys } onClick={ this.menuCick.bind(this) }>
            <Menu.Item key="0">
              <Icon type="table" />
              <span>按钮1</span>
            </Menu.Item>
            <Menu.Item key={route.key}>
              <Link to={route.link}><Icon type={route.iconType} /><b>{route.text}</b></Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: '0px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Icon
              className="trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle.bind(this)}
            />
            <div style={{ float: 'right' }}>
              <span>{ this.state.username }</span>
              <Button type="primary" icon="logout" onClick={ this.logout } style={{ margin: '0px 0px 0px 10px' }} />
            </div>
          </Header>
          <Content style={{
            margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280,
          }}
          >
            { /*this.props.children*/ }
            <Route exact key={route.key} path={route.link} component={route.component}/>
          </Content>
        </Layout>
      </Layout>
    </Router>
    )
  }
}

const IndexPage = Form.create()(LayoutMain);

ReactDOM.render(<IndexPage />, document.getElementById("root"));
