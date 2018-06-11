'use strict';
var slider = document.querySelector('.slider');
var sliderContainer = document.querySelector('.slider__container');

// Создание карточек из шаблона
function createArticle(item) {
  var template = document.querySelector('template').content.cloneNode(true);
  template.querySelector('article').setAttribute('data-index', item.index.toString());
  template.querySelector('img').src = item.picture;
  template.querySelector('.item__title').textContent = item.name.charAt(0).toUpperCase() + item.name.slice(1);
  template.querySelector('.item__author').textContent = (item.author.last ? (item.author.last + ' ' + item.author.first.slice(0, item.author.first.length - (item.author.first.length - 1)) + '.') : '');
  var price = template.querySelector('.item__price span');
  price.textContent = (item.typediscount === 'F') ? Math.round(+item.price - item.discount) : Math.round(+item.price);
  var sale = template.querySelector('.item__discount').querySelector('span');
  if (item.typediscount === 'P' && item.discount !== 0) {
    sale.textContent = item.discount;
  } else {
    template.querySelector('.item__discount').innerHTML = '<span></span>';
  }
  return template;
}

// Загрузка данных
function loadJSON(callback) {
  var xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.open('GET', 'test.json', true);
    xhr.onreadystatechange = function () {
      if(xhr.readyState == 4 && xhr.status == 200) {
        callback(xhr.responseText);
      }
    };
  xhr.send(null);
}

loadJSON(function(response) {
  var data = JSON.parse(response);
  for (var i = 0; i < data.length; i++) {
    sliderContainer.appendChild(createArticle(data[i]));
    sliderContainer.children[i].setAttribute('id', (i+1).toString());
  }
});

// Слайдер
var buttonLeft = document.querySelector('.slider__button--left');
var buttonRight = document.querySelector('.slider__button--right');
var item = document.getElementsByTagName('article');
var step = 0;

function moveSlider() {
  var target = event.target;
  if (target.classList.contains('slider__button--right') && step > (-88)) {
    step+=(-4);
    sliderContainer.style.transform = "translateX(" + step + "%)";
    sliderContainer.style.transition = "transform 1s";
  } else if (target.classList.contains('slider__button--right') && step == (-88)) {
    step = 0;
    sliderContainer.style.transform = "translateX(" + step + "%)";
    sliderContainer.style.transition = "transform";
  } else if (target.classList.contains('slider__button--left') && step != 0) {
    step+=4;
    sliderContainer.style.transform = "translateX(" + step + "%)";
    sliderContainer.style.transition = "transform 1s";
  } else if (target.classList.contains('slider__button--left') && step == 0) {
    step = (-88);
    sliderContainer.style.transform = "translateX(" + step + "%)";
    sliderContainer.style.transition = "transform";
  }
}
slider.addEventListener('click', moveSlider);

// Корзина
var cart = document.querySelector('.cart');
var cartPosition = document.querySelector('tbody');
var buttonBuy = sliderContainer.getElementsByClassName('item__buy');
var cartItems = cart.querySelector('.cart__items');
var cartSumm = cart.querySelector('.cart__total');
sliderContainer.addEventListener('click', selectItem);

function selectItem() {
  var target = event.target;
  if(target.className === 'item__buy' && target.parentElement.className === 'item') {
    target.parentElement.classList.add('item--selected');
    target.textContent = 'Отменить';
    addItem(target.previousElementSibling.firstElementChild.textContent, target.previousElementSibling.children[2].firstElementChild.textContent,
    target.previousElementSibling.lastElementChild.textContent,  target.parentElement.id);
  } else if (target.className === 'item__buy' && target.parentElement.className === 'item item--selected') {
    target.parentElement.classList.remove('item--selected');
    target.textContent = 'Купить';
    Array.from(cartPosition.children).forEach(function(item) {
      if(item.dataset.id === target.parentElement.id) {
        item.remove();
      }
    });
  }
}

// Корзина товаров
var mutationObserver = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if(mutation.type === 'childList' && cartPosition.children.length) {
      cart.style.display = 'table';
      cartItems.textContent = cartPosition.children.length;
      cartSumm.textContent = Array.from(cartPosition.children).map(function(item) {
        return item.children[1].lastElementChild.textContent;
      }).reduce(function(accumulator, item) {
        return +accumulator + +item;
      });
    } else if(mutation.type === 'childList' && !cartPosition.children.length) {
      cart.style.display = 'none';
    }
  });
});
mutationObserver.observe(cartPosition, {childList: true});

function addItem(name, price, discount, id) {
  var newPrice;
  var newDiscount;
  discount = discount.slice(7, -1);
  if(discount) {
    newPrice = Math.round((+price * discount)/100);
    newDiscount = 'Cкидка:' + discount + '%';
  } else {
    newPrice = +price;
    newDiscount = 'Cкидка: 0%';
  }
  var itemHTML = "\
    <tr data-id=" + id + ">\
      <th>" + name + "</th>\
      <td data-id="+ newPrice +">" + newDiscount + "__Цена: <span>" + newPrice + "</span> руб.</td>\
    </tr>";
  cartPosition.insertAdjacentHTML('beforeEnd', itemHTML);
}
