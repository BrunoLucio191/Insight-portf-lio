import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.admin.js";


//configura o acesso ao arquivo .env do backend
dotenv.config();

//configuracao padrao do back
const app = express();

//configuracao do cors pra permitir que o back e front estejam em portas diferentes
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

//mais configuracoes do node, habilitando a leitura de json em requests e cookies
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

//rotas usadas para autenticação
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running at the port ${PORT}`);
});
