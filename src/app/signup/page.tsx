"use client";

import { useState } from "react";
import Layout from "@/components/Layout";
import { AuthForm } from "@/components/AuthForm";
import { FormInput } from "@/components/FormInput";
import { SubmitButton } from "@/components/SubmitButton";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
// import router from "next/router";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match!");
    }
    console.log(e);
    setIsLoading(true);
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

      // If signup is successful, redirect to verification page
      router.push("/verify-email");
    } catch (error: unknown) {
      console.error("Signup error:", error);
      // setError(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout title="Ekrypt | Sign Up" description="Create your Ekrypt account">
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
                placeholder="your@email.com"
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
