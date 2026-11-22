
// "use client";

// import { useState, type FormEvent } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";

// import { authClient } from "@/lib/auth-client";

// interface AuthFormProps {
//   mode: "login" | "register";
// }

// export default function AuthForm({
//   mode,
// }: AuthFormProps) {
//   const router = useRouter();
//   const isRegister = mode === "register";

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const [role, setRole] = useState<
//     "customer" | "vendor"
//   >("customer");

//   const [loading, setLoading] = useState(false);

//   async function activateVendor() {
//     const response = await fetch(
//       "/api/profile/become-vendor",
//       {
//         method: "POST",
//       }
//     );

//     if (!response.ok) {
//       throw new Error(
//         "Account created, but vendor activation failed."
//       );
//     }
//   }

//   async function handleSubmit(
//     event: FormEvent<HTMLFormElement>
//   ) {
//     event.preventDefault();
//     setLoading(true);

//     try {
//       if (isRegister) {
//         const result = await authClient.signUp.email({
//           name,
//           email,
//           password,
//         });

//         if (result.error) {
//           toast.error(
//             result.error.message ??
//               "Registration failed."
//           );
//           return;
//         }

//         if (role === "vendor") {
//           await activateVendor();
//         }

//         toast.success("Account created successfully!");
//       } else {
//         const result = await authClient.signIn.email({
//           email,
//           password,
//         });

//         if (result.error) {
//           toast.error(
//             result.error.message ??
//               "Login failed."
//           );
//           return;
//         }

//         toast.success("Logged in successfully!");
//       }

//       router.push("/dashboard");
//       router.refresh();
//     } catch (error) {
//       toast.error(
//         error instanceof Error
//           ? error.message
//           : "Something went wrong."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handleGoogleLogin() {
//     try {
//       const callbackURL =
//         isRegister && role === "vendor"
//           ? "/auth/complete?role=vendor"
//           : "/dashboard";

//       const result = await authClient.signIn.social({
//         provider: "google",
//         callbackURL,
//       });

//       if (result.error) {
//         toast.error(
//           result.error.message ??
//             "Google sign-in failed."
//         );
//       }
//     } catch {
//       toast.error("Unable to connect to Google.");
//     }
//   }

//   return (
//     <div className="flex min-h-[80vh] items-center justify-center bg-[#FCFAF9] px-4 py-16">
//       <div className="w-full max-w-md rounded-2xl border border-[#eadfda] bg-white p-8 shadow-sm">
//         <div className="mb-8 text-center">
//           <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#8b2339]">
//             WedPlan
//           </p>

//           <h1 className="font-serif text-3xl font-bold text-[#2B2023]">
//             {isRegister
//               ? "Create Your Account"
//               : "Welcome Back"}
//           </h1>

//           <p className="mt-3 text-sm text-[#806c72]">
//             {isRegister
//               ? "Join WedPlan and start your wedding journey."
//               : "Sign in to continue your wedding planning."}
//           </p>
//         </div>

//         <form
//           onSubmit={handleSubmit}
//           className="space-y-5"
//         >
//           {isRegister && (
//             <>
//               <div>
//                 <label
//                   htmlFor="name"
//                   className="mb-2 block text-sm font-medium"
//                 >
//                   Full Name
//                 </label>

//                 <input
//                   id="name"
//                   type="text"
//                   required
//                   value={name}
//                   onChange={(e) =>
//                     setName(e.target.value)
//                   }
//                   placeholder="Enter your full name"
//                   className="w-full rounded-xl border border-[#eadfda] px-4 py-3 outline-none focus:border-[#8b2339]"
//                 />
//               </div>

//               <div>
//                 <label
//                   htmlFor="role"
//                   className="mb-2 block text-sm font-medium"
//                 >
//                   Register As
//                 </label>

//                 <select
//                   id="role"
//                   value={role}
//                   onChange={(e) =>
//                     setRole(
//                       e.target.value as
//                         | "customer"
//                         | "vendor"
//                     )
//                   }
//                   className="w-full rounded-xl border border-[#eadfda] px-4 py-3 outline-none focus:border-[#8b2339]"
//                 >
//                   <option value="customer">
//                     Customer
//                   </option>

//                   <option value="vendor">
//                     Wedding Service Vendor
//                   </option>
//                 </select>
//               </div>
//             </>
//           )}

//           <div>
//             <label
//               htmlFor="email"
//               className="mb-2 block text-sm font-medium"
//             >
//               Email Address
//             </label>

//             <input
//               id="email"
//               type="email"
//               required
//               value={email}
//               onChange={(e) =>
//                 setEmail(e.target.value)
//               }
//               placeholder="Enter your email"
//               className="w-full rounded-xl border border-[#eadfda] px-4 py-3 outline-none focus:border-[#8b2339]"
//             />
//           </div>

//           <div>
//             <label
//               htmlFor="password"
//               className="mb-2 block text-sm font-medium"
//             >
//               Password
//             </label>

