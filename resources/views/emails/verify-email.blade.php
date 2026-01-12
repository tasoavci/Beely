<x-mail::message>
# Email Adresinizi Doğrulayın

Merhaba {{ $user->name }},

**Beely**'e kayıt olduğunuz için teşekkür ederiz! Hesabınızı aktif etmek için aşağıdaki butona tıklayarak email adresinizi doğrulayın.

<x-mail::button :url="$verificationUrl">
Email Adresimi Doğrula
</x-mail::button>

Bu link **60 dakika** geçerlidir. Eğer bu isteği siz yapmadıysanız, bu email'i görmezden gelebilirsiniz.

Eğer buton çalışmıyorsa, aşağıdaki linki tarayıcınıza kopyalayıp yapıştırabilirsiniz:

[{{ $verificationUrl }}]({{ $verificationUrl }})

Sorunuz mu var? Bizimle iletişime geçmekten çekinmeyin.

Teşekkürler,<br>
{{ config('app.name') }} Ekibi
</x-mail::message>
