import InputError from "@/Components/InputError";
import Modal from "@/Components/Modal";
import { useForm } from "@inertiajs/react";
import { FormEventHandler, useRef, useState } from "react";
import { AlertTriangle, X } from "lucide-react";

export default function DeleteUserForm() {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: "",
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route("profile.destroy"), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                Hesabın silindiğinde, tüm veriler ve kaynaklarınız kalıcı olarak
                silinecektir. Silmeden önce saklamak istediğiniz verileri
                yedekleyin.
            </p>

            <button
                onClick={confirmUserDeletion}
                className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors"
            >
                Hesabımı Sil
            </button>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl flex-shrink-0">
                            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                                Hesabını silmek istediğinden emin misin?
                            </h2>
                            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                                Bu işlem geri alınamaz. Hesabın ve tüm verilerin
                                kalıcı olarak silinecek. Devam etmek için şifreni gir.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="mt-6">
                        <label
                            htmlFor="delete-password"
                            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
                        >
                            Şifre
                        </label>
                        <input
                            id="delete-password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData("password", e.target.value)}
                            placeholder="Şifreni gir..."
                            className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-300 font-medium rounded-xl transition-colors"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2.5 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-medium rounded-xl transition-colors"
                        >
                            Evet, Hesabımı Sil
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
