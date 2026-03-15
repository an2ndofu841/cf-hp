import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PixelCard } from "@/components/ui/pixel-card";
import { PixelButton } from "@/components/ui/pixel-button";

export default async function TokushohoPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const isEn = lang === "en";

  const items = isEn
    ? [
        { label: "Business Name", value: "Meshiagare Label Co., Ltd." },
        {
          label: "Address",
          value:
            "Shibuya Dogenzaka Store\n〒150-0044\nMIEUX Shibuya Bldg. 8F, 5-3 Maruyamacho, Shibuya-ku, Tokyo",
        },
        {
          label: "Phone",
          value: "Will be disclosed promptly upon request.",
        },
        { label: "Email", value: "info@mlbl.co.jp" },
        {
          label: "Representative",
          value: "Will be disclosed promptly upon request.",
        },
        { label: "Sales Price", value: "Listed on each product / service page." },
        {
          label: "Additional Fees",
          value: "Shipping fees, payment processing fees, etc. are shown at checkout.",
        },
        {
          label: "Payment Methods",
          value: "Credit card, and other methods shown at checkout.",
        },
        {
          label: "Payment Timing",
          value: "Charged at the time of purchase completion.",
        },
        {
          label: "Delivery / Provision",
          value:
            "Digital goods and tickets: available immediately or on the event date.\nPhysical goods: shipped within the period stated on the product page.",
        },
        {
          label: "Returns & Exchanges",
          value:
            "〈Customer-initiated returns〉\nBefore shipment: You may cancel via the cancel button on the website.\nAfter shipment: Unopened items may be returned or exchanged within 10 days of receipt by contacting Customer Support (info@mlbl.co.jp). Opened items are not eligible for return or exchange.\n\n〈Defective products〉\nPlease contact Customer Support (info@mlbl.co.jp). We will cover shipping costs and provide a refund or replacement.",
        },
      ]
    : [
        { label: "法人名", value: "株式会社めしあがレーベル" },
        {
          label: "住所",
          value:
            "渋谷道玄坂店\n〒150-0044\n東京都渋谷区円山町5番3号 MIEUX渋谷ビル8階",
        },
        {
          label: "電話番号",
          value: "請求があった場合には速やかに開示いたします",
        },
        { label: "メールアドレス", value: "info@mlbl.co.jp" },
        {
          label: "運営責任者",
          value: "請求があった場合には速やかに開示いたします",
        },
        {
          label: "販売価格",
          value: "各商品・サービスのページに記載しております。",
        },
        {
          label: "追加手数料等",
          value:
            "送料・決済手数料等は、購入手続き画面にてご確認いただけます。",
        },
        {
          label: "支払方法",
          value: "クレジットカード、その他購入手続き画面に表示する方法",
        },
        {
          label: "支払時期",
          value: "購入手続き完了時にお支払いが確定します。",
        },
        {
          label: "商品の引渡し・サービス提供時期",
          value:
            "デジタルコンテンツ・チケット類：購入完了後すぐ、またはイベント当日より提供。\n物販商品：各商品ページに記載の期間内に発送いたします。",
        },
        {
          label: "交換および返品に関するポリシー",
          value:
            "〈顧客からの返品・交換〉\n配送前の商品の場合：ウェブサイトのキャンセルボタンを押して注文をキャンセルできます。\n発送後の商品の場合：未開封の商品については、商品到着後10日以内にカスタマーサポートセンター（info@mlbl.co.jp）にご連絡いただいた場合に限り、返金または交換が可能です。開封後の返品や交換は受け付けておりません。\n\n〈不良品・サービスの返品・交換〉\nカスタマーサポートセンター（info@mlbl.co.jp）にお問い合わせください。弊社が送料を負担して返金するか、新しい製品と交換いたします。",
        },
      ];

  return (
    <div className="min-h-screen p-4 sm:p-8 font-pixel bg-zinc-50 dark:bg-zinc-950">
      <main className="max-w-4xl mx-auto flex flex-col min-h-[80vh]">
        <Header lang={lang} />

        <div className="flex-1 mt-8">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-xl md:text-2xl font-bold bg-foreground text-background px-4 py-1 leading-tight">
              {isEn ? "Specified Commercial Transactions Act" : "特定商取引法に基づく表記"}
            </h2>
            <div className="h-1 flex-1 bg-foreground hidden sm:block" />
          </div>

          <PixelCard className="p-0 overflow-hidden">
            <table className="w-full text-sm md:text-base">
              <tbody>
                {items.map(({ label, value }, i) => (
                  <tr
                    key={label}
                    className={i % 2 === 0 ? "bg-background" : "bg-zinc-100 dark:bg-zinc-800/50"}
                  >
                    <th className="align-top text-left px-4 py-4 w-[40%] md:w-[30%] font-bold border-r-2 border-foreground/20 text-foreground whitespace-nowrap">
                      {label}
                    </th>
                    <td className="align-top px-4 py-4 text-foreground/90 whitespace-pre-line leading-7">
                      {value.includes("info@mlbl.co.jp") ? (
                        value.split("info@mlbl.co.jp").map((part, j, arr) => (
                          <span key={j}>
                            {part}
                            {j < arr.length - 1 && (
                              <a
                                href="mailto:info@mlbl.co.jp"
                                className="underline hover:text-pixel-blue"
                              >
                                info@mlbl.co.jp
                              </a>
                            )}
                          </span>
                        ))
                      ) : (
                        value
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </PixelCard>
        </div>

        <div className="mt-12 text-center">
          <PixelButton href={`/${lang}`} variant="outline">
            {isEn ? "BACK TO TOP" : "トップへ戻る"}
          </PixelButton>
        </div>

        <Footer />
      </main>
    </div>
  );
}
