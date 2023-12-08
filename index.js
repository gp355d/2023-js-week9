import axios from 'axios';
import { toThousands } from './main.js';
import Swal from 'sweetalert2'
import validate from "validate.js";
let apiPath = 'leo533'
let url = "https://livejs-api.hexschool.io/api/livejs/v1/customer";
let totalPrice=0;
const ldld = new ldLoader({ root: ".my-loader" });
// Scrollspy
document.addEventListener('DOMContentLoaded', function () {
  const ele = document.querySelector('.recommendation-wall');
  ele.style.cursor = 'grab';
  let pos = { top: 0, left: 0, x: 0, y: 0 };
  const mouseDownHandler = function (e) {
    ele.style.cursor = 'grabbing';
    ele.style.userSelect = 'none';

    pos = {
      left: ele.scrollLeft,
      top: ele.scrollTop,
      // Get the current mouse position
      x: e.clientX,
      y: e.clientY,
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };
  const mouseMoveHandler = function (e) {
    // How far the mouse has been moved
    const dx = e.clientX - pos.x;
    const dy = e.clientY - pos.y;

    // Scroll the element
    ele.scrollTop = pos.top - dy;
    ele.scrollLeft = pos.left - dx;
  };
  const mouseUpHandler = function () {
    ele.style.cursor = 'grab';
    ele.style.removeProperty('user-select');

    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
  };
  // Attach the handler
  ele.addEventListener('mousedown', mouseDownHandler);
});

// menu 切換
let menuOpenBtn = document.querySelector('.menuToggle');
let linkBtn = document.querySelectorAll('.topBar-menu a');
let menu = document.querySelector('.topBar-menu');
menuOpenBtn.addEventListener('click', menuToggle);

linkBtn.forEach((item) => {
  item.addEventListener('click', closeMenu);
})

function menuToggle() {
  if (menu.classList.contains('openMenu')) {
    menu.classList.remove('openMenu');
  } else {
    menu.classList.add('openMenu');
  }
}
function closeMenu() {
  menu.classList.remove('openMenu');
}

let getDataList = [];
let getCartList = [];
const optionList = document.querySelector('.productSelect');
optionList.addEventListener('change',(e)=>{
  let filterArray = [];
  let getOptionval = e.target.value;
  console.log(getOptionval);
  if(getOptionval === "全部"){
    filterArray = getDataList;
  }else{
    filterData(getDataList,getOptionval,filterArray);
  }
})
function filterData(data,getVal,filterArray){
  data.forEach((filterDatas)=>{
    if(filterDatas.category === getVal){
      filterArray.push(filterDatas)
    }
  })
  renderProducts(filterArray);
}

const productList = document.querySelector('.productWrap');
function init(){
  getProducts();
  getCarts();
}
function getProducts(){
  ldld.on();
  axios.get(`${url}/${apiPath}/products`)
    .then(res => {
      console.log(res.data.products);
      getDataList = res.data.products;
      renderProducts(getDataList)
      ldld.off();
    })
    .catch(err => {
      console.log(err);
    });
}
function renderProducts(renderData){
  let str = '';
  renderData.forEach(product => {
    str+= `<li class="productCard">
    <h4 class="productType">新品</h4>
    <img src="${product.images}" alt="">
    <a href="#" class="addCardBtn" data-id=${product.id}>加入購物車</a>
    <h3>${product.title}</h3>
    <del class="originPrice">NT$${toThousands(product.origin_price)}</del>
    <p class="nowPrice">NT$${toThousands(product.price)}</p>
    </li>`
});
productList.innerHTML = str;
}
const cartList = document.querySelector('.shoppingCart-table tbody');
function getCarts(){
  axios.get(`${url}/${apiPath}/carts`)
  .then(res => {
    console.log(res.data.carts);
    getCartList = res.data.carts;
    totalPrice = res.data.finalTotal;
    renderCart(getCartList,totalPrice)
  })
  .catch(err => {
    console.log(err);
  });
}
const totalPriceDom = document.querySelector('.totalPrice');
const overflowWrap = document.querySelector('.shoppingCart-table');
function renderCart(renderCartdata,totalPrice){
  // debugger;
  let str = '';
  const discardAllBtn = document.querySelector('.discardAllBtn')
  if(renderCartdata.length === 0){
    str = '<tr><td colspan="8" style="text-align:center">目前前購物列表內無商品</td></tr>';
    // console.log(totalPriceDom.parentElement.parentElement);
    // totalPriceDom.parentElement.parentElement.remove();
    // overflowWrap.style.display = 'none';
    discardAllBtn.style.display = 'none'
    totalPriceDom.textContent = totalPrice;
    cartList.innerHTML = str;
    return;
  }else{
    renderCartdata.forEach(cart => {
      str+=`<tr>
      <td>
          <div class="cardItem-title">
              <img src="${cart.product.images}" alt="">
              <p>${cart.product.title}</p>
          </div>
      </td>
      <td>NT$${toThousands(cart.product.price)}</td>
      <td>${cart.quantity}</td>
      <td>NT$${toThousands(cart.product.price * cart.quantity)}</td>
      <td class="discardBtn">
          <a href="#" class="deleteItem material-icons" data-id=${cart.id}>
              clear
          </a>
      </td>
    </tr>`
    });
  }
  // const aElemet = document.createElement('a');
  // aElemet.classList('discardAllBtn').textContent='刪除所有品項';
  discardAllBtn.style.display = 'inline-block';
  totalPrice = toThousands(totalPrice);
  totalPriceDom.textContent = `NT$${totalPrice}`;
  cartList.innerHTML = str;
}

function addCart(getProductId){
  let num =1;
  getCartList.forEach((item)=>{
    if(item.product.id===getProductId){
      num=item.quantity+=1;
    }
  })
  ldld.on();
  axios.post(`${url}/${apiPath}/carts`,{
    data: {
      productId: getProductId,
      quantity: num
    }
  })
  .then(res => {
    console.log(res);
    totalPrice = res.data.finalTotal;
    getCartList = res.data.carts;
    console.log(getCartList);
    Swal.fire({
      position: "center",
      icon: "success",
      title: "商品已加入購物清單",
      showConfirmButton: false,
      timer: 1500
    });
    ldld.off();
    renderCart(getCartList,totalPrice)
    // console.log(res.data.products);
    // getDataList = res.data.products;
    // renderProducts(getDataList)
  })
  .catch(err => {
    console.log(err);
  });
}
let productWrap = document.querySelector('.productWrap');
productWrap.addEventListener('click',(e)=>{
  e.preventDefault();
  if(e.target.nodeName!== 'A'){
    return;
  }else{
    const getProductId = e.target.getAttribute('data-id')
    addCart(getProductId)
  }

})

cartList.addEventListener('click',((e)=>{
  e.preventDefault();
  let getItemid = e.target.getAttribute('data-id')
  // if(getItemid === null){
  //   return;
  // }
  deleteCart(getItemid)
}))
function deleteCart(id){
  ldld.on();
  axios.delete(`${url}/${apiPath}/carts/${id}`)
    .then(res => {
      totalPrice = res.data.finalTotal;
      getCartList = res.data.carts;
      console.log(getCartList);
      Swal.fire({
        position: "center",
        icon: "success",
        title: '該商品已經刪除',
        showConfirmButton: false,
        timer: 1500
      });
      ldld.off();
      renderCart(getCartList,totalPrice)
    })
    .catch(err => {
      console.log(err);
    });
}

//驗證表單規則
const constraints = {
  姓名:{
    presence:{
      message: "必填欄位"
    },
  },
  電話:{
    presence:{
      message: "必填欄位"
    },
    format: {
      pattern: /^[09]{2}\d{8}$/,
      message: "需以 09 開頭，共 10 碼"
   },
    length: {
      minimum: 8,
      message: "號碼需超過 8 碼"
    }
  },
  Email:{
    presence: {
      message: "是必填欄位"
    },
    email: {
      message: "格式有誤"
    }
  },
  寄送地址:{
    presence: {
      message: "是必填欄位"
    }
  },
  交易方式:{
    presence: {
      message: "是必填欄位"
    },
  }

}

const discardAllBtn = document.querySelector('.discardAllBtn');
discardAllBtn.addEventListener('click',(e)=>{
  e.preventDefault();
  deleteAllitem()
})
function deleteAllitem(){
  ldld.on();
  axios.delete(`${url}/${apiPath}/carts`)
  .then(res => {
    totalPrice = res.data.finalTotal;
    getCartList = res.data.carts;
    console.log(getCartList);
    Swal.fire({
      position: "center",
      icon: "success",
      title: res.data.message,
      showConfirmButton: false,
      timer: 1500
    });
    ldld.off();
    renderCart(getCartList,totalPrice)
  })
  .catch(err => {
    console.log(err);
  });
}
const messages = document.querySelectorAll('[data-message]');
const formDom = document.querySelector('.orderInfo-form');
const orderInfoMessage=document.querySelectorAll('.orderInfo-message'); 
// const customerInfo = document.querySelectorAll('.orderInfo-input');
formDom.addEventListener('submit',(e)=>{
  //驗證是否符合表單規則
  e.preventDefault();
  let errors = validate(formDom, constraints);
  // customerInfo.forEach((e) =>{
  //   e.addEventListener("change", validationInput);
  // });
  // 如果有誤，呈現錯誤訊息  
  if (errors) {
    showErrors(errors);
  } else {
    // // 如果沒有錯誤，送出表單
    orderInfoMessage.forEach((item)=>{
      console.log(item);
      item.textContent='';
    })
    sendOrders(e);
  }
})
function sendOrders(e){
  if(getCartList.length === 0){
    Swal.fire({
      position: "center",
      icon: "success",
      title: "購物清單內目前無選購商品!",
      showConfirmButton: false,
      timer: 1500
    });
    return;
  }
  // console.log(e.target[2].value);
  let sendOrder = {
    "data": {
      "user": {
        "name": e.target[0].value,
        "tel": e.target[1].value,
        "email": e.target[2].value,
        "address": e.target[3].value,
        "payment": e.target[4].value
      }
    }
  }
  // let ary=[]
  // customerInfo.forEach(function(item){
  //   ary.push(item.value);
  //   console.log(ary);
  // })

// let sendOrder = {
//   "data": {
//     "user": {
//       "name": ary[0],
//       "tel": ary[1],
//       "email": ary[2],
//       "address": ary[3],
//       "payment": ary[4]
//     }
//   }
// }
ldld.on();
  axios.post(`${url}/${apiPath}/orders`,sendOrder)
  .then(res => {
    formDom.reset();
    Swal.fire({
      position: "center",
      icon: "success",
      title: "訂單已送出",
      showConfirmButton: false,
      timer: 1500
    });
    getCarts();
    ldld.off();

  })
  .catch(err => {
    console.log(err);
  });
}
init()


//顯示表單驗證錯誤的回饋資訊
function showErrors(errors) {
  messages.forEach((item)=> {
    item.textContent = errors[item.dataset.message];
  })
  return false;
}