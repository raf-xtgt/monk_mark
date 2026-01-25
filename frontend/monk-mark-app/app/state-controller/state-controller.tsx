import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserStateDto } from '../model/dto/user-state-dto';

interface AppState {
    showTopBar: boolean;
    showBottomNavigation: boolean;
    user: UserStateDto | null;
    setShowTopBar: (show: boolean) => void;
    setShowBottomNavigation: (show: boolean) => void;
    setUser: (user: UserStateDto | null) => void;
}

const AppStateContext = createContext<AppState | undefined>(undefined);

export const useAppState = () => {
    const context = useContext(AppStateContext);
    if (!context) {
        throw new Error('useAppState must be used within AppStateProvider');
    }
    return context;
};

interface AppStateProviderProps {
    children: ReactNode;
}

export const AppStateProvider: React.FC<AppStateProviderProps> = ({ children }) => {
    const [showTopBar, setShowTopBar] = useState(true);
    const [showBottomNavigation, setShowBottomNavigation] = useState(true);
    const [user, setUser] = useState<UserStateDto | null>(null);

    const value: AppState = {
        showTopBar,
        showBottomNavigation,
        user,
        setShowTopBar,
        setShowBottomNavigation,
        setUser,
    };

    return (
        <AppStateContext.Provider value={value}>
            {children}
        </AppStateContext.Provider>
    );
};
