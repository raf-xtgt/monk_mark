import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserStateDto } from '../_model/dto/user-state-dto';
import { FocusSessionDto } from '../_model/dto/focus-session-dto';

interface AppState {
    showTopBar: boolean;
    showBottomNavigation: boolean;
    user: UserStateDto | null;
    currentRoute: number;
    focusSession: FocusSessionDto | null;
    notesTaken: string[];
    focusTimer: { hours: number; minutes: number; seconds: number } | null;
    focusSessionMetadata: { bookName: string; coverImageUrl: string } | null;
    setShowTopBar: (show: boolean) => void;
    setShowBottomNavigation: (show: boolean) => void;
    setUser: (user: UserStateDto | null) => void;
    setCurrentRoute: (route: number) => void;
    setFocusSession: (focusSession: FocusSessionDto | null) => void;
    setNotesTaken: (notes: string[]) => void;
    setFocusTimer: (timer: { hours: number; minutes: number; seconds: number } | null) => void;
    setFocusSessionMetadata: (metadata: { bookName: string; coverImageUrl: string } | null) => void;
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
    const [showTopBar, setShowTopBar] = useState(false);
    const [showBottomNavigation, setShowBottomNavigation] = useState(true);
    const [user, setUser] = useState<UserStateDto | null>(null);
    const [currentRoute, setCurrentRoute] = useState(1);
    const [focusSession, setFocusSession] = useState<FocusSessionDto | null>(null);
    const [notesTaken, setNotesTaken] = useState<string[]>([]);
    const [focusTimer, setFocusTimer] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
    const [focusSessionMetadata, setFocusSessionMetadata] = useState<{ bookName: string; coverImageUrl: string } | null>(null);

    const value: AppState = {
        showTopBar,
        showBottomNavigation,
        user,
        currentRoute,
        focusSession,
        notesTaken,
        focusTimer,
        focusSessionMetadata,
        setShowTopBar,
        setShowBottomNavigation,
        setUser,
        setCurrentRoute,
        setFocusSession,
        setNotesTaken,
        setFocusTimer,
        setFocusSessionMetadata,
    };

    return (
        <AppStateContext.Provider value={value}>
            {children}
        </AppStateContext.Provider>
    );
};
