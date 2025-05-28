import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface AuthState {
  userId: number | null
  token: string | null
  phoneNumber: string | null
}

const initialState: AuthState = {
  userId: null,
  token: null,
  phoneNumber: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ userId: number; token: string; phone: string }>) => {
      state.userId = action.payload.userId
      state.token = action.payload.token
      state.phoneNumber = action.payload.phone
    },
    logout: state => {
      state.userId = null
      state.token = null
      state.phoneNumber = null
    },
  },
})

export const { setUser, logout } = authSlice.actions
export default authSlice.reducer
