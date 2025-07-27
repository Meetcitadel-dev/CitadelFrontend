import { useState } from "react"
import { Edit, Phone } from "lucide-react"
// import SettingsHeader from "./settings-header"
import HelpSupportCard from "./help-support-card"
import FAQItem from "./faq-item"
import SettingsHeader from "./settings-header"

interface HelpSupportScreenProps {
  onBack?: () => void
  onWriteQuery?: () => void
}

export default function HelpSupportScreen({ onBack, onWriteQuery }: HelpSupportScreenProps) {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(2)

  const faqItems = [
    {
      question: "Understanding Stock Market Hours",
      answer: "",
    },
    {
      question: "Is The Stock Market Open On Weekends?",
      answer: "",
    },
    {
      question: "Is The Stock Market Open On Weekends?",
      answer:
        "Open the Tradebase app to get started and follow the steps. Tradebase doesn't charge a fee to create or maintain your Tradebase account.",
    },
    {
      question: "Impact of Holidays on Trading Days",
      answer: "",
    },
    {
      question: "Understanding Stock Market Hours",
      answer: "",
    },
  ]

  const handleFAQToggle = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index)
  }

  return (
    <div className="w-full min-h-screen bg-black">
      <SettingsHeader title="Help & Support" onBack={onBack} />

      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-8">
          <HelpSupportCard icon={Edit} title="Write to us with your query" onClick={onWriteQuery} />
          <HelpSupportCard icon={Phone} title="Call us with your query" />
        </div>

        <div>
          <h2 className="text-white text-lg font-medium mb-4">Frequently Asked Questions</h2>
          <div className="bg-gray-900 rounded-2xl p-4">
            {faqItems.map((item, index) => (
              <FAQItem
                key={index}
                question={item.question}
                answer={item.answer}
                isExpanded={expandedFAQ === index}
                onToggle={() => handleFAQToggle(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
