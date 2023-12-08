import './assets/scss/all.scss';
import './node_modules/ldloader/dist/ldld.js';
import Swal from 'sweetalert2';

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

// 錯誤處理提示
export function sweetalert2(text) {
  Swal.fire({
    position: "top-end",
    text: text,
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  });
}

export function toThousands(x) {
  let parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}
// Swal.fire("SweetAlert2 is working!");


// // 金錢千分位處理
// export function formattedNumber(price) {
//   return price.toLocaleString('zh-TW');
// }