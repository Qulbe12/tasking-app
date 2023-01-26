import { combineReducers, configureStore } from "@reduxjs/toolkit";
import React from "react";
import { TypedUseSelectorHook, useDispatch, useSelector, Provider } from "react-redux";
import authReducer from "./slices/authSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

import { PersistGate } from "redux-persist/integration/react";
import themeReducer from "./slices/themeSlice";
import boardsReducer from "./slices/boardsSlice";
import templatesReducer from "./slices/templateSlice";
import documentsReducer from "./slices/documentSlice";

const persistConfig = {
  blacklist: ["boards"],
  key: "root",
  storage,
};

const reducers = combineReducers({
  auth: authReducer,
  theme: themeReducer,
  boards: boardsReducer,
  templates: templatesReducer,
  documents: documentsReducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

const persistor = persistStore(store);

// Infer the RootState and AppDispatch types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const StoreProvider = ({ children }: { children: React.ReactElement }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export default StoreProvider;
