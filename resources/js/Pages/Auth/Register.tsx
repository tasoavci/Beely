import { FormEventHandler, useEffect } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("register"));
    };

    return (
        <GuestLayout
            title="Aramıza Katıl"
            subtitle={
                <span>
                    Hemen hesabını oluştur ve{" "}
                    <span className="text-beely-600 font-medium">Beely</span>{" "}
                    dünyasına adım at.
                </span>
            }
        >
            <Head title="Kayıt Ol" />

            <form onSubmit={submit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Ad Soyad</Label>
                    <Input
                        id="name"
                        name="name"
                        value={data.name}
                        className="bg-zinc-50 border-zinc-200 focus-visible:ring-beely-500"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                    />
                    <InputError message={errors.name} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email Adresi</Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="bg-zinc-50 border-zinc-200 focus-visible:ring-beely-500"
                        autoComplete="username"
                        onChange={(e) => setData("email", e.target.value)}
                        required
                    />
                    <InputError message={errors.email} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">Şifre</Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="bg-zinc-50 border-zinc-200 focus-visible:ring-beely-500"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password_confirmation">Tekrar</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="bg-zinc-50 border-zinc-200 focus-visible:ring-beely-500"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                            required
                        />
                    </div>
                </div>
                <InputError message={errors.password} />
                <InputError message={errors.password_confirmation} />

                <Button
                    className="w-full bg-beely-500 hover:bg-beely-600 text-white font-bold"
                    disabled={processing}
                >
                    Kayıt Ol
                </Button>

                <div className="flex items-center justify-center text-sm mt-4">
                    <span className="text-zinc-500">Zaten hesabın var mı?</span>
                    <Link
                        href={route("login")}
                        className="ml-1 font-medium text-beely-600 hover:text-beely-500 hover:underline"
                    >
                        Giriş Yap
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
