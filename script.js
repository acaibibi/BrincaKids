/*
  ==========================================
  CONFIGURAÇÃO
  ==========================================

  TROQUE pelo número do WhatsApp da loja.

  IMPORTANTE:
  Use o número com código do país + DDD,
  sem espaços, parênteses ou traços.

  Exemplo:
  5511999999999
*/

const WHATSAPP = "5511932286206";


/*
  ==========================================
  PRODUTOS
  ==========================================

  Você pode alterar nome, preço, emoji e
  desconto dos produtos aqui.
*/

const products = [
  {
    id: 1,
    name: "Urso de Pelúcia Gigante",
    oldPrice: 149.90,
    price: 79.90,
    emoji: "🧸",
    discount: 47
  },

  {
    id: 2,
    name: "Kit Massinha Criativa",
    oldPrice: 89.90,
    price: 49.90,
    emoji: "🎨",
    discount: 44
  },

  {
    id: 3,
    name: "Carrinho Radical",
    oldPrice: 119.90,
    price: 69.90,
    emoji: "🏎️",
    discount: 42
  },

  {
    id: 4,
    name: "Boneca Fashion",
    oldPrice: 139.90,
    price: 74.90,
    emoji: "👧",
    discount: 46
  },

  {
    id: 5,
    name: "Kit Blocos de Montar",
    oldPrice: 129.90,
    price: 69.90,
    emoji: "🧱",
    discount: 46
  },

  {
    id: 6,
    name: "Dinossauro Interativo",
    oldPrice: 179.90,
    price: 99.90,
    emoji: "🦖",
    discount: 44
  },

  {
    id: 7,
    name: "Kit Cozinha Infantil",
    oldPrice: 159.90,
    price: 89.90,
    emoji: "🍳",
    discount: 44
  },

  {
    id: 8,
    name: "Super Bola Colorida",
    oldPrice: 59.90,
    price: 29.90,
    emoji: "⚽",
    discount: 50
  }
];


/*
  ==========================================
  CARRINHO
  ==========================================
*/

let cart = [];


/*
  Renderiza os produtos
*/

function renderProducts() {

  const grid = document.getElementById("products-grid");

  grid.innerHTML = products.map(product => {

    return `
      <article class="product-card">

        <div class="product-image">

          <span class="offer-label">
            ${product.discount}% OFF
          </span>

          <span class="emoji">
            ${product.emoji}
          </span>

        </div>

        <div class="product-info">

          <h3>${product.name}</h3>

          <div class="old-price">
            De R$ ${formatPrice(product.oldPrice)}
          </div>

          <div class="price">
            R$ ${formatPrice(product.price)}
          </div>

          <button
            class="buy-button"
            onclick="adicionarAoCarrinho(${product.id})"
          >
            🛒 ADICIONAR
          </button>

        </div>

      </article>
    `;

  }).join("");
}


/*
  Adiciona produto
*/

function adicionarAoCarrinho(productId) {

  const product = products.find(
    product => product.id === productId
  );

  const existing = cart.find(
    item => item.id === productId
  );

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }

  atualizarCarrinho();

  abrirCarrinho();
}


/*
  Altera quantidade
*/

function alterarQuantidade(productId, change) {

  const item = cart.find(
    item => item.id === productId
  );

  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    cart = cart.filter(
      item => item.id !== productId
    );
  }

  atualizarCarrinho();
}


/*
  Atualiza carrinho
*/

function atualizarCarrinho() {

  const cartItems = document.getElementById("cart-items");
  const cartEmpty = document.getElementById("cart-empty");
  const cartFooter = document.getElementById("cart-footer");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  cartCount.textContent = totalItems;

  cartTotal.textContent =
    `R$ ${formatPrice(totalPrice)}`;


  if (cart.length === 0) {

    cartItems.innerHTML = "";

    cartEmpty.style.display = "block";
    cartFooter.style.display = "none";

    return;
  }


  cartEmpty.style.display = "none";
  cartFooter.style.display = "block";


  cartItems.innerHTML = cart.map(item => {

    return `
      <div class="cart-item">

        <div class="cart-item-image">
          ${item.emoji}
        </div>

        <div class="cart-item-info">

          <h4>${item.name}</h4>

          <div class="cart-item-price">
            R$ ${formatPrice(item.price)}
          </div>

        </div>

        <div class="quantity">

          <button
            onclick="alterarQuantidade(${item.id}, -1)"
          >
            −
          </button>

          <strong>
            ${item.quantity}
          </strong>

          <button
            onclick="alterarQuantidade(${item.id}, 1)"
          >
            +
          </button>

        </div>

      </div>
    `;

  }).join("");
}


/*
  Abre carrinho
*/

function abrirCarrinho() {

  document
    .getElementById("cart-overlay")
    .classList.add("active");

  document.body.style.overflow = "hidden";
}


/*
  Fecha carrinho
*/

function fecharCarrinho(event) {

  if (
    event &&
    event.target !== document.getElementById("cart-overlay")
  ) {
    return;
  }

  document
    .getElementById("cart-overlay")
    .classList.remove("active");

  document.body.style.overflow = "";
}


/*
  Finaliza pedido no WhatsApp
*/

function finalizarWhatsApp() {

  if (cart.length === 0) {
    alert("Adicione pelo menos um produto ao carrinho.");
    return;
  }


  const name =
    document
      .getElementById("customer-name")
      .value
      .trim();

  const note =
    document
      .getElementById("customer-note")
      .value
      .trim();


  if (!name) {

    alert("Digite seu nome para continuar.");

    document
      .getElementById("customer-name")
      .focus();

    return;
  }


  let message =
    `🎉 *NOVO PEDIDO — BLACK DIA DAS CRIANÇAS*%0A%0A`;

  message +=
    `👤 *Cliente:* ${name}%0A%0A`;

  message +=
    `🛍️ *PEDIDO:*%0A`;


  cart.forEach(item => {

    const subtotal =
      item.price * item.quantity;

    message +=
      `• ${item.quantity}x ${item.name} — R$ ${formatPrice(subtotal)}%0A`;

  });


  const total = cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );


  message += `%0A`;
  message += `💰 *TOTAL: R$ ${formatPrice(total)}*%0A`;


  if (note) {

    message += `%0A`;
    message += `📝 *Observação:* ${note}%0A`;

  }


  message += `%0A`;
  message +=
    `🔥 Gostaria de finalizar meu pedido!`;


  const url =
    `https://wa.me/${WHATSAPP}?text=${message}`;


  window.open(url, "_blank");
}


/*
  Formata valores em reais
*/

function formatPrice(value) {

  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

}


/*
  Inicialização
*/

document.addEventListener("DOMContentLoaded", () => {

  renderProducts();

  atualizarCarrinho();

});
