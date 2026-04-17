import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useProductStore = create((set, get) => ({
  products: [],
  categories: [],
  loading: false,
  error: null,
  selectedCategory: null,

  fetchProducts: async () => {
    set({ loading: true, error: null })
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(id, name, slug)')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    if (error) {
      set({ error: error.message, loading: false })
    } else {
      set({ products: data || [], loading: false })
    }
  },

  fetchAllProducts: async () => {
    set({ loading: true })
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(id, name, slug)')
      .order('created_at', { ascending: false })
    if (!error) set({ products: data || [] })
    set({ loading: false })
  },

  fetchCategories: async () => {
    const { data } = await supabase.from('categories').select('*').order('name')
    set({ categories: data || [] })
  },

  createProduct: async (productData) => {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single()
    if (error) throw error
    await get().fetchAllProducts()
    return data
  },

  updateProduct: async (id, updates) => {
    const { error } = await supabase
      .from('products')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) throw error
    await get().fetchAllProducts()
  },

  deleteProduct: async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) throw error
    set({ products: get().products.filter((p) => p.id !== id) })
  },

  createCategory: async (name, slug) => {
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name, slug }])
      .select()
      .single()
    if (error) throw error
    await get().fetchCategories()
    return data
  },

  deleteCategory: async (id) => {
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) throw error
    await get().fetchCategories()
  },

  setSelectedCategory: (cat) => set({ selectedCategory: cat }),

  getFilteredProducts: () => {
    const { products, selectedCategory } = get()
    if (!selectedCategory) return products
    return products.filter((p) => p.category_id === selectedCategory)
  },
}))
