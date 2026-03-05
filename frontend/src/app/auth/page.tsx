"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { inter, instrumentSerif } from "../../lib/fonts";
import { auth, googleProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from "../../lib/firebase";

export default function AuthPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);

    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // Helper to map Firebase error codes to user-friendly messages
    const getErrorMessage = (error: any) => {
        switch (error.code) {
            case 'auth/email-already-in-use':
                return "This email is already in use. Try signing in instead.";
            case 'auth/invalid-email':
                return "Please enter a valid email address.";
            case 'auth/weak-password':
                return "Password is too weak. Please use at least 6 characters.";
            case 'auth/user-not-found':
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
                return "Invalid email or password. Please try again.";
            case 'auth/too-many-requests':
                return "Too many failed attempts. Please try again later.";
            default:
                return "An unexpected error occurred. Please try again.";
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");
        setIsLoading(true);

        try {
            if (isSignUp) {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                // Send verification email
                await sendEmailVerification(userCredential.user);
                setSuccessMsg("Account created! Please check your email to verify your account before logging in.");
                setIsSignUp(false); // Switch to sign in mode implicitly
                setPassword(""); // Clear password for safety
                // Logout the newly created unverified user so they are forced to verify
                await auth.signOut();
            } else {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);

                // Optional: enforce email verification
                if (!userCredential.user.emailVerified) {
                    setErrorMsg("Please verify your email address before signing in. Check your inbox.");
                    await auth.signOut();
                    setIsLoading(false);
                    return;
                }
                router.push('/workspace');
            }
        } catch (error: any) {
            console.error("Email auth error:", error);
            setErrorMsg(getErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setErrorMsg("");
        setSuccessMsg("");
        setIsLoading(true);
        try {
            await signInWithPopup(auth, googleProvider);
            router.push('/workspace');
        } catch (error: any) {
            if (error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-closed-by-user') {
                console.log("Google sign in popup closed by user");
            } else {
                console.error("Google sign in error:", error);
                setErrorMsg(getErrorMessage(error));
            }
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <div className={`flex min-h-screen w-full bg-white ${inter.className}`}>
            {/* Left Side - Auth Form */}
            <div className="flex w-full md:w-1/2 flex-col justify-center items-center p-8 md:p-12 lg:p-24 relative">

                {/* Minimal Logo Top Left (from reference) */}
                <Link href="/" className="absolute top-8 left-8 md:top-12 md:left-12">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
                        <Image src="/target.png" alt="Logo" width={32} height={32} className="w-full h-auto object-cover" />
                    </div>
                </Link>

                <div className="w-full max-w-[400px]">
                    <h1 className={`text-[40px] md:text-[48px] text-[#111] mb-2 tracking-tight ${inter.className} font-medium`}>
                        {isSignUp ? "Create account" : "Welcome back!"}
                    </h1>
                    <p className="text-[#666] text-[15px] mb-10 tracking-tight">
                        Your work, your team, your flow — all in one place.
                    </p>

                    {/* OAuth Buttons */}
                    <div className="flex flex-col gap-4 mb-8">
                        <button
                            onClick={handleGoogleSignIn}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full border border-[#e5e5e5] hover:bg-[#f5f5f5] transition-colors text-[14px] font-medium text-[#333] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Sign {isSignUp ? "Up" : "In"} with Google
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-[1px] flex-1 bg-[#eaeaea]"></div>
                        <span className="text-[#999] text-[13px] font-medium uppercase tracking-wider">Or</span>
                        <div className="h-[1px] flex-1 bg-[#eaeaea]"></div>
                    </div>

                    {/* Email Form */}
                    <form onSubmit={handleEmailAuth} className="flex flex-col gap-4 mb-6">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-5 py-4 rounded-xl border border-[#e5e5e5] bg-white focus:outline-none focus:border-[#aaeac3] focus:ring-1 focus:ring-[#aaeac3] transition-colors text-[15px] text-[#111]"
                            required
                        />
                        {!isSignUp && (
                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-5 py-4 rounded-xl border border-[#e5e5e5] bg-white focus:outline-none focus:border-[#aaeac3] focus:ring-1 focus:ring-[#aaeac3] transition-colors text-[15px] text-[#111]"
                                required
                            />
                        )}
                        {isSignUp && (
                            <input
                                type="password"
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-5 py-4 rounded-xl border border-[#e5e5e5] bg-white focus:outline-none focus:border-[#aaeac3] focus:ring-1 focus:ring-[#aaeac3] transition-colors text-[15px] text-[#111]"
                                required
                            />
                        )}

                        {errorMsg && (
                            <div className="text-red-500 text-[13px] font-medium mt-1 p-3 bg-red-50 rounded-lg border border-red-100">
                                {errorMsg}
                            </div>
                        )}
                        {successMsg && (
                            <div className="text-green-600 text-[13px] font-medium mt-1 p-3 bg-green-50 rounded-lg border border-green-100">
                                {successMsg}
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 mt-2 rounded-full bg-[#111] hover:bg-black text-white text-[15px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                `Sign ${isSignUp ? "up" : "in"} with email`
                            )}
                        </button>
                    </form>

                    {/* Toggle */}
                    <div className="text-center text-[14px] text-[#666] mt-6">
                        {isSignUp ? "Already have an account? " : "Don't have an account? "}
                        <button
                            onClick={() => {
                                setIsSignUp(!isSignUp);
                                setErrorMsg("");
                                setSuccessMsg("");
                            }}
                            className="text-[#111] font-medium underline underline-offset-4 decoration-[#e5e5e5] hover:decoration-[#111] transition-colors"
                        >
                            {isSignUp ? "Sign In" : "Sign Up"}
                        </button>
                    </div>

                    {/* Footer Links */}
                    <div className="flex justify-center gap-4 mt-20 text-[13px] text-[#999] font-medium">
                        <Link href="/" className="hover:text-[#666] transition-colors">Help</Link>
                        <span>/</span>
                        <Link href="/" className="hover:text-[#666] transition-colors">Terms</Link>
                        <span>/</span>
                        <Link href="/" className="hover:text-[#666] transition-colors">Privacy</Link>
                    </div>
                </div>
            </div>

            {/* Right Side - Image Cover */}
            <div className="hidden md:block w-1/2 bg-[#f8f8f8] relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center mix-blend-multiply opacity-90">
                    <Image
                        src="/blur.png"
                        alt="Auth background"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            </div>
        </div>
    );
}
