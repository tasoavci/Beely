import { FormEventHandler } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import { Head, useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("password.email"));
    };

    return (
        <GuestLayout
            title="Şifreni mi Unuttun?"
            subtitle="Sorun değil. E-posta adresini yaz, sana sıfırlama bağlantısı gönderelim."
        >
            <Head title="Şifre Sıfırla" />

            {status && (
                <div className="mb-4 font-medium text-sm text-green-600 bg-green-50 p-3 rounded-md border border-green-200">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="bg-zinc-50 focus-visible:ring-beely-500"
                        isFocused={true}
                        onChange={(e) => setData("email", e.target.value)}
                    />
                    <InputError message={errors.email} />
                </div>

                <Button
                    className="w-full bg-beely-500 hover:bg-beely-600 text-white"
                    disabled={processing}
                >
                    Sıfırlama Linki Gönder
                </Button>
            </form>
        </GuestLayout>
    );
}
