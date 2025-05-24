"use client";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// TypeScript interfaces
interface FormData {
  originalUrl: string;
  title: string | undefined;
  expiresAt: string | undefined;
  maxClicks: number | null | undefined;
  oneTimeOnly: boolean;
  passwordProtected: boolean;
  password: string | undefined;
}

interface CreatedLink {
  shortUrl: string;
  originalUrl: string;
  title: string;
  clicks: number;
  created: string;
}

// Validation schema
const validationSchema = yup.object().shape({
  originalUrl: yup
    .string()
    .required("Original URL is required")
    .url("Please enter a valid URL"),
  title: yup.string().notRequired(),
  expiresAt: yup.string().notRequired(),
  maxClicks: yup
    .number()
    .nullable()
    .notRequired()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .positive("Max clicks must be a positive number")
    .integer("Max clicks must be a whole number"),
  oneTimeOnly: yup.boolean().required(),
  passwordProtected: yup.boolean().required(),
  password: yup.string().when("passwordProtected", {
    is: true,
    then: (schema) =>
      schema.required(
        "Password is required when password protection is enabled"
      ),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export default function CreateLink() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [createdLink, setCreatedLink] = useState<CreatedLink | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    resolver: yupResolver(validationSchema),
    defaultValues: {
      originalUrl: "",
      title: undefined,
      expiresAt: undefined,
      maxClicks: null,
      oneTimeOnly: false,
      passwordProtected: false,
      password: undefined,
    },
  });

  const passwordProtected = watch("passwordProtected");

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const shortUrl = `https://ekrypt.to/${Math.random()
        .toString(36)
        .substring(2, 8)}`;
      setCreatedLink({
        shortUrl,
        originalUrl: data.originalUrl,
        title: data.title || "Untitled Link",
        clicks: 0,
        created: new Date().toLocaleDateString(),
      });
      setIsLoading(false);
    }, 2000);
  };

  const copyToClipboard = async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  if (createdLink) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600 rounded-full filter blur-3xl opacity-70 animate-float"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-600 rounded-full filter blur-3xl opacity-50 animate-float-delay"></div>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 border-b border-gray-800 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-600 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Ekrypt
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCreatedLink(null)}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Create Another
              </button>
              <a
                href="#"
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Dashboard
              </a>
            </div>
          </div>
        </nav>

        {/* Success Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Link Created Successfully!
            </h1>
            <p className="text-xl text-gray-300">
              Your shortened link is ready to use
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-8 border border-gray-700 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-blue-400">
                  Short URL
                </h3>
                <div className="flex items-center space-x-3 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                  <span className="flex-1 font-mono text-white">
                    {createdLink.shortUrl}
                  </span>
                  <button
                    onClick={() => copyToClipboard(createdLink.shortUrl)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                      />
                    </svg>
                    <span>Copy</span>
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-purple-400">
                  Original URL
                </h3>
                <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                  <span className="text-gray-300 break-all">
                    {createdLink.originalUrl}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-gray-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-2">
                  {createdLink.clicks}
                </div>
                <div className="text-gray-400">Total Clicks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-2">
                  Active
                </div>
                <div className="text-gray-400">Status</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400 mb-2">
                  {createdLink.created}
                </div>
                <div className="text-gray-400">Created</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => setCreatedLink(null)}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Create Another Link
            </button>
            <a
              href="#"
              className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors text-center"
            >
              View Analytics
            </a>
          </div>
        </div>

        <style jsx global>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0) translateX(0);
            }
            50% {
              transform: translateY(-20px) translateX(10px);
            }
          }
          @keyframes float-delay {
            0%,
            100% {
              transform: translateY(0) translateX(0);
            }
            50% {
              transform: translateY(15px) translateX(-15px);
            }
          }
          .animate-float {
            animation: float 8s ease-in-out infinite;
          }
          .animate-float-delay {
            animation: float-delay 10s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600 rounded-full filter blur-3xl opacity-70 animate-float"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-600 rounded-full filter blur-3xl opacity-50 animate-float-delay"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-gray-800 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Ekrypt
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="#"
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Dashboard
            </a>
            <a
              href="#"
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              My Links
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Create New Link
            </span>
          </h1>
          <p className="text-xl text-gray-300">
            Shorten your URL with advanced customization options
          </p>
        </div>

        {/* Form */}
        <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-8 border border-gray-700">
          <div className="space-y-6">
            {/* Original URL */}
            <div>
              <label
                htmlFor="originalUrl"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Original URL *
              </label>
              <Controller
                name="originalUrl"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="url"
                    id="originalUrl"
                    placeholder="https://example.com/your-long-url"
                    className={`w-full px-4 py-3 bg-gray-900/50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.originalUrl ? "border-red-500" : "border-gray-600"
                    }`}
                  />
                )}
              />
              {errors.originalUrl && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.originalUrl.message}
                </p>
              )}
            </div>

            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Title (Optional)
              </label>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    id="title"
                    placeholder="Enter a descriptive title for your link"
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                )}
              />
            </div>

            {/* Advanced Options */}
            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-lg font-semibold mb-4 text-blue-400">
                Advanced Options
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Expires At */}
                <div>
                  <label
                    htmlFor="expiresAt"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Expires At
                  </label>
                  <Controller
                    name="expiresAt"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="datetime-local"
                        id="expiresAt"
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      />
                    )}
                  />
                </div>

                {/* Max Clicks */}
                <div>
                  <label
                    htmlFor="maxClicks"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Max Clicks
                  </label>
                  <Controller
                    name="maxClicks"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                      <input
                        {...field}
                        type="number"
                        id="maxClicks"
                        value={value || ""}
                        onChange={(e) =>
                          onChange(
                            e.target.value === ""
                              ? null
                              : Number(e.target.value)
                          )
                        }
                        placeholder="e.g., 100"
                        min="1"
                        className={`w-full px-4 py-3 bg-gray-900/50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          errors.maxClicks
                            ? "border-red-500"
                            : "border-gray-600"
                        }`}
                      />
                    )}
                  />
                  {errors.maxClicks && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.maxClicks.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-4 mt-6">
                {/* One Time Only */}
                <div className="flex items-start space-x-3">
                  <Controller
                    name="oneTimeOnly"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                      <input
                        {...field}
                        type="checkbox"
                        id="oneTimeOnly"
                        checked={value}
                        onChange={(e) => onChange(e.target.checked)}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-900"
                      />
                    )}
                  />
                  <div>
                    <label
                      htmlFor="oneTimeOnly"
                      className="text-sm font-medium text-gray-300"
                    >
                      One Time Only (Burn After Read)
                    </label>
                    <p className="text-sm text-gray-400">
                      Link will be automatically deleted after the first click
                    </p>
                  </div>
                </div>

                {/* Password Protected */}
                <div className="flex items-start space-x-3">
                  <Controller
                    name="passwordProtected"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                      <input
                        {...field}
                        type="checkbox"
                        id="passwordProtected"
                        checked={value}
                        onChange={(e) => onChange(e.target.checked)}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-900"
                      />
                    )}
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="passwordProtected"
                      className="text-sm font-medium text-gray-300"
                    >
                      Password Protected
                    </label>
                    <p className="text-sm text-gray-400 mb-3">
                      Require a password to access the link
                    </p>

                    {/* Password Input */}
                    {passwordProtected && (
                      <div className="mt-3">
                        <Controller
                          name="password"
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="password"
                              placeholder="Enter password"
                              className={`w-full px-4 py-3 bg-gray-900/50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                errors.password
                                  ? "border-red-500"
                                  : "border-gray-600"
                              }`}
                            />
                          )}
                        />
                        {errors.password && (
                          <p className="mt-1 text-sm text-red-400">
                            {errors.password.message}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-expect-error
                onClick={handleSubmit(onSubmit)}
                disabled={isLoading}
                className={`w-full px-8 py-4 font-bold rounded-lg transition-all flex items-center justify-center ${
                  isLoading
                    ? "bg-blue-700 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90"
                }`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Link...
                  </>
                ) : (
                  "Create Short Link"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }
        @keyframes float-delay {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(15px) translateX(-15px);
          }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float-delay 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