//             <input
//               id="password"
//               type="password"
//               required
//               minLength={8}
//               value={password}
//               onChange={(e) =>
//                 setPassword(e.target.value)
//               }
//               placeholder="Minimum 8 characters"
//               className="w-full rounded-xl border border-[#eadfda] px-4 py-3 outline-none focus:border-[#8b2339]"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full rounded-xl bg-[#8b2339] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#6d1a2c] disabled:opacity-60"
//           >
//             {loading
//               ? "Please wait..."
//               : isRegister
//                 ? "Create Account"
//                 : "Sign In"}
//           </button>
//         </form>

//         <div className="my-6 flex items-center gap-3">
//           <div className="h-px flex-1 bg-[#eadfda]" />
//           <span className="text-sm text-[#806c72]">
//             OR
//           </span>
//           <div className="h-px flex-1 bg-[#eadfda]" />
//         </div>

//         <button
//           type="button"
//           onClick={handleGoogleLogin}
//           className="w-full rounded-xl border border-[#eadfda] px-6 py-3 font-medium transition-colors hover:bg-[#f8edef]"
//         >
//           Continue with Google
//         </button>

//         <p className="mt-7 text-center text-sm text-[#806c72]">
//           {isRegister
//             ? "Already have an account?"
//             : "Don't have an account?"}{" "}
//           <Link
//             href={isRegister ? "/login" : "/register"}
//             className="font-semibold text-[#8b2339] hover:underline"
//           >
//             {isRegister ? "Sign In" : "Register"}
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }


"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Camera,
  Heart,
  LockKeyhole,
  Mail,
  UserRound,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AccountRole = "customer" | "vendor";

interface AuthFormProps {
  mode: "login" | "register";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isRegister = mode === "register";

  const [role, setRole] = useState<AccountRole>("customer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

  // ShadCN Input with an icon on the left
  const inputClass = "h-11 rounded-xl bg-white pl-10 pr-4";

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a PNG, JPG, or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must not exceed 5MB.");
      event.target.value = "";
      return;
    }

    setProfileImage(file);

    const reader = new FileReader();

    reader.onload = () => {
      setImagePreview(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const uploadProfileImage = async (): Promise<string | undefined> => {
    if (!profileImage) return undefined;

    const formData = new FormData();
    formData.append("image", profileImage);

    const response = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!response.ok || !result.url) {
      throw new Error(result.message || "Profile image upload failed.");
    }

    return result.url as string;
  };

  const activateVendor = async () => {
    const response = await fetch("/api/profile/become-vendor", {
      method: "POST",
    });

    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      throw new Error(result.message || "Vendor activation failed.");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) return;

    if (isRegister && !passwordPattern.test(password)) {
      toast.error(
        "Password must have at least 6 characters, one uppercase and one lowercase letter."
      );
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        // 1. Create the account (Better Auth signs the user in automatically)
        const result = await authClient.signUp.email({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        });

        if (result.error) {
          throw new Error(result.error.message || "Registration failed.");
        }

        if (role === "vendor") {
          await activateVendor();
        }

        // 2. Upload the profile photo now that the user is signed in.
        //    Image upload is only allowed for signed-in users.
        if (profileImage) {
          try {
            const image = await uploadProfileImage();
            if (image) {
              await authClient.updateUser({ image });
            }
          } catch {
            toast.warning(
              "Account created, but the photo could not be uploaded. You can add it in Profile Settings."
            );
          }
        }

        toast.success("Your WedPlan account has been created!");
      } else {
        const result = await authClient.signIn.email({
          email: email.trim().toLowerCase(),
          password,
        });

        if (result.error) {
          throw new Error(result.error.message || "Sign in failed.");
        }

        toast.success("Welcome back to WedPlan!");
      }

      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (googleLoading) return;

    setGoogleLoading(true);

    try {
      // Google login redirects to the dashboard.
      // Vendor onboarding must be completed through a verified
      // authenticated flow, not an untrusted OAuth callback parameter.
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });

