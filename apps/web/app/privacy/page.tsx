import Link from 'next/link';
import { Dog } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b-4 border-orange-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="inline-flex items-center space-x-3 text-gray-700 hover:text-orange-500 font-semibold">
            <div className="bg-gradient-to-br from-orange-400 to-pink-500 p-3 rounded-2xl shadow-lg">
              <Dog className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                Woof Spots
              </h1>
              <p className="text-xs text-orange-600 font-semibold">🐾 Dog Care Directory</p>
            </div>
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-5xl font-black mb-8">Privacy Policy</h1>

        <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-3">Information We Collect</h2>
            <p className="text-gray-700 mb-3">
              Woof Spots collects information to provide better services to our users. We collect the following types of information:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Contest Submissions:</strong> When you enter our monthly contest, we collect your pup's name, your name, email address, optional daycare name, city, state, photo, and caption.</li>
              <li><strong>Email Communications:</strong> If you sign up for our newsletter or contest notifications, we collect your email address.</li>
              <li><strong>Usage Data:</strong> We automatically collect information about how you interact with our site, including IP address for rate limiting and abuse prevention.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">How We Use Your Information</h2>
            <p className="text-gray-700 mb-3">
              We use the information we collect for the following purposes:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Contest Administration:</strong> To manage contest entries, voting, and prize distribution</li>
              <li><strong>Communication:</strong> To send contest updates, winner announcements, and optional newsletter content</li>
              <li><strong>Fraud Prevention:</strong> IP tracking for rate limiting and preventing abuse (e.g., vote manipulation)</li>
              <li><strong>Service Improvement:</strong> To understand how users interact with our platform and improve our services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">Email Marketing & Consent</h2>
            <p className="text-gray-700 mb-3">
              When you submit a contest entry, you may opt-in to receive:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Contest winner announcements</li>
              <li>Future contest notifications</li>
              <li>Dog care tips and resources</li>
            </ul>
            <p className="text-gray-700 mt-3">
              You can unsubscribe from our emails at any time using the unsubscribe link in any email we send.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">Data Storage & Security</h2>
            <p className="text-gray-700">
              Your data is stored securely on Vercel's infrastructure with industry-standard encryption. We retain contest data for the duration of the contest period and winner announcement. Email addresses are retained until you unsubscribe. We do not sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">IP Tracking & Rate Limiting</h2>
            <p className="text-gray-700">
              We track IP addresses to prevent voting abuse and ensure fair contest results. This includes:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Rate limiting voting to 10 votes per hour per IP address</li>
              <li>Detecting and blocking automated voting scripts</li>
              <li>IP data is stored temporarily and not used for any other purpose</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">Third-Party Services</h2>
            <p className="text-gray-700 mb-3">
              We use the following third-party services:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>UploadThing:</strong> For secure photo uploads</li>
              <li><strong>Resend:</strong> For sending email notifications</li>
              <li><strong>Vercel:</strong> For hosting and database services</li>
            </ul>
            <p className="text-gray-700 mt-3">
              These services have their own privacy policies governing their use of your information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">Your Rights</h2>
            <p className="text-gray-700">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Request access to your personal data</li>
              <li>Request deletion of your personal data</li>
              <li>Opt-out of email communications at any time</li>
              <li>Withdraw contest submissions (contact us before voting period ends)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">Children's Privacy</h2>
            <p className="text-gray-700">
              Our service is not directed to children under 13. We do not knowingly collect personal information from children under 13. If you are a parent and believe your child has provided us with personal information, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">Changes to This Policy</h2>
            <p className="text-gray-700">
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.
            </p>
            <p className="text-gray-700 mt-3">
              <strong>Last Updated:</strong> January 2025
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">Contact Us</h2>
            <p className="text-gray-700">
              If you have questions about this privacy policy or how we handle your data, please contact us through our website.
            </p>
          </section>
        </div>

        <div className="text-center mt-8">
          <Link href="/" className="text-orange-500 hover:underline font-bold">
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 border-t-4 border-orange-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="bg-gradient-to-br from-orange-400 to-pink-500 p-2 rounded-xl">
                <Dog className="w-6 h-6 text-white" />
              </div>
              <span className="font-black text-lg">Woof Spots</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2025 Made with 🐾 and ❤️ for dogs everywhere
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
