import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Sparkles, Users, Zap, Heart } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20 pb-12">
        <div className="container px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">About PromptHub</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your one-stop destination for discovering and using amazing AI prompts for creative projects.
            </p>
          </div>

          {/* Mission Section */}
          <section className="mb-12">
            <div className="glass-panel">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                At PromptHub, we believe that creativity should be accessible to everyone. Our mission is to provide a curated collection of high-quality AI prompts that help creators, artists, writers, and developers unlock their creative potential. We're passionate about making AI tools more accessible and helping people create amazing content.
              </p>
            </div>
          </section>

          {/* Features Grid */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">What We Offer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Curated Prompts</h3>
                <p className="text-muted-foreground text-sm">
                  Hand-picked, high-quality prompts for various AI tools including image generators, text models, and more.
                </p>
              </div>

              <div className="glass-card p-6">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Easy to Use</h3>
                <p className="text-muted-foreground text-sm">
                  Simply browse, copy, and paste. Our prompts are ready to use with your favorite AI tools instantly.
                </p>
              </div>

              <div className="glass-card p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Community Driven</h3>
                <p className="text-muted-foreground text-sm">
                  Built by creators, for creators. We continuously add new prompts based on community feedback and trends.
                </p>
              </div>

              <div className="glass-card p-6">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Free to Use</h3>
                <p className="text-muted-foreground text-sm">
                  All our prompts are free to use. We believe in making creativity accessible to everyone.
                </p>
              </div>
            </div>
          </section>

          {/* Story Section */}
          <section className="mb-12">
            <div className="glass-panel">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Our Story</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                PromptHub was born out of a simple idea: to create a place where people can easily find and share prompts for AI tools. As AI technology continues to evolve and become more accessible, we recognized the need for a centralized hub where creators can discover prompts that inspire and elevate their work.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Whether you're a professional designer looking for inspiration, a hobbyist exploring AI art, or a writer seeking creative prompts, PromptHub is here to help you on your creative journey.
              </p>
            </div>
          </section>

          {/* Connect Section */}
          <section>
            <div className="text-center glass-panel">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Connect With Us</h2>
              <p className="text-muted-foreground mb-6">
                Follow us on social media to stay updated with new prompts and features.
              </p>
              <div className="flex justify-center gap-4">
                <a
                  href="https://instagram.com/darmohsin63"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  Instagram
                </a>
                <a
                  href="https://facebook.com/darmohasin13"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  Facebook
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;