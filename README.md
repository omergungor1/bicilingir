# Bi Çilingir Projesi

Bu proje, Türkiye'nin en büyük çilingir pazaryeri olan Bi Çilingir'in web sitesini içerir.

## Kurulum

1. Projeyi klonlayın:
```bash
git clone <repo-url>
cd bi-cilingir
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

4. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresine gidin.

## Özellikler

- Türkiye il ve ilçe bazlı adres arama
- Çilingir hizmetleri arama
- Responsive tasarım

## Adres Arama Sistemi

Bu projede harici bir API kullanmak yerine, Türkiye'deki tüm il ve ilçeleri içeren statik bir veri kaynağı kullanılmaktadır. Kullanıcılar adres arama alanına yazdıkça, sistem otomatik olarak eşleşen il ve ilçeleri filtreleyerek gösterir.

Adres arama sistemi şu özelliklere sahiptir:
- Türkiye'deki 81 il ve tüm ilçeleri içerir
- Kullanıcı girişine göre gerçek zamanlı filtreleme
- İl veya ilçe bazında arama yapabilme
- Seçilen adresin tam formatını otomatik oluşturma

## Lisans

Bu proje [MIT lisansı](LICENSE) altında lisanslanmıştır.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
