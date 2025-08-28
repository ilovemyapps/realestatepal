"use client"

import { useState, useEffect } from "react"
import { Shield, DollarSign, FileText, TrendingUp, Zap, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { WaitlistForm } from "@/components/waitlist-form"
import { LanguageSwitcher } from "@/components/language-switcher"
import { translations, type Language } from "@/lib/translations"
import Link from "next/link"

export default function HomePage() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en")
  const t = translations[currentLanguage]

  useEffect(() => {
    document.title = t.metadata.title
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute("content", t.metadata.description)
    }
  }, [currentLanguage, t.metadata.title, t.metadata.description])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-[#F5E6D3] py-20 px-4 overflow-hidden">
        <div className="absolute top-6 right-12 z-20">
          <LanguageSwitcher currentLanguage={currentLanguage} onLanguageChange={setCurrentLanguage} />
        </div>

        {/* Architectural grid pattern background */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#8B7355" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-[#4A3728] mb-6 text-balance">{t.heroTitle}</h1>
            <p className="text-xl md:text-2xl text-[#8B7355] mb-8 max-w-4xl mx-auto text-pretty">{t.heroSubtitle}</p>

            <WaitlistForm
              placeholder={t.waitlistForm.placeholder}
              buttonText={t.waitlistForm.buttonText}
              loadingText={t.waitlistForm.loadingText}
              successMessage={t.waitlistForm.successMessage}
              errorMessages={t.waitlistForm.errorMessages}
              className="mb-8"
            />

            <div className="flex flex-wrap justify-center gap-8 text-[#8B7355] text-sm">
              <span>{t.trustIndicators.launching}</span>
              <span className="hidden sm:inline">|</span>
              <span>{t.trustIndicators.coverage}</span>
              <span className="hidden sm:inline">|</span>
              <span>{t.trustIndicators.timeSaved}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="shadow-sm border-[#8B7355]/10 hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-[#CC6B3D]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-[#CC6B3D]" />
                </div>
                <h3 className="font-semibold text-[#4A3728] mb-2">{t.valueProps.regulatoryDesign.title}</h3>
                <p className="text-[#8B7355] text-sm leading-relaxed">
                  {t.valueProps.regulatoryDesign.description.split("AI").map((part, index) =>
                    index === 0 ? (
                      part
                    ) : (
                      <>
                        <span key={index} className="text-[#CC6B3D] font-semibold">
                          AI
                        </span>
                        {part}
                      </>
                    ),
                  )}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-[#8B7355]/10 hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-[#CC6B3D]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-[#CC6B3D]" />
                </div>
                <h3 className="font-semibold text-[#4A3728] mb-2">{t.valueProps.riskAssessment.title}</h3>
                <p className="text-[#8B7355] text-sm leading-relaxed">
                  {t.valueProps.riskAssessment.description
                    .split(/(\b(?:risks?|风险|riesgos?)\b)/gi)
                    .map((part, index) =>
                      /^(risks?|风险|riesgos?)$/i.test(part) ? (
                        <span key={index} className="text-[#CC6B3D] font-semibold">
                          {part}
                        </span>
                      ) : (
                        part
                      ),
                    )}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-[#8B7355]/10 hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-[#CC6B3D]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-6 h-6 text-[#CC6B3D]" />
                </div>
                <h3 className="font-semibold text-[#4A3728] mb-2">{t.valueProps.costControl.title}</h3>
                <p className="text-[#8B7355] text-sm leading-relaxed">
                  {t.valueProps.costControl.description
                    .split(/(\b(?:budget|costs?|预算|成本|presupuesto|costos?)\b)/gi)
                    .map((part, index) =>
                      /^(budget|costs?|预算|成本|presupuesto|costos?)$/i.test(part) ? (
                        <span key={index} className="text-[#CC6B3D] font-semibold">
                          {part}
                        </span>
                      ) : (
                        part
                      ),
                    )}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-[#8B7355]/10 hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-[#CC6B3D]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-[#CC6B3D]" />
                </div>
                <h3 className="font-semibold text-[#4A3728] mb-2">{t.valueProps.financialAnalysis.title}</h3>
                <p className="text-[#8B7355] text-sm leading-relaxed">
                  {t.valueProps.financialAnalysis.description
                    .split(/(\b(?:ROI|profit|投资回报|利润|beneficio|ganancia)\b)/gi)
                    .map((part, index) =>
                      /^(ROI|profit|投资回报|利润|beneficio|ganancia)$/i.test(part) ? (
                        <span key={index} className="text-[#CC6B3D] font-semibold">
                          {part}
                        </span>
                      ) : (
                        part
                      ),
                    )}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-[#8B7355]/10 hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-[#CC6B3D]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-[#CC6B3D]" />
                </div>
                <h3 className="font-semibold text-[#4A3728] mb-2">{t.valueProps.speedAdvantage.title}</h3>
                <p className="text-[#8B7355] text-sm leading-relaxed">
                  {t.valueProps.speedAdvantage.description
                    .split(/(\b(?:24\s*hours?|24小时|24\s*horas?|first|先机|primero)\b)/gi)
                    .map((part, index) =>
                      /^(24\s*hours?|24小时|24\s*horas?|first|先机|primero)$/i.test(part) ? (
                        <span key={index} className="text-[#CC6B3D] font-semibold">
                          {part}
                        </span>
                      ) : (
                        part
                      ),
                    )}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-[#8B7355]/10 hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-[#CC6B3D]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-[#CC6B3D]" />
                </div>
                <h3 className="font-semibold text-[#4A3728] mb-2">{t.valueProps.aiHumanDriven.title}</h3>
                <p className="text-[#8B7355] text-sm leading-relaxed whitespace-pre-line">
                  {t.valueProps.aiHumanDriven.description
                    .split(/(\b(?:AI|Do more with less|事半功倍|Hacer más con menos)\b)/gi)
                    .map((part, index) =>
                      /^(AI|Do more with less|事半功倍|Hacer más con menos)$/i.test(part) ? (
                        <span key={index} className="text-[#CC6B3D] font-semibold">
                          {part}
                        </span>
                      ) : (
                        part
                      ),
                    )}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sample Report Section */}
      <section className="py-20 px-4 bg-[#F5E6D3]/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#4A3728] mb-8">{t.sampleReportTitle}</h2>

          {/* Report Preview Placeholder */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8 h-[600px] flex items-center justify-center border border-[#8B7355]/10">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#CC6B3D]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-[#CC6B3D]" />
              </div>
              <p className="text-[#8B7355] text-lg">{t.sampleReportLoading}</p>
            </div>
          </div>

          <Button asChild className="bg-[#CC6B3D] hover:bg-[#B85A2E] text-white px-8 py-3">
            <Link
              href="https://xiaoshuaifm.notion.site/ADU-AI-demo-25aa175fa91c8046934ec81ff292435a?pvs=74"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.sampleReportButton}
            </Link>
          </Button>
        </div>
      </section>

      {/* Waitlist Section */}
      <section className="py-20 px-4 bg-[#8B7355]/10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#4A3728] mb-4">{t.waitlistTitle}</h2>
          <p className="text-xl text-[#8B7355] mb-8">{t.waitlistSubtitle}</p>

          <WaitlistForm
            placeholder={t.waitlistForm.placeholder}
            buttonText={t.waitlistForm.buttonText}
            loadingText={t.waitlistForm.loadingText}
            successMessage={t.waitlistForm.successMessage}
            errorMessages={t.waitlistForm.errorMessages}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#4A3728] text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-lg font-semibold mb-2">Impact Bridge AI © 2025</p>
              <p className="text-sm text-[#F5E6D3]">{t.collaborationText}</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 text-center md:text-right">
              <span className="text-[#F5E6D3]">{t.contactEmail}</span>
              <Link href="/privacy" className="text-[#F5E6D3] hover:text-white transition-colors">
                {t.privacyPolicy}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
