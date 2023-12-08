import axios from 'axios';
import c3 from 'c3'

// import { sweetalert2 } from './main.js';
import Swal from 'sweetalert2'


let adminUrl = "https://livejs-api.hexschool.io/api/livejs/v1/admin";
let token = "XuK0KP4RkXR6ywFwzAvx7jPYBZg1";
const ldld = new ldLoader({ root: ".my-loader" });
let apiPath = 'leo533'
const acesstoken={
  headers: {
  'Authorization': token
  }
}
let getOrderList = [];
function getOrderDatas(){
  ldld.on();
  axios.get(`${adminUrl}/${apiPath}/orders`,acesstoken)
    .then(res => {
      // console.log(res.data.orders);
      getOrderList = res.data.orders;
      renderOrders(getOrderList);
      C3renderCategory(getOrderList);
      c3RenderRate(getOrderList);
      ldld.off();
    })
    .catch(err => {
      console.log(err);
    });
}
let ordersListDom = document.querySelector('.orderTableWrap tbody')
function renderOrders(orderListdata){
  let str = '';
  let orderItems = ''
  if(orderListdata.length === 0){
    deleteAllbtn.style.display = 'none';
    str = `<td colspan="8" style="text-align:center">目前無訂單資料</td>`;
    ordersListDom.innerHTML = str;
    return;
  }
  orderListdata.forEach(order => {
    // console.log(order);
    const timeStatus = new Date(order.createdAt * 1000);
    let year = timeStatus.getFullYear();
    let month = timeStatus.getMonth()+1;
    let date = timeStatus.getDate();
    if(month < 10){
      month =`0${month}`
    }
    if(date < 10){
      date=`0${date}`
    }
    const orderTime=`${year}/${month}/${date}`;
    if(order.paid) {
      order.paid='已處理'
    }
    else{
      order.paid='未處理'
    }
    order.products.forEach((products)=>{
      console.log(products);
      orderItems+=`${products.title}*${products.quantity}<br>`
    })
    str += `
    <tr>
        <td>${order.id}</td>
        <td>
          <p>${order.user.name}</p>
          <p>${order.user.tel}</p>
        </td>
        <td>${order.user.address}</td>
        <td>${order.user.email}</td>
        <td>
          <p>${orderItems}</p>
        </td>
        <td>${orderTime}</td>
        <td class="orderStatus">
          <a href="#" data-Orderid="${order.id}">${order.paid}</a>
        </td>
        <td>
          <input type="button" class="delSingleOrder-Btn" value="刪除" data-Orderid="${order.id}">
        </td>
    </tr>`
  });
  ordersListDom.innerHTML = str;
  // console.log(str2);
}
function deleteOrders(orderId){
  ldld.on();
  axios.delete(`${adminUrl}/${apiPath}/orders/${orderId}`,acesstoken)
  .then(res => {
    console.log(res);
    getOrderList = res.data.orders;
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "該筆訂單已刪除",
      showConfirmButton: false,
      timer: 1500
    });
    renderOrders(getOrderList);
    C3renderCategory(getOrderList);
    c3RenderRate(getOrderList);
    ldld.off();

  })
  .catch(err => {
    console.log(err);
  });
}
let deleteAllbtn = document.querySelector('.discardAllBtn')
deleteAllbtn.addEventListener('click',()=>{
  ldld.on();
  axios.delete(`${adminUrl}/${apiPath}/orders`,acesstoken)
  .then(res => {
    console.log(res);
    getOrderList = res.data.orders;
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "全部訂單皆已刪除",
      showConfirmButton: false,
      timer: 1500
    });
    renderOrders(getOrderList);
    C3renderCategory(getOrderList);
    c3RenderRate(getOrderList);
    ldld.off();

  })
  .catch(err => {
    console.log(err);
  })
})
// C3.js

