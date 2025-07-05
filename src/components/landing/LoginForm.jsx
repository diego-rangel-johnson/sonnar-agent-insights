import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { EyeIcon, EyeOffIcon, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth.jsx";

export default function LoginForm({ onLoginSuccess }) {
  const navigate = useNavigate();
  const { signIn, loading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpar erros quando o usuário começar a digitar
    if (localError) setLocalError("");
  };

  const handleCheckboxChange = (checked) => {
    setFormData((prev) => ({
      ...prev,
      rememberMe: checked,
    }));
  };

  const validateForm = () => {
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
    if (formData.password.length < 6) {
      setLocalError("Senha deve ter pelo menos 6 caracteres");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    
    if (!validateForm()) {
      return;
    }

    try {
      await signIn(formData.email, formData.password);
      
      // Sucesso - o AuthProvider irá redirecionar automaticamente
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (error) {
      console.error("Erro no login:", error);
      
      // Tratar diferentes tipos de erro
      if (error.message.includes("Invalid login credentials")) {
        setLocalError("Email ou senha incorretos");
      } else if (error.message.includes("Email not confirmed")) {
        setLocalError("Verifique seu email para confirmar a conta");
      } else if (error.message.includes("Too many requests")) {
        setLocalError("Muitas tentativas. Tente novamente em alguns minutos");
      } else {
        setLocalError(error.message || "Erro ao fazer login. Tente novamente.");
      }
    }
  };

  const displayError = localError || error;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Entrar</h2>
        <p className="text-white/80">Entre na sua conta para continuar</p>
      </div>

      {displayError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
          <span className="text-red-300 text-sm">{displayError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
          <div className="flex justify-between items-center">
            <Label htmlFor="password" className="text-white">Senha</Label>
            <button 
              type="button"
              className="text-sm text-sky-400 hover:text-sky-300 hover:underline"
              onClick={() => {/* TODO: Implementar reset de senha */}}
            >
              Esqueceu a senha?
            </button>
          </div>
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
              autoComplete="current-password"
              minLength={6}
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
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="remember" 
            checked={formData.rememberMe}
            onCheckedChange={handleCheckboxChange}
            className="border-white/20 data-[state=checked]:bg-sky-600 data-[state=checked]:border-sky-600"
          />
          <label
            htmlFor="remember"
            className="text-sm font-medium leading-none text-white/90 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Lembrar de mim
          </label>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white border-0 shadow-lg"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Entrando...</span>
            </div>
          ) : (
            "Entrar"
          )}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-white/80 text-sm">
          Não tem uma conta?{" "}
          <button className="text-sky-400 hover:text-sky-300 hover:underline font-medium">
            Cadastre-se
          </button>
        </p>
      </div>
    </div>
  );
} 