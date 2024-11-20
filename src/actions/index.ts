import { convertToUSD } from './payments/currency-converter-lt';

export { setUserAddress } from './address/set-user-address'
export { deleteUserAddress } from './address/delete-user-address'
export { getUserAdddress } from './address/get-user-address'

export { authenticate, login } from './auth/login'
export { logout } from './auth/logout'
export { registerUser } from './auth/register'
export { sendResetEmail } from './auth/send-reset-email'
export { resetPassword } from './auth/reset-password'

export { getCountries } from './country/get-countries'

export { placeOrder } from './order/place-order'
export { getOrdersByUser } from './order/get-orders-by-user'
export { getOrderById } from './order/get-order-by-id'
export { getPaginatedOrders } from './order/get-paginated-orders'
export { sendOrderConfirmationEmail } from './order/send-order-confirmation-email'

export { getAllPaginatedProductsWithImages } from './products/product-pagination'
export { getProductBySlug } from './products/get-product-by-slug'
export { createUpdateProduct } from './products/create-update-product'

export { setTransactionId } from './payments/set-transaction-id'
export { payPalCheckPayment } from './payments/paypal-check-payment'
export { convertToUSD } from './payments/currency-converter-lt'

export { getPaginatedUsers } from './users/get-paginated-users'
export { changeUserRole } from './users/change-user-role'

export { getCategories } from './categories/get-categories'

export { getTypes } from './typeses/get-types'

export { createMercadoPagoPreference } from './mercado-pago/api'
export { checkPaymentAndUpdateOrder } from './mercado-pago/mercado-pago-check-payment'