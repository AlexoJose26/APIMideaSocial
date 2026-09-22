import { createApp } from "./server";

console.log("1. Iniciando API MedeaSocial...");

async function main() {
  try {
    console.log("2. Criando aplicação...");

    const app = createApp();

    console.log("3. Aplicação criada.");

    const port = Number(process.env.PORT) || 3000;

    console.log(`4. Tentando iniciar servidor na porta ${port}...`);

    app.listen({
      port,
      hostname: "0.0.0.0",
    });

    console.log(`5. API MedeaSocial iniciada em http://localhost:${port}`);
  } catch (err) {
    console.error("ERRO AO INICIAR API:");
    console.error(err);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("ERRO FATAL:");
  console.error(err);
  process.exit(1);
});
