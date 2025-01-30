import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import lastEventReducer from './features/eventsSlice';
import themeReducer from './features/themeSlice';
import chatReducer from './features/chatSlice';
import userReducer from './features/userSlice';
import promotionsReducer from './features/videosSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    lastEvent: lastEventReducer,
    theme: themeReducer,
    chat: chatReducer,
    user: userReducer,
    videos: promotionsReducer,
  },
});

export default store;
