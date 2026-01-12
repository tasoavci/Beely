import { useEffect, FormEventHandler } from "react";
import Checkbox from "@/Components/Checkbox";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword?: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("login"));
    };

    return (
        <GuestLayout
            title="Tekrar Hoşgeldin"
            subtitle="Kaldığın yerden devam etmek için giriş yap."
        >
            <Head title="Giriş Yap" />

            {status && (
                <div className="mb-4 font-medium text-sm text-green-600 bg-green-50 p-3 rounded-md border border-green-200">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="email">Email Adresi</Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="bg-zinc-50 border-zinc-200 focus-visible:ring-beely-500"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData("email", e.target.value)}
                        required
                    />
                    <InputError message={errors.email} />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Şifre</Label>
                        {canResetPassword && (
                            <Link
                                href={route("password.request")}
                                className="text-xs font-medium text-beely-600 hover:text-beely-500 hover:underline"
                            >
                                Şifreni mi unuttun?
                            </Link>
                        )}
                    </div>
                    <Input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="bg-zinc-50 border-zinc-200 focus-visible:ring-beely-500"
                        autoComplete="current-password"
                        onChange={(e) => setData("password", e.target.value)}
                        required
                    />
                    <InputError message={errors.password} />
                </div>

                <div className="flex items-center">
                    <label className="flex items-center cursor-pointer group">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData("remember", e.target.checked)
                            }
                            className="text-beely-600 focus:ring-beely-500 rounded border-gray-300"
                        />
                        <span className="ms-2 text-sm text-zinc-600 group-hover:text-zinc-900 transition-colors">
                            Beni Hatırla
                        </span>
                    </label>
                </div>

                <Button
                    type="submit"
                    className="w-full bg-beely-500 hover:bg-beely-600 text-white font-bold py-2 shadow-lg shadow-beely-500/20 transition-all hover:scale-[1.02]"
                    disabled={processing}
                >
                    {processing ? "Giriş Yapılıyor..." : "Giriş Yap"}
                </Button>

                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-zinc-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-zinc-400">
                            veya
                        </span>
                    </div>
                </div>

                <div className="text-center text-sm text-zinc-600">
                    Henüz hesabın yok mu?{" "}
                    <Link
                        href={route("register")}
                        className="text-beely-600 hover:text-beely-700 font-semibold hover:underline"
                    >
                        Hemen Kayıt Ol
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
