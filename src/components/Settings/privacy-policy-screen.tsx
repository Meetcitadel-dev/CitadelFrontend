

import { useState } from "react"
import SettingsHeader from "./settings-header"
// import SettingsHeader from "./settings-header"

interface PrivacyPolicyScreenProps {
  onBack?: () => void
}

export default function PrivacyPolicyScreen({ onBack }: PrivacyPolicyScreenProps) {
  const [activeTab, setActiveTab] = useState<"privacy" | "terms">("privacy")

  const content = `Unlike Privacy Policies, which are required by laws such as the GDPR, CalOPPA and many others, there's no law or regulation on Terms and Conditions.

However, having a Terms and Conditions gives you the right to terminate the access of abusive users or to terminate the access to users who do not follow your rules and guidelines, as well as other desirable business benefits.

It's extremely important to have this agreement if you operate a SaaS app.

Here are a few examples of how this agreement can help you:

• If users abuse your website or mobile app in any way, you can terminate their account. Your "Termination" clause can inform users that their account would be terminated if they abuse your service.

• If users can post content on your website or mobile app (create content and share it on your platform), you can remove any content they created if it infringes copyright. Your Terms and Conditions will inform users that they can only create and/or share content they own rights to. Similarly, if users can register for an account and choose a username, you can inform users that they are not allowed to choose usernames that may infringe trademarks, i.e. usernames like Google, Facebook, and so on.

• If you sell products or services, you could cancel specific orders if a product price is incorrect. Your Terms and Conditions can include a clause to inform users that certain orders, at your sole discretion, can be cancelled if the products ordered have incorrect prices due to various`

  return (
    <div className="w-full min-h-screen bg-black">
      <SettingsHeader title="Privacy policy and T&C" onBack={onBack} />

      <div className="px-4 pt-6">
        <div className="flex gap-8 mb-6">
          <button
            onClick={() => setActiveTab("privacy")}
            className={`pb-2 text-base font-medium relative ${
              activeTab === "privacy" ? "text-white" : "text-gray-400"
            }`}
          >
            Privacy policy
            {activeTab === "privacy" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("terms")}
            className={`pb-2 text-base font-medium relative ${activeTab === "terms" ? "text-white" : "text-gray-400"}`}
          >
            Terms and conditions
            {activeTab === "terms" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />}
          </button>
        </div>

        <div className="pb-8">
          <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{content}</div>
        </div>
      </div>
    </div>
  )
}
