import { MAGENTO } from '../../constants';

export const createQuoteId = () => ({
  type: MAGENTO.CREATE_QUOTE_ID_REQUEST,
});

export const getCustomerCart = () => ({
  type: MAGENTO.CUSTOMER_CART_REQUEST,
});

export const removeItemFromCart = itemId => ({ 
  type: MAGENTO.REMOVE_ITEM_FROM_CART_REQUEST,
  payload: { itemId },
});

export const resetCart = ()=>({
  type: 'RESET_CART'
})


//create customer cart

// export const createCustomerCart = customerId  => ({
//   type: MAGENTO.CREATE_CART_REQUEST, payload:customerId});

//   if (customerId) {
//     try {
//       const cartId = await magento.admin.getCart(customerId);
//       dispatch({ type: MAGENTO.CREATE_CART, payload: cartId }); 
//       dispatch(getCart());
//     } catch (error) {
//       console.log(error.message);
//     }
//   }
// };

//get cart

// export const getCart = (refreshing = false)  => ({
//     type: MAGENTO.GET_CART, payload : refreshing});

//   if (refreshing) {
//     dispatch({ type: MAGENTO.REFRESH_CART, payload: true });
//   }

//   try {
//     let cart;
//     let cartId = await AsyncStorage.getItem('cartId');
//     if (magento.isCustomerLogin()) {
//       if(cartId){
//         /*Merge Cart*/
//         /*the code to merge cart will be here*/

//         AsyncStorage.removeItem('cartId');
//       }
//       cart = await magento.customer.getCustomerCart();
//     } else {
//       if(cartId){
//         try{
//           cart = await magento.guest.getGuestCart(cartId);
//         }catch(err){
//           console.log('Cart id '+cartId+' is no longer exist');
//         }
//       }

//       if(!cartId || !cart){
//         cartId = await magento.guest.createGuestCart();
//         AsyncStorage.setItem('cartId', cartId);
//         cart = await magento.guest.getGuestCart(cartId);
//       }
//       dispatch({ type: MAGENTO.CREATE_CART, payload: cartId });
//     }

//     dispatch({ type: MAGENTO.GET_CART, payload: cart });
//     dispatch({ type: MAGENTO.REFRESH_CART, payload: false });
//   } catch (error) {
//     console.log(error.message);
//     if (error.message && error.message.includes('No such entity with customerId')) {
//       const { customer } = getState().account;
//       if (customer && customer.id) {
//         dispatch(createCustomerCart(customer.id));
//       }
//     }
//   }
// };

// refresh cart
// export const refreshCart = ()=>(getState) => {
//   ({ type: MAGENTO.REFRESH_CART, payload: true })};

//   try {
//     let cart;
//     if (magento.isCustomerLogin()) {
//       cart = await magento.customer.getCustomerCart();
//     } else {
//       const cartId = getState().cart?.cartId;
//       cart = await magento.guest.getGuestCart(cartId);
//     }
//     dispatch({ type: MAGENTO.GET_CART, payload: cart });
//     dispatch({ type: MAGENTO.REFRESH_CART, payload: false });
//   } catch (error) {
//     console.log(error.message)
//     if (error.message && error.message.includes('No such entity with customerId')) {
//       const { customer } = getState().account;
//       if (customer && customer.id) {
//         dispatch(createCustomerCart(customer.id));
//       }
//     }
//   }
// };

//add to cart loading

// export const addToCartLoading = (isLoading) => ({
//   type: MAGENTO.ADD_TO_CART_LOADING,
//   payload: isLoading,
// });

// add to cart 

// export const addToCart = ({ cartId, item, customer })=> ({
//   type : MAGENTO.ADD_TO_CART, payload: { cartId, item, customer }});

//   try {
//     if (cartId) {
//       return dispatchAddToCart(dispatch, cartId, item);
//     }

