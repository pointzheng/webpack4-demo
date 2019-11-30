import React from 'react';
import { Input, Popover, Table, Button, message, Switch, Radio, Modal } from 'antd';
import { getUserName } from '../local';
import { DatePicker } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { getEvents, updateEvent, deleteEvent } from '../api';
import locale from 'antd/es/date-picker/locale/zh_CN';

const timeFormat = 'YYYY-MM-DD HH:mm:ss';
const dateFormat = 'YYYYMMDD';
const RadioButton = Radio.Button;
const { Search } = Input;
const RadioGroup = Radio.Group;
const { MonthPicker, RangePicker } = DatePicker;
const ButtonGroup = Button.Group;

moment.locale('zh-cn');

class Event extends React.Component {
  constructor(props) {
    super(props);

    const startOfToday = moment().startOf('day');
    const endOfToday = moment().endOf('day');
    this.state = {
	    data: [],
	    pagination: {
	    	pageSize: 10,
	    	currentPage: 1,
	    	total: 0
	    },

      // 查询条件相关
      filter: 'createdAt',
      start: startOfToday.add(-7, 'day'),
      end: endOfToday,
	   	type: 'all',
	   	date: null,
	   	key: null,
	   	status: 'all',
	    loading: false
	  }
  }

  componentDidMount() {
    let pagination = this.state.pagination;
    this.fetch();
  }

  onRecommendChange = async(data) => {
    // if(data.status != '2') return message.error('状态错误，不能修改') // 源码：已通过，不能再修改
    let r = await updateEvent({
      id: data.id + "",
      key: "top",
      value: data.top == "1" ? "2" : "1"
    })
    if(r && r.status == 'ok') {
      message.success('修改成功')
      this.refreshData()
    } else {
      message.error('修改失败')
    }
  }

  onStatusChange = async(data) => {
    let r = await updateEvent({
      id: data.id + "",
      key: "status",
      value: data.status == "1" || data.status == "3" ? "2" : "3"
    })
    if(r && r.status == 'ok') {
      message.success('修改成功')
      this.refreshData()
    } else {
      message.error('修改失败')
    }
  }

  async onRecommendIndexOk(data) {
    let r = await updateEvent({
      id: data.id + "",
      key: "weight",
      value: data.weight
    })
    if(r && r.status == 'ok') {
      message.success('修改成功')
      this.refreshData()
    } else {
      message.error(r.status ? r.status.message|| '修改失败' : '修改失败')
    }
  }

  onWeightChange(data,e) {
    let datas = this.state.data;
    datas[data.key].weight = e.target.value;
    this.setState({ data: datas })
  }

  async onDelete(data) {
    let r = await deleteEvent(data.id)
    if(r && r.status == 'ok') {
      message.success('删除成功')
    } else {
      message.error(r.status ? r.status.message|| '删除失败' : '删除失败')
    }
    this.refreshData();
  }

  refreshData() {
    let params = this.buildClientCons();

    this.fetch(params)
  }

  onTypeConChange = (e) => {
    let type = e.target.value;

    this.setState({type}, this.refreshData)
  }

  // 创建当前的查询条件
  buildClientCons() {
    let pagination = this.state.pagination;
    let currentPage = pagination.currentPage;
    let pageSize = pagination.pageSize;
    let keywords = this.state.key;
    let json = {currentPage, pageSize, cons: {}};

    if (keywords) {
      json.keywords = keywords;
    }
    if (this.state.type != "all") {
      json.cons.type = this.state.type;
    }
    if (this.state.status != "all") {
      json.cons.status = this.state.status;
    }
    if (this.state.start) {
      json.cons.clientStartTime = moment(this.state.start).format(timeFormat);
    }
    if (this.state.end) {
      json.cons.clientEndTime = moment(this.state.end).format(timeFormat);
    }

    return json;
  }

  onFilterConChange = (e) => {
    this.setState({filter: e.target.value}, this.refreshData);
  }

  onStatusConChange = (e) => {
  	this.setState({ status: e.target.value }, this.refreshData);
  }

  onRangeConChange = async(dates, dateStrings) => {
    this.setState({
      start: dateStrings[0],
      end: dateStrings[1]
    }, this.refreshData)
  }

  qrCode = (id) => {
    window.open('/event/qr/code/' + id)
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };

