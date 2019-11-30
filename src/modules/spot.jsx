import React from 'react';
import { Input, Popover, Table, Button, message, Switch, Radio, Modal } from 'antd';
import { getUserName } from '../local';
import { getSpots, updateSpot, transferSpot, deleteSpot } from '../api';

const ButtonGroup = Button.Group;
const moment = require('moment');
const { Search } = Input
const typeMap = {"1": "黑坑", "2": "路亚", "3": "自然水域", "4": "海钓"}

class Spot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
	    data: [],
	    pagination: {
	    	pageSize: 10,
	    	currentPage: 0,
	    	total: 0
	    },
      keywords: '',
	    loading: false,
	  }
  }

  componentDidMount() {
    this.fetch();
  }

  refreshData() {
    let params = this.buildClientCons();

    this.fetch(params)
  }

  // 创建当前的查询条件
  buildClientCons() {
    let pagination = this.state.pagination;
    let currentPage = pagination.currentPage;
    let pageSize = pagination.pageSize;
    let keywords = this.state.keywords;
    let json = {currentPage, pageSize, cons: {}};

    if (keywords) {
      json.keywords = keywords;
    }

    return json;
  }

   async onUpdateChange(data, key) {
    var value = ""
    let json = {
      id: data.id + "",
      key
    };

    if (key == "top") {
      value = (data.top == "1" ? "2" : "1");
    } else if (key == "attestation") {
      value = (data.attestation == "1" ? "2" : "1");
    } else if (key == "activity") {
      value = (data.activity == "1" ? "2" : "1");
    } else if (key == "game") {
      value = (data.game == "1" ? "2" : "1");
    } else if (key == "weight") {
      value = data.weight;
    } else if (key == "activity") {
      value = (data.activity == "1" ? "2" : "1");
    } else if (key == "status") {
      value = (data.status == "1" || data.status == "3" ? "2" : "3");
    } else if (key == "star") {
      value = data.star;
    }
    json.value = value;
    let r = await updateSpot(json)

    if(r && r.status == 'ok') {
      message.success('修改成功')
      this.refreshData()
    } else {
      message.success('修改失败')
    }
  }

  handleTableChange(pagination, filters, sorter) {
    const pager = { ...this.state.pagination };

    pager.currentPage = pagination.current;
    this.setState({
      pagination: pager,
    }, this.refreshData);
  }

  async transfer(data){
    let r = await transferSpot({
      id: data.id,
      uniqID: data.uniqID
    })
    if(r && r.status == 'ok') {
      message.success('修改成功')
    } else {
      message.error(r.status ? r.status.message|| '修改失败' : '修改失败')
    }
  }

  uniqChange(data, e) {
    let datas = this.state.data;
    datas[data.key].uniqID = e.target.value;
    this.setState({ data: datas })
  }

  onStarChange(data,e) {
    let datas = this.state.data;
    datas[data.key].star = e.target.value;
    this.setState({ data: datas })
  }

  weightChange(data,e){
    let datas = this.state.data;
    datas[data.key].weight = e.target.value;
    this.setState({ data: datas })
  }

  async onDeleteSure(data) {
    let r = await deleteSpot(data.id)
    if (r && r.status == 'ok') {
      message.success('删除成功')
    } else {
      message.error(r.status ? r.status.message || '删除失败' : '删除失败')
    }
    this.refreshData();
  }

  async onSearch(value) {
    this.setState({ keywords: value });
    this.fetch({
      keywords: value,
      currentPage: 1,
      pageSize: this.state.pagination.pageSize
    })
  }

  async fetch (params = {}) {
    this.setState({ loading: true });
    let res = await getSpots(params);
    const list = res.data.list.map((x,i) => Object.assign({
      key: i,
      description:
        <div className="flex c spot-inner">
          <div className="flex r spot-inner-box">
            <label>ID</label>
            <p>{ x.id }</p>
          </div>
          <div className="flex r spot-inner-box">
            <label>日期</label>
            <p>{ moment(x.createdAt).format('YYYY-MM-DD HH:mm') }</p>
          </div>
          <div className="flex r spot-inner-box">
            <label>地址</label>
            <p>{ x.address }</p>
          </div>
          <div className="flex r spot-inner-box">
            <label>鱼类</label>
            <p>{ x.fishes }</p>
          </div>
          <div className="flex r spot-inner-box">
            <label>钓场概况</label>
            <p> { `水域面积${x.waterSquare}亩,池塘个数${x.waterCount}个,钓位个数${x.spotCount}个,钓位间距${x.waterSquare}米,限杆长度${x.rodLong}米,水深${x.waterDepth}米`}</p>
          </div>
          <div className="flex r spot-inner-box">
            <label>规则说明</label>
            <p>{ x.content }</p>
          </div>
        </div>
    }, x))
	  this.setState({
      loading: false,
	    data: list,
      pagination: {
        total: res.data.totalRecords,
        pageSize: res.data.pageSize,
        currentPage: res.data.currentPage
      }
	  })
  }

  render() {
  	const columns = [{
  	  title: '钓场',
  	  dataIndex: 'name',
      width:'200px'
  	}, {
  	  title: '类型',
  	  dataIndex: 'spotType',
      width:'100px',
      render: (index, record) => <span>{typeMap[record.spotType]}</span>
  	}, {
      title: '星级',
      dataIndex: 'star',
      width:'80px'
    }, {
      title: '推荐指数',
      dataIndex: 'weight',
      width:'80px'
    }, {
  	  title: '金额',
  	  dataIndex: 'money',
      width:'100px'
  	}, {
  	  title: '联系人',
  	  dataIndex: 'leaderName',
      width:'80px'
  	}, {
      title: '创建用户',
      dataIndex: 'user',
      width:'80px'
    }, {
  	  title: '联系电话',
  	  dataIndex: 'leaderPhone',
      width:'100px'
  	}, {
  	  title: '操作',
  	  dataIndex: 'op',
      // width: '300',
  	  render: (index, data) =>
        <div>
          <Switch size="default" checked = { data.top == "1" ? true : false  } style={{ margin:"5px" }} checkedChildren="推荐" unCheckedChildren="不推荐"  onChange={ this.onUpdateChange.bind(this, data, 'top') }/>
          <Switch size="default" checked = { data.attestation == "1" ? true : false  } style={{ margin:"5px" }} checkedChildren="认证" unCheckedChildren="非认证"  onChange={ this.onUpdateChange.bind(this, data, 'attestation') }/>
          <Switch size="default" checked = { data.activity == "1"? true : false  } style={{ margin:"5px" }} checkedChildren="活动" unCheckedChildren="非活动"  onChange={ this.onUpdateChange.bind(this, data, 'activity') }/>
          <Switch size="default" checked = { data.game == "1" ? true : false  } style={{ margin:"5px" }} checkedChildren="赛事" unCheckedChildren="非赛事"  onChange={ this.onUpdateChange.bind(this, data, 'game') }/>
          <Popover style={{ margin:'0px 5px' }} placement="topLeft" title='推荐指数'
            content={
              <div className="flex r">
                <Input value={ data.weight }  type="number" onChange={ this.weightChange.bind(this,data) }/>
                <Button  style={{ marginLeft:'5px' }} onClick={ this.onUpdateChange.bind(this, data, 'weight') }>确定</Button>
              </div>
            }
            trigger="click"
          >
            <Button type="primary" size="small" style={{ marginLeft:'5px' }}>推荐指数</Button>
          </Popover>
          <Switch size="default"  style={{ margin:"5px" }}
            onChange = { this.onUpdateChange.bind(this, data, 'status') }
            checkedChildren="已通过"
            unCheckedChildren={data.status == "1" ? "审核中" : (data.status == "3" ? "未通过" : "错误状态")}
            checked={ data.status == '2' }
          />
          <Popover style={{ marginLeft:'5px' }} placement="topLeft" title='转让确认' content={
            <div className="flex r">
              <Input value={ data.uniqID }  onChange={ this.uniqChange.bind(this,data) }/>
              <Button  style={{ marginLeft:'5px' }} onClick={ this.transfer.bind(this, data) }>确定</Button>
            </div>}
            trigger="click"
          >
            <Button type="primary" size="small" style={{ marginLeft:'5px', display: "none" }}>转让</Button>
          </Popover>
          <Popover style={{ marginLeft:'5px' }} placement="topLeft" title='星级修改' content={<div className="flex r">
             <Input value={ data.star }  type="number" onChange={ this.onStarChange.bind(this,data) }/> <Button  style={{ marginLeft:'5px' }} onClick={ this.onUpdateChange.bind(this, data, 'star') }>确定</Button>
          </div>} trigger="click">
            <Button type="primary" size="small" style={{ marginLeft:'5px' }}>星级修改</Button>
          </Popover>
          <Popover style={{ marginLeft:'5px' }} placement="topLeft" title='确定删除?' content={<div className="flex r">
            <Button  style={{ marginLeft:'5px' }} onClick={ this.onDeleteSure.bind(this, data) }>确定</Button>
          </div>} trigger="click">
            <Button type="primary" size="small" style={{ marginLeft:'5px' }}>删除</Button>
          </Popover>
        </div>
  	}]
    return (
      <div className="boxer">
        <div style={{ marginBottom: '20px'}}>
          <Search style={{  width: '200px' }} placeholder="输入关键词" onSearch={ this.onSearch.bind(this) } enterButton />
        </div>
        <Table
          expandedRowRender={record => <div style={{ margin: 0 }}>{record.description}</div>}
          columns={columns}
          rowKey={record => record.id}
          dataSource={this.state.data}
          pagination={this.state.pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange}
        />
      </div>
    )
  }
}

export default Spot;
