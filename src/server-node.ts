import { serve } from "bun";

serve({
  port: process.env.PORT || 3000,
  fetch() {
    return new Response("API APIMideaSocial online");
  },
});
