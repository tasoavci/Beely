import { FormEventHandler } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";

export default function VerifyEmail({
    status,
    email,
}: {
    status?: string;
    email?: string;
}) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("verification.send"));
    };

    return (
        <GuestLayout
            title="Email Doğrulama"
            subtitle="Kayıt olduğun için teşekkürler! Başlamadan önce sana gönderdiğimiz linke tıklayarak emailini doğrular mısın?"
        >
            <Head title="Email Doğrulama" />

            {status === "verification-link-sent" && (
                <div className="mb-4 font-medium text-sm text-green-600 bg-green-50 p-3 rounded-md border border-green-200">
                    {email ? (
                        <>
                            Doğrulama linki{" "}
                            <strong className="font-semibold">{email}</strong>{" "}
                            adresine gönderildi. Lütfen email kutunu kontrol et.
                        </>
                    ) : (
                        "Doğrulama linki email adresine gönderildi. Lütfen email kutunu kontrol et."
                    )}
                </div>
            )}

            {email && (
                <div className="mb-4 text-sm text-zinc-600 bg-zinc-50 p-3 rounded-md border border-zinc-200">
                    <p className="font-medium mb-1">Email adresi:</p>
                    <p className="font-mono text-beely-600">{email}</p>
                    <p className="text-xs mt-2 text-zinc-500">
                        Doğrulama linki bu adrese gönderildi.
                    </p>
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <Button
                    className="w-full bg-beely-500 hover:bg-beely-600 text-white"
                    disabled={processing}
                >
                    Doğrulama Emailini Tekrar Gönder
                </Button>

                <div className="flex items-center justify-between text-sm mt-4">
                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="text-zinc-600 hover:text-zinc-900 underline"
                    >
                        Çıkış Yap
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
