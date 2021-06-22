export const uiProductListTypeGrid = data => ({
    type: "productGridList",
    payload: data,
  });
// checkout set active section

export const checkoutSetActiveSection = section => ({
  type: "CHECKOUT_ACTIVE",
  payload: section,
}); 