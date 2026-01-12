import { FormEventHandler, useEffect, ChangeEvent } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import { Head, useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
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
        post(route("password.store"));
    };

    return (
        <GuestLayout
            title="Yeni Şifre Belirle"
            subtitle="Güvenliğin için güçlü bir şifre seç."
        >
            <Head title="Şifre Sıfırla" />

            <form onSubmit={submit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="bg-zinc-100 text-zinc-500 cursor-not-allowed"
                        autoComplete="username"
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setData("email", e.target.value)
                        }
                        disabled
                    />
                    <InputError message={errors.email} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Yeni Şifre</Label>
                    <Input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="focus-visible:ring-beely-500"
                        autoComplete="new-password"
                        isFocused={true}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setData("password", e.target.value)
                        }
                    />
                    <InputError message={errors.password} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password_confirmation">
                        Yeni Şifre (Tekrar)
                    </Label>
                    <Input
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="focus-visible:ring-beely-500"
                        autoComplete="new-password"
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setData("password_confirmation", e.target.value)
                        }
                    />
                    <InputError message={errors.password_confirmation} />
                </div>

                <Button
                    className="w-full bg-beely-500 hover:bg-beely-600 text-white"
                    disabled={processing}
                >
                    Şifreyi Sıfırla
                </Button>
            </form>
        </GuestLayout>
    );
}