//     const updatedItem = item;
//     if (magento.isCustomerLogin()) {
//       const customerCartId = await magento.admin.getCart(customer.id);
//       dispatch({ type: MAGENTO_CREATE_CART, payload: customerCartId });
//       updatedItem.cartItem.quoteId = customerCartId;
//       return dispatchAddToCart(dispatch, customerCartId, updatedItem);
//     }

//     const guestCartId = await magento.guest.createGuestCart();
//     dispatch({ type: MAGENTO_CREATE_CART, payload: guestCartId });
//     updatedItem.cartItem.quoteId = guestCartId;
//     return dispatchAddToCart(dispatch, guestCartId, updatedItem);
//   } catch (error) {
//     console.log(error.message)
//   }
// };



//dispatch add to cart
// const dispatchAddToCart = (dispatch, cartId, item) => {
//   try {
//     let result;
//     if (magento.isCustomerLogin()) {
//       result = await magento.customer.addItemToCart(item);
//     } else {
//       result = await magento.guest.addItemToCart(cartId, item);
//     }
//     dispatch(checkoutSetActiveSection(1));
//     dispatch({ type: MAGENTO.ADD_TO_CART, payload: result });
//     dispatchGetGuestCart(dispatch, cartId);
//   } catch (e) {
//     console.log(e.message);
//     dispatch({ type: MAGENTO.ADD_TO_CART, payload: e });
//   }
// };

// // dispatch get guest cart

// const dispatchGetGuestCart = async (dispatch, cartId) => {
//   try {
//     let data;
//     if (magento.isCustomerLogin()) {
//       data = await magento.customer.getCustomerCart();
//     } else {
//       data = await magento.guest.getGuestCart(cartId);
//     }
//     dispatch({ type: MAGENTO.GET_CART, payload: data });
//   } catch (e) {
//     console.log(e.message);
//   }
// };

// cart item product

// export const cartItemProduct = sku => async (dispatch) => {
//   try {
//     const data = await magento.admin.getProductBySku(sku);
//     dispatch({ type: MAGENTO.CART_ITEM, payload: data });
//   } catch (error) {
//     console.log(error.message);
//   }
// };

// // remove from cart loading

// export const removeFromCartLoading = isLoading => ({
//   type: MAGENTO.REMOVE_ITEM_FROM_CART,
//   payload: isLoading,
// });


// // remove from cart

// export const removeFromCart = ({ cart, item }) => async (dispatch) => {
//   try {
//     console.log('removeFromCart', cart, item);
//     if (cart.quote) {
//       dispatchRemoveFromCart(dispatch, cart, item);
//       dispatch(checkoutSetActiveSection(1));
//     }
//   } catch (error) {
//       console.log(error.message)
//     dispatch({ type: MAGENTO.REMOVE_ITEM_FROM_CART, payload: error.message });
//   }
// };

// // dispatch remove from cart

// const dispatchRemoveFromCart = async (dispatch, cart, item) => {
//   try {
//     const result = await magento.admin.removeItemFromCart(cart.quote.id, item.item_id);
//     dispatch({ type: MAGENTO.REMOVE_ITEM_FROM_CART, payload: result });
//     dispatchGetCart(dispatch, cart.cartId);
//     dispatch({ type: MAGENTO.REMOVE_FROM_CART_LOADING, payload: false });
//   } catch (e) {
//     // TODO: handle error
//     dispatch({ type: MAGENTO.REMOVE_FROM_CART, payload: e.message });
//     dispatch({ type: MAGENTO.REMOVE_FROM_CART_LOADING, payload: false });
//     console.log(e.message);
//   }
// };

// // dispatch get cart

// const dispatchGetCart = async (dispatch, cartId) => {
//   try {
//     let data;
//     if (magento.isCustomerLogin()) {
//       data = await magento.customer.getCustomerCart();
//     } else {
//       data = await magento.guest.getGuestCart(cartId);
//     }
//     dispatch({ type: MAGENTO.GET_CART, payload: data });
//   } catch (e) {
//     console.log(e.message);
//   }
// };
