import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: {
  models: any[];
  chatHistory: { message: string; sender: string }[];
} = {
  models: [],
  chatHistory: [
    {
      message:
        'Hello! I am your SpendWise Assistant. You can tell me things like "I spent $50 on groceries today" or ask "How much did I spend in April?"',
      sender: "assistant",
    },
  ],
};

const aiSlice = createSlice({
  name: "ai",
  initialState: initialState,
  reducers: {
    setModels: (state, action: PayloadAction<any[]>) => {
      state.models = action.payload;
    },
    addMessagetoChatHistory: (
      state,
      action: PayloadAction<{ message: string; sender: string }>,
    ) => {
      state.chatHistory.push(action.payload);
    },
    clearChatHistory: (state) => {
      state.chatHistory = [];
    },
  },
});

export const { setModels, addMessagetoChatHistory, clearChatHistory } =
  aiSlice.actions;
export default aiSlice.reducer;
