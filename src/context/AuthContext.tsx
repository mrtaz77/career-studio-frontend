
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser,
  updateProfile
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/components/ui/use-toast";
import { useDispatch } from "react-redux";
import {addUser} from "../utils/authSlice"

interface AuthContextType {
  currentUser: FirebaseUser | null;
  loading: boolean;
  signup: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
const dispatch = useDispatch();
  // Signup function
  const signup = async (email: string, password: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Update the user's profile with their name
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: name
        }).then(() => {
            // Profile updated successfully!
            // You can also dispatch the user data to your Redux store here
            // 
       
            dispatch(addUser({
              email: userCredential.user.email,
              name: userCredential.user.displayName,
              uid: userCredential.user.uid,
              photoURL: userCredential.user.photoURL,
            }))
            });
      }

      console.log("currentUser", auth)
      toast({
        title: "Account created",
        description: "You've successfully created an account",
        variant: "default",
      });
      return Promise.resolve();
    } catch (error) {
      const errorMessage = (error as Error).message;
      toast({
        title: "Error creating account",
        description: errorMessage,
        variant: "destructive",
      });
      return Promise.reject(error);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in",
        variant: "default",
      });
      return Promise.resolve();
    } catch (error) {
      const errorMessage = (error as Error).message;
      toast({
        title: "Authentication failed",
        description: errorMessage,
        variant: "destructive",
      });
      return Promise.reject(error);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Signed out",
        description: "You've been successfully signed out",
        variant: "default",
      });
      return Promise.resolve();
    } catch (error) {
      const errorMessage = (error as Error).message;
      toast({
        title: "Error signing out",
        description: errorMessage,
        variant: "destructive",
      });
      return Promise.reject(error);
    }
  };

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};