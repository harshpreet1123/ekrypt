"use client";

import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { AuthForm } from "@/components/AuthForm";
import { FormInput } from "@/components/FormInput";
import { SubmitButton } from "@/components/SubmitButton";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      console.log(data);
      if (error) {
        console.log(error);
        setLoginError(error.message);
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout
      title="Ekrypt | Secure Login"
      description="Access your Ekrypt account with secure authentication"
    >
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <AuthForm
          title="Welcome back"
          subtitle="Secure access to your dashboard"
          footerText="Don't have an account?"
          footerLinkText="Sign up"
          footerLinkHref="/signup"
        >
          <form onSubmit={handleLogin}>
            <div className="space-y-5">
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
                showForgotPassword={true}
              />

              {loginError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                  {loginError}
                </div>
              )}

              <SubmitButton
                isLoading={isLoading}
                text="Sign in to your account"
                loadingText="Signing in..."
              />
            </div>
          </form>
        </AuthForm>
      </main>
    </Layout>
  );
}
