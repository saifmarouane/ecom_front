import React, { useEffect, useMemo, useState } from 'react'
import { getProducts } from '../services/api'
import { useI18n } from './I18nProvider'
import ProductGrid from './ProductGrid'

export default function ProductsSection({ title, lede, products: productsProp }) {
  const { t } = useI18n()

  const isControlled = Array.isArray(productsProp)
  const [products, setProducts] = useState(() => (Array.isArray(productsProp) ? productsProp : []))
  const [loading, setLoading] = useState(!isControlled)
  const [error, setError] = useState(null)

  const headerTitle = title || t('productsTitle')
  const headerLede = lede || t('productsLede')

  const displayProducts = useMemo(() => {
    return Array.isArray(productsProp) ? productsProp : products
  }, [productsProp, products])

  useEffect(() => {
    if (Array.isArray(productsProp)) return
    let isMounted = true

    async function load() {
      try {
        const list = await getProducts()
        if (!isMounted) return
        setProducts(Array.isArray(list) ? list : [])
      } catch (err) {
        if (!isMounted) return
        setError(err.message || 'Erreur lors du chargement des produits')
      } finally {
        if (!isMounted) return
        setLoading(false)
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [productsProp])

  return (
    <section className="products-section">
      <div className="products-header">
        <h2>{headerTitle}</h2>
        <p>{headerLede}</p>
      </div>

      {loading && <p className="products-status">{t('productsLoading')}</p>}
      {error && <p className="products-status error">{t('productsError')}</p>}

      {!loading && !error && (
        <ProductGrid products={displayProducts} />
      )}
    </section>
  )
}
