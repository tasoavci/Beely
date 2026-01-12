<x-mail::message>
# Şifre Sıfırlama İsteği

Merhaba {{ $user->name }},

Hesabınız için şifre sıfırlama isteği aldık. Yeni şifrenizi belirlemek için aşağıdaki butona tıklayın.

<x-mail::button :url="$resetUrl">
Şifremi Sıfırla
</x-mail::button>

Bu link **60 dakika** geçerlidir. Eğer bu isteği siz yapmadıysanız, bu email'i görmezden gelebilirsiniz ve mevcut şifreniz aynen kalacaktır.

Eğer buton çalışmıyorsa, aşağıdaki linki tarayıcınıza kopyalayıp yapıştırabilirsiniz:

[{{ $resetUrl }}]({{ $resetUrl }})

Güvenliğiniz için, eğer bu isteği siz yapmadıysanız şifrenizi değiştirmenizi öneririz.

Teşekkürler,<br>
{{ config('app.name') }} Ekibi
</x-mail::message>
