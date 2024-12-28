import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { User, UserType } from "@prisma/client";

export const getUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User>();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { user, isLoaded: isUserLoaded } = useUser();

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/users")

      if (response.ok) {
        const fetchedUsers = await response.json();

        if (user?.id && fetchedUsers) {
          setUsers(fetchedUsers.users);
        }
      }
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentUser = async () => {
    try {
      if (user) {
        setIsLoading(true);
        const response = await fetch(`/api/users/${user.id}`);

        if (response.ok) {
          const fetchedUser = await response.json();

          if (user?.id && fetchedUser) {
            setCurrentUser(fetchedUser.user);
          }
        }
      }
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (id: string, role: UserType) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/users/${id}`,
        {
          method: "PATCH",
          body: JSON.stringify(role)
        }
      )

      if (response.ok) {
        fetchUsers();
        getCurrentUser();
      }
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/users/${id}`,
        {
          method: "DELETE",
        }
      )

      if (response.ok) {
        fetchUsers();
      }
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isUserLoaded && user?.id) {
      fetchUsers();
      getCurrentUser();
    }
  }, [isUserLoaded, user?.id]);

  return {
    currentUser,
    users,
    isAdmin,
    isLoading: isLoading || !isUserLoaded,
    isError,
    error,
    refetch: fetchUsers,
    updateUser,
    deleteUser,
  };
};
