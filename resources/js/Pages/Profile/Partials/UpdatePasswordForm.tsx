import InputError from "@/Components/InputError";
import { Transition } from "@headlessui/react";
import { useForm } from "@inertiajs/react";
import { FormEventHandler, useRef } from "react";
import { Check } from "lucide-react";

export default function UpdatePasswordForm() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route("password.update"), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset("password", "password_confirmation");
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset("current_password");
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <form onSubmit={updatePassword} className="space-y-5">
            <div>
                <label
                    htmlFor="current_password"
                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
                >
                    Mevcut Şifre
                </label>
                <input
                    id="current_password"
                    ref={currentPasswordInput}
                    value={data.current_password}
                    onChange={(e) => setData("current_password", e.target.value)}
                    type="password"
                    autoComplete="current-password"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-beely-500 focus:border-beely-500 transition-colors"
                />
                <InputError message={errors.current_password} className="mt-2" />
            </div>

            <div>
                <label
                    htmlFor="password"
                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
                >
                    Yeni Şifre
                </label>
                <input
                    id="password"
                    ref={passwordInput}
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    type="password"
                    autoComplete="new-password"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-beely-500 focus:border-beely-500 transition-colors"
                />
                <InputError message={errors.password} className="mt-2" />
            </div>

            <div>
                <label
                    htmlFor="password_confirmation"
                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
                >
                    Yeni Şifre Tekrar
                </label>
                <input
                    id="password_confirmation"
                    value={data.password_confirmation}
                    onChange={(e) => setData("password_confirmation", e.target.value)}
                    type="password"
                    autoComplete="new-password"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-beely-500 focus:border-beely-500 transition-colors"
                />
                <InputError message={errors.password_confirmation} className="mt-2" />
            </div>

            <div className="flex items-center gap-4 pt-2">
                <button
                    type="submit"
                    disabled={processing}
                    className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium rounded-xl transition-colors"
                >
                    Şifreyi Güncelle
                </button>

                <Transition
                    show={recentlySuccessful}
                    enter="transition ease-in-out"
                    enterFrom="opacity-0"
                    leave="transition ease-in-out"
                    leaveTo="opacity-0"
                >
                    <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                        <Check className="h-4 w-4" />
                        Güncellendi
                    </p>
                </Transition>
            </div>
        </form>
    );
}
