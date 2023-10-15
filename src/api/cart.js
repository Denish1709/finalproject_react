export const getCartItems = () => {
  const cart = JSON.parse(localStorage.getItem("cart"));
  return cart ? cart : [];
};

export const clearCartItems = () => {
  localStorage.removeItem("cart");
};

export const addToCart = (skin) => {
  const cart = getCartItems();
  const existing_skin = cart.find((i) => i._id === skin._id);
  if (existing_skin) {
    existing_skin.quantity++;
  } else {
    cart.push({
      ...skin,
      quantity: 1,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
};

export const removeItemsFromCart = (list) => {
  const cart = getCartItems();
  const newCart = cart.filter((item) => {
    if (list.includes(item._id)) {
      return false;
    }
    return true;
  });
  localStorage.setItem("cart", JSON.stringify(newCart));
};
