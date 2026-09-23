import { createContext, useCallback, useContext, useState } from 'react'

const GenderContext = createContext({ gender: null, setGender: () => {} })

const LS_KEY = 'stylebook:gender'

export function GenderProvider({ children }) {
  const [gender, setGenderState] = useState(() => {
    try {
      return localStorage.getItem(LS_KEY) || null
    } catch {
      return null
    }
  })

  const setGender = useCallback((g) => {
    setGenderState(g)
    try {
      localStorage.setItem(LS_KEY, g)
    } catch {
      /* storage unavailable */
    }
  }, [])

  return <GenderContext.Provider value={{ gender, setGender }}>{children}</GenderContext.Provider>
}

export const useGender = () => useContext(GenderContext)