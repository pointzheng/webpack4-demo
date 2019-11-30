// 获取本地保存的用户名
export function getUserName (){
  return localStorage.getItem('username') || ''
}

// 设置本地保存的用户名
export function setUserName (name){
  return localStorage.setItem('username', name);
}

export function setRole(name) {
  return localStorage.setItem('role', name);
}

export function getRole(name) {
  return localStorage.getItem('role', name);
}

// 删除本地保存的用户名
export function delUserName (){
  return localStorage.removeItem('username');
}

// 获取是否保存帐号标示
export function getToken (){
  return localStorage.getItem('token');
}

// 设置本地保存的用户名
export function setToken (token){
  return localStorage.setItem('token', token);
}

// 删除本地保存的用户名
export function delToken (){
  return localStorage.removeItem('token');
}



