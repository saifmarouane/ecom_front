 //const API_BASE = process.env.REACT_APP_API_BASE || '/api'
const API_BASE ='https://ecombackend-staging.up.railway.app/api';
let memoryToken = ''

export function setAuthToken(token) {
  memoryToken = token || ''
}

export function getServerOrigin() {
  if (typeof API_BASE === 'string' && API_BASE.startsWith('http')) {
    return API_BASE.replace(/\/api\/?$/, '')
  }
  return ''
}

export function toServerUrl(maybePath) {
  if (!maybePath) return ''
  const p = String(maybePath)
  if (p.startsWith('http://') || p.startsWith('https://')) return p
  const origin = getServerOrigin()
  return origin ? `${origin}${p}` : p
}

function getToken() {
  return memoryToken || localStorage.getItem('token') || ''
}

function authHeaders() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function parseError(res) {
  const data = await res.json().catch(() => ({}))
  return data?.message || `HTTP ${res.status} - ${res.statusText}`
}

export async function getProducts() {
  const res = await fetch(`${API_BASE}/products`)
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} - ${res.statusText}`)
  }
  return res.json()
}

export async function getProductById(id) {
  const res = await fetch(`${API_BASE}/products/${id}`)
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

export async function getCategories() {
  const res = await fetch(`${API_BASE}/categories`)
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} - ${res.statusText}`)
  }
  return res.json()
}

export async function loginAdmin(username, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  if (!res.ok) {
    throw new Error(await parseError(res))
  }
  return res.json()
}

export async function getMe() {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { ...authHeaders() }
  })
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }
  return res.json()
}

export async function registerClient(username, password, email) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, email })
  })
  if (!res.ok) {
    throw new Error(await parseError(res))
  }
  return res.json()
}

// Categories (admin)
export async function createCategory(payload) {
  const hasFile = payload?.image instanceof File
  const body = hasFile ? (() => {
    const fd = new FormData()
    Object.entries(payload || {}).forEach(([key, value]) => {
      if (value === undefined) return
      if (value === null || value === '') return
      if (value instanceof File) return fd.append(key, value)
      fd.append(key, String(value))
    })
    return fd
  })() : JSON.stringify(payload)

  const res = await fetch(`${API_BASE}/categories`, {
    method: 'POST',
    headers: hasFile ? { ...authHeaders() } : { 'Content-Type': 'application/json', ...authHeaders() },
    body
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

export async function updateCategory(id, payload) {
  const hasFile = payload?.image instanceof File
  const body = hasFile ? (() => {
    const fd = new FormData()
    Object.entries(payload || {}).forEach(([key, value]) => {
      if (value === undefined) return
      if (value === null || value === '') return
      if (value instanceof File) return fd.append(key, value)
      fd.append(key, String(value))
    })
    return fd
  })() : JSON.stringify(payload)

  const res = await fetch(`${API_BASE}/categories/${id}`, {
    method: 'PUT',
    headers: hasFile ? { ...authHeaders() } : { 'Content-Type': 'application/json', ...authHeaders() },
    body
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

export async function deleteCategory(id) {
  const res = await fetch(`${API_BASE}/categories/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() }
  })
  if (!res.ok) throw new Error(await parseError(res))
}

// Products (admin) - routes use multer, so always send FormData
function toProductFormData(payload) {
  const fd = new FormData()
  Object.entries(payload || {}).forEach(([key, value]) => {
    if (value === undefined) return
    if (value === null) return fd.append(key, '')
    if (value instanceof File) return fd.append(key, value)
    fd.append(key, String(value))
  })
  return fd
}

export async function createProduct(payload) {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: { ...authHeaders() },
    body: toProductFormData(payload)
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

export async function updateProduct(id, payload) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: { ...authHeaders() },
    body: toProductFormData(payload)
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

export async function deleteProduct(id) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() }
  })
  if (!res.ok) throw new Error(await parseError(res))
}

// Orders (admin)
export async function getAdminOrders({ status = '', limit = 80 } = {}) {
  const qs = new URLSearchParams()
  if (status) qs.set('status', status)
  if (limit) qs.set('limit', String(limit))

  const res = await fetch(`${API_BASE}/orders?${qs.toString()}`, {
    headers: { ...authHeaders() }
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

export async function updateAdminOrderStatus(orderId, status) {
  const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ status })
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

export async function updateAdminOrderComment(orderId, comment) {
  const res = await fetch(`${API_BASE}/orders/${orderId}/comment`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ comment })
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

export async function getAdminOrderStats() {
  const res = await fetch(`${API_BASE}/orders/stats`, {
    headers: { ...authHeaders() }
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

// Users (admin)
export async function getAdminUsers() {
  const res = await fetch(`${API_BASE}/auth/admin/users`, {
    headers: { ...authHeaders() }
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

export async function createAdminUser(payload) {
  const res = await fetch(`${API_BASE}/auth/admin/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload)
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

export async function updateAdminUser(id, payload) {
  const res = await fetch(`${API_BASE}/auth/admin/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload)
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

export async function deleteAdminUser(id) {
  const res = await fetch(`${API_BASE}/auth/admin/users/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() }
  })
  if (!res.ok) throw new Error(await parseError(res))
}

// Cart (client/admin)
export async function getCart() {
  const res = await fetch(`${API_BASE}/cart`, {
    headers: { ...authHeaders() }
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

export async function addCartItem(productId, quantity = 1) {
  const res = await fetch(`${API_BASE}/cart/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ productId, quantity })
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

export async function updateCartItem(itemId, quantity) {
  const res = await fetch(`${API_BASE}/cart/items/${itemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ quantity })
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

export async function deleteCartItem(itemId) {
  const res = await fetch(`${API_BASE}/cart/items/${itemId}`, {
    method: 'DELETE',
    headers: { ...authHeaders() }
  })
  if (!res.ok) throw new Error(await parseError(res))
}

export async function clearCart() {
  const res = await fetch(`${API_BASE}/cart/clear`, {
    method: 'POST',
    headers: { ...authHeaders() }
  })
  if (!res.ok) throw new Error(await parseError(res))
}

export async function checkoutCart() {
  const res = await fetch(`${API_BASE}/cart/checkout`, {
    method: 'POST',
    headers: { ...authHeaders() }
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}
