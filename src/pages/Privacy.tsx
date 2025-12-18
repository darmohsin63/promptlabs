import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20 pb-12">
        <div className="container px-4 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
          
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
            <p className="text-muted-foreground leading-relaxed">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                PromptHub ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">2. Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may collect information about you in a variety of ways:
              </p>
              <h3 className="text-lg font-medium text-foreground">Personal Data</h3>
              <p className="text-muted-foreground leading-relaxed">
                When you register for an account, we may collect personally identifiable information, such as your name, email address, and any other information you voluntarily provide.
              </p>
              <h3 className="text-lg font-medium text-foreground">Usage Data</h3>
              <p className="text-muted-foreground leading-relaxed">
                We may automatically collect certain information when you visit our website, including your IP address, browser type, operating system, access times, and the pages you have viewed.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">3. Use of Your Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may use the information we collect about you to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Create and manage your account</li>
                <li>Provide and maintain our service</li>
                <li>Improve and personalize your experience</li>
                <li>Communicate with you about updates and changes</li>
                <li>Monitor and analyze usage patterns</li>
                <li>Protect against unauthorized access and legal liability</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">4. Disclosure of Your Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may share information we have collected about you in certain situations:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong>By Law or to Protect Rights:</strong> If required by law or to respond to legal process</li>
                <li><strong>Business Transfers:</strong> In connection with any merger, sale, or acquisition</li>
                <li><strong>With Your Consent:</strong> With your explicit permission for any other purpose</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">5. Security of Your Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use administrative, technical, and physical security measures to protect your personal information. While we have taken reasonable steps to secure the information you provide, please be aware that no security measures are perfect, and no method of data transmission can be guaranteed against interception.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">6. Cookies and Tracking</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may use cookies and similar tracking technologies to access or store information. You can set your browser to refuse all or some browser cookies. If you disable or refuse cookies, some parts of our website may become inaccessible or not function properly.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">7. Third-Party Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our website may contain links to third-party websites and services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies before providing any personal information.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">8. Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed">
                Depending on your location, you may have certain rights regarding your personal information, including the right to access, correct, delete, or export your data. To exercise these rights, please contact us.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">9. Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">10. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions or comments about this Privacy Policy, please contact us through our social media channels.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;