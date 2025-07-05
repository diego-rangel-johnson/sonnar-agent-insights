import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, LineChart, MessageSquare, Shield, Zap } from "lucide-react";

// Componentes para a Landing Page
import LoginForm from "@/components/landing/LoginForm";
import RegisterForm from "@/components/landing/RegisterForm";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("login");

  const handleGetStarted = () => {
    setActiveTab("register");
  };

  const features = [
    {
      icon: <MessageSquare className="h-10 w-10 text-white" />,
      title: "Gerenciamento de Canais",
      description: "Centralize todos os seus canais de comunicação em uma única plataforma intuitiva."
    },
    {
      icon: <Shield className="h-10 w-10 text-white" />,
      title: "Segurança Avançada",
      description: "Proteção de dados e conformidade com LGPD e outras regulamentações internacionais."
    },
    {
      icon: <Zap className="h-10 w-10 text-white" />,
      title: "IA Integrada",
      description: "Automatize respostas e obtenha insights preditivos com nossos agentes de IA."
    },
    {
      icon: <LineChart className="h-10 w-10 text-white" />,
      title: "Análise Detalhada",
      description: "Dashboards interativos e relatórios personalizados para otimizar seu atendimento."
    }
  ];

  const testimonials = [
    {
      name: "Maria Silva",
      role: "Gerente de Atendimento",
      company: "TechCorp",
      content: "A plataforma revolucionou nosso atendimento. Reduzimos o tempo de resposta em 60% e aumentamos a satisfação do cliente.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b589?w=64&h=64&fit=crop&crop=face"
    },
    {
      name: "João Santos",
      role: "CTO",
      company: "StartupXYZ",
      content: "Os insights de IA nos ajudaram a identificar padrões que não conseguíamos ver antes. Impressionante!",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face"
    },
    {
      name: "Ana Costa",
      role: "Diretora de Operações", 
      company: "E-commerce Plus",
      content: "Integração perfeita com nossos sistemas existentes. A equipe se adaptou rapidamente.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 text-white">
      {/* Header com fundo semi-transparente */}
      <header className="py-6 px-4 md:px-8 flex justify-between items-center max-w-7xl mx-auto backdrop-blur-sm bg-black/10 rounded-b-2xl shadow-lg border border-white/10">
        <div className="flex items-center">
          <img src="/logo.png" alt="Logo" className="h-12 w-auto" />
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-white/90 hover:text-white font-medium transition">Recursos</a>
          <a href="#testimonials" className="text-white/90 hover:text-white font-medium transition">Depoimentos</a>
          <a href="#pricing" className="text-white/90 hover:text-white font-medium transition">Preços</a>
        </nav>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => setActiveTab("login")} 
            className="text-white bg-gradient-to-r from-blue-500/20 to-sky-500/20 hover:from-blue-500/40 hover:to-sky-500/40">Login</Button>
          <Button 
            className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white border-0 shadow-lg" 
            onClick={() => setActiveTab("register")}>
            Cadastre-se
          </Button>
        </div>
      </header>

      {/* Hero Section com efeito visual aprimorado */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto relative overflow-hidden">
        {/* Efeitos de background */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-indigo-500 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-96 bg-blue-500 rounded-full filter blur-3xl opacity-10"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="space-y-6"
          >
            <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium mb-2">
              Plataforma All-in-One para Atendimento ao Cliente
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white">
              Revolucione seu <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-400">atendimento</span> com IA
            </h1>
            <p className="text-xl text-white/90">
              Centralize seus canais, automatize respostas e transforme dados em insights valiosos para uma experiência de cliente excepcional.
            </p>
            
            <div className="flex items-center gap-4 flex-wrap">
              <Button 
                size="lg" 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white border-0 shadow-lg group"
              >
                Começar Agora
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="text-white border-white/20 bg-white/10 hover:bg-white/20 backdrop-blur-sm"
              >
                Ver Demo
              </Button>
            </div>
            
            <div className="flex items-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold">98%</div>
                <div className="text-sm text-white/70">Satisfação</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">-60%</div>
                <div className="text-sm text-white/70">Tempo Resposta</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm text-white/70">Empresas</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="relative"
          >
            <div className="bg-black/20 backdrop-blur-md p-1 rounded-2xl border border-white/10 shadow-2xl">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                {activeTab === "login" ? (
                  <LoginForm />
                ) : (
                  <RegisterForm />
                )}
              </div>
            </div>
            
            {/* Elementos decorativos */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-purple-500 rounded-full filter blur-xl opacity-60"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-fuchsia-500 rounded-full filter blur-xl opacity-60"></div>
          </motion.div>
        </div>
      </section>

      {/* Interface Preview */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none"></div>
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="text-center mb-12 relative z-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Interface <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-400">Intuitiva</span></h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Uma plataforma completa para gerenciar todos os aspectos do seu atendimento ao cliente com facilidade.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="relative z-10 rounded-xl overflow-hidden shadow-2xl border border-white/10"
        >
          <div className="bg-black/30 backdrop-blur-md p-2 md:p-4">
            <img 
              src="/tela.png" 
              alt="Interface da plataforma" 
              className="w-full rounded-lg shadow-lg"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
            <div className="p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Dashboard Completo</h3>
              <p className="text-white/90">
                Visualize seus dados, gerencie canais e acompanhe o desempenho dos seus agentes em um só lugar.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Estatísticas */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 relative z-10"
        >
          {[
            { label: "Mensagens/dia", value: "50K+" },
            { label: "Tempo médio", value: "2.3s" },
            { label: "Resolução", value: "94%" },
            { label: "Satisfação", value: "4.8/5" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10"
            >
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-white/70">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features com grid melhorado */}
      <section id="features" className="py-20 px-4 md:px-8 max-w-7xl mx-auto relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none"></div>
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="text-center mb-16 relative z-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Recursos <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-400">Poderosos</span></h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Tudo o que você precisa para revolucionar seu atendimento ao cliente e impulsionar seus resultados.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              className="bg-gradient-to-br from-black/20 to-black/10 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-white/20 hover:shadow-xl transition group"
              whileHover={{ y: -5 }}
            >
              <div className="mb-4 bg-gradient-to-br from-purple-600 to-fuchsia-600 p-3 rounded-lg inline-block group-hover:scale-110 transition duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-white/90">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Testimonials com design melhorado */}
      <section id="testimonials" className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">O que nossos clientes dizem</h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Empresas de todos os tamanhos confiam em nossa plataforma para transformar seu atendimento.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              className="bg-gradient-to-br from-black/20 to-black/10 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-white/20 hover:shadow-xl transition"
            >
              <p className="text-white/90 mb-6 leading-relaxed">"{testimonial.content}"</p>
              <div className="flex items-center gap-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-white/70">{testimonial.role}, {testimonial.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Planos Simples e Transparentes</h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Escolha o plano que melhor se adapta às necessidades da sua empresa.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            {
              name: "Inicial",
              price: "99",
              description: "Ideal para pequenas empresas e startups",
              features: [
                "2 canais integrados",
                "1.000 mensagens por mês",
                "Análise básica de dados",
                "Chatbot com respostas pré-definidas",
                "Suporte por email"
              ]
            },
            {
              name: "Profissional",
              price: "199",
              description: "Ideal para empresas em crescimento",
              popular: true,
              features: [
                "5 canais integrados",
                "5.000 mensagens por mês",
                "Análise avançada de dados",
                "Agentes de IA personalizados",
                "Suporte prioritário"
              ]
            },
            {
              name: "Enterprise",
              price: "Personalizado",
              description: "Para grandes empresas com necessidades específicas",
              features: [
                "Canais ilimitados",
                "Mensagens ilimitadas",
                "IA customizada",
                "Integração personalizada",
                "Suporte dedicado 24/7"
              ]
            }
          ].map((plan, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              className={`bg-gradient-to-br from-black/20 to-black/10 backdrop-blur-sm p-8 rounded-xl border transition relative ${
                plan.popular 
                  ? 'border-purple-500 shadow-purple-500/20 shadow-xl scale-105' 
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Mais Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-white/70 mb-4">{plan.description}</p>
                <div className="text-4xl font-bold text-white mb-1">
                  {plan.price !== "Personalizado" && "R$"}{plan.price}
                  {plan.price !== "Personalizado" && <span className="text-lg text-white/70">/mês</span>}
                </div>
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-white/90">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className={`w-full ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700' 
                    : 'bg-white/20 hover:bg-white/30 border border-white/20'
                } text-white border-0 shadow-lg`}
                onClick={() => setActiveTab("register")}
              >
                {plan.price === "Personalizado" ? "Entrar em Contato" : "Começar Agora"}
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-r from-blue-900 to-purple-900 text-white">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="max-w-7xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Pronto para transformar seu atendimento?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Junte-se a milhares de empresas que já estão melhorando a experiência de seus clientes com nossa plataforma.
          </p>
          <Button
            size="lg"
            onClick={() => setActiveTab("register")}
            className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white border-0 shadow-lg"
            whileHover={{ scale: 1.05 }}
            as={motion.button}
          >
            Começar gratuitamente
          </Button>
        </motion.div>
      </section>

      {/* Footer modernizado */}
      <footer className="py-12 px-4 md:px-8 border-t border-white/10 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <img src="/logo.png" alt="Logo" className="h-10 w-auto mb-4" />
              <p className="text-white/70 text-sm">
                Revolucionando o atendimento ao cliente com tecnologia de ponta e inteligência artificial.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#" className="hover:text-white transition">Recursos</a></li>
                <li><a href="#" className="hover:text-white transition">Preços</a></li>
                <li><a href="#" className="hover:text-white transition">Integrações</a></li>
                <li><a href="#" className="hover:text-white transition">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#" className="hover:text-white transition">Sobre</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Carreiras</a></li>
                <li><a href="#" className="hover:text-white transition">Contato</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#" className="hover:text-white transition">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white transition">Documentação</a></li>
                <li><a href="#" className="hover:text-white transition">Status</a></li>
                <li><a href="#" className="hover:text-white transition">Comunidade</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/70 text-sm">© {new Date().getFullYear()} Todos os direitos reservados.</p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <a href="#" className="text-white/70 hover:text-white text-sm transition">Termos</a>
              <a href="#" className="text-white/70 hover:text-white text-sm transition">Privacidade</a>
              <a href="#" className="text-white/70 hover:text-white text-sm transition">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 