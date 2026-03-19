document.addEventListener('DOMContentLoaded', function() {
    // 1. Verificação de Segurança das Configurações
    if (!window.supabase || !window.supabaseConfig) {
        console.error('Erro: Supabase não configurado corretamente no head da página.');
        return;
    }

    // 2. Inicialização do Cliente
    const supabaseUrl = window.supabaseConfig.url;
    const supabaseKey = window.supabaseConfig.key;
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

    // 3. Seleção de Elementos
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const resetFormBtn = document.getElementById('resetFormBtn');
    
    // 4. Manipulação do Formulário
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault(); // IMPEDE O ENVIO VIA URL (GET)
            
            // Captura os dados do formulário
            const nome = document.getElementById('name').value;
            const telefone = document.getElementById('phone').value;
            const empresa = document.getElementById('company').value;
            const mensagem = document.getElementById('message').value;

            try {
                // Enviar para o Supabase via RPC Segura (conforme docs/supabase-contatos.sql)
                const { data, error } = await supabase.rpc('submeter_contato', {
                    p_nome: nome,
                    p_telefone: telefone,
                    p_mensagem: mensagem,
                    p_dados: { empresa: empresa, timestamp_local: new Date().toISOString() }
                });

                if (error) {
                    console.error('Erro no Supabase:', error);
                    showAlert('Erro ao enviar. Por favor, tente novamente ou use o WhatsApp.');
                } else {
                    // Feedback de Sucesso
                    contactForm.reset();
                    contactForm.style.display = 'none';
                    formSuccess.style.display = 'block';
                    showAlert('Mensagem enviada com sucesso!');
                }
            } catch (err) {
                console.error('Erro inesperado:', err);
                showAlert('Erro de conexão. Verifique sua internet.');
            }
        });
    }
    
    // Reset do Formulário
    if (resetFormBtn) {
        resetFormBtn.addEventListener('click', function() {
            formSuccess.style.display = 'none';
            contactForm.style.display = 'flex';
        });
    }
    
    // Máscara de Telefone (Formatação Automática)
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);
            
            if (value.length > 2 && value.length <= 6) {
                value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
            } else if (value.length > 6) {
                value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
            }
            e.target.value = value;
        });
    }
    
    // Validação Visual Simples
    const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.classList.add('error');
            } else {
                this.classList.remove('error');
            }
        });
    });
});

// Função de Alerta (Custom Alert)
function showAlert(message) {
    const alertMessage = document.getElementById('alertMessage');
    const customAlert = document.getElementById('customAlert');
    if (!alertMessage || !customAlert) return;

    alertMessage.textContent = message;
    customAlert.style.display = 'block';

    setTimeout(() => {
        customAlert.style.display = 'none';
    }, 4000);
}