    pager.currentPage = pagination.current;
    this.setState({
      pagination: pager,
    }, this.refreshData);
  }

  onSearch = async(value) => {
    this.setState({ key: value }, this.refreshData);
  }

  fetch = async (params = {}) => {
    this.setState({ loading: true });
    let res = await getEvents(params);
    const list = res.data.list.map((x,i) => (Object.assign({
      key: i,
      description:
        <ul className="flex c spot-inner">
          <li className="flex r spot-inner-box">
            <label>ID</label>
            <p>{x.id }</p>
          </li>
          <li className="flex r spot-inner-box">
            <label>创建日期</label>
            <p>{moment(x.createTime).format(timeFormat)}</p>
          </li>
          <li className="flex r spot-inner-box">
            <label>报名截止</label>
            <p>{moment(x.endTime).format(timeFormat)}</p>
          </li>
          <li className="flex r spot-inner-box">
            <label>开始时间</label>
            <p>{moment(x.startTime).format(timeFormat)}</p>
          </li>
          <li className="flex r spot-inner-box">
            <label>规则说明</label>
            <p>{x.content}</p>
          </li>
        </ul>
    }, x)))
	  this.setState({
	    loading: false,
	    data: list,
  	  pagination: {
        total: res.data.totalRecords,
        pageSize: res.data.pageSize,
        currentPage: res.data.currentPage
  	  },
	  })
  }

  render() {
    let {start, end} = this.state;
  	const columns = [{
  	  title: '主题',
  	  dataIndex: 'name',
  	  width: '150',
  	}, {
  	  title: '类型',
  	  dataIndex: 'type',
  	  width: '80',
      render: (index, record) => <span>{record.type == "1" ? "活动" : "赛事"}</span>
  	}, {
      title: '开始时间',
      dataIndex: 'startTime',
      width: '120',
      render: (index, record) => <span>{moment(record.startTime).format(timeFormat)}</span>
    }, {
  	  title: '发布用户',
  	  dataIndex: 'user',
  	  width: '80',
  	}, {
  	  title: '钓场',
  	  dataIndex: 'spotName',
  	  width: '150',
  	}, {
      title: '推荐指数',
      dataIndex: 'weight',
  	  width: '80'
    }, {
  	  title: '人数',
  	  dataIndex: 'peopleNumber',
  	  width: '80'
  	}, {
  	  title: '订单数',
  	  dataIndex: 'orderCnt',
  	  width: '80'
  	}, {
  	  title: '订单人数',
  	  dataIndex: 'orderPeopleCnt',
  	  width: '80'
  	}, {
  	  title: '操作',
  	  dataIndex: 'op',
  	  width: '300',
  	  render: (index, data) => <div>
        <Switch size="default"
          checked = { data.top == "1" ? true : false  }
          style={{ margin:"0px 5px",  float: 'left'  }}
          checkedChildren="推荐" unCheckedChildren="不推荐"
          onChange={ this.onRecommendChange.bind(this, data) }
        />
        <Popover
          style={{ margin:'0px 5px', float: 'left'  }}
          placement="topLeft" title='推荐指数'
          content={
            <div className="flex r">
              <Input value={ data.weight }  type="number" onChange={ this.onWeightChange.bind(this,data) }/>
              <Button  style={{ marginLeft:'5px' }} onClick={ this.onRecommendIndexOk.bind(this, data) }>确定</Button>
            </div>
          }
          trigger="click"
        >
          <Button type="primary" size="small" style={{ marginLeft:'5px' }}>推荐指数</Button>
        </Popover>
       	<Switch
          size="default"
          style={{ margin:"0px 5px", float: 'left' }}
          onChange={ this.onStatusChange.bind(this, data) }
          checkedChildren="已通过"
          unCheckedChildren={data.status == "1" ? "审核中" : (data.status == "3" ? "未通过" : "错误状态")}
          checked={data.status == '2'}
        />
        <Popover
          style={{ marginLeft:'5px' }}
          placement="topLeft" title='确定删除?'
          content={
            <div className="flex r">
              <Button  style={{ marginLeft:'5px' }} onClick={ this.onDelete.bind(this, data) }>确定</Button>
            </div>
          }
          trigger="click"
        >
          <Button type="primary" size="small" style={{ marginLeft:'5px' }}>删除</Button>
        </Popover>
        <Button
          style={{ marginLeft:'5px' }}
          type="primary"
          size="small"
          onClick={ this.qrCode.bind(this,data.id) }
        >二维码</Button>
      </div>
  	}]
    return (
      <div className="boxer">
        <div style={{ marginBottom: '20px'}}>
        	<RadioGroup onChange={this.onTypeConChange} value={this.state.type} style={{marginRight: '10px'}}>
  	        <RadioButton value="all">全部</RadioButton>
  	        <RadioButton value="2">赛事</RadioButton>
  	        <RadioButton value="1">活动</RadioButton>
  	      </RadioGroup>
  		    <RadioGroup onChange={this.onStatusConChange} value={this.state.status} style={{marginRight: '10px'}}>
  	        <RadioButton value="all">全部</RadioButton>
  	        <RadioButton value="1">审核中</RadioButton>
  	        <RadioButton value="2">已通过</RadioButton>
  	        <RadioButton value="3">未通过</RadioButton>
  	      </RadioGroup>
          <Search
            style={{  width: '200px' }}
            placeholder="输入关键词"
            onSearch={ this.onSearch.bind(this) }
            enterButton
          />
  	    </div>
        <div style={{ marginBottom: '20px'}}>
          <RadioGroup onChange={this.onFilterConChange} value={this.state.filter} style={{  marginRight: '10px' }}>
            <RadioButton value="createTime">创建时间</RadioButton>
            <RadioButton value="endTime">报名截止</RadioButton>
            <RadioButton value="startTime">开始时间</RadioButton>
          </RadioGroup>
          <RangePicker
            ranges={{
              '今天': [moment(), moment()],
              '近7天': [moment().add(-7,'day'), moment()],
              '近30天': [moment().add(-30,'day'), moment()],
              '本月': [moment().startOf('month'), moment().endOf('month')],
            }}
            locale={locale}
            defaultValue={[start, end]}
            format={dateFormat}
            onChange={this.onRangeConChange}
          />
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

export default Event;
