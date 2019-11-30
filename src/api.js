import { getToken } from './local'

const apiBase = "http://localhost:8080";

function createPostInfo(json, isFormEncoded) {
	let body;
	let headers;

	if (typeof json === "undefined" || json === null) {
		json = {};
	}
	if (isFormEncoded) {
		body = Object.keys(json).map(function (key) {
        return encodeURIComponent(key) + "=" + encodeURIComponent(json[key]);
    }).join("&");
		headers = {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'};
	} else {
		 body = JSON.stringify(json);
		 headers =  {'Content-Type': 'application/json;charset=UTF-8'};
	}

	return  {
		method: 'POST',
		headers,
		body
	};
}

// zhengyy:登录
export async function signin({ name, password }) {
	let res = await fetch(`${apiBase}/account/login`, createPostInfo({name, password}));
	let result = await res.json();

	return result;
}

// zhengyy:用户列表
export async function getUsers(data) {
	let res = await fetch(`${apiBase}/user/list`, createPostInfo(data));
	let result = await res.json();

	return result;
}

// 更新禁用状态
export async function updateUser(data) {
	let res = await fetch(`${apiBase}/user/switchForbidden`, createPostInfo(data, true));
	let result = await res.json();

	return result;
}


export async function getScoreListByUserId(uid) {
	let res = await fetch(`${apiBase}/user/getScoreList?uid=${uid}`, {
		method: 'GET',
    // headers: {'token': getToken()} // TODO: 相应加入token
	});
	let result = await res.json();

	return result;
}

export async function getEvents(data) {
	let res = await fetch(`${apiBase}/event/list`, createPostInfo(data));
	let result = await res.json();

	return result;
}

export async function deleteEvent(id) {
	let res = await fetch(`${apiBase}/event/del?id=${id}`, {
		method: 'GET'
	});
	let result = await res.json();

	return result;
}

export async function updateEvent(data) {
	let res = await fetch(`${apiBase}/event/updateByKey`, createPostInfo(data));
	let result = await res.json();

	return result;
}

export async function getSpots(data) {
	let res = await fetch(`${apiBase}/spot/list`, createPostInfo(data));
	let result = await res.json();

	return result;
}


export async function updateSpot(data) {
	let res = await fetch(`${apiBase}/spot/updateByKey`, createPostInfo(data));
	let result = await res.json();

	return result;
}

export async function deleteSpot(id) {
	let res = await fetch(`${apiBase}/spot/del?id=${id}`, {
		method: 'GET'
	});
	let result = await res.json();

	return result;
}

export async function getFishCatch(data) {
	let res = await fetch(`${apiBase}/fishcatch/list`, createPostInfo(data));
	let result = await res.json();

	return result;
}

export async function delFishCatch(id) {
	let res = await fetch(`${apiBase}/fishcatch/del?id=${id}`, {
		method: 'GET'
	});
	let result = await res.json();

	return result;
}

export async function getArticles(data) {
	let res = await fetch(`${apiBase}/article/list`, createPostInfo(data));
	let result = await res.json();

	return result;
}

export async function delArticle(id) {
	let res = await fetch(`${apiBase}/article/del?id=${id}`, {
		method: 'GET'
	});
	let result = await res.json();

	return result;
}

export async function  updateArticleByField(data) {
	let res = await fetch(`${apiBase}/article/updateByKey`, createPostInfo(data));
	let result = await res.json();

	return result;
}

export async function getArticleById(id) {
	let res = await fetch(`${apiBase}/article/detail?id=${id}`, {
		method: 'GET'
	});
	let result = await res.json();

	return result;
}

export async function addArticle(data) {
	let res = await fetch(`${apiBase}/article/au`, createPostInfo(data));
	let result = await res.json();

	return result;
}

export async function getSwipers(data) {
	let res = await fetch(`${apiBase}/app/getIndexList`, createPostInfo(data));
	let result = await res.json();

	return result;
}

export async function delSwiper(data) {
	let res = await fetch(`${apiBase}/app/del`, createPostInfo(data));
	let result = await res.json();

	return result;
}

export async function addSwiper(data) {
	let res = await fetch(`${apiBase}/app/add`, createPostInfo(data));
	let result = await res.json();

	return result;
}

export async function updateSwiper(data) {
	let res = await fetch(`${apiBase}/app/update`, createPostInfo(data));
	let result = await res.json();

	return result;
}

export async function getPoints(data) {
	let res = await fetch(`${apiBase}/points/list`, createPostInfo(data));
	let result = await res.json();

	return result;
}

export async function updateFinance(data) {
	let res = await fetch(`${apiBase}/finance/update`, createPostInfo(data));
	let result = await res.json();

	return result;
}

export async function getFinance(data) {
	let res = await fetch(`${apiBase}/finance/list`, createPostInfo(data));
	let result = await res.json();

	return result;
}

export async function downloadFinance(data) {
	window.open("http://www.baidu.com")
}
/*************************************************************/

export  async function transferSpot(data) {
	let res = await fetch('/api/spot/transfer', {
		method: 'POST',
		headers: {
     'Content-Type': 'application/json;charset=UTF-8',
     'Authorization': getToken()
    },
    body: JSON.stringify(data),
	});
	let result = await res.json();
	return result;
}
