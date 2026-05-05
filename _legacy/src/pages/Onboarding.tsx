import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Upload, Wand2, QrCode, Smartphone, Rocket, Check, ArrowRight, ArrowLeft, FileText, Camera, Loader2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
  { icon: Upload, label: "Importer le menu" },
  { icon: Wand2, label: "IA structure" },
  { icon: QrCode, label: "QR Code" },
  { icon: Smartphone, label: "Aperçu mobile" },
  { icon: Rocket, label: "Mise en ligne" },
];

const Onboarding = () => {
  const [step, setStep] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const progress = ((step + 1) / steps.length) * 100;

  const simulateUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setStep(1);
      setProcessing(true);
      setTimeout(() => {
        setProcessing(false);
        setStep(2);
      }, 2000);
    }, 1500);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="text-center max-w-lg mx-auto animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full glass-warm px-3 py-1 mb-4">
              <Sparkles className="w-3 h-3 text-primary" />
              <span className="text-xs text-muted-foreground">Étape 1 sur 5</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Importez votre menu</h2>
            <p className="text-muted-foreground mb-8">Glissez un PDF, prenez une photo ou tapez-le manuellement. Notre IA fait le reste.</p>
            <div
              className="rounded-2xl border-2 border-dashed border-border hover:border-primary/50 bg-secondary/30 p-12 transition-all cursor-pointer group hover:shadow-warm"
              onClick={simulateUpload}
            >
              {uploading ? (
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-12 h-12 text-primary animate-spin" />
                  <p className="text-sm text-muted-foreground">Upload en cours...</p>
                  <div className="w-48 bg-secondary rounded-full h-1.5 overflow-hidden">
                    <div className="h-full bg-gradient-warm rounded-full animate-shimmer" style={{ width: "60%" }} />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-warm-subtle flex items-center justify-center group-hover:bg-gradient-warm transition-all duration-300 group-hover:shadow-warm group-hover:scale-110">
                    <Upload className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Cliquez ou glissez votre menu ici</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG — Max 20MB</p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-center gap-4 mt-6">
              <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors focus-ring rounded-lg px-3 py-1.5">
                <Camera className="w-4 h-4" /> Prendre une photo
              </button>
              <span className="text-muted-foreground/30">|</span>
              <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors focus-ring rounded-lg px-3 py-1.5">
                <FileText className="w-4 h-4" /> Saisie manuelle
              </button>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="text-center max-w-lg mx-auto animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full glass-warm px-3 py-1 mb-4">
              <Wand2 className="w-3 h-3 text-primary" />
              <span className="text-xs text-muted-foreground">Étape 2 sur 5</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">L'IA structure votre menu</h2>
            <p className="text-muted-foreground mb-8">Notre IA analyse, catégorise et optimise votre menu automatiquement.</p>
            <div className="rounded-2xl border border-border bg-gradient-card p-8">
              {processing ? (
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-12 h-12 text-primary animate-spin" />
                  <p className="text-sm text-muted-foreground">Analyse en cours...</p>
                  <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-gradient-warm rounded-full animate-shimmer" style={{ width: "70%" }} />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-left">
                  {[
                    { text: "12 plats détectés", delay: "0ms" },
                    { text: "4 catégories créées", delay: "100ms" },
                    { text: "Prix analysés", delay: "200ms" },
                    { text: "Traduction FR/EN/ES prête", delay: "300ms" },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-3 animate-fade-up" style={{ animationDelay: item.delay }}>
                      <div className="w-6 h-6 rounded-full bg-gradient-warm flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 text-primary-foreground" />
                      </div>
                      <span className="text-sm text-foreground">{item.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="text-center max-w-lg mx-auto animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full glass-warm px-3 py-1 mb-4">
              <QrCode className="w-3 h-3 text-primary" />
              <span className="text-xs text-muted-foreground">Étape 3 sur 5</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Votre QR Code est prêt</h2>
            <p className="text-muted-foreground mb-8">Scannez-le pour voir votre menu en direct.</p>
            <div className="rounded-2xl border border-border bg-gradient-card p-8 inline-block mx-auto relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-warm-subtle blur-xl opacity-50" />
              <div className="relative w-48 h-48 mx-auto rounded-xl bg-foreground/90 p-4 flex items-center justify-center">
                <QrCode className="w-full h-full text-background" />
              </div>
              <p className="relative text-xs text-muted-foreground mt-4">lepetitbistro.tableo.app</p>
            </div>
            <div className="flex items-center justify-center gap-4 mt-6">
              <button className="text-sm text-primary font-medium hover:underline transition-all focus-ring rounded-lg px-3 py-1.5">Télécharger PNG</button>
              <span className="text-muted-foreground/30">|</span>
              <button className="text-sm text-primary font-medium hover:underline transition-all focus-ring rounded-lg px-3 py-1.5">Personnaliser</button>
              <span className="text-muted-foreground/30">|</span>
              <button className="text-sm text-primary font-medium hover:underline transition-all focus-ring rounded-lg px-3 py-1.5">Imprimer</button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="text-center max-w-lg mx-auto animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full glass-warm px-3 py-1 mb-4">
              <Smartphone className="w-3 h-3 text-primary" />
              <span className="text-xs text-muted-foreground">Étape 4 sur 5</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Aperçu mobile</h2>
            <p className="text-muted-foreground mb-8">Voici comment vos clients verront votre menu.</p>
            <div className="mx-auto w-[260px] rounded-[28px] border-2 border-border bg-card overflow-hidden shadow-card relative">
              <div className="absolute -inset-6 rounded-[36px] bg-gradient-warm-subtle blur-2xl opacity-30" />
              <div className="relative">
                {/* Dynamic island */}
                <div className="flex justify-center pt-2">
                  <div className="w-16 h-4 rounded-full bg-background border border-border" />
                </div>
                <div className="px-4 py-2 text-xs text-muted-foreground flex justify-between">
                  <span className="font-medium">9:41</span>
                  <span>100%</span>
                </div>
                <div className="px-4 pb-2">
                  <h3 className="text-sm font-bold text-foreground">Le Petit Bistro</h3>
                  <p className="text-[10px] text-muted-foreground">Menu du soir • Table 7</p>
                </div>
                <div className="space-y-2 px-4 pb-4">
                  {[
                    { name: "Saumon Mi-Cuit", price: "24€", tag: "★" },
                    { name: "Risotto Truffe", price: "28€", tag: "🔥" },
                    { name: "Fondant Chocolat", price: "14€", tag: "❤️" },
                  ].map((d) => (
                    <div key={d.name} className="rounded-lg bg-secondary/50 p-2.5 text-xs text-foreground flex items-center justify-between">
                      <span>{d.name}</span>
                      <span className="flex items-center gap-1.5">
                        <span className="text-[10px]">{d.tag}</span>
                        <span className="font-bold text-gradient-warm">{d.price}</span>
                      </span>
                    </div>
                  ))}
                </div>
                {/* Home indicator */}
                <div className="flex justify-center pb-2">
                  <div className="w-24 h-1 rounded-full bg-foreground/20" />
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center max-w-lg mx-auto animate-fade-up">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              {done ? "🎉 Vous êtes en ligne !" : "Prêt à lancer ?"}
            </h2>
            <p className="text-muted-foreground mb-8">
              {done
                ? "Votre menu est accessible par vos clients. Bienvenue sur Tableo !"
                : "Un clic et votre menu est accessible à tous vos clients."}
            </p>
            {done ? (
              <div className="space-y-4">
                <div className="rounded-2xl glass-warm p-6 text-left space-y-3">
                  {[
                    { text: "Menu en ligne", emoji: "✅" },
                    { text: "QR code actif", emoji: "📱" },
                    { text: "Analytics activés", emoji: "📊" },
                    { text: "Revenue Engine prêt", emoji: "🚀" },
                  ].map((i) => (
                    <div key={i.text} className="flex items-center gap-3">
                      <span className="text-sm">{i.emoji}</span>
                      <span className="text-sm text-foreground font-medium">{i.text}</span>
                    </div>
                  ))}
                </div>
                <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-xl bg-gradient-warm px-8 py-3 text-sm font-semibold text-primary-foreground shadow-warm hover:scale-[1.02] transition-all focus-ring">
                  Accéder au dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <button
                onClick={() => setDone(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-warm px-8 py-4 text-base font-semibold text-primary-foreground shadow-warm transition-all hover:scale-[1.03] hover:shadow-glow-warm focus-ring"
              >
                <Rocket className="w-5 h-5" />
                Mettre en ligne maintenant
              </button>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background noise-overlay">
      <Navbar />
      <div className="pt-20 pb-12" style={{ zIndex: 2, position: 'relative' }}>
        <div className="container mx-auto px-6 max-w-3xl">
          {/* Progress with connecting lines */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4 relative">
              {/* Connecting line */}
              <div className="absolute top-5 left-0 right-0 h-px bg-border" />
              <div
                className="absolute top-5 left-0 h-px bg-gradient-warm transition-all duration-700"
                style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
              />
              {steps.map((s, i) => (
                <div key={s.label} className="flex flex-col items-center gap-2 relative">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                      i <= step ? "bg-gradient-warm shadow-warm scale-110" : "bg-secondary"
                    }`}
                  >
                    {i < step ? (
                      <Check className="w-5 h-5 text-primary-foreground" />
                    ) : (
                      <s.icon className={`w-5 h-5 ${i <= step ? "text-primary-foreground" : "text-muted-foreground"}`} />
                    )}
                  </div>
                  <span className={`text-[10px] font-medium hidden sm:block transition-colors ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-gradient-warm rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">{Math.round(progress)}% complété</p>
          </div>

          {/* Step content */}
          <div className="min-h-[400px] flex items-center justify-center">
            {renderStep()}
          </div>

          {/* Navigation */}
          {step > 0 && !uploading && !processing && (
            <div className="flex items-center justify-between mt-12">
              <button
                onClick={() => setStep(Math.max(0, step - 1))}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors focus-ring rounded-lg px-3 py-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Retour
              </button>
              {step < 4 && (
                <button
                  onClick={() => setStep(Math.min(4, step + 1))}
                  className="flex items-center gap-2 rounded-lg bg-gradient-warm px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:scale-[1.02] transition-all focus-ring"
                >
                  Suivant <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
