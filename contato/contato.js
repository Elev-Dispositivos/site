// Configuração do Supabase (Carregada via window.supabaseConfig no index.html)
const supabaseUrl = window.supabaseConfig.url;
const supabaseKey = window.supabaseConfig.key;
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', function() {
    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const resetFormBtn = document.getElementById('resetFormBtn');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Captura os dados do formulário
            const nome = document.getElementById('name').value;
            const telefone = document.getElementById('phone').value;
            const empresa = document.getElementById('company').value;
            const mensagem = document.getElementById('message').value;

            // Concatena a mensagem com o nome da empresa
            const mensagemFinal = `Empresa: ${empresa}\n\n${mensagem}`;

            // Enviar dados para o Supabase
            const { data, error } = await supabase
                .from('solicitacoes') // Nome da tabela
                .insert([
                    { nome, telefone, mensagem: mensagemFinal }
                ]);

            if (error) {
                console.error('Erro ao enviar dados:', error);
                showAlert('Erro ao enviar a mensagem. Tente novamente.');
            } else {
                showAlert('Mensagem enviada com sucesso!');
                // Limpar o formulário
                contactForm.reset();
                formSuccess.style.display = 'block'; // Exibe a mensagem de sucesso
                contactForm.style.display = 'none'; // Esconde o formulário
            }
        });
    }
    
    if (resetFormBtn) {
        resetFormBtn.addEventListener('click', function() {
            formSuccess.style.display = 'none';
            contactForm.style.display = 'flex';
        });
    }
    
    // Form field validation
    const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea, .contact-form select');
    
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.classList.add('error');
            } else {
                this.classList.remove('error');
            }
        });
        
        input.addEventListener('focus', function() {
            this.classList.remove('error');
        });
    });
    
    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) {
                value = value.slice(0, 11);
            }
            
            if (value.length > 2 && value.length <= 6) {
                value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
            } else if (value.length > 6) {
                value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
            }
            
            e.target.value = value;
        });
    }
});

function showAlert(message) {
    const alertMessage = document.getElementById('alertMessage');
    const customAlert = document.getElementById('customAlert');
    
    alertMessage.textContent = message;
    customAlert.style.display = 'block';
    

    // Fechar o alerta automaticamente após 3 segundos
    setTimeout(() => {
        customAlert.style.display = 'none';
    }, 3000);
}

