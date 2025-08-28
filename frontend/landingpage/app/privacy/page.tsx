"use client"

import { useState } from "react"
import { translations, type Language } from "@/lib/translations"
import { LanguageSwitcher } from "@/components/language-switcher"
import Link from "next/link"

export default function PrivacyPage() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en")
  const t = translations[currentLanguage]

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="absolute top-6 right-6 z-20">
        <LanguageSwitcher currentLanguage={currentLanguage} onLanguageChange={setCurrentLanguage} />
      </div>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[#4A3728] mb-8">{t.privacy.title}</h1>

        <div className="prose prose-lg max-w-none text-[#8B7355]">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#4A3728] mb-4">{t.privacy.informationCollection.title}</h2>
            <p className="mb-4">{t.privacy.informationCollection.description}</p>
            <ul className="list-disc pl-6 mb-4">
              {t.privacy.informationCollection.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#4A3728] mb-4">{t.privacy.informationUse.title}</h2>
            <p className="mb-4">{t.privacy.informationUse.description}</p>
            <ul className="list-disc pl-6 mb-4">
              {t.privacy.informationUse.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#4A3728] mb-4">{t.privacy.ccpaRights.title}</h2>
            <p className="mb-4">{t.privacy.ccpaRights.description}</p>
            <ul className="list-disc pl-6 mb-4">
              {t.privacy.ccpaRights.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#4A3728] mb-4">{t.privacy.gdprRights.title}</h2>
            <p className="mb-4">{t.privacy.gdprRights.description}</p>
            <ul className="list-disc pl-6 mb-4">
              {t.privacy.gdprRights.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#4A3728] mb-4">{t.privacy.contactUs.title}</h2>
            <p className="mb-4">{t.privacy.contactUs.description}</p>
            <p className="mb-4">
              {t.privacy.contactUs.email}{" "}
              <a href="mailto:wang@impactbridge.ai" className="text-[#CC6B3D] hover:underline">
                wang@impactbridge.ai
              </a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#4A3728] mb-4">{t.privacy.policyUpdates.title}</h2>
            <p className="mb-4">{t.privacy.policyUpdates.description}</p>
            <p className="text-sm text-[#8B7355]">{t.privacy.policyUpdates.lastUpdated}</p>
          </section>
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="text-[#CC6B3D] hover:underline">
            ← {currentLanguage === "en" ? "Back to Home" : currentLanguage === "zh" ? "返回首页" : "Volver al Inicio"}
          </Link>
        </div>
      </div>
    </div>
  )
}