// let chart = c3.generate({
//   bindto: '#chart', // HTML 元素綁定
//   data: {
//       type: "pie",
//       columns: [
//       ['Louvre 雙人床架', 1],
//       ['Antony 雙人床架', 2],
//       ['Anty 雙人床架', 3],
//       ['其他', 4],
//       ],
//       colors:{
//           "Louvre 雙人床架":"#DACBFF",
//           "Antony 雙人床架":"#9D7FEA",
//           "Anty 雙人床架": "#5434A7",
//           "其他": "#301E5F",
//       }
//   },
// });
function init(){
  getOrderDatas()
}
ordersListDom.addEventListener('click',(e)=>{
  e.preventDefault();
  let status = false;
  console.log(e.target.nodeName);
  let getOrderID = e.target.getAttribute('data-Orderid')
  if(e.target.nodeName === 'A'){
    if(e.target.textContent === '未處理'){
      status=!status
    }
    changeOrderstatus(getOrderID,status)
  }else if(e.target.nodeName === 'INPUT'){
    deleteOrders(getOrderID)
  }else{
    return;
  }
})
function changeOrderstatus(getOrderID,status){
  ldld.on();
  axios.put(`${adminUrl}/${apiPath}/orders`,  {
    "data": {
      "id": getOrderID,
      "paid": status
    }
  },acesstoken)
  .then(res => {
    getOrderList = res.data.orders;
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "訂單狀態已切換",
      showConfirmButton: false,
      timer: 1500
    });
    ldld.off();
    renderOrders(getOrderList)
  })
  .catch(err => {
    console.log(err);
  });
}
function C3renderCategory(getOrderList){
  let chatDom = document.querySelector('#chart');
  if(getOrderList.length === 0){
    chatDom.style.textAlign = 'center'
    chatDom.innerHTML = '目前無訂單資料';
    return;
  }
  let dataObj = {};
  console.log(getOrderList);
  getOrderList.forEach((item)=>{
    // console.log(item);
    item.products.forEach((collectItem)=>{
      // console.log(collectItem);
      if(dataObj[collectItem.category] === undefined){
        dataObj[collectItem.category] = collectItem.price * collectItem.quantity
      }else{
        dataObj[collectItem.category] += collectItem.price * collectItem.quantity
      }
    })
  })
  console.log(dataObj);
  
  let collectAry = Object.keys(dataObj)
  let c3Data = [];
  collectAry.forEach((c3items)=>{
    let comb = [];
    // console.log(c3items);
    comb.push(c3items)
    // console.log(comb,"is"+dataObj[c3items]);
    comb.push(dataObj[c3items])
    // console.log(comb);
    // console.log(c3Data);
    c3Data.push(comb)
  })
  c3.generate({
    bindto: '#chart', // HTML 元素綁定
    data: {
        type: "pie",
        columns: c3Data,
    },
    color:      {
      pattern:["#301E5F", "#5434A7", "#9D7FEA", "#DACBFF"]
    }
  });
}

function c3RenderRate(getOrderList){
  let chatDomR = document.querySelector('#chartR');
  if(getOrderList.length === 0){
    chatDomR.style.textAlign = 'center'
    chatDomR.innerHTML = '目前無訂單資料';
    return;
  }
  //資料蒐集
  let obj={};
  console.log(getOrderList);
  getOrderList.forEach((item)=>{
    item.products.forEach((productItem)=>{
      if(obj[productItem.title]===undefined){
        obj[productItem.title]=productItem.price*productItem.quantity;
      }
      else{
        obj[productItem.title]+=productItem.price*productItem.quantity
      }
    })
  })
  let newAry = Object.keys(obj);
  //組成C3格式資料
  let c3Data=[];
  newAry.forEach(function(item){
    let combination=[];
    combination.push(item);
    combination.push(obj[item]);
    c3Data.push(combination)
  })
  // console.log(c3Data);
  c3Data.sort(function(a,b){
    return b[1]-a[1];
  })
  // console.log(c3Data.length);
  if(c3Data.length>3){
    let otherTotal=0;
    c3Data.forEach(function(item,i){
      if(i>2){
        otherTotal+=c3Data[i][1];
      }
    })
    c3Data.splice(3,c3Data.length-1);
    c3Data.push(['其他',otherTotal]);
    console.log(c3Data);
    c3.generate({
      bindto: '#chartR', // HTML 元素綁定
      data: {
          type: "pie",
          columns: c3Data,
      },
      color:      {
        pattern:["#301E5F", "#5434A7", "#9D7FEA", "#DACBFF"]
      }
    });
  }
}

init()