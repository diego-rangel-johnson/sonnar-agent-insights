import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { EyeIcon, EyeOffIcon, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth.jsx";

export default function RegisterForm({ onRegisterSuccess }) {
  const navigate = useNavigate();
  const { signUp, loading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpar erros quando o usuário começar a digitar
    if (localError) setLocalError("");
    if (success) setSuccess(false);
  };

  const handleCheckboxChange = (checked) => {
    setFormData((prev) => ({
      ...prev,
      acceptTerms: checked,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setLocalError("Nome é obrigatório");
      return false;
    }
    if (formData.name.trim().length < 2) {
      setLocalError("Nome deve ter pelo menos 2 caracteres");
      return false;
    }
    if (!formData.email) {
      setLocalError("Email é obrigatório");
      return false;
    }
    if (!formData.email.includes("@")) {
      setLocalError("Email inválido");
      return false;
    }
    if (!formData.password) {
      setLocalError("Senha é obrigatória");
      return false;
    }
    if (formData.password.length < 8) {
      setLocalError("Senha deve ter pelo menos 8 caracteres");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setLocalError("As senhas não coincidem");
      return false;
    }
    if (!formData.acceptTerms) {
      setLocalError("Você deve aceitar os termos de uso");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setSuccess(false);
    
    if (!validateForm()) {
      return;
    }

    try {
      const result = await signUp(formData.email, formData.password, {
        full_name: formData.name,
        display_name: formData.name,
      });

      if (result.user && !result.session) {
        // Usuário criado mas precisa confirmar email
        setSuccess(true);
        setLocalError("");
      } else if (result.session) {
        // Usuário criado e já logado
        if (onRegisterSuccess) {
          onRegisterSuccess();
        }
      }
    } catch (error) {
      console.error("Erro no registro:", error);
      
      // Tratar diferentes tipos de erro
      if (error.message.includes("User already registered")) {
        setLocalError("Este email já está cadastrado. Tente fazer login.");
      } else if (error.message.includes("Password should be at least")) {
        setLocalError("A senha deve ter pelo menos 8 caracteres");
      } else if (error.message.includes("Invalid email")) {
        setLocalError("Email inválido");
      } else if (error.message.includes("Signup is disabled")) {
        setLocalError("Cadastro temporariamente indisponível");
      } else {
        setLocalError(error.message || "Erro ao criar conta. Tente novamente.");
      }
    }
  };

  const displayError = localError || error;

  if (success) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Conta Criada!</h2>
          <p className="text-white/80">
            Verifique seu email para confirmar sua conta antes de fazer login.
          </p>
        </div>
        
        <Button 
          onClick={() => window.location.reload()}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 shadow-lg"
        >
          Voltar ao Login
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Criar Conta</h2>
        <p className="text-white/80">Comece sua jornada conosco</p>
      </div>

      {displayError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
          <span className="text-red-300 text-sm">{displayError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white">Nome Completo</Label>
          <Input 
            id="name"
            name="name"
            type="text"
            placeholder="Seu nome completo" 
            value={formData.name}
            onChange={handleChange}
            className="bg-black/30 border-white/20 text-white placeholder:text-white/50 focus:ring-sky-500 focus:border-sky-500"
            required
            autoComplete="name"
            minLength={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">Email</Label>
          <Input 
            id="email"
            name="email"
            type="email"
            placeholder="seu@email.com" 
            value={formData.email}
            onChange={handleChange}
            className="bg-black/30 border-white/20 text-white placeholder:text-white/50 focus:ring-sky-500 focus:border-sky-500"
            required
            autoComplete="email"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password" className="text-white">Senha</Label>
          <div className="relative">
            <Input 
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••" 
              value={formData.password}
              onChange={handleChange}
              className="bg-black/30 border-white/20 text-white placeholder:text-white/50 focus:ring-sky-500 focus:border-sky-500"
              required
              autoComplete="new-password"
              minLength={8}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOffIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="text-xs text-white/70">
            A senha deve ter pelo menos 8 caracteres
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-white">Confirmar Senha</Label>
          <Input 
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••" 
            value={formData.confirmPassword}
            onChange={handleChange}
            className="bg-black/30 border-white/20 text-white placeholder:text-white/50 focus:ring-sky-500 focus:border-sky-500"
            required
            autoComplete="new-password"
            minLength={8}
          />
        </div>
        
        <div className="flex items-start space-x-2">
          <Checkbox 
            id="terms" 
            checked={formData.acceptTerms}
            onCheckedChange={handleCheckboxChange}
            className="border-white/20 data-[state=checked]:bg-sky-600 data-[state=checked]:border-sky-600 mt-0.5"
          />
          <label
            htmlFor="terms"
            className="text-sm leading-none text-white/90 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Aceito os{" "}
            <button 
              type="button"
              className="text-sky-400 hover:text-sky-300 hover:underline"
            >
              termos de uso
            </button>
            {" "}e{" "}
            <button 
              type="button"
              className="text-sky-400 hover:text-sky-300 hover:underline"
            >
              política de privacidade
            </button>
          </label>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white border-0 shadow-lg"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Criando conta...</span>
            </div>
          ) : (
            "Criar Conta"
          )}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-white/80 text-sm">
          Já tem uma conta?{" "}
          <button className="text-sky-400 hover:text-sky-300 hover:underline font-medium">
            Fazer login
          </button>
        </p>
      </div>
    </div>
  );
} 