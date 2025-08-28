"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

interface LanguageSwitcherProps {
  currentLanguage: string
  onLanguageChange: (language: string) => void
}

export function LanguageSwitcher({ currentLanguage, onLanguageChange }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    { code: "en", name: "English" },
    { code: "zh", name: "中文" },
    { code: "es", name: "Español" },
  ]

  const currentLang = languages.find((lang) => lang.code === currentLanguage) || languages[0]

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        size="lg"
        className="bg-white/90 backdrop-blur-sm border-[#8B7355]/20 hover:bg-white hover:border-[#CC6B3D] text-[#4A3728] font-semibold px-8 py-4 text-xl shadow-sm"
      >
        <Globe className="w-6 h-6 mr-3" />
        {currentLang.name}
      </Button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-lg border border-[#8B7355]/20 overflow-hidden z-50 min-w-[192px]">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => {
                onLanguageChange(language.code)
                setIsOpen(false)
              }}
              className={`w-full px-5 py-4 text-left text-lg hover:bg-[#F5E6D3] transition-colors ${
                currentLanguage === language.code ? "bg-[#F5E6D3] text-[#CC6B3D] font-semibold" : "text-[#4A3728]"
              }`}
            >
              {language.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
