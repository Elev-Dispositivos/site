document.addEventListener('DOMContentLoaded', function() {
    // Configuração do Supabase (Carregada via window.supabaseConfig no index.html)
    const supabaseUrl = window.supabaseConfig.url;
    const supabaseKey = window.supabaseConfig.key;
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

    // Form handling
    const applicationForm = document.getElementById('applicationForm');
    const formSuccess = document.getElementById('formSuccess');
    const resetFormBtn = document.getElementById('resetFormBtn');
    
    if (applicationForm) {
        applicationForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Captura os dados do formulário
            const nome = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const telefone = document.getElementById('phone').value;
            const area = document.getElementById('area').value;
            const position = document.getElementById('position').value;
            const message = document.getElementById('message').value;

            // Formata a experiência
            const experiencia = `Área de interesse: ${area}\nVaga específica: ${position}\nMensagem: ${message}`;

            // Envio para o Supabase via RPC Segura (Previne bypass de RLS)
            const { data, error } = await supabase.rpc('submeter_candidatura', {
                p_nome: nome,
                p_email: email,
                p_telefone: telefone,
                p_linkedin: '', // Pode ser expandido se houver campo no form
                p_cargo_desejado: position,
                p_experiencia: experiencia
            });

            if (error) {
                console.error('Erro ao enviar dados:', error);
                return;
            }

            // Hide form and show success message
            applicationForm.style.display = 'none';
            formSuccess.style.display = 'block';

            // Reset form fields
            applicationForm.reset();
        });
    }
    
    if (resetFormBtn) {
        resetFormBtn.addEventListener('click', function() {
            formSuccess.style.display = 'none';
            applicationForm.style.display = 'flex';
        });
    }
    
    // Verifica se há posições e exibe a mensagem se não houver
    const positionsList = document.querySelector('.positions-list');
    const noPositionsMessage = document.getElementById('noPositionsMessage');
    const openPositionsSection = document.querySelector('.open-positions');

    // Verifique se a lista de posições está vazia
    if (positionsList) {
        if (positionsList.children.length === 0) {
            if (noPositionsMessage) {
                noPositionsMessage.style.display = 'block';
            }
            // Oculta a seção de vagas
            if (openPositionsSection) {
                openPositionsSection.style.display = 'none';
            }
        } else {
            if (noPositionsMessage) {
                noPositionsMessage.style.display = 'none';
            }
            // Mostra a seção de vagas
            if (openPositionsSection) {
                openPositionsSection.style.display = 'block';
            }
        }
    }
    
    // Form field validation
    const formInputs = document.querySelectorAll('.application-form input, .application-form textarea, .application-form select');
    
    formInputs.forEach(input => {
        if (input.type !== 'checkbox') {
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
        }
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
    
    // Position button click handling
    const positionButtons = document.querySelectorAll('.position-btn');
    const positionField = document.getElementById('position');
    
    positionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const position = this.dataset.position;
            
            // Scroll to form
            const form = document.getElementById('applicationForm');
            form.scrollIntoView({ behavior: 'smooth' });
            
            // Set position field value
            if (positionField) {
                positionField.value = position;
            }
            
            // Focus on first form field
            const firstInput = form.querySelector('input');
            if (firstInput) {
                setTimeout(() => {
                    firstInput.focus();
                }, 800);
            }
        });
    });
});