      if (result.error) {
        throw new Error(result.error.message || "Google sign-in failed.");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Google sign-in failed."
      );
      setGoogleLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-[#fcfaf9] px-4 py-10 sm:py-12">
      <div className="w-full max-w-[415px] rounded-xl border border-[#eadfd9] bg-white px-5 py-6 shadow-[0_8px_18px_rgba(43,32,35,0.10)] sm:px-6">
        {/* Header */}
        <div className="mb-7 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#8c2338] text-white">
            <Heart size={19} fill="currentColor" />
          </div>

          <h1 className="font-serif text-[25px] font-bold leading-tight tracking-tight text-[#2b2023]">
            {isRegister
              ? "Create Your WedPlan Account"
              : "Welcome Back to WedPlan"}
          </h1>

          <p className="mx-auto mt-2 max-w-[340px] text-[13px] leading-relaxed text-[#806c71]">
            {isRegister
              ? "Join as a couple planning your wedding or as a vendor offering curated services."
              : "Sign in to continue planning your perfect wedding."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              {/* Account role */}
              <div>
                <p className="mb-2 text-[13px] font-medium text-[#30252a]">
                  Account Role
                </p>

                <div className="grid grid-cols-2 gap-2.5">
                  {(
                    [
                      {
                        value: "customer",
                        title: "Customer",
                        description: "Plan & book services",
                      },
                      {
                        value: "vendor",
                        title: "Vendor",
                        description: "Publish wedding services",
                      },
                    ] as const
                  ).map((option) => (
                    <Button
                      key={option.value}
                      type="button"
                      variant="outline"
                      onClick={() => setRole(option.value)}
                      aria-pressed={role === option.value}
                      className={`h-auto flex-col items-start gap-0 whitespace-normal rounded-xl px-3 py-3 text-left ${
                        role === option.value
                          ? "border-[#8c2338] bg-[#fbf3f5] ring-1 ring-[#8c2338]/30"
                          : "border-[#eadfd9] bg-white hover:border-[#caa7ae]"
                      }`}
                    >
                      <span className="block text-[13px] font-semibold text-[#30252a]">
                        {option.title}
                      </span>

                      <span className="block text-[11px] leading-snug text-[#806c71]">
                        {option.description}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Profile photo */}
              <div className="rounded-xl border border-[#eadfd9] bg-[#fcfaf9] p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#eadfd9] bg-[#f6e9ec] text-sm font-medium text-[#8c2338]">
                    {imagePreview ? (
                      // A local preview is intentionally displayed before upload.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imagePreview}
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      "WP"
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                      aria-label="Upload profile photo"
                    />

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-xl bg-white text-[11px]"
                    >
                      <Camera className="text-[#8c2338]" />
                      {profileImage
                        ? "Change Profile Photo"
                        : "Upload Profile Photo (Optional)"}
                    </Button>

                    <p className="mt-1 text-[10px] text-[#927d82]">
                      {profileImage
                        ? profileImage.name
                        : "Hosted on ImgBB (PNG, JPG, WebP, max 5MB)."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Full name */}
              <div>
                <Label
                  htmlFor="register-name"
                  className="mb-2 text-[13px] text-[#30252a]"
                >
                  Full Name
                </Label>

                <div className="relative">
                  <UserRound
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#927d82]"
                  />

                  <Input
                    id="register-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Emma Watson"
                    autoComplete="name"
                    minLength={2}
                    required
                    className={inputClass}
                  />
                </div>
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <Label
              htmlFor="auth-email"
              className="mb-2 text-[13px] text-[#30252a]"
            >
              Email
            </Label>

            <div className="relative">
              <Mail
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#927d82]"
              />

              <Input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className={inputClass}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <Label
              htmlFor="auth-password"
              className="mb-2 text-[13px] text-[#30252a]"
            >
              Password
            </Label>

            <div className="relative">
              <LockKeyhole
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#927d82]"
              />

              <Input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={
                  isRegister
                    ? "Min 6 chars, 1 uppercase & 1 lowercase"
                    : "Enter your password"
                }
                autoComplete={
                  isRegister ? "new-password" : "current-password"
                }
                minLength={isRegister ? 6 : undefined}
                required
                className={inputClass}
              />
            </div>

            {isRegister && (
              <p className="mt-1.5 text-[10px] text-[#927d82]">
                Must be at least 6 characters with 1 uppercase and 1 lowercase
                letter.
              </p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading || googleLoading}
            className="h-11 w-full rounded-xl text-[13px]"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}

            {loading
              ? "Please wait..."
              : isRegister
                ? "Create Account"
                : "Sign In"}
          </Button>
        </form>

        {/* Divider */}
        <div className="my-5 flex items-center gap-2">
          <span className="h-px flex-1 bg-[#eadfd9]" />

          <span className="text-[10px] text-[#927d82]">
            OR CONTINUE WITH
          </span>

          <span className="h-px flex-1 bg-[#eadfd9]" />
        </div>

        {/* Google */}
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignIn}
          disabled={googleLoading || loading}
          className="h-11 w-full rounded-xl bg-[#fcfaf9] text-[13px] hover:bg-[#f6e9ec]"
        >
          {googleLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <svg
              width="17"
              height="17"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6C44.4 38.03 46.98 31.9 46.98 24.55z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59A14.41 14.41 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.88 23.88 0 0 0 0 24c0 3.87.93 7.51 2.56 10.78l7.97-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.92-2.13 15.89-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.97 6.19C6.51 42.62 14.62 48 24 48z"
              />
            </svg>
          )}

          {/* Google sign-up always creates a Customer account */}
          {isRegister ? "Sign up with Google (Customer)" : "Continue with Google"}
        </Button>

        {/* Bottom link */}
        <p className="mt-5 text-center text-[12px] text-[#806c71]">
          {isRegister
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <Link
            href={isRegister ? "/login" : "/register"}
            className="font-semibold text-[#8c2338] hover:underline"
          >
            {isRegister ? "Sign in" : "Create account"}
          </Link>
        </p>
      </div>
    </main>
  );
}
