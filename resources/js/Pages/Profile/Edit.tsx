import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Head, usePage } from "@inertiajs/react";
import { User, Lock, Trash2 } from "lucide-react";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    const user = usePage().props.auth.user;

    return (
        <AuthenticatedLayout>
            <Head title="Profil Ayarları" />

            <div className="max-w-3xl mx-auto space-y-6">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-beely-500 to-amber-500 rounded-2xl p-6 text-white">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">{user.name}</h1>
                            <p className="text-white/80">{user.email}</p>
                        </div>
                    </div>
                </div>

                {/* Profile Information */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                    <div className="flex items-center gap-3 p-5 border-b border-zinc-100 dark:border-zinc-800">
                        <div className="p-2 bg-beely-100 dark:bg-beely-900/30 rounded-xl">
                            <User className="h-5 w-5 text-beely-600 dark:text-beely-400" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
                                Profil Bilgileri
                            </h2>
                            <p className="text-sm text-zinc-500">
                                Hesap bilgilerini güncelle
                            </p>
                        </div>
                    </div>
                    <div className="p-5">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </div>
                </div>

                {/* Password */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                    <div className="flex items-center gap-3 p-5 border-b border-zinc-100 dark:border-zinc-800">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                            <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
                                Şifre Değiştir
                            </h2>
                            <p className="text-sm text-zinc-500">
                                Güvenliğin için güçlü bir şifre kullan
                            </p>
                        </div>
                    </div>
                    <div className="p-5">
                        <UpdatePasswordForm />
                    </div>
                </div>

                {/* Delete Account */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-red-200 dark:border-red-900/50 overflow-hidden">
                    <div className="flex items-center gap-3 p-5 border-b border-red-100 dark:border-red-900/30">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
                            <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-red-600 dark:text-red-400">
                                Hesabı Sil
                            </h2>
                            <p className="text-sm text-zinc-500">
                                Bu işlem geri alınamaz
                            </p>
                        </div>
                    </div>
                    <div className="p-5">
                        <DeleteUserForm />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
