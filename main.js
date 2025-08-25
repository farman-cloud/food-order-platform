document.addEventListener("DOMContentLoaded", function () {
  // --- State Management ---
  // The cart object will store items with their price and quantity.
  // Example: { "Shahi Paneer": { price: 280, quantity: 2 } }
  let cart = {};

  // --- DOM Element References ---
  const cartCountElement = document.getElementById("cart-count");
  const cartItemsContainer = document.getElementById("cart-items-container");
  const cartTotalElement = document.getElementById("cart-total");
  const successToastEl = document.getElementById("successToast");
  const successToast = new bootstrap.Toast(successToastEl);
  const cartModalEl = document.getElementById("cartModal");
  const cartModal = new bootstrap.Modal(cartModalEl);
  const paymentModalEl = document.getElementById("paymentModal");
  const paymentModal = new bootstrap.Modal(paymentModalEl);
  const paymentTotalElement = document.getElementById("payment-total");

  /**
   * Updates the entire cart UI based on the current state of the `cart` object.
   * This function is called whenever the cart is modified.
   */
  function updateCartUI() {
    // Clear the current cart display to rebuild it
    cartItemsContainer.innerHTML = "";

    // Check if the cart is empty and show a message
    if (Object.keys(cart).length === 0) {
      cartItemsContainer.innerHTML =
        '<p class="text-muted text-center py-3">Your cart is empty.</p>';
      cartTotalElement.textContent = "₹0";
      updateCartIconCount();
      return;
    }

    // Build the list of cart items
    const cartList = document.createElement("ul");
    cartList.className = "list-group list-group-flush";
    let grandTotal = 0;

    for (const itemName in cart) {
      const item = cart[itemName];
      const itemTotal = item.price * item.quantity;
      grandTotal += itemTotal;

      const listItem = document.createElement("li");
      listItem.className =
        "list-group-item d-flex justify-content-between align-items-center";
      // Note the data-name attribute on the remove button
      listItem.innerHTML = `
                <div class="me-auto">
                    <h6 class="my-0">${itemName}</h6>
                    <small class="text-muted">₹${item.price} x ${item.quantity}</small>
                </div>
                <span class="fw-bold me-3">₹${itemTotal}</span>
                <button class="btn btn-sm btn-outline-danger remove-item-btn" data-name="${itemName}">
                    <i class="bi bi-trash"></i>
                </button>
            `;
      cartList.appendChild(listItem);
    }

    cartItemsContainer.appendChild(cartList);
    cartTotalElement.textContent = `₹${grandTotal}`;
    updateCartIconCount();
  }

  /**
   * Updates the little red badge on the cart icon in the navbar.
   */
  function updateCartIconCount() {
    const totalItems = Object.values(cart).reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    cartCountElement.textContent = totalItems;
  }

  /**
   * Shows a toast notification.
   * @param {string} message - The message to display.
   */
  function showToast(message) {
    const toastBody = successToastEl.querySelector(".toast-body");
    toastBody.textContent = message;
    successToast.show();
  }

  // --- Event Listeners ---

  // Attach listeners to all "Add to Cart" buttons on the page
  document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const name = this.dataset.name;
      const price = parseInt(this.dataset.price);

      if (cart[name]) {
        cart[name].quantity++;
      } else {
        cart[name] = { price: price, quantity: 1 };
      }
      showToast(`'${name}' was added to your cart.`);
      updateCartUI();
    });
  });

  // Use event delegation for "Remove" buttons since they are created dynamically
  cartItemsContainer.addEventListener("click", function (e) {
    const removeButton = e.target.closest(".remove-item-btn");
    if (removeButton) {
      const itemName = removeButton.dataset.name;
      if (cart[itemName]) {
        delete cart[itemName];
        updateCartUI();
      }
    }
  });

  // Listener for "Proceed to Payment" button
  document
    .getElementById("proceed-to-payment-btn")
    .addEventListener("click", function () {
      if (Object.keys(cart).length === 0) {
        alert("Your cart is empty!");
        return;
      }
      const total = Object.values(cart).reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      paymentTotalElement.textContent = `₹${total}`;
      cartModal.hide();
      paymentModal.show();
    });

  // Listeners for payment method selection
  document.querySelectorAll(".payment-option-btn").forEach((button) => {
    button.addEventListener("click", function () {
      paymentModal.hide();
      showToast("Your order has been placed successfully!");
      cart = {}; // Clear the cart
      updateCartUI();
    });
  });

  // Update the cart UI when the modal is about to be shown
  cartModalEl.addEventListener("show.bs.modal", updateCartUI);

  // Initial UI update on page load
  updateCartUI();
});
