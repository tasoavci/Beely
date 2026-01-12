import InputError from "@/Components/InputError";
import { Transition } from "@headlessui/react";
import { Link, useForm, usePage } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { Check } from "lucide-react";

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route("profile.update"));
    };

    return (
        <form onSubmit={submit} className="space-y-5">
            <div>
                <label
                    htmlFor="name"
                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
                >
                    Ad Soyad
                </label>
                <input
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    required
                    autoComplete="name"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-beely-500 focus:border-beely-500 transition-colors"
                />
                <InputError className="mt-2" message={errors.name} />
            </div>

            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
                >
                    E-posta Adresi
                </label>
                <input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    required
                    autoComplete="username"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-beely-500 focus:border-beely-500 transition-colors"
                />
                <InputError className="mt-2" message={errors.email} />
            </div>

            {mustVerifyEmail && user.email_verified_at === null && (
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                        E-posta adresin henüz doğrulanmadı.{" "}
                        <Link
                            href={route("verification.send")}
                            method="post"
                            as="button"
                            className="font-medium underline hover:text-amber-900 dark:hover:text-amber-100"
                        >
                            Doğrulama e-postasını tekrar gönder
                        </Link>
                    </p>

                    {status === "verification-link-sent" && (
                        <p className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                            Yeni doğrulama linki e-posta adresine gönderildi.
                        </p>
                    )}
                </div>
            )}

            <div className="flex items-center gap-4 pt-2">
                <button
                    type="submit"
                    disabled={processing}
                    className="px-5 py-2.5 bg-beely-500 hover:bg-beely-600 disabled:bg-beely-300 text-white font-medium rounded-xl transition-colors flex items-center gap-2"
                >
                    Kaydet
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
                        Kaydedildi
                    </p>
                </Transition>
            </div>
        </form>
    );
}
