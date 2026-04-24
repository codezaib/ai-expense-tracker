import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: {
  alerts: any[];
  unreadCount: number;
} = {
  alerts: [],
  unreadCount: 0,
};

const alertsSlice = createSlice({
  name: "alerts",
  initialState,
  reducers: {
    setAlerts: (state, action: PayloadAction<any[]>) => {
      state.alerts = action.payload;
      state.unreadCount = action.payload.filter(
        (alert) => !alert.is_read,
      ).length;
    },
  },
});

export const { setAlerts } = alertsSlice.actions;
export default alertsSlice.reducer;
