import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Recipe } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

export function useRecipes(user: User | null) {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      fetchRecipes()
    } else {
      setRecipes([])
    }
  }, [user])

  const fetchRecipes = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setRecipes(data || [])
    } catch (error) {
      console.error('Error fetching recipes:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveRecipe = async (recipeData: Omit<Recipe, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('User not authenticated')

    try {
      const { data, error } = await supabase
        .from('recipes')
        .insert([
          {
            ...recipeData,
            user_id: user.id,
          },
        ])
        .select()
        .single()

      if (error) throw error
      
      setRecipes(prev => [data, ...prev])
      return { data, error: null }
    } catch (error) {
      console.error('Error saving recipe:', error)
      return { data: null, error }
    }
  }

  const deleteRecipe = async (recipeId: string) => {
    if (!user) throw new Error('User not authenticated')

    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', recipeId)
        .eq('user_id', user.id)

      if (error) throw error
      
      setRecipes(prev => prev.filter(recipe => recipe.id !== recipeId))
      return { error: null }
    } catch (error) {
      console.error('Error deleting recipe:', error)
      return { error }
    }
  }

  const updateRecipeStatus = async (recipeId: string, status: 'favorite' | 'want-to-try') => {
    if (!user) throw new Error('User not authenticated')

    try {
      const { data, error } = await supabase
        .from('recipes')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', recipeId)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error
      
      setRecipes(prev => prev.map(recipe => 
        recipe.id === recipeId ? { ...recipe, status } : recipe
      ))
      return { data, error: null }
    } catch (error) {
      console.error('Error updating recipe:', error)
      return { data: null, error }
    }
  }

  return {
    recipes,
    loading,
    saveRecipe,
    deleteRecipe,
    updateRecipeStatus,
    refetch: fetchRecipes,
  }
}