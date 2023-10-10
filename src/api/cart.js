export const getCartItems = () => {
  const cart = JSON.parse(localStorage.getItem("cart"));
  return cart ? cart : [];
};

export const clearCartItems = () => {
  localStorage.removeItem("cart");
};

export const addToCart = (skin) => {
  //get all the items from the current cart
  const cart = getCartItems();
  //find if the product already exists in the cart or not
  const existing_skin = cart.find((i) => i._id === skin._id);
  //if product exists, increase the quantity
  if (existing_skin) {
    existing_skin.quantity++;
  } else {
    //add product to cart
    cart.push({
      ...skin, // clone the product data
      quantity: 1, //set quantity to 1
    });
  }

  //update cart to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const removeItemsFromCart = (list) => {
  const cart = getCartItems();
  const newCart = cart.filter((item) => {
    // if item is inside the list array, then it should be removed
    if (list.includes(item._id)) {
      return false; // return false means it won't in the new cart.
    }
    return true; // return true means it still be in the new cart
  });
  localStorage.setItem("cart", JSON.stringify(newCart));
};
