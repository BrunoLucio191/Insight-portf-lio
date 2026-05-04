import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/Home/HomePage";
import Admin from "./components/Admin/Admin";
import Painel from "./components/admin/painel";
import AuthProvider from "./components/Auth/AuthProvider";
import axios from 'axios';
import { useEffect ,useState } from "react";

axios.defaults.withCredentials = true;

function App() {

  //State do react que valide se o user esta logado ou não, quando o user loga ele recebe um token que fica 
  //guardado nos cookies do navegador, se o usuario ja estiver logado, o valor de setUser vai ser diferente de null
  
  const [users, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  

  //hook do react que roda a funcao fetchUser uma vez quando a pagina e renderizada, se esse get não retornar nada user
  //fica como null
  
  useEffect(() => {
    const fetchUser = async () => {
      try{
        const res = await axios.get('http://localhost:3000/api/auth/me')
        setUser(res.data);
      }catch(error){
        setUser(null)
        console.log(error);
      }
    }
    fetchUser();
  }, []);
   return (

    //A rota painel é protegida por um component, esse component usa
    //o valor de users para liberar o acesso da rota painel, aqui ta a sacada legal
    //se nao exister token salvo nos cookies, nao existe resposta pro get acima
    //logo user === null
    
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<Admin setUser={setUser} />} />
        <Route path="/painel" element={<AuthProvider setUser={users}><Painel/> </AuthProvider>} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
