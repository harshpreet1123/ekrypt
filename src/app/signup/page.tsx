"use client";

import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { AuthForm } from "@/components/AuthForm";
import { FormInput } from "@/components/FormInput";
import { SubmitButton } from "@/components/SubmitButton";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.replace("/dashboard");
      }
    };

    checkSession();
  }, [router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Sign up with Supabase
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      // Show success toast
      toast.success(
        <div>
          <p className="font-semibold">Account created successfully!</p>
          <p>Please verify your email to access your account.</p>
        </div>,
        {
          duration: 3000,
          position: "top-center",
          style: {
            background: "#4BB543",
            color: "white",
            padding: "16px",
            borderRadius: "8px",
            maxWidth: "500px",
          },
        }
      );

      // Wait for the toast to show before redirecting
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Redirect to login page
      router.replace("/login");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Signup error:", error);
      setError(error.message || "An error occurred during signup");
      toast.error(
        error.message || "An error occurred during signup",
        {
          position: "top-center",
          style: {
            background: "#FF3333",
            color: "white",
            padding: "16px",
            borderRadius: "8px",
          },
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout title="Ekrypt | Sign Up" description="Create your Ekrypt account">
      {/* Toast container */}
      <Toaster />
      
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <AuthForm
          title=""
          subtitle="Create your Ekrypt account"
          footerText="Already an account?"
          footerLinkText="Login"
          footerLinkHref="/login"
        >
          <form onSubmit={handleSignup}>
            <div className="space-y-5">
              <FormInput
                id="name"
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                type="default"
              />
              <FormInput
                id="email"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
              />

              <FormInput
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                showForgotPassword={false}
              />
              <FormInput
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                showForgotPassword={false}
              />

              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                  {error}
                </div>
              )}

              <SubmitButton
                isLoading={isLoading}
                text="Create your account"
                loadingText="Signing you up..."
              />
            </div>
          </form>
        </AuthForm>
      </main>
    </Layout>
  );
}