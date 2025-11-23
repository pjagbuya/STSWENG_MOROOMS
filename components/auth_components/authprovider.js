'use client';

import {
  getInternalRole,
  getUserPermissions,
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
  isAdmin,
  isAdminOrRM,
  isRoomManager,
} from '@/lib/rbac-config';
import { createClient } from '@/utils/supabase/client';
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchUserRole = async userId => {
    try {
      const { data: role, error } = await supabase.rpc('get_user_role', {
        p_user_id: userId,
      });

      if (error) {
        console.error('Error fetching user role:', error);
        return null;
      }

      const internalRole = getInternalRole(role);
      console.log(
        '✅ Fetched role for user:',
        userId,
        '→',
        role,
        '→',
        internalRole,
      );
      return internalRole;
    } catch (error) {
      console.error('Error fetching user role:', error);
      return null;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const {
          data: { user: authUser },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          console.error('Error getting user:', error);
          setUser(null);
          setLoading(false);
          return;
        }

        if (authUser) {
          console.log('🔐 Init: User found, fetching role...');
          const role = await fetchUserRole(authUser.id);
          setUser({
            id: authUser.id,
            email: authUser.email,
            role: role,
            metadata: authUser.user_metadata,
          });
          console.log('✅ Init: User set with role:', role);
        } else {
          console.log('❌ Init: No user found, clearing state');
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event);

      if (event === 'SIGNED_IN' && session?.user) {
        console.log('✅ SIGNED_IN: Fetching role for new user...');
        const role = await fetchUserRole(session.user.id);
        setUser({
          id: session.user.id,
          email: session.user.email,
          role: role,
          metadata: session.user.user_metadata,
        });
        console.log('✅ New user set with role:', role);
      } else if (event === 'SIGNED_OUT') {
        console.log('🚪 SIGNED_OUT: Clearing all user state');
        setUser(null);
      } else if (event === 'USER_UPDATED' && session?.user) {
        console.log('🔄 USER_UPDATED: Refreshing role...');
        const role = await fetchUserRole(session.user.id);
        setUser({
          id: session.user.id,
          email: session.user.email,
          role: role,
          metadata: session.user.user_metadata,
        });
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        console.log('🔄 TOKEN_REFRESHED: Refreshing role...');
        const role = await fetchUserRole(session.user.id);
        setUser({
          id: session.user.id,
          email: session.user.email,
          role: role,
          metadata: session.user.user_metadata,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const refreshUserRole = async () => {
    if (!user?.id) return;

    try {
      const role = await fetchUserRole(user.id);
      setUser(prev => ({ ...prev, role }));
    } catch (error) {
      console.error('Failed to refresh user role:', error);
    }
  };

  const refreshUser = async () => {
    try {
      const {
        data: { user: authUser },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error('Error refreshing user:', error);
        setUser(null);
        return;
      }

      if (authUser) {
        const role = await fetchUserRole(authUser.id);
        setUser({
          id: authUser.id,
          email: authUser.email,
          role: role,
          metadata: authUser.user_metadata,
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const can = permission => hasPermission(user, permission);
  const canAny = permissions => hasAnyPermission(user, permissions);
  const canAll = permissions => hasAllPermissions(user, permissions);
  const getPermissions = () => getUserPermissions(user);
  const checkIsAdmin = () => isAdmin(user);
  const checkIsRoomManager = () => isRoomManager(user);
  const checkIsAdminOrRM = () => isAdminOrRM(user);

  const value = {
    user,
    loading,
    refreshUserRole,
    refreshUser,
    can,
    canAny,
    canAll,
    getPermissions,
    isAuthenticated: !!user,
    isAdmin: checkIsAdmin,
    isRoomManager: checkIsRoomManager,
    isAdminOrRM: checkIsAdminOrRM,
    supabase,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
